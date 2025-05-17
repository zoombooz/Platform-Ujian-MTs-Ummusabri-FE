import { useEffect, useState } from "react";
import axios from "axios";
import { Environment } from "../environment/environment";
import { Loader } from "../components/loader";
import { useParams } from "react-router";
import HasilUjianPdfViewer from "../components/HasilUjianPdfViewer";
import logoPesri from "@assets/logo-pesri.png"

export function HasilUjianAnalysisSingle() {

    const {base_url} = Environment;
    const { ujian_id } = useParams<{ ujian_id: string }>();

    const endpoints = {
        analisis_jawaban: (ujian_id: number) => `admin/hasil_ujian/analysis/${ujian_id}`,
        get_kelompok_ujian: "admin/kelompok_ujian",
        get_mapel: "admin/mapel",
        get_daftar_kelas: "admin/daftar_kelas",
        get_tingkatan: "admin/tingkatan",
        get_ujian: `admin/ujian/${ujian_id}`
    };

    const [ujian,setUjian] = useState<any>();

    const [tingkatanList, setTingkatanList] = useState<any[]>([]);
    const [kelasList, setKelasList] = useState<any[]>([]);

    const [selectedTingkatan,setSelectedTingkatan] = useState<any>(null); 
    const [selectedKelas,setSelectedKelas] = useState<any>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const [hasilUjian,setHasilUjian] = useState<any>(null);

    useEffect(() => {
        fetchAdditionalData(endpoints["get_ujian"],setUjian);
        fetchAdditionalData(endpoints["get_daftar_kelas"], setKelasList);
        fetchAdditionalData(endpoints["get_tingkatan"], setTingkatanList);
    }, [])

    const fetchAdditionalData = (endpoint: string, setList: React.Dispatch<React.SetStateAction<any>>) => {
        setLoading(true);
        const url = `${base_url}${endpoint}?limit=100`;
        console.log(url)
        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })
            .then((response) => {
                const { data } = response.data;
                if(data) setList(data);
                else setList(response.data);
            })
            .catch((error) => {
                console.error(error);
            }).finally(()=>{
                setLoading(false);
            });
    }

    const onSelect = (e: React.ChangeEvent<HTMLSelectElement>, setList: React.Dispatch<React.SetStateAction<any>>,selectList:any[]) => {
        const id = e.target.value;
        setList(() => {
                const selected = selectList?.find((el: { id: number; }) => el.id === Number(id));
                return selected ?? null;
            })
        // if(ujian_id) fetchDataUjian(Number(ujian_id));
        // setSelectedUjian(() => {
        //     const ujian = ujianList.find(el => el.id === Number(ujian_id));
        //     return ujian ?? null;
        // })
    }

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

    // const getAllClasses = (): { data: { name: string; data: number[] }[]; categories: string[] } => {
    //     if (!analisisUjian) return { data: [], categories: [] };
    //     const arr = analisisUjian.class_analysis.all_classes;
    //     return {
    //         data: [{ name: 'All Classes Avg Score', data: arr.map(c => c.average_score) }],
    //         categories: arr.map(c => c.class_name)
    //     };
    // };

    const fetchHasilUjian = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // if (!selectedTingkatan || !selectedKelas || !ujian_id) {
        //     alert("Please select Tingkatan, Kelas, and Ujian.");
        //     return;
        // }

        const kelas_id = selectedKelas?.id;
        const tingkatan_id = selectedTingkatan?.id;
        
        setLoading(true);
        let url = `${base_url}admin/hasil_ujian/ujian/${ujian_id}?`;
        if (kelas_id) url += `kelas_id=${kelas_id}&`;
        if (tingkatan_id) url += `tingkatan_id=${tingkatan_id}&`;
        url = url.slice(0, -1); // Remove the trailing '&'

        axios
            .get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            })
            .then((response) => {
                setHasilUjian(response?.data ? response?.data : response);
                console.log("Hasil Ujian : ", response?.data ? response?.data : response);
            })
            .catch((error) => {
                console.error("Error fetching Hasil Ujian : ", error);
            })
            .finally(() => {
                setLoading(false);
                console.log(selectedKelas)
            });
    };

    const style = {
        chart: 'bg-white rounded-xl shadow-xl p-2'
    }

    return (
    <div className="relative flex flex-col gap-6 w-full h-full bg-gray-200 p-10 overflow-y-auto">
        {loading && (
        <div className="absolute flex justify-center items-center w-full h-full">
            <Loader/>
        </div>
        )}
            <p className="text-[20px] font-bold text-gray-600">Analisis Hasil Ujian</p>   
        <form onSubmit={fetchHasilUjian} className="flex justify-between items-center">
            <select 
                id="ujian" 
                className="min-w-60 bg-gray-50 border-2 rounded-lg px-2 py-1.5 border-gray-300 text-black"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>onSelect(e,setSelectedTingkatan,tingkatanList)}
                value={selectedTingkatan ? selectedTingkatan.id : ''}
            >
                <option value=''>Pilih Tingkatan</option>
                {tingkatanList.map(el => (
                    <option key={`${el.id}${el.nama}`} value={el.id}>{el.nama}</option>
                ))}
            </select>
            <div className="flex gap-2">
            <select 
                id="ujian" 
                className="min-w-60 bg-gray-50 border-2 rounded-lg px-2 py-1.5 border-gray-300 text-black"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>onSelect(e,setSelectedKelas,kelasList)}
                value={selectedKelas ? selectedKelas.id : ''}
            >
                <option value=''>Pilih Kelas</option>
                {kelasList.map(el => (
                    <option key={`${el.id}${el.nama}`} value={el.id}>{el.nama}</option>
                ))}
            </select>

            <button 
                type="submit" 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
                Submit
            </button>
            </div>
        </form>

        {ujian?.nama && (<HasilUjianPdfViewer data={hasilUjian} title={ujian?.nama} kelas={selectedKelas?.nama} tingkatan={selectedTingkatan?.nama} logoUrl={logoPesri} />)}
        
    </div>
    )

}