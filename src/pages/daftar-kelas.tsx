import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValue, IPagination } from "../models/table.type";
import { useDialog } from "../context/DialogContext";
import { Form } from "../components/form";
import { Icon } from "../components/icon";
import { daftarKelasList } from "../models/mockup.constant";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";

export interface IDaftarKelas {
    id: number,
    nama: string,
    updated_at: string,
    created_at: string
}

const baseUrl = Environment.base_url;

export function DaftarKelas() {

    const {openDialog, closeDialog} = useDialog();
    const [pagination] = useState<IPagination>(defaultPaginationValue);
    const [daftarKelas, setDaftarKelas] = useState<IDaftarKelas[]>([]);
    const endpoints = {
        create: `admin/daftar_kelas`,
        get: `admin/daftar_kelas`,
        edit: (id: number) => `admin/daftar_kelas/${id}`,
        delete: (id: number) => `admin/daftar_kelas/${id}`,
    }

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        const url = `${baseUrl}${endpoints['get']}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(response => {
            setDaftarKelas(response.data.data);
        }).catch(error => {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: `${(error as Error).message}`
            })
        })
    }

    const handleAdd = () => {
        const addClass = (data: IDaftarKelas) => {
            const url = `${baseUrl}${endpoints['create']}`;
            axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            }).then(() => {
                fetchData();
                closeDialog();
            });
        }

        openDialog({
            width: "500px",
            height: "240px",
            content: (
                <Form <IDaftarKelas>
                    title="Tambah Kelas"
                    headList={["Nama Kelas"]}
                    keyList={["nama"]}
                    type={["text"]}
                    hint={["Contoh: kimia, matematika, dll."]}
                    onSubmit={addClass}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleEdit = (daftar_kelas: IDaftarKelas) => {
        const editClass = (editedData: IDaftarKelas) => {
            const url = `${baseUrl}${endpoints['edit'](daftar_kelas.id)}`;
            axios.put(url, editedData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            }).then(() => {
                fetchData();
                closeDialog();
            }).catch(error => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: `${(error as Error).message}`
                })
            });
        }

        openDialog({
            width: "500px",
            height: "240px",
            content: (
                <Form <IDaftarKelas>
                    data={daftar_kelas}
                    title="Tambah Kelas"
                    headList={["Nama Kelas"]}
                    keyList={["nama"]}
                    type={["text"]}
                    hint={["Contoh: kimia, matematika, dll."]}
                    onSubmit={editClass}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleDelete = (kelas: IDaftarKelas) => {
        Swal.fire({
            title: "Menghapus Item",
            text: "Apakah anda yakin ingin menghapus item ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(async result => {
            if(result){
                const url = `${baseUrl}${endpoints['delete'](kelas.id)}`;
                axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }).then(() => {
                    fetchData();
                }).catch(error => {
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
            <div className="bg-white rounded-lg w-full h-full p-6 shadow-md">
                <Table <IDaftarKelas>
                    title="Daftar Kelas"
                    data={daftarKelas}
                    headList={['Nama Rombel']}
                    keyList={['nama']}
                    pagination={pagination}
                    editAction={true}
                    deleteAction={true}
                    onEditAction={handleEdit}
                    onDeleteAction={handleDelete}
                    additionalButton={(
                        <button onClick={handleAdd} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                            <Icon name="heroicons:plus" shape="outline"/>
                            <p>Tambah Kelas</p>
                        </button>
                    )}
                />
            </div>
        </div>
    )
}