import { useState } from "react";
import { Table } from "../components/table";
import { dataGuruList } from "../models/mockup.constant";
import { defaultPaginationValue } from "../models/table.type";

export interface IDataGuru {
    username: string,
    password: string,
    nama: string,
    alamat: string,
    mata_pelajaran: string,
    aktif: boolean
}

const dataGuru: IDataGuru[] = dataGuruList;

export function DataGuru() {

    const [pagination, setPagination] = useState(defaultPaginationValue);

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full h-fit p-6 shadow-md">
                <Table <IDataGuru>
                    title="Data Guru"
                    data={dataGuru}
                    headList={['Username', 'Password', 'Nama Guru', 'Alamat', 'Mata Pelajaran', 'Aktif']}
                    keyList={['username', 'password', 'nama', 'alamat', 'mata_pelajaran', 'aktif']}
                    pagination={pagination}
                    infoAction={true}
                    editAction={true}
                    deleteAction={true}
                />
            </div>
        </div>
    )

}