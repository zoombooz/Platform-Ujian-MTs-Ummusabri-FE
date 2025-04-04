import { useEffect, useState } from "react";
import { useDialog } from "../context/DialogContext";
import { Environment } from "../environment/environment";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";
import axios from "axios";
import Swal from "sweetalert2";
import { Form } from "../components/form";
import { Table } from "../components/table";
import { Icon } from "../components/icon";
import { useParams } from "react-router";
import WysiwygArea from "../components/WysiwygArea";
import DOMPurify from "dompurify";

export interface ISoal {
    id: number,
    ujian_id: string,
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
    ujian: string | null
}

export function SoalPage() {

    // -----------------------------------------------------------------------------------------------------
    // @ Variables
    // -----------------------------------------------------------------------------------------------------

    const [pagination, setPagination] = useState(defaultPaginationValueNew);
    const [ujianList, setUjianList] = useState<{name: string, key: string}[]>([]);
    const [soal, setSoal] = useState<ISoal[]>([]);
    const [selectedSoal, setSelectedSoal] = useState<ISoal>();
    // const [editorContent, setEditorContent] = useState<string>('');

    const {ujian_id} = useParams();
    const {openDialog, closeDialog} = useDialog();

    const baseUrl = Environment.base_url;
    const tipe_soal = [
        {name: "Pilihan Ganda", key: "pilihan_ganda"},
        {name: "Essay", key: "essai"}
    ]
    const endpoints = {
        get: (ujian_id?: string) => `admin/soal${ujian_id ? `?ujian=${ujian_id}` : ''}`,
        add: `admin/soal`,
        edit: (id: number) => `admin/soal/${id}`,
        delete: (id: number) => `admin/soal/${id}`,
        get_ujian: 'admin/ujian'
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    useEffect(() => {
        console.log("Ujian ID: ", ujian_id)
        fetchData();
        fetchAdditionalData(endpoints['get_ujian'], setUjianList);
    }, [])

    // -----------------------------------------------------------------------------------------------------
    // @ Methods
    // -----------------------------------------------------------------------------------------------------

    const selectSoal = (soal: ISoal) => {
        setSelectedSoal(soal);
    }

    const fetchData = (URL?: string) => {
        const url = URL ?? `${baseUrl}${endpoints['get'](ujian_id)}`;
        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(response => {
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(response.data)
            setPagination(pagination)
            setSoal(data);
        }).catch(error => {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: `${(error as Error).message}`
            })
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
        const addSoal = async (body: Partial<ISoal>) => {
            const url = `${baseUrl}${endpoints['add']}`;
            try {
                await axios.post(url, body, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                closeDialog();
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


        openDialog({
            width: "800px",
            height: "500px",
            content: (
                <Form <Partial<ISoal>>
                    data={{
                        ujian_id
                    }}
                    title="Tambah Soal"
                    headList={["Ujian", "Soal", "Tipe Soal", "Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E", "Jawaban"]}
                    keyList={["ujian_id", "soal", "tipe_soal", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "pilihan_e", "jawaban"]}
                    type={["select", "text-editor", "select"]}
                    selectList={{
                        ujian_id: ujianList,
                        tipe_soal: tipe_soal
                    }}
                    onSubmit={addSoal}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleEdit = (soal: ISoal) => {
        const editAgama = (editedAgama: ISoal) => {
            const url = `${baseUrl}${endpoints['edit'](soal.id)}`;
                axios.put(url, editedAgama, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                }).then(() => {
                    closeDialog();
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

        console.log(soal)

        openDialog({
            width: "500px",
            height: "500px",
            content: (
                <Form <ISoal>
                    data={soal}
                    title="Edit Soal"
                    headList={["Ujian", "Soal", "Tipe Soal", "Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E", "Jawaban"]}
                    keyList={["ujian_id", "soal", "tipe_soal", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "pilihan_e", "jawaban"]}
                    type={["select", "text-editor", "select"]}
                    selectList={{
                        ujian_id: ujianList,
                        tipe_soal: tipe_soal
                    }}
                    onSubmit={editAgama}
                    onCancel={closeDialog}
                />
            )
        })
    }

    const handleDelete = (soal: ISoal) => {
        Swal.fire({
            title: "Menghapus Item",
            text: "Apakah anda yakin ingin menghapus item ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(result => {
            if(result){
                const url = `${baseUrl}${endpoints['delete'](soal.id)}`;
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

    // -----------------------------------------------------------------------------------------------------
    // @ HTML
    // -----------------------------------------------------------------------------------------------------

    return (
        <div className="relative flex flex-col w-full bg-gray-100 p-4 h-full">
            <div className="flex flex-col gap-4 bg-white rounded-lg w-full min-h-full p-6 shadow-md">
                <div className="flex justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {soal.map((el, index) => (
                            <button 
                                key={el.id}
                                className={`${(selectedSoal && selectedSoal.id === el.id) ? 'bg-gray-400 text-white hover:bg-gray-500' : 'text-black hover:bg-gray-200'} flex justify-center border border-slate-900 w-fit px-2 py-1.5 min-w-8 transition-all cursor-pointer`}
                                onClick={() => selectSoal(el)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAdd} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                            <Icon name="heroicons:plus" shape="outline"/>
                            <p>Tambah Soal</p>
                        </button>

                        {selectedSoal && (
                        <button onClick={() => selectedSoal ? handleEdit(selectedSoal) : ''} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-yellow-500 rounded-md cursor-pointer text-white hover:bg-yellow-600 transition-all">
                            <Icon name="heroicons:pencil-square" shape="outline"/>
                            <p>Edit Soal</p>
                        </button>
                        )}
                    </div>
                </div>
                
                {selectedSoal ?
                (
                    <div>
                        <p>{selectedSoal.soal}</p>
                        <p>a. {selectedSoal.pilihan_a}</p>
                        <p>b. {selectedSoal.pilihan_b}</p>
                        <p>c. {selectedSoal.pilihan_c}</p>
                        <p>d. {selectedSoal.pilihan_d}</p>
                        <p>e. {selectedSoal.pilihan_e}</p>
                    </div>
                )
                :
                (
                    <div className="flex justify-center w-full h-full items-center py-4">
                        <p>Please select a question</p>
                    </div>
                )
                }

                {/* <RichTextEditor value="" onChange={() => {}}/> */}
                {/* <WysiwygArea content={editorContent} onChange={(val) => {
                    const content = val.replace(/ /g, "&nbsp;").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
                    setEditorContent(content);
                }}/> */}
                {/* <button className="w-20 p-2 text-white rounded-md bg-green-500 cursor-pointer"
                    onClick={() => {console.log("Content: ", editorContent)}}
                >
                    Submit
                </button>

                <div className="p-4 border border-gray-300 bg-white">
                    <div className="text-base leading-relaxed list-disc list-inside" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(editorContent)}}></div>
                </div> */}

                {/* <Table <ISoal>
                    title="Daftar Soal"
                    data={soal}
                    headList={['ID', 'Soal']}
                    keyList={['id', 'soal']}
                    pagination={pagination}
                    numberRow={false}
                    editAction={true}
                    deleteAction={true}
                    onEditAction={handleEdit}
                    onDeleteAction={handleDelete}
                    onChangePage={fetchData}
                    additionalButton={(
                        <div className="flex gap-1">
                            <button onClick={handleAdd} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                                <Icon name="heroicons:plus" shape="outline"/>
                                <p>Tambah Soal</p>
                            </button>
                        </div>
                    )}
                /> */}
            </div>
        </div>
    )
}