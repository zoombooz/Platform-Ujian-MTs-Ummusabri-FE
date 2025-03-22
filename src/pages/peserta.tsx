import { useState } from "react";
import { useDialog } from "../context/DialogContext";
import { defaultPaginationValue, IPagination } from "../models/table.type";
import { Table } from "../components/table";
import { pesertaList } from "../models/mockup.constant";
import { Icon } from "../components/icon";
import { Environment } from "../environment/environment";
import { Form } from "../components/form";
import axios from "axios";
import Swal from "sweetalert2";

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
    const [pagination] = useState<IPagination>(defaultPaginationValue);
    const endpoints = {
        get: `admin/peserta`,
        add: `admin/peserta`,
        edit: (id: number) => `admin/peserta${id}`,
        delete: (id: number) => `admin/peserta/${id}`,
    }

    const handleAdd = () => {
        const addPeserta = async (body: Partial<IPeserta>) => {
            const url = `${baseUrl}${endpoints['add']}`;
            const response = await axios.post(url, body);
            console.log("Add Agama Response: ", response);
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
                        jurusan_id: ["1", "2", "3"],
                        agama_id: ["4", "5", "6"],
                        kelas_id: ["7", "8", "9"]
                    }}
                    onSubmit={addPeserta}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleEdit = (peserta: IPeserta) => {
        const editPeserta = async (body: Partial<IPeserta>) => {
            const url = `${baseUrl}${endpoints['edit']}`;
            const response = await axios.put(url, body);
            console.log("Edit Agama Response: ", response);
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
                        jurusan_id: ["1", "2", "3"],
                        agama_id: ["4", "5", "6"],
                        kelas_id: ["7", "8", "9"]
                    }}
                    onSubmit={() => {}}
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
                const response = await axios.delete(url);
                console.log("Delete Peserta Response: ", response);
            }
        })
    }

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full h-full p-6 shadow-md">
                <Table <IPeserta>
                    title="Daftar Peserta"
                    data={peserta}
                    headList={['Nama', 'Password', 'Jurusan', 'Agama', 'Kelas']}
                    keyList={['nama', 'password', 'jurusan_id', 'agama_id', 'kelas_id']}
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