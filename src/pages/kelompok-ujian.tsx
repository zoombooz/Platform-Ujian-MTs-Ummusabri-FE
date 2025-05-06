import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { Icon } from "../components/icon";
import { Form } from "../components/form";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";
import { IKelompokUjian } from "../models/ujian.type";
import { useDrawer } from "../context/DrawerContext";
import { useNavigate } from "react-router";

export function KelompokUjian() {
    
    const navigate = useNavigate();
    const {openDrawer, closeDrawer} = useDrawer();
    const [loading, setLoading] = useState<boolean>(false);
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
            setKelompokUjian(data);
            setPagination(pagination);
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
        const addKelompokUjian = (body: Partial<IKelompokUjian>) => {
            body = {
                ...body,
                id_sekolah
            }

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
            height: "460px",
            content: (
                <Form <IKelompokUjian>
                    title="Tambah Kelompok Ujian"
                    headList={["Nama Kelompok Ujian", "Tanggal Dimulai", "Tanggal Berakhir"]}
                    keyList={["nama", "start_date", "end_date"]}
                    type={["text", "date", "date"]}
                    onSubmit={addKelompokUjian}
                    onCancel={closeDrawer}
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
            height: "460px",
            content: (
                <Form <IKelompokUjian>
                    data={kelompok_ujian}
                    title="Edit Kelompok Ujian"
                    headList={["Nama Kelompok Ujian", "Tanggal Dimulai", "Tanggal Berakhir"]}
                    keyList={["nama", "start_date", "end_date"]}
                    type={["text", "date", "date"]}
                    onSubmit={addKelompokUjian}
                    onCancel={closeDrawer}
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
        }).then(result => {
            if(result.isConfirmed){
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

    const handleInfo = (data: IKelompokUjian) => {
        navigate(`/admin/ujian?kelompok_ujian_id=${data.id}`)
    }

    return (
        <div className="w-full h-full bg-gray-200 p-10 overflow-y-auto">
            <Table <IKelompokUjian>
                title="Kelompok Ujian"
                data={kelompokUjian}
                headList={['ID', 'Nama Kelompok Ujian', "Tanggal Dimulai", "Tanggal Berakhir"]}
                keyList={['id', 'nama', "start_date", "end_date"]}
                pagination={pagination}
                infoAction={true}
                infoButtonText="Lihat Ujian"
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
                onInfoAction={handleInfo}
                onEditAction={handleEdit}
                onDeleteAction={handleDelete}
                onChangePage={fetchData}
                numberRow={false}
                loading={loading}
            />
        </div>
    )

}