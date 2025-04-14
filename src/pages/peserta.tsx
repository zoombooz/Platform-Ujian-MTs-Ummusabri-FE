import { useEffect, useState } from "react";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { Table } from "../components/table";
import { Icon } from "../components/icon";
import { Environment } from "../environment/environment";
import { Form } from "../components/form";
import axios from "axios";
import Swal from "sweetalert2";
import { IPeserta } from "../models/peserta.type";
import { useDrawer } from "../context/DrawerContext";
import { useNavigate } from "react-router";

const baseUrl = Environment.base_url;

export function Peserta() {

    // -----------------------------------------------------------------------------------------------------
    // @ Properties
    // -----------------------------------------------------------------------------------------------------

    const navigate = useNavigate();
    const {openDrawer, closeDrawer} = useDrawer();
    const [peserta, setPeserta] = useState<IPeserta[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [agamaList, setAgamaList] = useState<{name: string, key: string | number}[]>([]);
    const [jurusanList, setJurusanList] = useState<{name: string, key: string | number}[]>([]);
    const [kelasList, setKelasList] = useState<{name: string, key: string | number}[]>([]);
    const [pagination, setPagination] = useState<IPaginationNew>(defaultPaginationValueNew);
    const endpoints = {
        get: `admin/peserta`,
        add: `admin/peserta`,
        edit: (id: number) => `admin/peserta/${id}`,
        delete: (id: number) => `admin/peserta/${id}`,
        get_agama: 'admin/agama',
        get_jurusan: 'admin/jurusan',
        get_kelas: 'admin/daftar_kelas'
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    useEffect(() => {
        fetchData();
        fetchAdditionalData(endpoints['get_agama'], setAgamaList);
        fetchAdditionalData(endpoints['get_jurusan'], setJurusanList);
        fetchAdditionalData(endpoints['get_kelas'], setKelasList);
    }, [])

    // -----------------------------------------------------------------------------------------------------
    // @ Public Methods
    // -----------------------------------------------------------------------------------------------------

    const fetchData = (URL?: string) => {
        setLoading(true);
        const url = URL ?? `${baseUrl}${endpoints['get']}`;
        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(response => {
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(response.data)
            setPeserta(data);
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

    const fetchAdditionalData = (endpoint: string, setList: React.Dispatch<React.SetStateAction<{name: string; key: string | number;}[]>>) => {
        const url = `${baseUrl}${endpoint}`;
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
            setList(() => {
                return [...list]
            });
            console.log("Check List: ", {agamaList, jurusanList, kelasList})
        }).catch(error => {
            console.error(error)
        })
    }

    const handleAdd = () => {
        const addPeserta = async (body: Partial<IPeserta>) => {
            const url = `${baseUrl}${endpoints['add']}`;
            try {
                const response = await axios.post(url, body, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                console.log("Add Agama Response: ", response);
                closeDrawer();
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

        openDrawer({
            width: "500px",
            height: "540px",
            content: (
                <Form <IPeserta>
                    title="Tambah Peserta"
                    headList={["Nama Peserta", "Password", "Jurusan", "Agama", "Kelas"]}
                    keyList={["nama", "password", "jurusan_id", "agama_id", "kelas_id"]}
                    type={["text", "password", "select", "select", "select"]}
                    selectList={{
                        jurusan_id: jurusanList,
                        agama_id: agamaList,
                        kelas_id: kelasList
                    }}
                    onSubmit={addPeserta}
                    onCancel={closeDrawer}
                />
            )
        })
    }

    const handleEdit = (peserta: IPeserta) => {
        const editPeserta = async (body: Partial<IPeserta>) => {
            const url = `${baseUrl}${endpoints['edit'](peserta.id)}`;
            try {
                const response = await axios.put(url, body, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                console.log("Edit Agama Response: ", response);
                closeDrawer();
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

        Swal.fire({
            title: "Perubahan yang diinginkan?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Ubah Data Peserta",
            denyButtonText: `Ubah Password Peserta`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                openDrawer({
                    width: "500px",
                    height: "540px",
                    content: (
                        <Form <IPeserta>
                            data={peserta}
                            title="Edit Peserta"
                            headList={["Nama Peserta", "Jurusan", "Agama", "Kelas"]}
                            keyList={["nama", "jurusan_id", "agama_id", "kelas_id"]}
                            type={["text", "select", "select", "select"]}
                            selectList={{
                                jurusan_id: jurusanList,
                                agama_id: agamaList,
                                kelas_id: kelasList
                            }}
                            onSubmit={editPeserta}
                            onCancel={closeDrawer}
                        />
                    )
                })
            } else if (result.isDenied) {
                openDrawer({
                    width: "500px",
                    height: "540px",
                    content: (
                        <Form <IPeserta>
                            data={peserta}
                            title="Edit Peserta"
                            headList={["Nama Peserta", "Password Terbaru"]}
                            keyList={["nama", "password"]}
                            type={["text", "text"]}
                            onSubmit={editPeserta}
                            onCancel={closeDrawer}
                            disabled={['nama']}
                        />
                    )
                })
            }
        });
    }

    const handleDelete = (peserta: IPeserta) => {
        Swal.fire({
            title: "Apakah anda yakin ingin menghapus peserta ini?",
            text: "Data yang dihapus tidak dapat kembali",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(async result => {
            if(result.isConfirmed){
                const url = `${baseUrl}${endpoints['delete'](peserta.id)}`;
                await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                fetchData();
            }
        })
    }

    const onEvaluasi = (peserta: IPeserta) => {
        navigate(`/admin/evaluasi/${peserta.nomor_peserta}`)
    }

    // -----------------------------------------------------------------------------------------------------
    // @ HTML Element
    // -----------------------------------------------------------------------------------------------------

    return (
        <div className="w-full h-full bg-gray-200 p-10 overflow-y-auto">
            <Table <IPeserta>
                title="Daftar Peserta"
                data={peserta}
                headList={['Nama', 'Jurusan', 'Agama', 'Kelas', 'Nomor Peserta']}
                keyList={['nama', 'jurusan_id', 'agama_id', 'kelas_id', 'nomor_peserta']}
                selectList={{
                    jurusan_id: jurusanList,
                    agama_id: agamaList,
                    kelas_id: kelasList
                }}
                pagination={pagination}
                infoAction={true}
                infoButtonText="Evaluasi"
                editAction={true}
                deleteAction={true}
                loading={loading}
                additionalButton={(
                    <button className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all" onClick={handleAdd}>
                        <Icon name="heroicons:plus" shape="outline"/>
                        <p>Tambah Peserta</p>
                    </button>
                )}
                onEditAction={handleEdit}
                onDeleteAction={handleDelete}
                onChangePage={fetchData}
                onInfoAction={onEvaluasi}
            />
        </div>
    )

}