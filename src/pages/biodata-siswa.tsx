import { useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValue } from "../models/table.type";
import { biodataSiswaList } from "../models/mockup.constant";
import { useDialog } from "../context/DialogContext";
import { Icon } from "../components/icon";
import { Form } from "../components/form";

export interface IBiodataSiswa {
    nomor_peserta: string,
    nama: string,
    alamat: string,
    kelas: string,
    jurusan: string,
}

interface IBiodataSiswaForm extends IBiodataSiswa {
    nis: string,
    agama: string,
}

const biodataSiswa: IBiodataSiswa[] = biodataSiswaList

const classList = [
    "VIII.A INTENATIONAL",
    "VIII.B CIBER DIGITAL",
    "IX.A CIBER",
    "IX.F SEMI CIBER",
    "VIII.C CIBER DIGITAL",
    "VIII.D CIBER TAHFIDZ",
    "VIII.E CIBER",
    "VIII.F CIBER",
    "VIII.G CIBER",
    "VIII.H CIBER",
    "IX.B CIBER",
    "IX.C CIBER",
    "IX.D CIBER",
    "IX.E TAHFIDZ",
    "VII.A INTENATIONAL",
    "VII.B INTENATIONAL",
    "VII.C TAHFIDZ",
    "VII.D CIBER",
    "VII.E CIBER"
];

const jurusanList = [
    "Umum",
    "IPA",
    "IPS",
    "Bahasa",
    "Keagamaan"
]

const agamaList = [
    "Islam",
    "Kristen",
    "Hindu",
    "Buddha"
]

export function BiodataSiswa() {

    const [pagination] = useState(defaultPaginationValue);

    const {openDialog, closeDialog} = useDialog();

    const addParticipant = () => {
        openDialog({
            width: '800px',
            height: '600px',
            content: (
                <Form <IBiodataSiswaForm>
                    title="Tambah Peserta"
                    headList={["Kelas", "Jurusan", "Id Siswa/NIS", "Nama Siswa", "Alamat Siswa", "Agama Siswa"]}
                    keyList={['kelas', 'jurusan', 'nis', 'nama', 'alamat', 'agama']}
                    type={["select", "select", "text", "text", "text", "select"]}
                    selectList={{
                        'kelas': classList,
                        'jurusan': jurusanList,
                        'agama': agamaList
                    }}
                    onSubmit={() => console.log("Test")}
                    onCancel={closeDialog}
                />
            )
        })
    }

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full min-h-full p-6 shadow-md">
                <Table <IBiodataSiswa>
                    title="Peserta"
                    data={biodataSiswa}
                    headList={['Nomor Peserta', 'Nama', 'Alamat', 'Jurusan', 'Kelas']}
                    keyList={['nomor_peserta', 'nama', 'alamat', 'jurusan', 'kelas']}
                    pagination={pagination}
                    infoAction={true}
                    editAction={true}
                    deleteAction={true}
                    additionalButton={(
                        <div className="flex gap-1">
                            <button onClick={addParticipant} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                                <Icon name="heroicons:plus" shape="outline"/>
                                <p>Tambah Peserta</p>
                            </button>

                            <button onClick={addParticipant} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-yellow-500 rounded-md cursor-pointer text-white hover:bg-yellow-600 transition-all">
                                <Icon name="heroicons:plus" shape="outline"/>
                                <p>Upload Peserta</p>
                            </button>

                            <button onClick={addParticipant} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-red-500 rounded-md cursor-pointer text-white hover:bg-red-700 transition-all">
                                <Icon name="heroicons:plus" shape="outline"/>
                                <p>Hapus Semua</p>
                            </button>
                        </div>
                    )}
                />
            </div>
        </div>
    )

}