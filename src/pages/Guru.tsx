import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { IPeserta } from "../models/peserta.type";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";
import { Icon } from "../components/icon";
import { useDrawer } from "../context/DrawerContext";
import { Form } from "../components/form";
import { isRoleAdmin, getTokenPayload } from "../utils/jwt";
import { Import } from "../components/Import";
export interface ISoal {
    id: number,
    ujian_id: string | number,
    soal: string,
    image: string | null,
    tipe_soal: string,
    pilihan_a: string,
    pilihan_b: string,
    pilihan_c: string,
    pilihan_d: string,
    pilihan_e: string,
    jawaban: string,
    created_at: string,
    updated_at: string,
    ujian: string | null,
    file: any,
    acceptFile: string[],
  }

export function Guru() {

    const {openDrawer, closeDrawer} = useDrawer();
    const [guru, setGuru] = useState<IPeserta[]>([]);
    const [agamaList, setAgamaList] = useState<{name: string, key: string | number}[]>([]);
    const [mapelList, setMapelList] = useState<{name: string, key: string | number}[]>([]);
    const [pagination, setPagination] = useState<IPaginationNew>(defaultPaginationValueNew);
    const endpoints = {
        get_guru: isRoleAdmin() ? 'admin/guru' : `admin/guru?id=${getTokenPayload().id}`,
        post_guru: 'admin/guru',
        put_guru: (id: number) => `admin/guru/${id}`,
        delete_guru: (id: number) => `admin/guru/${id}`,
        get_agama: 'admin/agama',
        get_mapel: 'admin/mapel',
        import: 'admin/import_guru',
    }
    const {base_url} = Environment;
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
        fetchAdditionalData(endpoints['get_agama'], setAgamaList);
        fetchAdditionalData(endpoints['get_mapel'], setMapelList);
    }, [])

    const fetchData = (URL?: string) => {
        const url = URL ?? `${base_url}${endpoints['get_guru']}`;
        setLoading(true);
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(res => {
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(res.data);
            setGuru(data);
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
        const url = `${base_url}${endpoint}`;
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
        }).catch(error => {
            console.error(error)
        })
    }

    const handleAdd = () => {
        const addGuru = async (body: Partial<IPeserta>) => {
            body = {
                ...body,
                role: 'guru'
            }
            const url = `${base_url}${endpoints['post_guru']}`;
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
                    title="Tambah Guru"
                    headList={["Nama Guru", "Username", "Password", "Mata Pelajaran", "Agama"]}
                    keyList={["nama", "username", "password", "mapel_id", "agama_id"]}
                    type={["text", "text", "password", "select", "select"]}
                    selectList={{
                        agama_id: agamaList,
                        mapel_id: mapelList
                    }}
                    onSubmit={addGuru}
                    onCancel={closeDrawer}
                />
            )
        })
    }

    const handleEdit = (input_guru: IPeserta) => {
        const editGuru = async (body: Partial<IPeserta>) => {
            const url = `${base_url}${endpoints['put_guru'](input_guru.id)}`;
            try {
                const response = await axios.put(url, body, {
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

        Swal.fire({
            title: "Perubahan yang diinginkan?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Ubah Data Guru",
            denyButtonText: `Ubah Password Guru`,
        }).then((result) => {
            if (result.isConfirmed) {
                openDrawer({
                    width: "500px",
                    height: "540px",
                    content: (
                        <Form <IPeserta>
                            data={input_guru}
                            title="Edit Peserta"
                            headList={["Nama Guru", "Username", "Mata Pelajaran", "Agama"]}
                            keyList={["nama", "username", "mapel_id", "agama_id"]}
                            type={["text", "text", "select", "select"]}
                            selectList={{
                                mapel_id: mapelList,
                                agama_id: agamaList,
                            }}
                            onSubmit={editGuru}
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
                            data={input_guru}
                            title="Edit Peserta"
                            headList={["Nama Guru", "Username", "Password Terbaru"]}
                            keyList={["nama", "username", "password"]}
                            type={["text", "text", 'password']}
                            onSubmit={editGuru}
                            onCancel={closeDrawer}
                            disabled={['nama', 'username']}
                        />
                    )
                })
            }
        });
    }

    const handleDelete = (input_guru: IPeserta) => {
        Swal.fire({
            title: "Apakah anda yakin ingin menghapus peserta ini?",
            text: "Data yang dihapus tidak dapat kembali",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(async result => {
            if(result.isConfirmed){
                const url = `${base_url}${endpoints['delete_guru'](input_guru.id)}`;
                await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                fetchData();
            }
        })
    }

    const handleImport = () => {
        const importSoal = async (body: Partial<ISoal>) => {
            body = {
                ...body,
                // ujian_id: Number(ujian_id)
            }
            const url = `${base_url}${endpoints['import']}`;
            const data = new FormData();
            data.append('file', body?.file as any);
            data.append('ujian_id', body.ujian_id as any);
            try {
                console.log("Going to import: ", data)
                await axios.post(url, data, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                closeDrawer();
                fetchData();
            } catch (error) {
                console.error(error);
                console.log("Error: ", error)
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: `${(error as Error).message}`
                })
            }
        }
    
        // const headList = options === 'pilihan_ganda'
        //     ? ["Ujian", "Tipe Soal", "Soal", "Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E", "Jawaban"]
        //     : ["Ujian", "Tipe Soal", "Soal", 'Jawaban']
    
        // const keyList = options === 'pilihan_ganda'
        //     ? ["ujian_id", "tipe_soal", "soal", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "pilihan_e", "jawaban"]
        //     : ["ujian_id", "tipe_soal", "soal", 'jawaban']
    
            openDrawer({
                content: (
                    <Import <ISoal>
                        // data={{
                        //     ujian_id
                        // }}
                        title="Import Guru"
                        headList={["Upload"]}
                        keyList={["file"]}
                        type={["file"]}
                        acceptFile={[".xlsx", ".xls", ".csv"]}
                        // selectList={{
                        //     ujian_id: ujianList,
                        //     tipe_soal: tipe_soal,
                        //     jawaban: [
                        //         {name: "A", key: 'A'},
                        //         {name: "B", key: 'B'},
                        //         {name: "C", key: 'C'},
                        //         {name: "D", key: 'D'},
                        //         {name: "E", key: 'E'}
                        //     ]
                        // }}
                        // disabled={['ujian_id']}
                        onSubmit={importSoal}
                        onCancel={closeDrawer}
                    />
                )
            })
      }

    return (
        <div className="w-full h-full bg-gray-200 p-10 overflow-y-auto">
            <Table <IPeserta>
                title="Daftar Guru"
                data={guru}
                headList={['Nama', 'Role', 'Agama', 'Mata Pelajaran']}
                keyList={['username', 'role', 'agama_id', 'mapel_id']}
                selectList={{
                    mapel_id: mapelList,
                    agama_id: agamaList,
                }}
                pagination={pagination}
                editAction={true}
                deleteAction={true}
                loading={loading}
                additionalButton={(
                    <div className="flex gap-2">
                        <button className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all" onClick={handleImport}>
                            <Icon name="heroicons:plus" shape="outline"/>
                            <p>Import Guru</p>
                        </button>
                        <button className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all" onClick={handleAdd}>
                            <Icon name="heroicons:plus" shape="outline"/>
                            <p>Tambah Guru</p>
                        </button>
                    </div>
                )}
                onEditAction={handleEdit}
                onDeleteAction={handleDelete}
                onChangePage={fetchData}
            />
        </div>
    )

}