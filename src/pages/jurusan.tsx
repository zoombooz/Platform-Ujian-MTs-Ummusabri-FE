import { useState } from "react"
import { Icon } from "../components/icon"
import { Table } from "../components/table"
import { defaultPaginationValue } from "../models/table.type"
import { jurusanList } from "../models/mockup.constant"
import { useDialog } from "../context/DialogContext"
import { Form } from "../components/form"
import { Environment } from "../environment/environment"
import axios from "axios"
import Swal from "sweetalert2"

export interface IJurusan {
    id: string,
    nama: string,
    created_at: string,
    updated_at: string
}

const jurusan: IJurusan[] = jurusanList;
const baseUrl = Environment.base_url;

export function Jurusan() {

    const {openDialog, closeDialog} = useDialog();
    const [pagination] = useState(defaultPaginationValue);

    const endpoints = {
        create: `admin/jurusan`,
        get: `admin/jurusan`,
        edit: (id: string) => `admin/jurusan/${id}`,
        delete: (id: string) => `admin/jurusan/${id}`
    }

    const handleAdd = () => {
        const addJurusan = async (body: Partial<IJurusan>) => {
            const url = `${baseUrl}${endpoints['create']}`;
            const response = await axios.post(url, body);
            console.log("Response: ", response)
        }

        openDialog({
            width: "500px",
            height: "240px",
            content: (
                <Form <IJurusan>
                    title="Tambah Jurusan"
                    headList={["Nama Jurusan"]}
                    keyList={["nama"]}
                    type={["text"]}
                    onSubmit={addJurusan}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleEdit = (jurusan: IJurusan) => {
        const editJurusan = async (body: Partial<IJurusan>) => {
            const url = `${baseUrl}${endpoints['edit'](jurusan.id)}`;
            const response = await axios.post(url, body);
            console.log("Response: ", response)
        }

        openDialog({
            width: "500px",
            height: "240px",
            content: (
                <Form <IJurusan>
                    data={jurusan}
                    title="Tambah Jurusan"
                    headList={["Nama Jurusan"]}
                    keyList={["nama"]}
                    type={["text"]}
                    onSubmit={editJurusan}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleDelete = (jurusan: IJurusan) => {
        Swal.fire({
            title: "Menghapus Item",
            text: "Apakah anda yakin ingin menghapus item ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(async result => {
            if(result){
                const url = `${baseUrl}${endpoints['delete'](jurusan.id)}`;
                const response = await axios.delete(url);
                console.log("Delete Jurusan Response: ", response);
            }
        })
    }

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full min-h-full p-6 shadow-md">
                <Table <IJurusan>
                    title="Jurusan"
                    data={jurusan}
                    headList={['Id', 'Nama Jurusan']}
                    keyList={['id', 'nama']}
                    pagination={pagination}
                    numberRow={false}
                    editAction={true}
                    deleteAction={true}
                    additionalButton={(
                        <div className="flex gap-1">
                            <button onClick={handleAdd} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                                <Icon name="heroicons:plus" shape="outline"/>
                                <p>Tambah Jurusan</p>
                            </button>
                        </div>
                    )}
                    onEditAction={handleEdit}
                    onDeleteAction={handleDelete}
                />
            </div>
        </div>
    )

}