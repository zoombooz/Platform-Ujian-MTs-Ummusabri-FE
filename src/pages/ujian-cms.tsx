import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { useDialog } from "../context/DialogContext";
import { Form } from "../components/form";
import { Icon } from "../components/icon";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { IUjian } from "../models/ujian.type";
import { useDrawer } from "../context/DrawerContext";

const baseUrl = Environment.base_url;

export function UjianCMS() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const {openDrawer, closeDrawer} = useDrawer();
    const [pagination, setPagination] = useState<IPaginationNew>(defaultPaginationValueNew);
    const [ujian, setUjian] = useState<IUjian[]>([]);
    const [kelompokUjianList, setKelompokUjianList] = useState<{name: string, key: string}[]>([]);
    const [mapelList, setMapelList] = useState<{name: string, key: string}[]>([]);
    const [daftarKelasList, setDaftarKelasList] = useState<{name: string, key: string}[]>([]);
    const endpoints = {
        create: `admin/ujian`,
        get: `admin/ujian`,
        edit: (id: number) => `admin/ujian/${id}`,
        delete: (id: number) => `admin/ujian/${id}`,
        get_kelompok_ujian: 'admin/kelompok_ujian',
        get_mapel: 'admin/mapel',
        get_daftar_kelas: 'admin/daftar_kelas'
    }

    useEffect(() => {
        fetchData();
        fetchAdditionalData(endpoints['get_daftar_kelas'], setDaftarKelasList);
        fetchAdditionalData(endpoints['get_mapel'], setMapelList);
        fetchAdditionalData(endpoints['get_kelompok_ujian'], setKelompokUjianList);
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
            setUjian(data);
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

    const fetchAdditionalData = (endpoint: string, setList: React.Dispatch<React.SetStateAction<{name: string;key: string;}[]>>) => {
        const url = `${baseUrl}${endpoint}?limit=100`;
        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(response => {
            const list = response.data.data.map((el: any) => {
                return {
                    name: el.nama,
                    key: el.id
                }
            })
            setList(list);
        }).catch(error => {
            console.error(error)
        })
    }
    
    const handleAdd = () => {
        const addClass = (body: IUjian) => {
            body = {
                ...body,
                id_sekolah: 1
            }
            const url = `${baseUrl}${endpoints['create']}`;
            axios.post(url, body, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            }).then(() => {
                fetchData();
                closeDrawer();
            }).catch(err => {
                console.error(err);
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: err.response.data.error,
                });
            });
        }

        openDrawer({
            width: "500px",
            height: "600px",
            content: (
                <Form <IUjian>
                    title="Tambah Ujian"
                    headList={['Ujian', 'Kelompok Ujian', 'Mapel', 'Kelas', 'Tanggal Mulai', 'Tanggal Berakhir', 'Status']}
                    keyList={['nama', 'kelompok_id', 'mapel_id', 'kelas_id', 'start_date', 'end_date', 'status']}
                    type={["text", "select", "select", "select", "date", "date", 'text']}
                    selectList={{
                        kelompok_id: kelompokUjianList,
                        mapel_id: mapelList,
                        kelas_id: daftarKelasList
                    }}
                    onSubmit={addClass}
                    onCancel={closeDrawer}
                />
            )
        })
    }

    const handleEdit = (daftar_kelas: IUjian) => {
        const editClass = (editedData: IUjian) => {
            const url = `${baseUrl}${endpoints['edit'](daftar_kelas.id)}`;
            axios.put(url, editedData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            }).then(() => {
                fetchData();
                closeDrawer();
            }).catch(err => {
                console.error(err);
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: err.response.data.error,
                });
            });
        }

        openDrawer({
            width: "500px",
            height: "600px",
            content: (
                <Form <IUjian>
                    data={daftar_kelas}
                    title="Tambah Ujian"
                    headList={['Ujian', 'Kelompok Ujian', 'Mapel', 'Kelas', 'Tanggal Mulai', 'Tanggal Berakhir', 'Status']}
                    keyList={['nama', 'kelompok_id', 'mapel_id', 'kelas_id', 'start_date', 'end_date', 'status']}
                    type={["text", "select", "select", "select", "date", "date", "text"]}
                    selectList={{
                        kelompok_id: kelompokUjianList,
                        mapel_id: mapelList,
                        kelas_id: daftarKelasList
                    }}
                    onSubmit={editClass}
                    onCancel={closeDrawer}
                />
            )
        })
    }

    const handleDelete = (kelas: IUjian) => {
        Swal.fire({
            title: "Menghapus Item",
            text: "Apakah anda yakin ingin menghapus item ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(result => {
            if(result.isConfirmed){
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

    const openInfo = (ujian: IUjian) => {
        navigate(`/admin/soal/${ujian.id}/${ujian.nama}`)
    }

    return (
        <div className="w-full h-full bg-gray-200 p-10 overflow-y-auto">
            <Table <IUjian>
                title="Daftar Ujian"
                data={ujian}
                headList={['Ujian', 'Kelompok Ujian', 'Mapel', 'Kelas', 'Tanggal Mulai', 'Tanggal Berakhir', 'Status']}
                keyList={['nama', 'kelompok_id', 'mapel_id', 'kelas_id', 'start_date', 'end_date', 'status']}
                selectList={{
                    kelompok_id: kelompokUjianList,
                    mapel_id: mapelList,
                    kelas_id: daftarKelasList
                }}
                pagination={pagination}
                infoAction={true}
                editAction={true}
                deleteAction={true}
                onEditAction={handleEdit}
                onDeleteAction={handleDelete}
                onInfoAction={openInfo}
                onChangePage={fetchData}
                additionalButton={(
                    <button onClick={handleAdd} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                        <Icon name="heroicons:plus" shape="outline"/>
                        <p>Tambah Ujian</p>
                    </button>
                )}
                loading={loading}
            />
        </div>
    )
}