import { useEffect, useState } from "react";
import { useDialog } from "../context/DialogContext";
import { defaultPaginationValue, IPagination } from "../models/table.type";
import { Table } from "../components/table";
import { pesertaList } from "../models/mockup.constant";
import { Icon } from "../components/icon";
import { Environment } from "../environment/environment";
import { Form } from "../components/form";
import axios from "axios";
import Swal from "sweetalert2";
import { IAgama } from "./agama";

export interface IPeserta {
    nama: string,
    password: string,
    jurusan_id: string,
    agama_id: string,
    kelas_id: string,
    nomor_peserta: string,
    updated_at: string,
    created_at: string,
    id: number,
}

const peserta: IPeserta[] = pesertaList;
const baseUrl = Environment.base_url;

export function Peserta() {

    const {openDialog, closeDialog} = useDialog();
    const [peserta, setPeserta] = useState<IPeserta[]>([]);
    const [agama, setAgama] = useState<{name: string, key: string}[]>([]);
    const [pagination] = useState<IPagination>(defaultPaginationValue);
    const endpoints = {
        get: `admin/peserta`,
        add: `admin/peserta`,
        edit: (id: number) => `admin/peserta/${id}`,
        delete: (id: number) => `admin/peserta/${id}`,
        get_agama: 'admin/agama'
    }

    useEffect(() => {
        fetchData();
        fetchAgama();
    }, [])

    const fetchData = async () => {
        try {
            const url = `${baseUrl}${endpoints['get']}`;
            const response = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            setPeserta(response.data.data);
            console.log("Peserta: ", response)
        } catch (error) {
            console.error(error);
        }
    }

    const fetchAgama = async () => {
        try {
            const url = `${baseUrl}${endpoints['get_agama']}`;
            const response = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            const agamaList = response.data.data.map((el: IAgama) => {
                return {
                    name: el.nama,
                    key: el.id
                }
            })
            setAgama(agamaList);
        } catch (error) {
            console.error(error);
        }
    }

    const handleAdd = () => {
        const addPeserta = async (body: Partial<IPeserta>) => {
            const url = `${baseUrl}${endpoints['add']}`;
            try {
                const response = await axios.post(url, body, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                console.log("Add Agama Response: ", response);
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
            height: "540px",
            content: (
                <Form <IPeserta>
                    title="Tambah Peserta"
                    headList={["Nama Peserta", "Password", "Jurusan", "Agama", "Kelas", "Nomor Peserta"]}
                    keyList={["nama", "password", "jurusan_id", "agama_id", "kelas_id", "nomor_peserta"]}
                    type={["text", "password", "select", "select", "select", "text"]}
                    selectList={{
                        jurusan_id: agama,
                        agama_id: agama,
                        kelas_id: agama
                    }}
                    onSubmit={addPeserta}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleEdit = (peserta: IPeserta) => {
        const editPeserta = async (body: Partial<IPeserta>) => {
            const url = `${baseUrl}${endpoints['edit'](peserta.id)}`;
            try {
                const response = await axios.put(url, body, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                console.log("Edit Agama Response: ", response);
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
            height: "540px",
            content: (
                <Form <IPeserta>
                    data={peserta}
                    title="Tambah Peserta"
                    headList={["Nama Peserta", "Password", "Jurusan", "Agama", "Kelas", "Nomor Peserta"]}
                    keyList={["nama", "password", "jurusan_id", "agama_id", "kelas_id", "nomor_peserta"]}
                    type={["text", "password", "select", "select", "select", "text"]}
                    selectList={{
                        jurusan_id: agama,
                        agama_id: agama,
                        kelas_id: agama
                    }}
                    onSubmit={editPeserta}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleDelete = (peserta: IPeserta) => {
        Swal.fire({
            title: "Apakah anda yakin ingin menghapus peserta ini?",
            text: "Data yang dihapus tidak dapat kembali",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(async result => {
            if(result){
                const url = `${baseUrl}${endpoints['delete'](peserta.id)}`;
                const response = await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                fetchData();
            }
        })
    }

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full h-full p-6 shadow-md">
                <Table <IPeserta>
                    title="Daftar Peserta"
                    data={peserta}
                    headList={['Nama', 'Jurusan', 'Agama', 'Kelas']}
                    keyList={['nama', 'jurusan_id', 'agama_id', 'kelas_id']}
                    pagination={pagination}
                    editAction={true}
                    deleteAction={true}
                    additionalButton={(
                        <button className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all" onClick={handleAdd}>
                            <Icon name="heroicons:plus" shape="outline"/>
                            <p>Tambah Peserta</p>
                        </button>
                    )}
                    onEditAction={handleEdit}
                    onDeleteAction={handleDelete}
                />
            </div>
        </div>
    )

}