import { useEffect, useState } from "react"
import { Icon } from "../components/icon";
import { Countdown } from "../components/countdown";
import { soalBIList } from "../models/soal.constant";
import { useDialog } from "../context/DialogContext";
import { ValidationDialog } from "../components/validation-dialog";
import { TextEditor } from "../components/text-editor";
import ReactQuill from "react-quill";
import RichTextEditor from "../components/RichTextEditor";

export interface IQuestion {
    ujian_id: number,
    nomor: number,
    perintah?: string,
    teks?: string,
    pertanyaan: string,
    pilihan_a: string,
    pilihan_b: string,
    pilihan_c: string,
    pilihan_d: string,
    pilihan_e: string,
    jawaban: string
}

interface IAnswerForm {
    nomor: number,
    jawaban: string,
    ragu: boolean
}

export function Ujian() {

    // const {openDialog, closeDialog} = useDialog();
    const [questions] = useState<IQuestion[]>(soalBIList);
    const [currentNumber, setCurrentNumber] = useState<number>(1);
    const [extendSidebar, setExtendSidebar] = useState<boolean>(false);
    const [answers, setAnswers] = useState<IAnswerForm[]>(
        new Array(questions.length).fill(0).map((_, i) => {
            return {
                nomor: i + 1,
                jawaban: '',
                ragu: false
            }
        })
    )

    // useEffect(() => {
    //     // console.log("Banyak Soal: ", questions.length)
    //     console.log("Answer Form: ", answers)
    // }, [answers])

    const timeLimit = new Date().getTime() + (1000 * 30);
    
    const range = (start: number, end: number, step = 1): number[] => {
        return Array.from({ length: Math.floor((end - start) / step) }, (_, i) => start + i * step);
    }

    const currentSoal = (): IQuestion => {
        return questions[currentNumber - 1];
    }

    const changeSoal = (option: 'prev' | 'next'): void => {
        console.log("Check")
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Value: ", e.target.value);
        setAnswers(prevAnswers => {
            return prevAnswers.map((answer, index) => 
                index === currentNumber - 1 ? {...answer, jawaban: e.target.value} : answer
            )
        })
    }

    const handleSubmit = (open_dialog: boolean) => {
        if(open_dialog){
            // openDialog({
            //     width: "500px",
            //     height: "240px",
            //     content: (
            //         <ValidationDialog  
            //             title={`Are you sure you want to submit`}
            //             description="Are you sure you want to delete this data?"
            //             response={deleteAgama}
            //         />
            //     )
            // })
        }

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

    

    return (
        <div className="flex w-screen h-screen overflow-hidden">
            <div id="sidebar" className={`${extendSidebar ? "w-[20%] px-2" : "w-0"} relative h-full bg-green-600 shadow-md transition-all duration-300`}>
                <button className="absolute -right-8 top-20 bg-green-600 rounded-r-md py-2 px-2 cursor-pointer" onClick={() => setExtendSidebar(val => !val)}>
                    <Icon name="heroicons:bars-3" shape="outline" customClass="text-white"/>
                </button>

                {extendSidebar && (
                <div>
                    <p className="text-white px-2 pt-2 text-center">Jawaban</p>
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
                )}
            </div>

            <div className="flex justify-center w-full h-full bg-gray-100 p-6">
                <div className="flex flex-col bg-white h-full rounded-md shadow-md p-4 w-full xl:max-w-400">
                    <div id="header" className="flex justify-between h-[10%]">
                        <p className="font-bold">NO &nbsp;<span className="bg-teal-800 text-white px-3 py-2">{currentSoal().nomor}</span></p>
                        <div className="flex items-center border border-slate-900 rounded-md px-2 py-1">
                            <Countdown deadline={timeLimit} onDone={() => onDone()}/>
                        </div>
                    </div>

                    <div id="content" className="flex flex-col gap-2 px-4 h-full">

                        {currentSoal().perintah && (
                        <p>{currentSoal().perintah}</p>
                        )}

                        {currentSoal().teks && (
                        <div className="p-2 border border-black rounded-sm">
                            <p>
                                {currentSoal().teks}
                            </p>
                        </div>
                        )}

                        <p>{currentSoal().pertanyaan}</p>

                        {['a', 'b', 'c', 'd', 'e'].map((el) => (
                            <div className={`${style.radio_button}`} key={el}>
                                <input 
                                    type="radio" 
                                    id={el} 
                                    value={el.toUpperCase()} 
                                    name={String(currentSoal().nomor)} 
                                    checked={answers[currentNumber - 1].jawaban === el.toUpperCase()} 
                                    onChange={handleChange}
                                />
                                <label htmlFor={el}>{currentSoal()[`pilihan_${el}` as keyof IQuestion]}</label>
                            </div>
                        ))}

                    </div>
                    
                    {/* <TextEditor /> */}
                    <RichTextEditor value="string" onChange={() => {}}/>

                    <div id="control" className="flex justify-center gap-2 h-[10%]">
                        <button 
                            disabled={!(currentNumber > 1)} 
                            className={`${style.control_button} ${currentNumber > 1 ? style.control_button_active : style.control_button_inactive}`} 
                            onClick={() => changeSoal('prev')}
                        >Prev</button>

                        <button 
                            className={`${style.doubt_button} ${answers[currentNumber - 1].ragu ? 'bg-yellow-500' : 'bg-blue-500'}`}
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