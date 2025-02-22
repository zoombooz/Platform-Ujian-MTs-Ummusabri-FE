import { useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValue } from "../models/table.type";
import { mataPelajaranList } from "../models/mockup.constant";

export interface IMataPelajaran {
    nama: string,
    sekolah_id: string
}

const mataPelajaran: IMataPelajaran[] = mataPelajaranList;

export function MataPelajaran() {

    const [pagination, setPagination] = useState(defaultPaginationValue);

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full min-h-full p-6 shadow-md">
                <Table <IMataPelajaran>
                    title="Mata Pelajaran"
                    data={mataPelajaran}
                    headList={['Nama Kelompok Ujian / Mapel', 'Id Sekolah']}
                    keyList={['nama', 'sekolah_id']}
                    pagination={pagination}
                    editAction={true}
                    deleteAction={true}
                />
            </div>
        </div>
    )

}