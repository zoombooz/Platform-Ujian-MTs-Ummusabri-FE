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
    },
    
    top_performers: {
        nomor_peserta: number,
        nama: string,
        kelas: string,
        score: number
    }[],

    overall_statistics: {
        count: number,
        min: number,
        max: number,
        average: number,
        median: number,
        stdDev: number,
        confidence_interval?: {
            low: number,
            high: number
        }
    },

    class_analysis: {
        all_classes: {
            class_name: string,
            average_score: number
        }[],
        top_5_classes: {
            class_name: string,
            average_score: number
        }[],
        bottom_5_classes: {
            class_name: string,
            average_score: number
        }[]
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

    const getSummary = (): { data: { name: string, data: number[] }[], categories: string[] } => {
        if (!analisisUjian) return { data: [], categories: [] };

        const stats = (analisisUjian as any).overall_statistics ?? analisisUjian.descriptive;
        const categories: string[] = [
            "count",
            "min",
            "max",
            "average",
            "median",
            "stdDev",
            // "ci_low",
            // "ci_high"
        ];

        const values: number[] = [
            stats.count,
            stats.min,
            stats.max,
            stats.average,
            stats.median,
            stats.stdDev,
            // confidence_interval may be in stats.confidence_interval or stats.confidence_interval_95
            // stats.confidence_interval?.low ?? stats.confidence_interval_95?.low ?? 0,
            // stats.confidence_interval?.high ?? stats.confidence_interval_95?.high ?? 0
        ];

        return {
            data: [{ name: "Value", data: values }],
            categories
        };
    }

    const getScore = (): { data: { name: string; data: number[] }[]; categories: string[] } => {
        if (!analisisUjian) return { data: [], categories: [] };

        const data = [
            {
                name: 'Top Performers',
                data: analisisUjian.top_performers.map(tp => tp.score)
            }
        ];
        const categories = analisisUjian.top_performers.map(tp => tp.nama);

        return { data, categories };
    };

    // const getRanking = (): {data: {name: string, data: number[]}[], categories: string[]} => {
    //     if(!analisisUjian) return {data: [], categories: []}
    //     const data =  [{
    //         name: 'Nilai Ujian',
    //         data: analisisUjian.scores.map(el => {
    //             return el.score
    //         })
    //     }]
    //     const categories = analisisUjian.scores.map(el => {
    //         return el.nama
    //     })
    //     return {data, categories}
    // }

    const getClassTop5 = (): { data: { name: string; data: number[] }[]; categories: string[] } => {
        if (!analisisUjian) return { data: [], categories: [] };
        const arr = analisisUjian.class_analysis.top_5_classes;
        return {
            data: [{ name: 'Top 5 Classes', data: arr.map(c => c.average_score) }],
            categories: arr.map(c => c.class_name)
        };
    };

    const getClassBottom5 = (): { data: { name: string; data: number[] }[]; categories: string[] } => {
        if (!analisisUjian) return { data: [], categories: [] };
        const arr = analisisUjian.class_analysis.bottom_5_classes;
        return {
            data: [{ name: 'Bottom 5 Classes', data: arr.map(c => c.average_score) }],
            categories: arr.map(c => c.class_name)
        };
    };

    const getAllClasses = (): { data: { name: string; data: number[] }[]; categories: string[] } => {
        if (!analisisUjian) return { data: [], categories: [] };
        const arr = analisisUjian.class_analysis.all_classes;
        return {
            data: [{ name: 'All Classes Avg Score', data: arr.map(c => c.average_score) }],
            categories: arr.map(c => c.class_name)
        };
    };

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
                        title="Top 5 Peserta Ujian"
                    /> 
                </div>

                <div className={style.chart}>
                    <BarChart
                        categories={getClassTop5().categories}
                        data={getClassTop5().data}
                        minValueHeight={100}
                        title="Top 5 Kelas berdasarkan Rata-rata"
                    /> 
                </div>

                
                <div className={style.chart}>
                    <BarChart
                        categories={getAllClasses().categories}
                        data={getAllClasses().data}
                        minValueHeight={100}
                        title="Nilai Rata-rata Per-Kelas"
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