import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { agamaList } from "../models/mockup.constant";
import { defaultPaginationValue } from "../models/table.type";
import { Icon } from "../components/icon";
import { useDialog } from "../context/DialogContext";
import { Form } from "../components/form";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";

export interface IAgama {
    id: number,
    nama: string,
    created_at: string,
    updated_at: string
}


export function Agama() {
    
    const baseUrl = Environment.base_url;
    const {openDialog, closeDialog} = useDialog();
    const [pagination] = useState(defaultPaginationValue);
    const [agama, setAgama] = useState<IAgama[]>([]);
    const endpoints = {
        get: `admin/agama`,
        add: `admin/agama`,
        edit: (id: number) => `admin/agama/${id}`,
        delete: (id: number) => `admin/agama/${id}`
    }

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const url = `${baseUrl}${endpoints['get']}`;
        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        setAgama(response.data.data);
    }

    const handleAdd = () => {
        const addAgama = async (body: Partial<IAgama>) => {
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
            height: "240px",
            content: (
                <Form <Partial<IAgama>>
                    title="Tambah Agama"
                    headList={["Agama"]}
                    keyList={["nama"]}
                    type={["text"]}
                    onSubmit={addAgama}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleEdit = (agama: IAgama) => {
        const editAgama = async (editedAgama: IAgama) => {
            const url = `${baseUrl}${endpoints['edit'](agama.id)}`;
            try {
                const response = await axios.put(url, editedAgama, {
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
            height: "240px",
            content: (
                <Form <IAgama>
                    data={agama}
                    title="Tambah Agama"
                    headList={["Agama"]}
                    keyList={["nama"]}
                    type={["text"]}
                    onSubmit={editAgama}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleDelete = (agama: IAgama) => {
        Swal.fire({
            title: "Menghapus Item",
            text: "Apakah anda yakin ingin menghapus item ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(async result => {
            if(result){
                const url = `${baseUrl}${endpoints['delete'](agama.id)}`;
                const response = await axios.delete(url, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                fetchData();
            }
        })
    }

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full min-h-full p-6 shadow-md">
                <Table <IAgama>
                    title="Daftar Agama"
                    data={agama}
                    headList={['ID', 'Nama']}
                    keyList={['id', 'nama']}
                    pagination={pagination}
                    numberRow={false}
                    editAction={true}
                    deleteAction={true}
                    onEditAction={handleEdit}
                    onDeleteAction={handleDelete}
                    additionalButton={(
                        <div className="flex gap-1">
                            <button onClick={handleAdd} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                                <Icon name="heroicons:plus" shape="outline"/>
                                <p>Tambah Agama</p>
                            </button>
                        </div>
                    )}
                />
            </div>
        </div>
    )

}