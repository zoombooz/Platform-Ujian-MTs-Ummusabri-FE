import { useEffect, useState } from "react";
import { Environment } from "../environment/environment"
import { useParams } from "react-router";
import axios from "axios";

export interface IHasilUjian {
    id: number,
    nama: string,
    nomor_peserta: number,
    ujian_id: number,
    soal: string,
    tipe_soal: 'essai' | 'pilihan_ganda',
    jawaban_soal: string,
    jawaban_sesi: string,
    isTrue: number
}

export function Evaluasi () {

    const [hasilUjianList, setHasilUjianList] = useState<IHasilUjian[]>([]);

    const {ujian_id, nomor_peserta} = useParams();
    const {base_url} = Environment;
    const endpoints = {
        get_hasil_ujian: (nomor_peserta: number, ujian_id: number) => `admin/hasil_ujian?nomor_peserta=${nomor_peserta}&ujian_id=${ujian_id}`,
        get_hasil_ujian_detail: (hasil_ujian_id: number) => `admin/hasil_ujian/show/${hasil_ujian_id}`,
        update_hasil_ujian: (hasil_ujian_id: number) => `admin/hasil_ujian/update/${hasil_ujian_id}`
    }

    useEffect(() => {
        getHasilUjian();
    }, [])

    const getHasilUjian = () => {
        if(ujian_id && nomor_peserta){
            const url = `${base_url}${endpoints['get_hasil_ujian'](Number(nomor_peserta), Number(ujian_id))}`;
            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            }).then(res => {
                console.log("Response hasil ujian: ", res)
            })
        }
        return;
    }

    return (
        <div className="w-full h-full bg-gray-200 p-10 overflow-y-auto">
            <div>Evaluasi Works</div>
        </div>
    )

}