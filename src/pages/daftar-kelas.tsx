import { useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValue, IPagination } from "../models/table.type";
import { useDialog } from "../context/DialogContext";
import { Form } from "../components/form";
import { Icon } from "../components/icon";
import { daftarKelasList } from "../models/mockup.constant";
import { Environment } from "../environment/environment";
import axios from "axios";
import { ValidationDialog } from "../components/validation-dialog";

export interface IDaftarKelas {
    id: number,
    nama: string;
}

const baseUrl = Environment.base_url;
const daftarKelas: IDaftarKelas[] = daftarKelasList;
// const tingkatKelas: string[] = ["VII", "VIII", "IX"];

export function DaftarKelas() {

    const {openDialog, closeDialog} = useDialog();
    const [pagination] = useState<IPagination>(defaultPaginationValue);
    const endpoints = {
        add: `admin/daftar_kelas`,
        edit: `admin/daftar_kelas`,
        delete: (id: number) => `admin/daftar_kelas/${id}`,
    }

    const addClass = () => {
        const addClass = async (data: IDaftarKelas) => {
            const url = `${baseUrl}${endpoints['add']}`;
            const response = await axios.post(url, data);
            console.log("Add Class Response: ", response);
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

    const handleEdit = (data: IDaftarKelas) => {
        const editClass = async (editedData: IDaftarKelas) => {
            const url = `${baseUrl}${endpoints['edit']}`;
            const response = await axios.put(url, editedData);
            console.log("Edit Response: ", response);
        }

        openDialog({
            width: "500px",
            height: "240px",
            content: (
                <Form <IDaftarKelas>
                    data={data}
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

    const handleDelete = (data: IDaftarKelas) => {
        const deleteClass = async (valid: boolean) => {
            if(valid){
                const url = `${baseUrl}${endpoints['delete'](data.id)}`;
                const response = await axios.delete(url);
                console.log("Delete Response: ", response);
            }
        }

        openDialog({
            width: "500px",
            height: "240px",
            content: (
                <ValidationDialog  
                    title={`Deleting ${data.nama}`}
                    description="Are you sure you want to delete this data?"
                    response={deleteClass}
                />
            )
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
                        <button onClick={addClass} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                            <Icon name="heroicons:plus" shape="outline"/>
                            <p>Tambah Kelas</p>
                        </button>
                    )}
                />
            </div>
        </div>
    )
}