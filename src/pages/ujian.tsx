import { useEffect, useState } from "react"
import { Icon } from "../components/icon";
import { Countdown } from "../components/countdown";
// import { soalBIList } from "../models/soal.constant";
import { useDialog } from "../context/DialogContext";
import { ValidationDialog } from "../components/validation-dialog";
import { TextEditor } from "../components/text-editor";
import ReactQuill from "react-quill";
import RichTextEditor from "../components/RichTextEditor";
import { Environment } from "../environment/environment";
import axios from "axios";
import { ISoal } from "./SoalPage";
import { useParams } from "react-router";
import { getTokenPayload } from "../utils/jwt";

interface IAnswerForm {
    nomor: number,
    jawaban: string,
    ragu: boolean
}

export function Ujian() {

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
        upload_jawaban: 'siswa/sesi_soal',
        get_sesi_soal: `siswa/sesi_soal`,
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
        const url = `${baseUrl}${endpoints['get_sesi_soal']}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            console.log("Get Sesi Soal", res)
        }).catch(err => {
            console.error(err);
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
            setAnswers(
                new Array(res.data.data.length).fill(0).map((_, i) => {
                    return {
                        nomor: i + 1,
                        jawaban: '',
                        ragu: false
                    }
                })
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
            const duration = res.data.duration * 60 * 1000;
            setTimeLimit(new Date().getTime() + duration)
        }).catch(err => {
            console.error(err);
        })
    }

    const uploadJawaban = (body: any) => {
        const url = `${baseUrl}${endpoints['upload_jawaban']}?limit=100`;
        axios.post(url, body, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.error(err);
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
        const body = {
            soal_id: currentSoal().id,
            jawaban: e.target.value,
            nomor_peserta,
            ujian_id: currentSoal().ujian_id
        }
        uploadJawaban(body);
        console.log("Current Soal: ", currentSoal())
        console.log("Value: ", e.target.value);
        setAnswers(prevAnswers => {
            return prevAnswers.map((answer, index) => 
                index === currentNumber - 1 ? {...answer, jawaban: e.target.value} : answer
            )
        })
    }

    const handleSubmit = (open_dialog: boolean) => {
        const answer: {nomor: number, jawaban: string}[] = answers.map(el => {
            return {nomor: el.nomor, jawaban: el.jawaban}
        })
        console.log("Answer: ", answer)
    }

    const onDone = () => {
        alert("Ujian Selesai")
    }

    const style = {
        radio_button: `flex gap-2`,
        control_button: `min-w-16 w-fit px-2 py-1.5 rounded-md text-white transition-all`,
        control_button_active: `bg-green-700 cursor-pointer hover:bg-green-800`,
        control_button_inactive: `bg-green-700/80`,
        submit_button: `bg-red-500 cursor-pointer hover:bg-red-600`,
        doubt_button: `w-16 rounded-md py-1.5 text-white`
    }

    if(!questions.length && !answers.length) {
        return <p>Hello</p>
    }

    console.log('omg', {q: questions, a: answers})

    return (
        <div className="relative flex w-screen h-screen overflow-hidden">
            {drawerOpen &&
            <div 
                className="absolute w-full h-full flex bg-dialog-animation overflow-y-hidden z-50"
                onClick={() => {setDrawerOpen(false)}}
            >
                <div 
                    className="absolute right-0 w-full md:w-3/4 lg:w-1/4 h-full bg-white rounded-md drawer-animation border-l-2 border-slate-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 h-full">
                        <p className="text-black px-2 pt-2 text-center mb-5">Jawaban</p>
                        <div id="soal-list" className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 xl:gap-4 p-2`}>
                            {range(1, questions.length + 1).map((el) => (
                                <button 
                                    key={el}
                                    onClick={() => setCurrentNumber(el)} 
                                    className="group flex flex-col w-10 h-12 bg-white border-2 border-green-700 cursor-pointer transition-all"
                                >
                                    <p className="h-[40%] bg-green-500 border-b-2 border-green-700 text-xs">{answers[el-1].jawaban}</p>
                                    <p className={`${answers[el-1].ragu ? 'bg-yellow-400' : 'bg-white'} h-[60%] transition-all`}>{el}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            }

            <div className="flex justify-center w-full h-full bg-gray-100 p-6">
                <div className="flex flex-col bg-white h-full rounded-md shadow-md p-4 w-full xl:max-w-400">
                    <div id="header" className="flex justify-between h-[10%]">
                        <p className="font-bold">NO &nbsp;<span className="bg-teal-800 text-white px-3 py-2">{currentNumber}</span></p>
                        <div className="flex gap-2">
                            <button className="border-2 border-yellow-500 px-3 py-2 rounded-lg cursor-pointer hover:bg-yellow-500 hover:text-white transition-all" onClick={() => setDrawerOpen(true)}>Daftar Soal</button>
                            <div className="flex items-center border border-slate-900 rounded-md px-2 py-1">
                                {timeLimit && 
                                <Countdown deadline={timeLimit} onDone={() => onDone()}/>
                                }
                            </div>
                        </div>
                    </div>

                    <div id="content" className="flex flex-col gap-2 px-4 h-full">

                        {/* {currentSoal().perintah && (
                        <p>{currentSoal().perintah}</p>
                        )} */}

                        {currentSoal().soal && (
                        <div className="">
                            <p>
                                {currentSoal().soal}
                            </p>
                        </div>
                        )}

                        {/* <p>{currentSoal().pertanyaan}</p> */}

                        {['a', 'b', 'c', 'd', 'e'].map((el) => (
                            <div className={`${style.radio_button}`} key={el}>
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

                    </div>
                    
                    {!currentSoal().pilihan_a && (
                        <textarea onChange={handleChange}></textarea>

                        // <RichTextEditor value="string" onChange={() => {}}/>
                    )}

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
                            onClick={() => currentNumber < questions.length ? changeSoal('next') : handleSubmit(false)}
                        >{currentNumber < questions.length ? 'Next' : 'Complete'}</button>
                    </div>

                </div>
            </div>
        </div>
    )
}