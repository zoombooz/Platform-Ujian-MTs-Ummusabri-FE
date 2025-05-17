import { useEffect, useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
// import { Icon } from "../components/icon";
import { useNavigate } from "react-router";
import { Form } from "../components/form";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";
import { useDrawer } from "../context/DrawerContext";

export interface IAgama {
    id: number,
    nama: string,
    created_at: string,
    updated_at: string
}


export function HasilUjianAnalysis() {
    
    const baseUrl = Environment.base_url;
    // const {openDialog, closeDialog} = useDialog();
    const {openDrawer, closeDrawer} = useDrawer();
    const [pagination, setPagination] = useState<IPaginationNew>(defaultPaginationValueNew);
    const [loading, setLoading] = useState<boolean>(false);
    const [agama, setAgama] = useState<IAgama[]>([]);
    const endpoints = {
        get: `admin/ujian`,
        add: `admin/agama`,
        edit: (id: number) => `admin/agama/${id}`,
        delete: (id: number) => `admin/agama/${id}`
    }
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [])

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

            setAgama(data);
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
        const addAgama = async (body: Partial<IAgama>) => {
            const url = `${baseUrl}${endpoints['add']}`;
            try {
                await axios.post(url, body, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
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
            content: (
                <Form <Partial<IAgama>>
                    title="Tambah Agama"
                    headList={["Nama Agama"]}
                    keyList={["nama"]}
                    type={["text"]}
                    onSubmit={addAgama}
                    onCancel={closeDrawer}
                />
            )
        })
    }

    const handleEdit = (agama: IAgama) => {
        const editAgama = (editedAgama: IAgama) => {
            const url = `${baseUrl}${endpoints['edit'](agama.id)}`;
                axios.put(url, editedAgama, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                }).then(() => {
                    closeDrawer();
                    fetchData();
                }).catch ((error) => {
                    console.error(error);
                    Swal.fire({
                        icon: "error",
                        title: "Request Failed",
                        text: `${(error as Error).message}`
                    })
                });
        }

        openDrawer({
            content: (
                <Form <IAgama>
                    data={agama}
                    title="Edit Agama"
                    headList={["Nama Agama"]}
                    keyList={["nama"]}
                    type={["text"]}
                    onSubmit={editAgama}
                    onCancel={closeDrawer}
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
        }).then(result => {
            console.log(result)
            if(result.isConfirmed){
                const url = `${baseUrl}${endpoints['delete'](agama.id)}`;
                axios.delete(url, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                }).then(() => {
                    fetchData();
                }).catch ((error) => {
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

    const onEvaluasi = (ujian: IAgama) => {
        navigate(`/admin/hasil_ujian/ujian/${ujian.id}`);
    }

    return (
        <div className="w-full h-full overflow-y-auto bg-gray-200 p-10">
            <Table <IAgama>
                title="Hasil Ujian"
                data={agama}
                headList={['ID', 'Nama']}
                keyList={['id', 'nama']}
                pagination={pagination}
                loading={loading}
                numberRow={false}
                editAction={false}
                deleteAction={false}
                infoAction={true}
                infoButtonText="Lihat Hasil Ujian"
                onInfoAction={onEvaluasi}
                onEditAction={handleEdit}
                onDeleteAction={handleDelete}
                onChangePage={fetchData}
                titleIcon="heroicons:moon"
            />
        </div>
    )

}