import { useEffect, useState } from "react";
import { BarChart } from "../components/BarChart";
import axios from "axios";
import { Environment } from "../environment/environment";
import { ujianService } from "../service/ujianService";
import { IUjian } from "../models/ujian.type";

interface AnalisisUjian {
    descriptive: {
        count: number,
        min: number,
        max: number,
        average: number,
        median: number,
        stdDev: number,
    },
    inferential: {
        confidence_interval_95: {
            low: number,
            high: number,
        }
    },
    scores: {
        nomor_peserta: number,
        nama: string,
        kelas: string,
        score: number
    }[],
    ranking_by_class: {
        [class_key: string]: {
            nomor_peserta: number,
            nama: string,
            kelas: string,
            score: number,
            rank: number
        }
    }
}

export function MonitoringPage() {

    const {base_url} = Environment;

    const endpoints = {
        analisis_jawaban: (ujian_id: number) => `admin/hasil_ujian/analysis/${ujian_id}`,
    }

    const [ujianList, setUjianList] = useState<IUjian[]>([]);
    const [selectedUjian, setSelectedUjian] = useState<IUjian | null>(null);
    const [analisisUjian, setAnalisisUjian] = useState<AnalisisUjian | null>(null);

    useEffect(() => {
        fetchUjianList();
    }, [])

    const fetchUjianList = () => {
        ujianService.getUjian(undefined, 1, 100)
        .then(res => {
            const {data} = res;
            setUjianList(data);
        })
    }

    const fetchDataUjian = (ujian_id: number) => {
        const url = `${base_url}${endpoints['analisis_jawaban'](ujian_id)}`;
        axios.get(url).then(res => {
            setAnalisisUjian(res.data);
            console.log("Analisis Jawaban: ", res)
        })
    }

    const onSelectUjian = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ujian_id = e.target.value;
        if(ujian_id) fetchDataUjian(Number(ujian_id));
        setSelectedUjian(() => {
            const ujian = ujianList.find(el => el.id === Number(ujian_id));
            return ujian ?? null;
        })
    }

    const getSummary = (): {data: {name: string, data: number[]}[], categories: string[]} => {
        if(!analisisUjian) return {data: [], categories: []};
        const hasil: number[] = [];
        const categories: string[] = [];
        for(const key of Object.keys(analisisUjian.descriptive) as (keyof typeof analisisUjian.descriptive)[]){
            categories.push(key);
            hasil.push(analisisUjian.descriptive[key]);
        }
        const data = [{
            name: 'Value',
            data: hasil,
        }]
        return {data, categories}
    }

    const getScore = (): {data: {name: string, data: number[]}[], categories: string[]} => {
        if(!analisisUjian) return {data: [], categories: []}
        const data =  [{
            name: 'Nilai Ujian',
            data: analisisUjian.scores.map(el => {
                return el.score
            })
        }]
        const categories = analisisUjian.scores.map(el => {
            return el.nama
        })
        return {data, categories}
    }

    const getRanking = (): {data: {name: string, data: number[]}[], categories: string[]} => {
        if(!analisisUjian) return {data: [], categories: []}
        const data =  [{
            name: 'Nilai Ujian',
            data: analisisUjian.scores.map(el => {
                return el.score
            })
        }]
        const categories = analisisUjian.scores.map(el => {
            return el.nama
        })
        return {data, categories}
    }

    const style = {
        chart: 'bg-white rounded-xl shadow-xl p-2'
    }

    return (
    <div className="flex flex-col gap-6 w-full h-full bg-gray-200 p-10 overflow-y-auto">
        <div className="flex justify-between items-center">
            <p className="text-[20px] font-bold text-gray-600">Analisis Hasil Ujian</p>   
            <select 
                id="ujian" 
                className="min-w-60 bg-gray-50 border-2 rounded-lg px-2 py-1.5 border-gray-300 text-black"
                onChange={onSelectUjian}
                value={selectedUjian ? selectedUjian.id : ''}
            >
                <option value=''>Pilih Ujian</option>
                {ujianList.map(el => (
                    <option key={el.id} value={el.id}>{el.nama}</option>
                ))}
            </select>
        </div>
        {(analisisUjian && selectedUjian) && (
            <div className="grid grid-cols-2 gap-6">
                <div className={style.chart}>
                    <BarChart
                        categories={getSummary().categories}
                        data={getSummary().data}
                        minValueHeight={100}
                        title="Rangkuman Hasil Ujian"
                    /> 
                </div>

                <div className={style.chart}>
                    <BarChart
                        categories={getScore().categories}
                        data={getScore().data}
                        minValueHeight={100}
                        title="Nilai Ujian"
                    /> 
                </div>

                <div className={style.chart}>
                    <BarChart
                        categories={getRanking().categories}
                        data={getRanking().data}
                        minValueHeight={100}
                        title="Ranking"
                    /> 
                </div>
            </div>
        )}
        {!(selectedUjian && analisisUjian) && (
            <div className="w-full h-full flex justify-center items-center">
                <p>Pilih Ujian yang ingin ditampilkan</p>
            </div>
        )}
    </div>
    )

}