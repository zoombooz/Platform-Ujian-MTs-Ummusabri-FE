import { useEffect, useState } from "react"
import { Countdown } from "../components/countdown";
import { Environment } from "../environment/environment";
import axios from "axios";
import { ISoal } from "./SoalPage";
import { useNavigate, useParams } from "react-router";
import { getTokenPayload } from "../utils/jwt";
import { Loader } from "../components/loader";
import Swal from "sweetalert2";
import { HorizontalLayout } from "../layout/horizontal-layout";
import AntiCheatGuard from "../components/AntiCheatGuard";

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
    ujian_id: number
}

export function Ujian() {

    const [tabSwitches, setTabSwitches] = useState<number>(0);

    const navigate = useNavigate();
    const {nomor_peserta} = getTokenPayload();
    const {ujian_id} = useParams();
    const [questions, setQuestions] = useState<ISoal[]>([]);
    const [currentNumber, setCurrentNumber] = useState<number>(1);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [answers, setAnswers] = useState<IAnswerForm[]>([])
    const [timeLimit, setTimeLimit] = useState<number|null>(null );
    const [loading, setLoading] = useState<boolean>(false);

    const endpoints = {
        start_ujian: (ujian_id: number | string) => `siswa/soal?ujian_id=${ujian_id}`,
        get_duration: (id: string) => `siswa/ujian/${id}`,
        upload_jawaban: 'siswa/sesi_soal', // Untuk upload jawaban satu-satu
        upload_jawaban_banyak: 'siswa/submit_ujian', // Untuk upload dalam array of jawaban
        hasil_ujian_migrate:  'siswa/hasil_ujian/migrate',
        hasil_ujian_reevaluate: 'siswa/hasil_ujian/reevaluate',
        get_sesi_soal: `siswa/sesi_soal`,
        post_sesi_ujian: `siswa/sesi_ujian`,
    }
    const baseUrl = Environment.base_url;

    useEffect(() => {
        if(ujian_id){
            startUjian(ujian_id);
            getDuration(ujian_id)
            getSesiSoal()
        }
    }, [])

    const getSesiSoal = () => {
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
        const url = `${baseUrl}${endpoints['start_ujian'](id)}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
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
                // return new Array(res.data.data.length).fill(0).map((_, i) => {
                //     return {
                //         soal_id: i + 1,
                //         jawaban: '',
                //         ragu: false
                //     }
                // })
            }   
            )
        }).catch(err => {
            console.error(err);
        })
    }

    const getDuration = (id: string) => {
        const url = `${baseUrl}${endpoints['get_duration'](id)}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            const deadline = new Date(res.data.end_date).getTime();
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
        // Make sure to not change it to non existing number
        if(currentNumber === 1 && option === 'prev') return;
        if(currentNumber === questions.length && option === 'next') return;
        setCurrentNumber(value => option === 'prev' ? value - 1 : value + 1);
    }

    const clickDoubt = (nomor: number) => {
        console.log("Check")
        setAnswers(prevAnswers => {
            return prevAnswers.map((answer, index) => 
                index === nomor - 1 ? {...answer, ragu: !answer.ragu} : answer
            )
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const body: IUploadAnswer = {
            soal_id: currentSoal().id,
            jawaban: e.target.value,
            nomor_peserta,
            ujian_id: Number(currentSoal().ujian_id)
        }

        uploadJawaban(body);
        setAnswers(prevAnswers => {
            return prevAnswers.map((answer, index) => 
                index === currentNumber - 1 ? {...answer, jawaban: e.target.value} : answer
            )
        })
    }

    const handleSubmit = (open_dialog: boolean) => {
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

            const url = `${baseUrl}${endpoints['upload_jawaban_banyak']}`;

            axios.post(url, {data: answer}, {headers}).then(() => {
                const migratePromise = axios.get(`${baseUrl}${endpoints['hasil_ujian_migrate']}`, {headers});
                const reevaluatePromise = axios.get(`${baseUrl}${endpoints['hasil_ujian_reevaluate']}`, {headers});
                const sesiUjianPromise = axios.post(`${baseUrl}${endpoints['post_sesi_ujian']}`, {
                    nomor_peserta,
                    ujian_id,
                    isTrue: 1
                }, {headers});

                Promise.all([migratePromise, reevaluatePromise, sesiUjianPromise])
                    .then(([migrateRes, reevaluateRes, sesiUjianRes]) => {
                        console.log("Response Migrate:", migrateRes);
                        console.log("Response Reevaluate:", reevaluateRes);
                        console.log("Response Sesi Ujian:", sesiUjianRes);

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

    const style = {
        radio_button: `flex gap-2 border-2 border-gray-300 px-3 py-2 rounded-xl w-fit min-w-80`,
        control_button: `min-w-24 w-fit px-2 py-1.5 rounded-xl text-white font-semibold transition-all`,
        control_button_active: `bg-green-700 cursor-pointer hover:bg-green-800`,
        control_button_inactive: `bg-green-700/80`,
        submit_button: `bg-red-500 cursor-pointer hover:bg-red-600`,
        doubt_button: `w-24 rounded-xl py-1.5 text-white font-semibold`
    }

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
                    className="absolute right-0 w-full md:w-3/4 lg:w-1/4 h-full bg-gray-100 drawer-animation border-l-2 border-slate-500"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col justify-between p-4 h-full">
                        <div>
                            <p className="text-black px-2 pt-2 mb-4 font-bold text-xl">Jawaban</p>
                            <div id="soal-list" className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 xl:gap-4 p-2`}>
                                {range(1, questions.length + 1).map((el) => (
                                    <button 
                                        key={el}
                                        onClick={() => setCurrentNumber(el)} 
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

            <div className="flex justify-center w-full h-full bg-gray-200 p-6">
                <div className="flex flex-col bg-white h-full rounded-md shadow-md p-4 w-full xl:max-w-400">
                    <div id="header" className="flex justify-between h-[10%]">
                        <p className="font-bold">NO &nbsp;<span className="bg-teal-800 text-white px-3 py-2 rounded-md">{currentNumber}</span></p>
                        <div className="flex gap-2">
                            <button className="font-semibold border-2 border-yellow-500 text-yellow-500 px-3 py-2 rounded-xl cursor-pointer hover:bg-yellow-500 hover:text-white transition-all" onClick={() => setDrawerOpen(true)}>Daftar Soal</button>
                            <div className="flex items-center bg-slate-300 rounded-xl px-2 py-1 font-semibold">
                                {timeLimit && 
                                <Countdown deadline={timeLimit} onDone={() => {handleSubmit(false)}}/>
                                }
                            </div>
                        </div>
                    </div>

                    <div id="content" className="flex flex-col gap-2 px-4 h-full">

                        {currentSoal().soal && (
                        <div className="">
                            <p className="no-select">
                                {currentSoal().soal}
                            </p>
                        </div>
                        )}

                        {currentSoal().tipe_soal === 'pilihan_ganda' && ['a', 'b', 'c', 'd', 'e'].map((el) => (
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
                                <label htmlFor={el}>{currentSoal()[`pilihan_${el}` as keyof ISoal]}</label>
                            </div>
                        ))}

                        {currentSoal().tipe_soal === 'essai' && (
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
                    

                    <div id="control" className="flex justify-center gap-2 h-[10%]">
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