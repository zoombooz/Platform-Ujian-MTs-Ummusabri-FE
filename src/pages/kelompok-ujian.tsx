import { useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValue } from "../models/table.type";
import { kelompokUjianList } from "../models/mockup.constant";

export interface IKelompokUjian {
    id: string,
    nama: string,
    sekolah_id: string,
    jumlah_ujian: number,
    status: boolean
}

const kelompokUjian: IKelompokUjian[] = kelompokUjianList;

export function KelompokUjian() {

    const [pagination, setPagination] = useState(defaultPaginationValue);

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full min-h-full p-6 shadow-md">
                <Table <IKelompokUjian>
                    title="Kelompok Ujian"
                    data={kelompokUjian}
                    headList={['Id Kelompok Ujian', 'Nama Kelompok Ujian / Mapel', 'Id Sekolah', 'Jumlah Ujian', 'Status']}
                    keyList={['id', 'nama', 'sekolah_id', 'jumlah_ujian', 'status']}
                    pagination={pagination}
                    infoAction={true}
                    editAction={true}
                    deleteAction={false}
                />
            </div>
        </div>
    )

}