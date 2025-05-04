import { useCallback, useEffect, useState } from "react";
import { Environment } from "../environment/environment";
import axios from "axios";
import Swal from "sweetalert2";
import { Form } from "../components/form";
import { Icon } from "../components/icon";
import { useParams } from "react-router";
import { useDrawer } from "../context/DrawerContext";
import { Loader } from "../components/loader";
import ArabicTextWrapper from "../components/ArabicTextWrapper/ArabicTextWrapper";
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
    template: any
}

export function SoalPage2() {

    // -----------------------------------------------------------------------------------------------------
    // @ Variables
    // -----------------------------------------------------------------------------------------------------

    const [ujianList, setUjianList] = useState<{name: string, key: string}[]>([]);
    const [soalList, setSoalList] = useState<ISoal[]>([]);
    const [selectedSoal, setSelectedSoal] = useState<ISoal | null>(null);

    const {ujian_id, nama_ujian} = useParams();
    const {openDrawer, closeDrawer} = useDrawer();
    const [loading, setLoading] = useState<boolean>(false);

    const baseUrl = Environment.base_url;
    const tipe_soal = [
        {name: "Pilihan Ganda", key: "pilihan_ganda"},
        {name: "Essay", key: "essai"}
    ]
    const endpoints = {
        get: (ujian_id?: string) => `admin/soal${ujian_id ? `?ujian_id=${ujian_id}` : ''}`,
        add: `admin/soal`,
        edit: (id: number) => `admin/soal/${id}`,
        delete: (id: number) => `admin/soal/${id}`,
        import_soal: 'admin/import-soal',
        get_ujian: 'admin/ujian',

    }

    const fetchData = useCallback((URL?: string, soal_id?: number) => {
        setLoading(true);
        const url = URL ?? `${baseUrl}${endpoints['get'](ujian_id)}&?limit=100`;
        axios.get(url, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            }
        }).then(response => {
            const {data} = (({data}) => {
                return {data}
            })(response.data)
            setSoalList(data);
            if(soal_id){
                setSelectedSoal(() => {
                    const findSoal = data.find((el: ISoal) => el.id === soal_id);
                    if(findSoal){
                        return findSoal;
                    }
                    return null;
                });
            }
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
    }, [baseUrl, endpoints, ujian_id])

    const fetchAdditionalData = useCallback((endpoint: string, setList: React.Dispatch<React.SetStateAction<{name: string;key: string;}[]>>) => {
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
    }, [baseUrl])

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    useEffect(() => {
        fetchData();
        fetchAdditionalData(endpoints['get_ujian'], setUjianList);
    }, [])

    // -----------------------------------------------------------------------------------------------------
    // @ Methods
    // -----------------------------------------------------------------------------------------------------

    const selectSoal = (soal: ISoal) => {
        setSelectedSoal(soal);
    }

    const handleAdd = (options: 'pilihan_ganda' | 'essai') => {
        const addSoal = async (body: Partial<ISoal>) => {
            body = {
                ...body,
                ujian_id: Number(ujian_id)
            }
            
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

        const headList = options === 'pilihan_ganda'
            ? ["Ujian", "Tipe Soal", "Soal", "Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E", "Jawaban"]
            : ["Ujian", "Tipe Soal", "Soal", 'Jawaban']

        const keyList = options === 'pilihan_ganda'
            ? ["ujian_id", "tipe_soal", "soal", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "pilihan_e", "jawaban"]
            : ["ujian_id", "tipe_soal", "soal", 'jawaban']

        openDrawer({
            content: (
                <Form <Partial<ISoal>>
                    data={{
                        ujian_id,
                        tipe_soal: options
                    }}
                    title="Tambah Soal"
                    headList={headList}
                    keyList={keyList}
                    type={["select", "select", "text-editor", "text", "text", "text", "text", "text", "select"]}
                    selectList={{
                        ujian_id: ujianList,
                        tipe_soal: tipe_soal,
                        jawaban: [
                            {name: "A", key: 'A'},
                            {name: "B", key: 'B'},
                            {name: "C", key: 'C'},
                            {name: "D", key: 'D'},
                            {name: "E", key: 'E'}
                        ]
                    }}
                    disabled={['ujian_id', 'tipe_soal']}
                    onSubmit={addSoal}
                    onCancel={closeDrawer}
                />
            )
        })
    }

    const handleEdit = (soal: ISoal) => {
        const editAgama = (editedSoal: ISoal) => {
            const url = `${baseUrl}${endpoints['edit'](soal.id)}`;
                axios.put(url, editedSoal, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                }).then(() => {
                    closeDrawer();
                    fetchData(undefined, soal.id);
                }).catch ((error) => {
                    console.error(error);
                    Swal.fire({
                        icon: "error",
                        title: "Request Failed",
                        text: `${(error as Error).message}`
                    })
                });
        }

        const headList = soal.tipe_soal === 'pilihan_ganda'
            ? ["Ujian", "Tipe Soal", "Upload Gambar", "Soal", "Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E", "Jawaban"]
            : ["Ujian", "Tipe Soal", "Upload Gambar", "Soal", "Jawaban"]

        const keyList = soal.tipe_soal === 'pilihan_ganda'
            ? ["ujian_id", "tipe_soal", "image", "soal", "pilihan_a", "pilihan_b", "pilihan_c", "pilihan_d", "pilihan_e", "jawaban"]
            : ["ujian_id", "tipe_soal", "image", "soal", "jawaban"]

        openDrawer({
            content: (
                <Form <ISoal>
                    data={soal}
                    title="Edit Soal"
                    headList={headList}
                    keyList={keyList}
                    type={["select", "select", "file", "text-editor", "text", "text", "text", "text", "text", "select"]}
                    selectList={{
                        ujian_id: ujianList,
                        tipe_soal: tipe_soal,
                        jawaban: [
                            {name: "A", key: 'A'},
                            {name: "B", key: 'B'},
                            {name: "C", key: 'C'},
                            {name: "D", key: 'D'},
                            {name: "E", key: 'E'}
                        ]
                    }}
                    disabled={['ujian_id', 'tipe_soal']}
                    onSubmit={editAgama}
                    onCancel={closeDrawer}
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
            if(result.isConfirmed){
                const url = `${baseUrl}${endpoints['delete'](soal.id)}`;
                axios.delete(url, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                    }
                }).then(() => {
                    fetchData();
                    setSelectedSoal(null);
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

    const handleImportSoal = () => {
        const importSoal = async (body: Partial<ISoal>) => {
            body = {
                ...body,
                ujian_id: Number(ujian_id)
            }
            const url = `${baseUrl}${endpoints['import_soal']}`;
            const data = new FormData();
            data.append('template', body?.template as any);
            data.append('ujian_id', body.ujian_id as any);
            try {
                await axios.post(url, data, {
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
                <Import <ISoal>
                    title="Import Soal"
                    headList={["Upload"]}
                    keyList={["template"]}
                    type={["file"]}
                    disabled={['ujian_id']}
                    onSubmit={importSoal}
                    onCancel={closeDrawer}
                />
            )
        })
    }

    const isImageUrl = (input: string) => {
        try {
            const parsedUrl = new URL(input);
            console.log(parsedUrl)
            return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(parsedUrl.pathname);
        }catch(_) {
            return false;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ HTML
    // -----------------------------------------------------------------------------------------------------

    return (
        <div className="relative flex flex-col gap-4 w-full h-full bg-gray-100 p-10 overflow-y-auto">
            <div className="flex justify-between">
                <h1 className="font-bold mb-5 text-gray-700">{nama_ujian}</h1>
                <div className="flex gap-2">
                    <button onClick={() => handleImportSoal()} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                        <Icon name="heroicons:plus" shape="outline"/>
                        <p className="font-semibold">Import Soal</p>
                    </button>
                    <button onClick={() => handleAdd('pilihan_ganda')} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                        <Icon name="heroicons:plus" shape="outline"/>
                        <p className="font-semibold">Tambah Pilihan Ganda</p>
                    </button>

                    <button onClick={() => handleAdd('essai')} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                        <Icon name="heroicons:plus" shape="outline"/>
                        <p className="font-semibold">Tambah Essay</p>
                    </button>

                </div>
            </div>
            <div className="flex justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {soalList.map((el, index) => (
                        <button 
                            key={el.id}
                            className={`${(selectedSoal && selectedSoal.id === el.id) ? 'bg-green-500 text-white' : 'text-black hover:bg-green-500 hover:text-white'} flex justify-center items-center rounded-xl border-2 border-green-500 shadow-md px-2 py-1.5 w-12 h-12 transition-all cursor-pointer`}
                            onClick={() => selectSoal(el)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                
            </div>
            
            {selectedSoal ?
            (
                <>
                <div className="bg-white shadow-md p-4 rounded-xl border-l-4 border-green-500">
                    <h3 className="font-semibold mb-4 capitalize">
                        Tipe Soal: <span className="font-normal">{selectedSoal.tipe_soal.replace('_', ' ')}</span>
                    </h3>

                    {selectedSoal.image && (
                        <img className="max-h-[7.625rem]" src={selectedSoal.image} alt="" />
                    )}

                    {/* <p 
                        style={{whiteSpace:'pre-line', fontFamily:`${font}`}} dangerouslySetInnerHTML={{ __html: selectedSoal.soal }}
                    ></p> */}
                    
                    <ArabicTextWrapper text={selectedSoal.soal} />

                    {
                    selectedSoal.tipe_soal === 'pilihan_ganda' && (
                    <div className="flex flex-col gap-1">
                        <p>a. 
                            {isImageUrl(selectedSoal.pilihan_a) 
                            ? <img src={selectedSoal.pilihan_a} className="ml-8"/>
                            : <ArabicTextWrapper text={selectedSoal.pilihan_a} /> 
                            }
                        </p>
                        <p>b. 
                            {isImageUrl(selectedSoal.pilihan_b)
                            ? <img src={selectedSoal.pilihan_b} className="ml-8"/>
                            : <ArabicTextWrapper text={selectedSoal.pilihan_b} /> 
                            }
                        </p>
                        <p>c. 
                            {isImageUrl(selectedSoal.pilihan_c)
                            ? <img src={selectedSoal.pilihan_c} className="ml-8"/>
                            : <ArabicTextWrapper text={selectedSoal.pilihan_c} /> 
                            }
                        </p>
                        <p>d. 
                            {isImageUrl(selectedSoal.pilihan_d)
                            ? <img src={selectedSoal.pilihan_d} className="ml-8"/>
                            : <ArabicTextWrapper text={selectedSoal.pilihan_d} /> 
                            }
                        </p>
                        {selectedSoal.pilihan_e && (
                        <p>e. 
                            {isImageUrl(selectedSoal.pilihan_e)
                            ? <img src={selectedSoal.pilihan_e} className="ml-8"/>
                            : <ArabicTextWrapper text={selectedSoal.pilihan_e} /> 
                            }
                        </p>
                        )}
                    </div>
                    )
                    }

                    <p className="font-bold mt-4 text-green-700">
                        Jawaban: <ArabicTextWrapper text={selectedSoal.jawaban} />
                    </p>

                </div>
                <div className="flex gap-4">
                    <button onClick={() => selectedSoal ? handleEdit(selectedSoal) : ''} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-yellow-500 rounded-md cursor-pointer text-white hover:bg-yellow-600 transition-all">
                        <p className="font-semibold">✏️ Edit Soal</p>
                    </button>
                    <button onClick={() => selectedSoal ? handleDelete(selectedSoal) : ''} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-red-500 rounded-md cursor-pointer text-white hover:bg-red-600 transition-all">
                        <p className="font-semibold">🗑️ Hapus Soal</p>
                    </button>
                </div>
                </>
                
            )
            :
            (
                <div className="flex w-full items-center py-4">
                    {loading 
                    ? <Loader/>
                    : (soalList.length 
                        ? <div className="bg-white shadow-md p-4 rounded-xl border-l-4 border-green-500 w-120 font-semibold">Please select a question</div> 
                        : <div className="bg-white shadow-md p-4 rounded-xl border-l-4 border-green-500 w-120 font-semibold">Please add a question</div>)
                    }
                    
                </div>
            )
            }
        </div>
    )
}