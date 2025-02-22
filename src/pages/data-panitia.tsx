import { useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValue } from "../models/table.type";
import { dataPanitiaList } from "../models/mockup.constant";

export interface IDataPanitia {
    username: string,
    password: string,
    nama: string,
    alamat: string
}

const dataPanitia: IDataPanitia[] = dataPanitiaList;

export function DataPanitia() {

    const [pagination, setPagination] = useState(defaultPaginationValue);

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full h-fit p-6 shadow-md">
                <Table <IDataPanitia>
                    title="Data Panitia"
                    data={dataPanitia}
                    headList={['Username', 'Password', 'Nama', 'Alamat']}
                    keyList={['username', 'password', 'nama', 'alamat']}
                    pagination={pagination}
                    infoAction={true}
                    editAction={true}
                    deleteAction={false}
                />
            </div>
        </div>
    )

}