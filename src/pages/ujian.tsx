import { useEffect, useRef, useState } from "react"
import { Countdown } from "../components/countdown";
import { Environment } from "../environment/environment";
import axios from "axios";
import { ISoal } from "./SoalPage";
import { useNavigate, useParams } from "react-router";
import { getTokenPayload } from "../utils/jwt";
import { Loader } from "../components/loader";
import Swal from "sweetalert2";
import AntiCheatGuard from "../components/AntiCheatGuard";
import { Icon } from "../components/icon";
import * as Rx from 'rxjs';
import ArabicTextWrapper from "../components/ArabicTextWrapper/ArabicTextWrapper";

interface IAnswerForm {
    soal_id: number,
    jawaban: string,
    ragu: boolean,
    ujian_id: number,
    tipe_soal: string
}

interface IUploadAnswer {
    jawaban: string,
    nomor_peserta: number,
    soal_id: number,
    ujian_id: number,
    tipe_soal: string
}

export function Ujian() {

    // -----------------------------------------------------------------------------------------------------
    // @ Properties
    // -----------------------------------------------------------------------------------------------------

    const navigate = useNavigate();
    const peserta = getTokenPayload();
    const {nomor_peserta} = getTokenPayload();
    const {ujian_id} = useParams();
    const [questions, setQuestions] = useState<ISoal[]>([]);
    const [currentNumber, setCurrentNumber] = useState<number>(1);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [answers, setAnswers] = useState<IAnswerForm[]>([])
    const [timeLimit, setTimeLimit] = useState<number|null>(null );
    const [loading, setLoading] = useState<boolean>(false);
    const [sesiUjian, setSesiUjian] = useState<any>({});

    const essayInput$ = useRef(new Rx.Subject<IUploadAnswer>()).current;
    const latestEssayAnswer = useRef<IUploadAnswer|null>(null);

    const endpoints = {
        get_soal: (ujian_id: number | string) => `siswa/soal?ujian_id=${ujian_id}`,
        get_duration: (id: string) => `siswa/ujian/${id}`,
        upload_jawaban: 'siswa/sesi_soal', // Untuk upload jawaban satu-satu
        upload_jawaban_banyak: 'siswa/submit_ujian', // Untuk upload dalam array of jawaban
        hasil_ujian_migrate:  'siswa/hasil_ujian/migrate',
        hasil_ujian_reevaluate: 'siswa/hasil_ujian/reevaluate',
        get_sesi_soal: `siswa/sesi_soal`,
        get_sesi_ujian: (ujian_id: number|string, nomor_peserta: number|string) => `siswa/sesi_ujian?ujian_id=${ujian_id}&nomor_peserta=${nomor_peserta}`,
        post_sesi_ujian: `siswa/sesi_ujian`,
        put_sesi_ujian: (id: number) => `siswa/sesi_ujian/${id}`
    }
    const baseUrl = Environment.base_url;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    useEffect(() => {
        if(ujian_id){
            startUjian(ujian_id);
            getDuration(ujian_id)
            fetchSesiSoal()
        }
        const subscription = essayInput$
            .pipe(Rx.debounceTime(5000))
            .subscribe((body) => {
                uploadJawaban(body)
            }) 

        return () => subscription.unsubscribe();
    }, [essayInput$])

    // -----------------------------------------------------------------------------------------------------
    // @ CRUD Functions
    // -----------------------------------------------------------------------------------------------------

    const fetchSesiSoal = () => {
        setLoading(true);
        const url = `${baseUrl}${endpoints['get_sesi_soal']}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            console.log("Get Sesi Soal", res)
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    const startUjian = (id: string | number) => {
        const url_get_soal = `${baseUrl}${endpoints['get_soal'](id)}`;
        const headers = { Authorization: `Bearer ${localStorage.getItem('authToken')}` };
        axios.get(url_get_soal, { headers })
            .then(res => {
                setQuestions(res.data.data);
                setAnswers(() => {
                    const arr: IAnswerForm[] = [];
                    res.data.data.forEach((element: ISoal) => {
                        arr.push({
                            soal_id: element.id,
                            jawaban: '',
                            ragu: false,
                            ujian_id: Number(element.ujian_id),
                            tipe_soal: element.tipe_soal
                        })
                    });
                    return arr;
                });

                const urlGetSesiUjian = `${baseUrl}${endpoints['get_sesi_ujian'](Number(ujian_id), peserta.nomor_peserta)}`;
                axios.get(urlGetSesiUjian, {headers})
                    .then(res => {
                        console.log("Response Get Sesi Ujian", res)
                        if(res.data.data[0]){
                            const sesi_ujian = res.data.data[0];
                            setSesiUjian(sesi_ujian)
                            
                        }else {
                            const urlPostSesiUjian = `${baseUrl}${endpoints['post_sesi_ujian']}`;
                            axios.post(urlPostSesiUjian, {
                                nomor_peserta,
                                ujian_id,
                            }).then(res => {
                                setSesiUjian(res.data.data)
                            }).catch(err => {
                                console.error(err)
                            })
                        }
                    }) 

            }).catch(err => {
                console.error(err);
            })
    }

    const getDuration = (id: string) => {
        const url = `${baseUrl}${endpoints['get_sesi_ujian'](id, nomor_peserta)}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            // const deadline = new Date(res.data.end_date).getTime();
            // setTimeLimit(deadline)
            // console.log("Get Duration", res.data.data[0])
            const endTime = new Date(res.data.data[0].end_date + 'Z').toLocaleString();
            const deadline = new Date(endTime).getTime();
            // console.log(`Current Time: ${new Date()}, Deadline: ${new Date(res.data.data[0].end_date)}`)
            console.log("Get Deadline ",deadline)
            setTimeLimit(deadline)
        }).catch(err => {
            console.error(err);
        })
    }

    const uploadJawaban = (body: IUploadAnswer) => {
        setLoading(true)
        const url = `${baseUrl}${endpoints['upload_jawaban']}?limit=100`;
        axios.post(url, body, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        })
    }
    
    const range = (start: number, end: number, step = 1): number[] => {
        return Array.from({ length: Math.floor((end - start) / step) }, (_, i) => start + i * step);
    }

    const currentSoal = (): ISoal => {
        return questions[currentNumber - 1];
    }

    const changeSoal = (option: 'prev' | 'next'): void => {
        flushPendingEssayAnswer();
        // Make sure to not change it to non existing number
        if(currentNumber === 1 && option === 'prev') return;
        if(currentNumber === questions.length && option === 'next') return;
        setCurrentNumber(value => option === 'prev' ? value - 1 : value + 1);
    }

    const clickDoubt = (nomor: number) => {
        setAnswers(prevAnswers => {
            return prevAnswers.map((answer, index) => 
                index === nomor - 1 ? {...answer, ragu: !answer.ragu} : answer
            )
        })
        console.log("Current Soal",currentSoal())
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const body: IUploadAnswer = {
            soal_id: currentSoal().id,
            jawaban: e.target.value,
            nomor_peserta,
            ujian_id: Number(currentSoal().ujian_id),
            tipe_soal: currentSoal().tipe_soal
        }

        if(body.tipe_soal === 'essai'){
            latestEssayAnswer.current = body;
            essayInput$.next(body)
        }else {
            uploadJawaban(body)
        }

        // uploadJawaban(body);
        setAnswers(prevAnswers => {
            return prevAnswers.map((answer, index) => 
                index === currentNumber - 1 ? {...answer, jawaban: e.target.value} : answer
            )
        })
    }

    const flushPendingEssayAnswer = () => {
        if(latestEssayAnswer.current) {
            uploadJawaban(latestEssayAnswer.current);
            latestEssayAnswer.current = null;
        }
    }

    const handleSubmit = (open_dialog: boolean) => {
        flushPendingEssayAnswer()
        const upload = () => {
            const answer: any[] = answers.map(el => {
                return {
                    soal_id: el.soal_id, 
                    jawaban: el.jawaban, 
                    ujian_id: el.ujian_id, 
                    nomor_peserta: String(nomor_peserta),
                    tipe_soal: el.tipe_soal
                }
            })
            const headers = { Authorization: `Bearer ${localStorage.getItem('authToken')}` }

            console.log("Sesi Ujian: ", sesiUjian)
            
            const urlGetSesiUjian = `${baseUrl}${endpoints['get_sesi_ujian'](Number(ujian_id), peserta.nomor_peserta)}`;
            axios.get(urlGetSesiUjian, {headers})
            .then(res => {
                console.log("Response Get Sesi Ujian", res)
                if(res.data.data[0]){
                    upload2(res.data.data[0].id)
                    
                }else {
                    const urlPostSesiUjian = `${baseUrl}${endpoints['post_sesi_ujian']}`;
                    axios.post(urlPostSesiUjian, {
                        nomor_peserta,
                        ujian_id,
                    }).then(res => {
                        upload2(res.data.data.id);
                    }).catch(err => {
                        console.error(err)
                    })
                }
            }) 
            
            
            const upload2 = (sesi_ujian_id: number) => {
                const url = `${baseUrl}${endpoints['upload_jawaban_banyak']}`;
                axios.post(url, {data: answer}, {headers}).then(() => {
                    const migratePromise = axios.get(`${baseUrl}${endpoints['hasil_ujian_migrate']}`, {headers});
                    const reevaluatePromise = axios.get(`${baseUrl}${endpoints['hasil_ujian_reevaluate']}`, {headers});
                    const sesiUjianPromise = axios.put(`${baseUrl}${endpoints['put_sesi_ujian'](sesi_ujian_id)}`, {
                        nomor_peserta,
                        ujian_id,
                        isTrue: 1
                    }, {headers});
    
                    Promise.all([migratePromise, reevaluatePromise, sesiUjianPromise])
                        .then(() => {
                            Swal.fire({
                                title: "Exam submitted!",
                                text: "You may leave now!",
                                icon: "success"
                            }).then(() => {
                                navigate('/daftar-ujian');
                            });
                        }).catch(err => {
                            console.error(err);
                            Swal.fire({
                                icon: "error",
                                title: "Upload Failed",
                                text: err?.response?.data?.error || "An error occurred while uploading answers.",
                            });
                        });
                }).catch(err => {
                    console.error(err);
                    Swal.fire({
                        icon: "error",
                        title: "Request Failed",
                        text: err.response.data.error,
                    });
                });
            }
        }

        if(open_dialog){
            Swal.fire({
                title: "Submit Ujian",
                text: "Apakah anda yakin ingin mengakhiri ujian?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Iya",
                cancelButtonText: "Tidak"
            }).then(result => {
                if(result.isConfirmed){
                    upload();
                }
            })
        }else {
            upload();
        }
    }

    const isImageUrl = (input: string) => {
        try {
            const parsedUrl = new URL(input);
            console.log(parsedUrl)
            return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(parsedUrl.pathname);
        }catch(_) {
            return false;
        }
    }

    const style = {
        radio_button: `flex gap-2 border-2 border-gray-300 px-3 py-2 rounded-xl w-fit min-w-80`,
        control_button: `min-w-24 w-fit px-2 py-1.5 rounded-xl text-white font-semibold transition-all`,
        control_button_active: `bg-green-700 cursor-pointer hover:bg-green-800`,
        control_button_inactive: `bg-green-700/80`,
        submit_button: `bg-red-500 cursor-pointer hover:bg-red-600`,
        doubt_button: `w-24 rounded-xl py-1.5 text-white font-semibold`
    }

    // -----------------------------------------------------------------------------------------------------
    // @ HTML
    // -----------------------------------------------------------------------------------------------------

    if(loading && !questions.length && !answers.length) {
        return (
            <div className="absolute flex justify-center items-center w-screen h-screen bg">
                <Loader />
            </div>
        )
    }

    if(!questions.length && !answers.length){
        return (
            <div className="bg-slate-200 flex w-screen h-screen justify-center items-center">
                <div className="bg-white shadow-xl w-160 h-80 rounded-xl flex flex-col gap-4 justify-center items-center">
                    <p className="font-semibold text-3xl">📄 Tidak ada soal ❌</p>
                    <p>Ujian ini belum memiliki soal. Mungkin guru lupa menambahkannya.</p>
                    <button 
                        className="bg-green-500 hover:bg-green-600 active:bg-green-700 transition-all px-3 py-2 rounded-xl text-white font-semibold cursor-pointer"
                        onClick={() => navigate('/daftar-ujian')}
                    >Kembali ke Daftar Ujian</button>
                </div>
            </div>
        )
    }

    return (<>
        <div className="relative flex w-screen h-screen overflow-hidden">

            <AntiCheatGuard 
                maxViolations={5}
                onViolationLimitReached={() => {handleSubmit(false)}}
                logViolation={res => console.log("Response Anti Cheat Guard: ", res)}
            />

            {loading && 
            <div className="absolute flex justify-center items-center w-full h-full">
                <Loader />
            </div>
            }
            {drawerOpen &&
            <div 
                className="absolute w-full h-full flex bg-dialog-animation overflow-y-hidden z-50"
                onClick={() => {setDrawerOpen(false)}}
            >
                <div 
                    className="absolute right-0 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-full bg-gray-100 drawer-animation border-l-2 border-slate-500"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col justify-between p-4 h-full">
                        <div>
                            <div className="flex justify-between items-center">
                                <p className="text-black px-2 pt-2 mb-4 font-bold text-xl">Jawaban</p>
                                <button className="cursor-pointer" onClick={() => setDrawerOpen(false)}>
                                    <Icon name={'heroicons:x-mark'} shape={'outline'} />
                                </button>
                            </div>
                            <div id="soal-list" className={`flex flex-wrap gap-2 xl:gap-4 p-2`}>
                                {range(1, questions.length + 1).map((el) => (
                                    <button 
                                        key={el}
                                        onClick={() => {setCurrentNumber(el); setDrawerOpen(false)}} 
                                        className={`relative group flex flex-col justify-center items-center w-12 h-12 border-2 rounded-xl cursor-pointer transition-all ${answers[el-1].ragu ? 'bg-yellow-400 border-yellow-600' : 'bg-white border-green-400'}`}
                                    >
                                        {answers[el-1].jawaban &&
                                        <p className={`flex justify-center items-center text-white font-semibold absolute -right-1 -top-1 h-4 w-4 rounded-full bg-green-400 text-xs ${answers[el-1].ragu ? 'bg-yellow-800' : 'bg-green-600'}`}>
                                            {answers[el-1].tipe_soal === 'pilihan_ganda' ? answers[el-1].jawaban : (answers[el-1].jawaban ? '✓' : '')}
                                        </p>
                                        }
                                        <p className="font-bold">{el}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button 
                            className="bg-red-500 hover:bg-red-600 active:bg-red-700 transition-all w-32 py-2 px-3 rounded-lg text-white self-center cursor-pointer" 
                            onClick={() => handleSubmit(true)}
                        >Finish Exam</button>
                    </div>
                </div>
            </div>
            }

            <div className="flex justify-center w-full h-full bg-gray-200 md:p-6">
                <div className="flex flex-col bg-white h-full rounded-md shadow-md p-4 w-full xl:max-w-400">
                    <div id="header" className="flex items-center justify-between h-[10%]">
                        <p className="font-bold">NO &nbsp;<span className="bg-teal-800 text-white px-3 py-2 rounded-md">{currentNumber}</span></p>
                        <div className="flex gap-2 h-12">
                            <button className="font-semibold border-2 border-yellow-500 text-yellow-500 px-3 py-2 rounded-xl cursor-pointer hover:bg-yellow-500 hover:text-white transition-all" onClick={() => setDrawerOpen(true)}>Daftar Soal</button>
                            <div className="flex items-center bg-slate-300 rounded-xl px-2 py-1 font-semibold">
                                {timeLimit && 
                                <Countdown deadline={timeLimit} onDone={() => {handleSubmit(false)}}/>
                                }
                            </div>
                        </div>
                    </div>

                    <div id="content" className="flex flex-col gap-2 px-4 pb-12 h-full overflow-y-auto">

                        {currentSoal() && currentSoal().soal && (
                        <p className="no-select py-5 sm:py-0">
                            <ArabicTextWrapper text={currentSoal().soal}></ArabicTextWrapper>
                        </p>
                        )}

                        {currentSoal() && currentSoal().image && (
                        
                        <div className="flex justify-center">
                            <img src={currentSoal().image ?? ""} alt="soal" className="rounded-lg shadow-md max-h-72 object-cover" />
                        </div>
                        )
                        }

                        {currentSoal().tipe_soal === 'pilihan_ganda' && ['a', 'b', 'c', 'd'].map((el) => (
                            <>
                            {currentSoal()[`pilihan_${el}` as keyof ISoal] && (
                            <div 
                                className={`${style.radio_button} ${answers[currentNumber - 1].jawaban === el.toUpperCase() ? 'bg-gray-300' : ''} transition-all`} 
                                key={el}
                            >
                                <input 
                                    type="radio" 
                                    id={el} 
                                    value={el.toUpperCase()} 
                                    name={String(currentSoal().id)} 
                                    checked={answers[currentNumber - 1].jawaban === el.toUpperCase()} 
                                    onChange={handleChange}
                                />
                                <label htmlFor={el} className="py-4 sm:py-0">
                                    {isImageUrl(currentSoal()[`pilihan_${el}` as keyof ISoal] as string) 
                                    ? <img src={currentSoal()[`pilihan_${el}` as keyof ISoal] as string} className="ml-8"/>
                                    : <ArabicTextWrapper text={currentSoal()[`pilihan_${el}` as keyof ISoal] as string} /> 
                                    }
                                </label>
                            </div>
                            )}
                            </>
                        ))}

                        { (currentSoal().tipe_soal === 'essai' || currentSoal().tipe_soal === 'essay')  && (
                            <>
                            <label htmlFor=""></label>
                            <textarea 
                                value={answers[currentNumber-1].jawaban} 
                                onChange={handleChange} 
                                className="border-2 border-gray-300 rounded-lg p-2"
                                placeholder="Tulis Jawaban Anda di sini..."
                                rows={4}
                            ></textarea>
                            </>
                        )}

                    </div>
                    

                    <div id="control" className="flex justify-center gap-2 h-16">
                        <button 
                            disabled={!(currentNumber > 1)} 
                            className={`${style.control_button} ${currentNumber > 1 ? style.control_button_active : style.control_button_inactive}`} 
                            onClick={() => changeSoal('prev')}
                        >Prev</button>

                        <button 
                            className={`${style.doubt_button} ${answers[currentNumber - 1].ragu ? 'bg-yellow-500 hover:bg-blue-500' : 'bg-blue-500 hover:bg-yellow-500'} cursor-pointer  transition-all`}
                            onClick={() => clickDoubt(currentNumber)}
                        >Ragu</button>

                        <button 
                            // disabled={!(currentNumber < questions.length)} 
                            className={`${style.control_button} ${currentNumber < questions.length ? style.control_button_active : style.submit_button}`} 
                            onClick={() => currentNumber < questions.length ? changeSoal('next') : handleSubmit(true)}
                        >{currentNumber < questions.length ? 'Next' : 'Complete'}</button>
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}