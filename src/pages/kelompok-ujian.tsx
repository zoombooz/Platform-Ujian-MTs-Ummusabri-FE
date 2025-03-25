import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { useDialog } from "../context/DialogContext";
import { Icon } from "../components/icon";
import { Form } from "../components/form";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";

export interface IKelompokUjian {
    nama: string,
    id_sekolah: string,
    start_date: string,
    end_date: string,
    updated_at: string,
    created_at: string,
    id: number
}

export function KelompokUjian() {
    
    const {openDialog, closeDialog} = useDialog();
    const [pagination, setPagination] = useState<IPaginationNew>(defaultPaginationValueNew);
    const [kelompokUjian, setKelompokUjian] = useState<IKelompokUjian[]>([]);
    const {base_url: baseUrl, id_sekolah} = Environment;

    const endpoints = {
        create: "admin/kelompok_ujian",
        get: "admin/kelompok_ujian",
        edit: (id: string | number) => `admin/kelompok_ujian/${id}`,
        delete: (id: string | number) => `admin/kelompok_ujian/${id}`
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = (URL?: string) => {
        const url = URL ?? `${baseUrl}${endpoints['get']}`;
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(response => {
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(response.data)
            setKelompokUjian(data);
            setPagination(pagination);
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
        const addKelompokUjian = (body: Partial<IKelompokUjian>) => {
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
            height: "460px",
            content: (
                <Form <IKelompokUjian>
                    title="Tambah Kelompok Ujian"
                    headList={["Nama Kelompok Ujian", "Sekolah", "Tanggal Dimulai", "Tanggal Berakhir"]}
                    keyList={["nama", "id_sekolah", "start_date", "end_date"]}
                    type={["text", "select", "date", "date"]}
                    selectList={{
                        id_sekolah: [{key: id_sekolah, name: id_sekolah}]
                    }}
                    onSubmit={addKelompokUjian}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleEdit = (kelompok_ujian: IKelompokUjian) => {
        console.log("Kelompok Ujian: ", kelompok_ujian)
        const addKelompokUjian = async (body: Partial<IKelompokUjian>) => {
            const url = `${baseUrl}${endpoints['edit'](kelompok_ujian.id)}`;
            await axios.put(url, body, {
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
            height: "460px",
            content: (
                <Form <IKelompokUjian>
                    data={kelompok_ujian}
                    title="Edit Kelompok Ujian"
                    headList={["Nama Kelompok Ujian", "Sekolah", "Tanggal Dimulai", "Tanggal Berakhir"]}
                    keyList={["nama", "id_sekolah", "start_date", "end_date"]}
                    type={["text", "select", "date", "date"]}
                    selectList={{
                        "id_sekolah": [{key: id_sekolah, name: id_sekolah}]
                    }}
                    onSubmit={addKelompokUjian}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleDelete = (kelompok_ujian: IKelompokUjian) => {
        Swal.fire({
            title: "Menghapus Item",
            text: "Apakah anda yakin ingin menghapus item ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(async result => {
            if(result){
                const url = `${baseUrl}${endpoints['delete'](kelompok_ujian.id)}`;
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
                <Table <IKelompokUjian>
                    title="Kelompok Ujian"
                    data={kelompokUjian}
                    headList={['Id Kelompok Ujian', 'Nama Kelompok Ujian', 'Id Sekolah', "Tanggal Dimulai", "Tanggal Berakhir"]}
                    keyList={['id', 'nama', 'sekolah_id', "start_date", "end_date"]}
                    pagination={pagination}
                    editAction={true}
                    deleteAction={true}
                    additionalButton={(
                        <div className="flex gap-1">
                        <button onClick={handleAdd} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                            <Icon name="heroicons:plus" shape="outline"/>
                            <p>Tambah Kelompok Ujian</p>
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