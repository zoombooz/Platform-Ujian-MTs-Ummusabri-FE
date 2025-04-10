import { useEffect, useState } from "react";
import { useDialog } from "../context/DialogContext";
import { Environment } from "../environment/environment";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import axios from "axios";
import Swal from "sweetalert2";
import { Form } from "../components/form";
import { Table } from "../components/table";
import { Icon } from "../components/icon";
import { useParams } from "react-router";
import WysiwygArea from "../components/WysiwygArea";
import DOMPurify from "dompurify";
import { useDrawer } from "../context/DrawerContext";
import { Loader } from "../components/loader";

export interface ISoal {
    id: number,
    ujian_id: string | number,
    soal: string,
    image: string | null,
    tipe_soal: string,
    pilihan_a: string,
    pilihan_b: string,
    pilihan_c: string,
    pilihan_d: string,
    pilihan_e: string,
    jawaban: string,
    created_at: string,
    updated_at: string,
    ujian: string | null
}

export function SoalPage() {

    // -----------------------------------------------------------------------------------------------------
    // @ Variables
    // -----------------------------------------------------------------------------------------------------

    const [ujianList, setUjianList] = useState<{name: string, key: string}[]>([]);
    const [soal, setSoal] = useState<ISoal[]>([]);
    const [selectedSoal, setSelectedSoal] = useState<ISoal | null>(null);

    const {ujian_id, nama_ujian} = useParams();
    const {openDrawer, closeDrawer} = useDrawer();
    const [loading, setLoading] = useState<boolean>(false);

    const baseUrl = Environment.base_url;
    const tipe_soal = [
        {name: "Pilihan Ganda", key: "pilihan_ganda"},
        {name: "Essay", key: "essai"}
    ]
    const endpoints = {
        get: (ujian_id?: string) => `admin/soal${ujian_id ? `?ujian_id=${ujian_id}` : ''}`,
        add: `admin/soal`,
        edit: (id: number) => `admin/soal/${id}`,
        delete: (id: number) => `admin/soal/${id}`,
        get_ujian: 'admin/ujian'
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    useEffect(() => {
        console.log("Ujian ID: ", ujian_id)
        fetchData();
        fetchAdditionalData(endpoints['get_ujian'], setUjianList);
    }, [])

    // -----------------------------------------------------------------------------------------------------
    // @ Methods
    // -----------------------------------------------------------------------------------------------------

    const selectSoal = (soal: ISoal) => {
        setSelectedSoal(soal);
    }

    const fetchData = (URL?: string) => {
        setLoading(true);
        const url = URL ?? `${baseUrl}${endpoints['get']('')}?limit=100`;
        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(response => {
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(response.data)
            // setPagination(pagination)
            setSoal(data);
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

    const fetchAdditionalData = (endpoint: string, setList: React.Dispatch<React.SetStateAction<{name: string;key: string;}[]>>) => {
        const url = `${baseUrl}${endpoint}?limit=100`;
        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(response => {
            const list = response.data.data.map((el: any) => {
                return {
                    name: el.nama,
                    key: el.id
                }
            })
            setList(list);
        }).catch(error => {
            console.error(error)
        })
    }

    const handleAdd = (options: 'pilihan_ganda' | 'essai') => {
        const addSoal = async (body: Partial<ISoal>) => {
            body = {
                ...body,
                ujian_id: Number(ujian_id)
            }
            const url = `${baseUrl}${endpoints['add']}`;
            try {
                await axios.post(url, body, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                closeDrawer();
                fetchData();
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: `${(error as Error).message}`
                })
            }
        }

        const headList = options === 'pilihan_ganda'
            ? ["Ujian", "Tipe Soal", "Soal", "Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E", "Jawaban"]
            : ["Ujian", "Tipe Soal", "Soal"]

        const keyList = options === 'pilihan_ganda'
            ? ["ujian_id", "tipe_soal", "soal", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "pilihan_e", "jawaban"]
            : ["ujian_id", "tipe_soal", "soal"]

        openDrawer({
            content: (
                <Form <Partial<ISoal>>
                    data={{
                        ujian_id,
                        tipe_soal: options
                    }}
                    title="Tambah Soal"
                    headList={headList}
                    keyList={keyList}
                    type={["select", "select", "text-editor", "text", "text", "text", "text", "text", "select"]}
                    selectList={{
                        ujian_id: ujianList,
                        tipe_soal: tipe_soal,
                        jawaban: [
                            {name: "A", key: 'A'},
                            {name: "B", key: 'B'},
                            {name: "C", key: 'C'},
                            {name: "D", key: 'D'},
                            {name: "E", key: 'E'}
                        ]
                    }}
                    disabled={['ujian_id', 'tipe_soal']}
                    onSubmit={addSoal}
                    onCancel={closeDrawer}
                />
            )
        })
    }

    const handleEdit = (soal: ISoal) => {
        const editAgama = (editedAgama: ISoal) => {
            const url = `${baseUrl}${endpoints['edit'](soal.id)}`;
                axios.put(url, editedAgama, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                }).then(() => {
                    closeDrawer();
                    fetchData();
                }).catch ((error) => {
                    console.error(error);
                    Swal.fire({
                        icon: "error",
                        title: "Request Failed",
                        text: `${(error as Error).message}`
                    })
                });
        }

        const headList = soal.tipe_soal === 'pilihan_ganda'
            ? ["Ujian", "Tipe Soal", "Soal", "Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E", "Jawaban"]
            : ["Ujian", "Tipe Soal", "Soal"]

        const keyList = soal.tipe_soal === 'pilihan_ganda'
            ? ["ujian_id", "tipe_soal", "soal", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "pilihan_e", "jawaban"]
            : ["ujian_id", "tipe_soal", "soal"]

        openDrawer({
            content: (
                <Form <ISoal>
                    data={soal}
                    title="Edit Soal"
                    headList={headList}
                    keyList={keyList}
                    type={["select", "select", "text-editor", "text", "text", "text", "text", "text", "select"]}
                    selectList={{
                        ujian_id: ujianList,
                        tipe_soal: tipe_soal,
                        jawaban: [
                            {name: "A", key: 'A'},
                            {name: "B", key: 'B'},
                            {name: "C", key: 'C'},
                            {name: "D", key: 'D'},
                            {name: "E", key: 'E'}
                        ]
                    }}
                    disabled={['ujian_id', 'tipe_soal']}
                    onSubmit={editAgama}
                    onCancel={closeDrawer}
                />
            )
        })
    }

    const handleDelete = (soal: ISoal) => {
        Swal.fire({
            title: "Menghapus Item",
            text: "Apakah anda yakin ingin menghapus item ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(result => {
            if(result.isConfirmed){
                const url = `${baseUrl}${endpoints['delete'](soal.id)}`;
                axios.delete(url, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                }).then(() => {
                    fetchData();
                    setSelectedSoal(null);
                }).catch ((error) => {
                    console.error(error);
                    Swal.fire({
                        icon: "error",
                        title: "Request Failed",
                        text: `${(error as Error).message}`
                    })
                });
            }
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ HTML
    // -----------------------------------------------------------------------------------------------------

    return (
        <div className="relative flex flex-col gap-4 w-full h-full bg-gray-100 p-10 overflow-y-auto">
            <div className="flex justify-between">
                <h1 className="font-bold mb-5 text-gray-700">{nama_ujian}</h1>
                <div className="flex gap-2">
                    <button onClick={() => handleAdd('pilihan_ganda')} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                        <Icon name="heroicons:plus" shape="outline"/>
                        <p className="font-semibold">Tambah Pilihan Ganda</p>
                    </button>

                    <button onClick={() => handleAdd('essai')} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                        <Icon name="heroicons:plus" shape="outline"/>
                        <p className="font-semibold">Tambah Essay</p>
                    </button>

                </div>
            </div>
            <div className="flex justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {soal.map((el, index) => (
                        <button 
                            key={el.id}
                            className={`${(selectedSoal && selectedSoal.id === el.id) ? 'bg-green-500 text-white' : 'text-black hover:bg-green-500 hover:text-white'} flex justify-center items-center rounded-xl border-2 border-green-500 shadow-md px-2 py-1.5 w-12 h-12 transition-all cursor-pointer`}
                            onClick={() => selectSoal(el)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                
            </div>
            
            {selectedSoal ?
            (
                <>
                <div className="bg-white shadow-md p-4 rounded-xl border-l-4 border-green-500">
                    <h3 className="font-semibold mb-4 capitalize">Tipe Soal: <span className="font-normal">{selectedSoal.tipe_soal.replace('_', ' ')}</span></h3>
                    <p>{selectedSoal.soal}</p>
                    {
                    selectedSoal.tipe_soal === 'pilihan_ganda' && (
                    <div className="flex flex-col gap-1">
                        <p>a. {selectedSoal.pilihan_a}</p>
                        <p>b. {selectedSoal.pilihan_b}</p>
                        <p>c. {selectedSoal.pilihan_c}</p>
                        <p>d. {selectedSoal.pilihan_d}</p>
                        <p>e. {selectedSoal.pilihan_e}</p>
                        <p className="font-bold mt-4 text-green-700">Jawaban: {selectedSoal.jawaban}</p>
                    </div>
                    )
                    }

                </div>
                <div className="flex gap-4">
                    <button onClick={() => selectedSoal ? handleEdit(selectedSoal) : ''} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-yellow-500 rounded-md cursor-pointer text-white hover:bg-yellow-600 transition-all">
                        <p className="font-semibold">✏️ Edit Soal</p>
                    </button>
                    <button onClick={() => selectedSoal ? handleDelete(selectedSoal) : ''} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-red-500 rounded-md cursor-pointer text-white hover:bg-red-600 transition-all">
                        <p className="font-semibold">🗑️ Hapus Soal</p>
                    </button>
                </div>
                </>
                
            )
            :
            (
                <div className="flex w-full items-center py-4">
                    {loading 
                    ? <Loader/>
                    : (soal.length 
                        ? <div className="bg-white shadow-md p-4 rounded-xl border-l-4 border-green-500 w-120 font-semibold">Please select a question</div> 
                        : <div className="bg-white shadow-md p-4 rounded-xl border-l-4 border-green-500 w-120 font-semibold">Please add a question</div>)
                    }
                    
                </div>
            )
            }
        </div>
    )
}