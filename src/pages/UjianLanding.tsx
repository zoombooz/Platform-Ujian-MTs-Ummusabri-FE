import axios from "axios";
import { Environment } from "../environment/environment"
import { useEffect, useState } from "react";
import { ISesiUjian, IUjian } from "../models/ujian.type";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { CardList } from "../components/CardList";
import { Icon } from "../components/icon";

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
                mapel_name: el.mapel.nama,
                status_ujian: (el.isTrue !== null ? 'Finished' : 'Available')
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

    const logOut = () => {
        Swal.fire({
            title: "Log Out",
            text: "Apakah anda yakin ingin keluar?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(result => {
            if(result.isConfirmed){
                localStorage.removeItem("authToken");
                navigate("/login-student")
            }
        })
    }

    return (
        <div className="relative flex w-screen h-screen overflow-hidden">
            
            
            <div className="flex justify-center w-full h-full bg-gray-200 p-6">
                <div className="flex flex-col bg-white h-full rounded-md shadow-md p-4 w-full xl:max-w-400">
                    <div className="flex justify-between pb-2">
                        <div>
                            <h1 className="font-bold">📝Daftar Ujian Tersedia</h1>
                            <p className="text-gray-500 font-medium">Silakan pilih ujian yang ingin Anda kerjakan dari daftar berikut.</p>
                        </div>
                        <button 
                            className="bg-blue-500 hover:bg-blue-600 transition-all active:bg-blue-700 px-3 py-1 sm:w-32 h-12 rounded-xl cursor-pointer" 
                            onClick={() => logOut()}
                        >
                            <Icon name="heroicons:arrow-left-start-on-rectangle" shape="outline" customClass="text-white sm:hidden" />
                            <p className="text-white hidden sm:block">Log Out</p>
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <Table <IUjian>
                            title={''}
                            headList={['ID', 'Ujian', 'Kelompok Ujian', 'Kelas', 'Mata Pelajaran', 'Status']}
                            keyList={['id', 'nama', 'kelompok_ujian_name', 'kelas_name', 'mapel_name', 'status_ujian']}
                            pagination={pagination}
                            data={getUjianList()}
                            onChangePage={() => {}}
                            infoAction={true}
                            onInfoAction={res => startUjian(res.id)}
                            infoButtonText="▶️ Mulai Ujian"
                            loading={loading}
                            numberRow={false}
                            isRowDisabled={(data) => (data.isTrue !== null)}
                            iconOnActionButton={false}
                            colValueWithBackground={['status_ujian']}
                            colBackgroundColor={{
                                'Available': 'bg-green-500 px-3 py-2 rounded-lg text-white font-semibold flex justify-center',
                                'Finished': 'bg-red-500/80 px-3 py-2 rounded-lg text-white font-semibold flex justify-center',
                                'default': 'bg-gray-500 px-3 py-2 rounded-lg'
                            }}
                        />
                    </div>

                    <div className="block md:hidden overflow-y-auto">
                        <CardList 
                            title={'Daftar Ujian'}
                            cardTitle="nama"
                            headList={['ID', 'Ujian', 'Kelompok Ujian', 'Kelas', 'Mata Pelajaran', 'Status']}
                            keyList={['id', 'nama', 'kelompok_ujian_name', 'kelas_name', 'mapel_name', 'status_ujian']}
                            pagination={pagination}
                            data={getUjianList()}
                            onChangePage={() => {}}
                            infoAction={true}
                            onInfoAction={res => startUjian(res.id)}
                            // infoButtonText="▶️ Mulai Ujian"
                            loading={loading}
                            // numberRow={false}
                            isCardDisabled={(data) => (data.isTrue !== null)}
                            // iconOnActionButton={false}
                            // colValueWithBackground={['status_ujian']}
                            // colBackgroundColor={{
                            //     'Available': 'bg-green-500 px-3 py-2 rounded-lg text-white font-semibold flex justify-center',
                            //     'Finished': 'bg-red-500/80 px-3 py-2 rounded-lg text-white font-semibold flex justify-center',
                            //     'default': 'bg-gray-500 px-3 py-2 rounded-lg'
                            // }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}