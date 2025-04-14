import { useParams } from "react-router"
import { Environment } from "../environment/environment";
import axios from "axios";
import { useEffect, useState } from "react";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import Swal from "sweetalert2";
import { Table } from "../components/table";
import { IHasilUjian } from "../models/ujian.type";
import { useDrawer } from "../context/DrawerContext";
import { Form } from "../components/form";

export function HasilUjian() {

    // -----------------------------------------------------------------------------------------------------
    // @ Properties
    // -----------------------------------------------------------------------------------------------------

    const {closeDrawer, openDrawer} = useDrawer();
    const {nomor_peserta, ujian_id} = useParams();
    const endpoints = {
        get_hasil_ujian: (nomor_peserta: number, ujian_id: number) => `admin/hasil_ujian?nomor_peserta=${nomor_peserta}&ujian_id=${ujian_id}`,
        update_hasil_ujian: (id: number) => `admin/hasil_ujian/update/${id}`,
    }
    const {base_url} = Environment;
    const [hasilUjian, setHasilUjian] = useState<IHasilUjian[]>([]);
    const [pagination, setPagination] = useState<IPaginationNew>(defaultPaginationValueNew);
    const [loading, setLoading] = useState<boolean>(false);

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    useEffect(() => {
        fetchHasilUjian();
    }, [])

    // -----------------------------------------------------------------------------------------------------
    // @ Getter Functions
    // -----------------------------------------------------------------------------------------------------

    const getHasilUjian = () => {
        const customHasilUjian = hasilUjian.map(el => {
            return {
                ... el,
                isCorrect: el.isTrue === 1 ? "Benar" : "Salah"
            }
        })
        return customHasilUjian;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ CRUD Functions
    // -----------------------------------------------------------------------------------------------------

    const fetchHasilUjian = (URL?: string) => {
        if(nomor_peserta && ujian_id){
            const url = URL ? `${URL}&nomor_peserta=${nomor_peserta}&ujian_id=${ujian_id}` : `${base_url}${endpoints['get_hasil_ujian'](Number(nomor_peserta), Number(ujian_id))}`;
            setLoading(true);
            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            }).then(res => {
                const {data, pagination} = (({data, ...pagination}) => {
                    return {data, pagination}
                })(res.data);
                setHasilUjian(data);
                setPagination(pagination);
            }).catch(error => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: `${(error as Error).message}`
                })
            }).finally(() => setLoading(false))
        }
        return;
    }

    const updateHasilUjian = (hasil_ujian: IHasilUjian) => {
        const update = (body: Partial<IHasilUjian>) => {
            body = {
                ...body,
                isTrue: (body as Partial<IHasilUjian> & { isCorrect?: string }).isCorrect === 'Benar' ? 1 : 0
            }
            const url = `${base_url}${endpoints['update_hasil_ujian'](hasil_ujian.id)}`;
            axios.put(url, body, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            }).then(() => {
                closeDrawer();
                fetchHasilUjian();
            }).catch(error => {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Request Failed",
                    text: `${(error as Error).message}`
                })
            })
        }

        openDrawer({
            width: "500px",
            height: "540px",
            content: (
                <Form <IHasilUjian>
                    data={hasil_ujian}
                    title="Tambah Peserta"
                    headList={["Soal", "Tipe Soal", "Jawaban Siswa", "Kunci Jawaban", "Status"]}
                    keyList={["soal", "tipe_soal", "jawaban_sesi", "jawaban_soal", "isCorrect"]}
                    type={["text", "text", "text", "text", "select"]}
                    selectList={{
                        isCorrect: [
                            {name: "Benar", key: "Benar"},
                            {name: "Salah", key: "Salah"}
                        ]
                    }}
                    disabled={['soal']}
                    onSubmit={update}
                    onCancel={closeDrawer}
                />
            )
        })

    }

    // -----------------------------------------------------------------------------------------------------
    // @ HTML
    // -----------------------------------------------------------------------------------------------------

    return (
        <div className="w-full h-full bg-gray-200 p-10 overflow-y-auto overflow-x-auto">
            <Table <IHasilUjian>
                title={`Hasil Ujian Peserta ${nomor_peserta}`}
                data={getHasilUjian()}
                headList={['Soal', 'Jawaban Siswa', 'Kunci Jawaban', 'Tipe Soal', 'Status']}
                keyList={['soal', 'jawaban_sesi', 'jawaban_sesi', 'tipe_soal', 'isCorrect']}
                pagination={pagination}
                editAction={true}
                onEditAction={updateHasilUjian}
                onChangePage={fetchHasilUjian}
                loading={loading}
            ></Table>
        </div>
    )
}