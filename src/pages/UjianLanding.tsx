import axios from "axios";
import { Environment } from "../environment/environment"
import { useEffect, useState } from "react";
import { IUjian } from "../models/ujian.type";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { CardList } from "../components/CardList";
import { Icon } from "../components/icon";
import { getTokenPayload } from "../utils/jwt";

export function UjianLanding() {

    const navigate = useNavigate();
    const [pagination, setPagination] = useState<IPaginationNew>(defaultPaginationValueNew);
    const [ujianList, setUjianList] = useState<IUjian[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const endpoints = {
        get_ujian: `siswa/ujian?nomor_peserta=${getTokenPayload().nomor_peserta}`,
        get_kelompok_ujian: 'siswa/kelompok_ujian',
        sesi_soal: 'siswa/sesi_soal',
        sesi_ujian: 'siswa/sesi_ujian',
        start_ujian: (ujian_id: number) => `siswa/soal?ujian_id=${ujian_id}`
    }
    const baseUrl = Environment.base_url;

    const getUjianList = () : IUjian[] => {
        console.log("ujianList: ", ujianList);
        const ujian_list = ujianList.map(el => {
            console.log({
                ...el,
                // kelompok_ujian_name: el.kelompok_ujian?.nama ?? "",
                // kelas_name: el.kelas.nama,
                // mapel_name: el.mapel.nama,
                // status_ujian: el.isTrue
            })
            return {
                ...el,
                kelompok_ujian_name: el.kelompok_ujian?.nama ?? "",
                kelas_name: el.kelas.nama,
                mapel_name: el.mapel.nama,
                status_ujian: (el.isTrue && el.isTrue !== null ? 'Finished' : 'Available')
            }
        });
        return ujian_list;
    }

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async(URL?: string) => {
        setLoading(true);
        const url = URL ?? `${baseUrl}${endpoints['get_ujian']}`;
        await axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(res.data)
            console.log("Ujian: ", res);
            setUjianList(data);
            setPagination(pagination)
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    /**
     * Initiates the process of starting an exam (ujian) by confirming the user's intent,
     * validating the exam details, and sending a request to create a new exam session.
     *
     * @param ujian_id - The unique identifier of the exam to be started.
     *
     * The function performs the following steps:
     * 1. Prompts the user with a confirmation dialog using SweetAlert2.
     * 2. If confirmed, it validates the exam details by searching for the exam in the `ujianList`.
     * 3. Sends a POST request to the server to create a new exam session with the necessary data.
     * 4. Navigates the user to the exam page upon successful confirmation and session creation.
     *
     * Error Handling:
     * - Displays an error alert if the exam is not found in the `ujianList`.
     * - Displays an error alert if the POST request to create the session fails.
     * - Logs any unexpected errors to the console and shows an error alert.
     *
     * Dependencies:
     * - `axios` for making HTTP requests.
     * - `Swal` (SweetAlert2) for displaying confirmation and error dialogs.
     * - `navigate` for redirecting the user to the exam page.
     * - `getTokenPayload` for retrieving the user's participant number.
     * - `baseUrl` and `endpoints` for constructing the API endpoint URL.
     * - `localStorage` for retrieving the authentication token.
     */
    const startUjian = (ujian_id: number) => {
        const post_sesi_ujian = async (id:string|number) => {
            const url = `${baseUrl}${endpoints['sesi_ujian']}`;
            const ujian:any = ujianList.find((u) => u.id === id);
            if (!ujian) {
                Swal.fire({
                    title: "Error",
                    text: "Ujian tidak ditemukan.",
                    icon: "error",
                });
                return;
            }
            const duration = ujian.duration ?? 120;
            const data = {
                ujian_id: ujian_id,
                nomor_peserta: getTokenPayload().nomor_peserta,
                duration: duration
            }

            console.log("Data: ", data);

            await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            }).catch(err => {
                console.error(err);
                Swal.fire({
                    title: "Error",
                    text: "Gagal memulai ujian.",
                    icon: "error",
                });
            })
        }



        Swal.fire({
            title: "Memulai Ujian",
            text: "Apakah anda yakin ingin memulai ujian sekarang?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(async (result) => {
            try{
                if(result.isConfirmed){
                    await post_sesi_ujian(ujian_id)
                    navigate(`/ujian/${ujian_id}`)
                }
            }
            catch(err){
                console.error(err);
                Swal.fire({
                    title: "Error",
                    text: "Gagal memulai ujian. " + err,
                    icon: "error",
                });
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
            
            
            <div className="flex justify-center w-full h-full bg-gray-100 md:bg-gray-200 p-6">
                <div className="flex flex-col md:bg-white h-full rounded-md md:shadow-md md:p-4 w-full xl:max-w-400">
                    <div className="flex justify-between pb-2">
                        <div>
                            <h1 className="font-bold">📝Daftar Ujian Tersedia</h1>
                            <p className="text-gray-500 font-normal md:font-medium">Silakan pilih ujian yang ingin Anda kerjakan dari daftar berikut.</p>
                        </div>
                        <button 
                            className="bg-blue-500 hover:bg-blue-600 transition-all active:bg-blue-700 px-3 py-1 sm:w-32 h-12 rounded-full cursor-pointer" 
                            onClick={() => logOut()}
                        >
                            <Icon name="heroicons:arrow-left-start-on-rectangle" shape="outline" customClass="text-white sm:hidden" />
                            <p className="text-white hidden sm:block">Log Out</p>
                        </button>
                    </div>
                    <div className="hidden md:block overflow-y-auto">
                        <Table <IUjian>
                            title={''}
                            headList={['ID', 'Ujian', 'Kelompok Ujian', 'Kelas', 'Mata Pelajaran', 'Status']}
                            keyList={['id', 'nama', 'kelompok_ujian_name', 'kelas_name', 'mapel_name', 'status_ujian']}
                            pagination={pagination}
                            data={getUjianList()}
                            onChangePage={fetchData}
                            infoAction={true}
                            onInfoAction={res => startUjian(res.id)}
                            infoButtonText="▶️ Mulai Ujian"
                            loading={loading}
                            numberRow={false}
                            isRowDisabled={(data) => (data.isTrue && data.isTrue !== null)}
                            iconOnActionButton={false}
                            colValueWithBackground={['status_ujian']}
                            colBackgroundColor={{
                                'Available': 'bg-green-500 px-3 py-2 rounded-lg text-white font-semibold flex justify-center',
                                'Finished': 'bg-red-500/80 px-3 py-2 rounded-lg text-white font-semibold flex justify-center',
                                'default': 'bg-gray-500 px-3 py-2 rounded-lg'
                            }}
                        />
                    </div>

                    <div className="block md:hidden overflow-y-auto h-full">
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