import axios from "axios";
import { Environment } from "../environment/environment"
import { useEffect, useState } from "react";
import { ISesiUjian, IUjian } from "../models/ujian.type";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { getTokenPayload } from "../utils/jwt";

export function UjianLanding() {

    const [pagination] = useState<IPaginationNew>(defaultPaginationValueNew);
    const [ujianList, setUjianList] = useState<ISesiUjian[]>([]);

    const endpoints = {
        get_ujian: 'siswa/ujian',
        get_kelompok_ujian: 'siswa/kelompok_ujian',
        sesi_soal: 'siswa/sesi_soal'
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
        // getKelompokUjian();
        getUjian();
        startUjian(1)
    }, [])

    const getKelompokUjian = () => {
        const url = `${baseUrl}${endpoints['get_kelompok_ujian']}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            console.log("Kelompok Ujian: ", res);
        })
    }

    const getUjian = () => {
        const url = `${baseUrl}${endpoints['get_ujian']}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            console.log("Ujian: ", res);
            setUjianList(res.data.data);
        })
    }

    const startUjian = (ujian_id: number) => {
        const tokenPayload = getTokenPayload();
        console.log(tokenPayload)
        const url = `${baseUrl}${endpoints['sesi_soal']}?nomor_peserta=${tokenPayload.nomor_peserta}&ujian_id=${ujian_id}`
        console.log(url)
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            console.log("Start Ujian: ", res)
        })
    }

    return (
        <div className="flex w-screen h-screen overflow-hidden">
            <div className="flex justify-center w-full h-full bg-gray-100 p-6">
                <div className="flex flex-col bg-white h-full rounded-md shadow-md p-4 w-full xl:max-w-400">
                    {/* <h1>Pilih Ujian</h1> */}
                    <Table <IUjian>
                        title="Ujian List"
                        headList={['Ujian', 'Kelompok Ujian', 'Kelas', 'Mata Pelajaran']}
                        keyList={['nama', 'kelompok_ujian_name', 'kelas_name', 'mapel_name']}
                        pagination={pagination}
                        data={getUjianList()}
                        onChangePage={() => {}}
                        customActionButton={(
                            <button onClick={() => {}} className="bg-green-500 py-1.5 px-2 rounded-md text-white cursor-pointer w-30">
                                <p>Mulai Ujian</p>
                            </button>
                        )}
                    />
                </div>
            </div>
        </div>
    )

}