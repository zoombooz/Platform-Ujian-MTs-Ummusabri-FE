import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { useDialog } from "../context/DialogContext";
import { Icon } from "../components/icon";
import { Environment } from "../environment/environment";
import axios from "axios";
import { Form } from "../components/form";
import Swal from "sweetalert2";

export interface IMataPelajaran {
    nama: string,
    updated_at: string,
    created_at: string,
    id: number
}

export function MataPelajaran() {
    
    const {openDialog, closeDialog} = useDialog();
    const [pagination, setPagination] = useState<IPaginationNew>(defaultPaginationValueNew);
    const [mataPelajaran, setMataPelajaran] = useState<IMataPelajaran[]>([]);
    const baseUrl = Environment.base_url;

    const endpoints = {
        create: `admin/mapel`,
        get: `admin/mapel`,
        edit: (id: number) => `admin/mapel/${id}`,
        delete: (id: number) => `admin/mapel/${id}` 
    }

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = (URL?: string) => {
        const url = URL ?? `${baseUrl}${endpoints['get']}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(response => {
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(response.data);
            setMataPelajaran(data);
            setPagination(pagination)
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
        const addJurusan = (body: Partial<IMataPelajaran>) => {
            const url = `${baseUrl}${endpoints['create']}`;
            axios.post(url, body, {
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
                <Form <IMataPelajaran>
                    title="Tambah Mata Pelajaran"
                    headList={["Nama Mata Pelajaran"]}
                    keyList={["nama"]}
                    type={["text"]}
                    onSubmit={addJurusan}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleEdit = (mapel: IMataPelajaran) => {
        const editMapel = (body: Partial<IMataPelajaran>) => {
            const url = `${baseUrl}${endpoints['edit'](mapel.id)}`;
            axios.put(url, body, {
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
                <Form <IMataPelajaran>
                    data={mapel}
                    title="Ubah Mata Pelajaran"
                    headList={["Nama Mata Pelajaran"]}
                    keyList={["nama"]}
                    type={["text"]}
                    onSubmit={editMapel}
                    onCancel={closeDialog}
                />
            )
        })
    } 

    const handleDelete = (mapel: IMataPelajaran) => {
        Swal.fire({
            title: "Menghapus Item",
            text: "Apakah anda yakin ingin menghapus item ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(async result => {
            if(result){
                const url = `${baseUrl}${endpoints['delete'](mapel.id)}`;
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
            <div className="bg-white rounded-lg w-full min-h-full p-6 shadow-md">
                <Table <IMataPelajaran>
                    title="Mata Pelajaran"
                    data={mataPelajaran}
                    headList={['ID', 'Mata Pelajaran']}
                    keyList={['id', 'nama']}
                    numberRow={false}
                    pagination={pagination}
                    editAction={true}
                    deleteAction={true}
                    additionalButton={(
                        <div className="flex gap-1">
                            <button onClick={handleAdd} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                                <Icon name="heroicons:plus" shape="outline"/>
                                <p>Tambah Mata Pelajaran</p>
                            </button>
                        </div>
                    )}
                    onEditAction={handleEdit}
                    onDeleteAction={handleDelete}
                    onChangePage={fetchData}
                />
            </div>
        </div>
    )

}