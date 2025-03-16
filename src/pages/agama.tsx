import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { agamaList } from "../models/mockup.constant";
import { defaultPaginationValue } from "../models/table.type";
import { Icon } from "../components/icon";
import { useDialog } from "../context/DialogContext";
import { Form } from "../components/form";
import { Environment } from "../environment/environment";
import axios from "axios";
import { ValidationDialog } from "../components/validation-dialog";

export interface IAgama {
    id: number,
    nama: string,
    created_at: string,
    updated_at: string
}

export interface IAgamaForm {
    nama: string
}

const agama: IAgama[] = agamaList;
const baseUrl = Environment.base_url;

export function Agama() {
    
    const {openDialog, closeDialog} = useDialog();
    const [pagination] = useState(defaultPaginationValue);
    const endpoints = {
        get: `admin/agama`,
        add: `admin/agama`,
        edit: (id: number) => `admin/agama/${id}`,
        delete: (id: number) => `admin/agama/${id}`
    }

    useEffect(() => {
        
    }, [])

    const handleAdd = () => {
        const addAgama = async (body: IAgamaForm) => {
            const url = `${baseUrl}${endpoints['add']}`;
            const response = await axios.post(url, body);
            console.log("Add Agama Response: ", response);
        }


        openDialog({
            width: "500px",
            height: "240px",
            content: (
                <Form <IAgamaForm>
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
            const url = `${baseUrl}${endpoints['edit'](editedAgama.id)}`;
            const response = await axios.put(url, editedAgama);
            console.log("Edit Agama Response: ", response);
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
        const deleteAgama = async (valid: boolean) => {
            if(valid){
                const url = `${baseUrl}${endpoints['delete'](agama.id)}`;
                const response = await axios.delete(url);
                console.log("Delete Agama Response: ", response);
            }
        }

        openDialog({
            width: "500px",
            height: "240px",
            content: (
                <ValidationDialog  
                    title={`Deleting ${agama.nama}`}
                    description="Are you sure you want to delete this data?"
                    response={deleteAgama}
                />
            )
        })
    }

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full min-h-full p-6 shadow-md">
                <Table <IAgama>
                    title="Daftar Agama"
                    data={agama}
                    headList={['Nama']}
                    keyList={['nama']}
                    pagination={pagination}
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