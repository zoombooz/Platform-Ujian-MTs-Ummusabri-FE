import axios from "axios";
import { Environment } from "../environment/environment"
import { useEffect, useState } from "react";
import { ISesiUjian, IUjian } from "../models/ujian.type";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export function UjianLanding() {

    const navigate = useNavigate();
    const [pagination] = useState<IPaginationNew>(defaultPaginationValueNew);
    const [ujianList, setUjianList] = useState<ISesiUjian[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const endpoints = {
        get_ujian: 'siswa/ujian',
        get_kelompok_ujian: 'siswa/kelompok_ujian',
        sesi_soal: 'siswa/sesi_soal',
        start_ujian: (ujian_id: number) => `siswa/soal?ujian_id=${ujian_id}`
    }
    const baseUrl = Environment.base_url;

    const getUjianList = () => {
        const ujian_list = ujianList.map(el => {
            return {
                ...el,
                kelompok_ujian_name: el.kelompok_ujian.nama,
                kelas_name: el.kelas.nama,
                mapel_name: el.mapel.nama
            }
        });
        return ujian_list;
    }

    useEffect(() => {
        getUjian();
    }, [])

    const getUjian = () => {
        setLoading(true);
        const url = `${baseUrl}${endpoints['get_ujian']}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            console.log("Ujian: ", res);
            setUjianList(res.data.data);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    const startUjian = (ujian_id: number) => {

        Swal.fire({
            title: "Memulai Ujian",
            text: "Apakah anda yakin ingin memulai ujian sekarang?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(result => {
            if(result.isConfirmed){
                navigate(`/ujian/${ujian_id}`)
            }
        })
    }

    return (
        <div className="relative flex w-screen h-screen overflow-hidden">
            
            
            <div className="flex justify-center w-full h-full bg-gray-200 p-6">
                <div className="flex flex-col bg-white h-full rounded-md shadow-md p-4 w-full xl:max-w-400">
                    <h1 className="font-bold">📝Daftar Ujian Tersedia</h1>
                    <p className="text-gray-500 font-medium">Silakan pilih ujian yang ingin Anda kerjakan dari daftar berikut.</p>
                    <Table <IUjian>
                        title={''}
                        headList={['ID', 'Ujian', 'Kelompok Ujian', 'Kelas', 'Mata Pelajaran']}
                        keyList={['id', 'nama', 'kelompok_ujian_name', 'kelas_name', 'mapel_name']}
                        pagination={pagination}
                        data={getUjianList()}
                        onChangePage={() => {}}
                        infoAction={true}
                        onInfoAction={res => startUjian(res.id)}
                        infoButtonText="▶️ Mulai Ujian"
                        loading={loading}
                        numberRow={false}
                        // isRowDisabled={(data) => (data.isTrue !== null)}
                        iconOnActionButton={false}
                    />
                </div>
            </div>
        </div>
    )

}