import { useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValue } from "../models/table.type";
import { biodataSiswaList } from "../models/mockup.constant";

export interface IBiodataSiswa {
    nomor_peserta: string,
    nama: string,
    alamat: string,
    kelas: string,
    jurusan: string,
}

const biodataSiswa: IBiodataSiswa[] = biodataSiswaList

export function BiodataSiswa() {

    const [pagination, setPagination] = useState(defaultPaginationValue);

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full min-h-full p-6 shadow-md">
                <Table <IBiodataSiswa>
                    title="Biodata Siswa"
                    data={biodataSiswa}
                    headList={['Nomor Peserta', 'Nama', 'Alamat', 'Jurusan', 'Kelas']}
                    keyList={['nomor_peserta', 'nama', 'alamat', 'jurusan', 'kelas']}
                    pagination={pagination}
                    infoAction={true}
                    editAction={true}
                    deleteAction={true}
                />
            </div>
        </div>
    )

}