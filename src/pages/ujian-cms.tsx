import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValue, IPagination } from "../models/table.type";
import { useDialog } from "../context/DialogContext";
import { Form } from "../components/form";
import { Icon } from "../components/icon";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";

export interface IUjian {
    id: number,
    nama: string,
    kelompok_id: string,
    mapel_id: string,
    kelas_id: string,
    id_sekolah: string | number,
    start_date: string,
    end_date: string,
    status: string,
    updated_at: string,
    created_at: string
}

const baseUrl = Environment.base_url;

export function UjianCMS() {

    const {openDialog, closeDialog} = useDialog();
    const [pagination] = useState<IPagination>(defaultPaginationValue);
    const [ujian, setUjian] = useState<IUjian[]>([]);
    const endpoints = {
        create: `admin/ujian`,
        get: `admin/ujian`,
        edit: (id: number) => `admin/ujian/${id}`,
        delete: (id: number) => `admin/ujian/${id}`,
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
            setUjian(response.data.data);
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
        const addClass = (body: IUjian) => {
            body = {
                ...body,
                id_sekolah: 1
            }
            const url = `${baseUrl}${endpoints['create']}`;
            axios.post(url, body, {
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
            height: "600px",
            content: (
                <Form <IUjian>
                    title="Tambah Kelas"
                    headList={['Ujian', 'Kelompok Ujian', 'Mapel', 'Kelas', 'Tanggal Mulai', 'Tanggal Berakhir', 'Status']}
                    keyList={['nama', 'kelompok_id', 'mapel_id', 'kelas_id', 'start_date', 'end_date', 'status']}
                    type={["text", "text", "text", "text", "date", "date", "text"]}
                    onSubmit={addClass}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleEdit = (daftar_kelas: IUjian) => {
        const editClass = (editedData: IUjian) => {
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
            height: "600px",
            content: (
                <Form <IUjian>
                    data={daftar_kelas}
                    title="Tambah Kelas"
                    headList={['Ujian', 'Kelompok Ujian', 'Mapel', 'Kelas', 'Tanggal Mulai', 'Tanggal Berakhir', 'Status']}
                    keyList={['nama', 'kelompok_id', 'mapel_id', 'kelas_id', 'start_date', 'end_date', 'status']}
                    type={["text", "text", "text", "text", "date", "date", "text"]}
                    onSubmit={editClass}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleDelete = (kelas: IUjian) => {
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
                <Table <IUjian>
                    title="Daftar Kelas"
                    data={ujian}
                    headList={['Ujian', 'Kelompok Ujian', 'Mapel', 'Kelas', 'Tanggal Mulai', 'Tanggal Berakhir', 'Status']}
                    keyList={['nama', 'kelompok_id', 'mapel_id', 'kelas_id', 'start_date', 'end_date', 'status']}
                    pagination={pagination}
                    editAction={true}
                    deleteAction={true}
                    onEditAction={handleEdit}
                    onDeleteAction={handleDelete}
                    additionalButton={(
                        <button onClick={handleAdd} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                            <Icon name="heroicons:plus" shape="outline"/>
                            <p>Tambah Ujian</p>
                        </button>
                    )}
                />
            </div>
        </div>
    )
}