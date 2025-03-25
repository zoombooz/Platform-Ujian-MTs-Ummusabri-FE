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

export interface ISoal {
    id: number,
    ujian_id: string,
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

    const {ujian_id} = useParams();
    const baseUrl = Environment.base_url;
    const tipe_soal = [
        {name: "Pilihan Ganda", key: "pilihan_ganda"},
        {name: "Essay", key: "essai"}
    ]
    const {openDialog, closeDialog} = useDialog();
    const [pagination, setPagination] = useState(defaultPaginationValueNew);
    const [ujianList, setUjianList] = useState<{name: string, key: string}[]>([]);
    const [soal, setSoal] = useState<ISoal[]>([]);
    const endpoints = {
        get: `admin/soal`,
        add: `admin/soal`,
        edit: (id: number) => `admin/soal/${id}`,
        delete: (id: number) => `admin/soal/${id}`,
        get_ujian: 'admin/ujian'
    }

    useEffect(() => {
        console.log("Ujian ID: ", ujian_id)
        fetchData();
        fetchAdditionalData(endpoints['get_ujian'], setUjianList);
    }, [])

    const fetchData = (URL?: string) => {
        const url = URL ?? `${baseUrl}${endpoints['get']}`;
        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(response => {
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(response.data)
            setPagination(pagination)
            setSoal(data);
        }).catch(error => {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: `${(error as Error).message}`
            })
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

    const handleAdd = () => {
        const addSoal = async (body: Partial<ISoal>) => {
            const url = `${baseUrl}${endpoints['add']}`;
            try {
                await axios.post(url, body, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                closeDialog();
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


        openDialog({
            width: "500px",
            height: "500px",
            content: (
                <Form <Partial<ISoal>>
                    title="Tambah Soal"
                    headList={["Ujian", "Soal", "Tipe Soal", "Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E", "Jawaban"]}
                    keyList={["ujian_id", "soal", "tipe_soal", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "pilihan_e", "jawaban"]}
                    type={["select", "text", "select"]}
                    selectList={{
                        ujian_id: ujianList,
                        tipe_soal: tipe_soal
                    }}
                    onSubmit={addSoal}
                    onCancel={closeDialog}
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
                    closeDialog();
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

        console.log(soal)

        openDialog({
            width: "500px",
            height: "500px",
            content: (
                <Form <ISoal>
                    data={soal}
                    title="Edit Soal"
                    headList={["Ujian", "Soal", "Tipe Soal", "Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E", "Jawaban"]}
                    keyList={["ujian_id", "soal", "tipe_soal", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "pilihan_e", "jawaban"]}
                    type={["select", "text", "select"]}
                    selectList={{
                        ujian_id: ujianList,
                        tipe_soal: tipe_soal
                    }}
                    onSubmit={editAgama}
                    onCancel={closeDialog}
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
            if(result){
                const url = `${baseUrl}${endpoints['delete'](soal.id)}`;
                axios.delete(url, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                }).then(() => {
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
        })
    }

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full min-h-full p-6 shadow-md">
                <Table <ISoal>
                    title="Daftar Soal"
                    data={soal}
                    headList={['ID', 'Soal']}
                    keyList={['id', 'soal']}
                    pagination={pagination}
                    numberRow={false}
                    editAction={true}
                    deleteAction={true}
                    onEditAction={handleEdit}
                    onDeleteAction={handleDelete}
                    onChangePage={fetchData}
                    additionalButton={(
                        <div className="flex gap-1">
                            <button onClick={handleAdd} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                                <Icon name="heroicons:plus" shape="outline"/>
                                <p>Tambah Soal</p>
                            </button>
                        </div>
                    )}
                />
            </div>
        </div>
    )
}