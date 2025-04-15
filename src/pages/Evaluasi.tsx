import { useEffect, useState } from "react";
import { Environment } from "../environment/environment"
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import Swal from "sweetalert2";
import { ISesiUjian } from "../models/ujian.type";
import { Table } from "../components/table";

export function Evaluasi () {

    const navigate = useNavigate();
    const [ujian, setUjian] = useState<ISesiUjian[]>([]);
    const [pagination, setPagination] = useState<IPaginationNew>(defaultPaginationValueNew);
    const [loading, setLoading] = useState<boolean>(false);
    const {nomor_peserta} = useParams();
    const {base_url} = Environment;
    const endpoints = {
        get_peserta: 'admin/peserta',
        get_ujian: 'admin/sesi_ujian',
        get_hasil_ujian: (nomor_peserta: number, ujian_id: number) => `admin/hasil_ujian?nomor_peserta=${nomor_peserta}&ujian_id=${ujian_id}`,
        get_hasil_ujian_detail: (hasil_ujian_id: number) => `admin/hasil_ujian/show/${hasil_ujian_id}`,
        update_hasil_ujian: (hasil_ujian_id: number) => `admin/hasil_ujian/update/${hasil_ujian_id}`
    }

    useEffect(() => {
        fetchUjian();
        fetchPeserta();
    }, [])

    const getUjian = () => {
        const ujianList = ujian.map(el => {
            return {
                ...el,
                nama_ujian: el.ujian.nama,
                nama_kelompok_ujian: el?.ujian?.kelompok_ujian?.nama ?? '',
                nama_mapel: el?.ujian?.mapel?.nama ?? '',
                nama_kelas: el?.ujian?.kelas?.nama ?? '',
                status_ujian: (el?.ujian?.status ? (el.ujian.status === 1 ? 'Berakhir' : 'Belum Berakhir') : '')
            }
        })
        return ujianList
    }

    const fetchUjian = (URL?: string) => {
        setLoading(true);
        const url = URL ?? `${base_url}${endpoints['get_ujian']}?nomor_peserta=${nomor_peserta}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(res.data)
            setUjian(data);
            setPagination(pagination);
        }).catch(error => {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: `${(error as Error).message}`
            })
        }).finally(() => {
            setLoading(false);
        })
    }

    const fetchPeserta = () => {
        const url = `${base_url}${endpoints['get_peserta']}?nomor_peserta=${nomor_peserta}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            const data = res.data.data;
            console.log("Peserta", data)
        })
    }


    const fetchHasilUjian = (ujian_id: number) => {
        navigate(`/admin/evaluasi/${nomor_peserta}/${ujian_id}`)
    }

    return (
        <div className="w-full h-full bg-gray-200 p-10 overflow-y-auto">
            <Table <ISesiUjian>
                title={`Sesi Ujian Peserta ${nomor_peserta}`}
                data={getUjian()}
                headList={['Ujian', 'Kelompok Ujian', 'Mapel', 'Kelas', 'Tanggal Mulai', 'Tanggal Berakhir', 'Status']}
                keyList={['nama_ujian', 'nama_kelompok_ujian', 'nama_mapel', 'nama_kelas', 'start_date', 'end_date', 'status_ujian']}
                pagination={pagination}
                infoAction={true}
                onInfoAction={(row) => fetchHasilUjian(row.ujian.id)}
                onChangePage={fetchUjian}
                loading={loading}
            ></Table>
        </div>
    )

}