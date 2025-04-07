import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { Form } from "../components/form";
import { Icon } from "../components/icon";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";
import { IDaftarKelas } from "../models/kelas.type";
import { useDrawer } from "../context/DrawerContext";

const baseUrl = Environment.base_url;

export function DaftarKelas() {

    const {openDrawer, closeDrawer} = useDrawer();
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<IPaginationNew>(defaultPaginationValueNew);
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

    const fetchData = (URL?: string) => {
        setLoading(true);
        const url = URL ?? `${baseUrl}${endpoints['get']}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(response => {
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(response.data)
            setDaftarKelas(data);
            setPagination(pagination)
        }).catch(error => {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: `${(error as Error).message}`
            })
        }).finally(() => {
            setLoading(false);
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
                closeDrawer();
            });
        }

        openDrawer({
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
                    onCancel={closeDrawer}
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
                closeDrawer();
            }).catch(error => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: `${(error as Error).message}`
                })
            });
        }

        openDrawer({
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
                    onCancel={closeDrawer}
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
        <div className="w-full h-full bg-gray-100 p-4">
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
                    onChangePage={fetchData}
                    additionalButton={(
                        <button onClick={handleAdd} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                            <Icon name="heroicons:plus" shape="outline"/>
                            <p>Tambah Kelas</p>
                        </button>
                    )}
                    loading={loading}
                />
            </div>
        </div>
    )
}