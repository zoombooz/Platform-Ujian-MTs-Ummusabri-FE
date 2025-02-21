import { useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValue, IPagination } from "../models/table.type";

interface IDaftarKelas {
    nama_rombel: string;
    tingkat: string;
}

const daftarKelasList: IDaftarKelas[] = [
    {
        nama_rombel: "Bahasa Indonesia",
        tingkat: "VII"
    },
    {
        nama_rombel: "English",
        tingkat: "VII"
    },
    {
        nama_rombel: "Math",
        tingkat: "VII"
    }
] 

export function DaftarKelas() {

    const [pagination] = useState<IPagination>(defaultPaginationValue);

    return (
        <div className="w-full min-h-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full h-full p-6 shadow-md">
                <Table <IDaftarKelas>
                    title="Daftar Kelas"
                    data={daftarKelasList}
                    headList={['Nama Rombel', 'Tingkat']}
                    keyList={['nama_rombel', 'tingkat']}
                    pagination={pagination}
                    infoAction={true}
                    editAction={true}
                    deleteAction={true}
                />
            </div>
        </div>
    )

}