import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { Icon } from "../components/icon";
import { Environment } from "../environment/environment";
import axios from "axios";
import { Form } from "../components/form";
import Swal from "sweetalert2";
import { IMataPelajaran } from "../models/mapel.type";
import { useDrawer } from "../context/DrawerContext";



export function MataPelajaran() {
    
    const {openDrawer, closeDrawer} = useDrawer();
    const [loading, setLoading] = useState<boolean>(false);
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
        setLoading(true);
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
        }).finally(() => {
            setLoading(false);
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
                <Form <IMataPelajaran>
                    title="Tambah Mata Pelajaran"
                    headList={["Nama Mata Pelajaran"]}
                    keyList={["nama"]}
                    type={["text"]}
                    onSubmit={addJurusan}
                    onCancel={closeDrawer}
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
                <Form <IMataPelajaran>
                    data={mapel}
                    title="Ubah Mata Pelajaran"
                    headList={["Nama Mata Pelajaran"]}
                    keyList={["nama"]}
                    type={["text"]}
                    onSubmit={editMapel}
                    onCancel={closeDrawer}
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
        }).then(result => {
            if(result.isConfirmed){
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
        <div className="w-full h-full bg-gray-200 p-10 overflow-y-auto">
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
                    loading={loading}
                />
        </div>
    )

}