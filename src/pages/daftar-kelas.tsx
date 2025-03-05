import { useState } from "react";
import { Table } from "../components/table";
import { defaultPaginationValue, IPagination } from "../models/table.type";
import { useDialog } from "../context/DialogContext";
import { Form } from "../components/form";
import { Icon } from "../components/icon";
import { daftarKelasList } from "../models/mockup.constant";

export interface IDaftarKelas {
    nama_rombel: string;
    tingkat: string;
}

const daftarKelas: IDaftarKelas[] = daftarKelasList;
const tingkatKelas: string[] = ["VII", "VIII", "IX"];

export function DaftarKelas() {

    const {openDialog, closeDialog} = useDialog();
    const [pagination] = useState<IPagination>(defaultPaginationValue);

    const addClass = () => {
        openDialog({
            width: "500px",
            height: "300px",
            content: (
                <Form <IDaftarKelas>
                    title="Tambah Kelas"
                    headList={["Tingkat", "Nama Kelas"]}
                    keyList={["tingkat", "nama_rombel"]}
                    hint={["Hint Tingkat", "Hint Kelas"]}
                    type={["select", "text"]}
                    selectList={
                        {'tingkat': tingkatKelas}
                    }
                    onSubmit={(data) => handleAddClass(data)}
                    onCancel={() => closeDialog()}
                />
            )
        })
    }

    const handleAddClass = (data: IDaftarKelas) => {
        console.log("Form: ", data)
    }

    const checkAction = (input: IDaftarKelas) => {
        alert(input)
        return input;
    }

    const edit = () => {
        alert("Edit bang")
    }

    return (
        <div className="w-full bg-gray-100 p-4">
            <div className="bg-white rounded-lg w-full h-full p-6 shadow-md">
                <Table <IDaftarKelas>
                    title="Daftar Kelas"
                    data={daftarKelas}
                    headList={['Nama Rombel', 'Tingkat']}
                    keyList={['nama_rombel', 'tingkat']}
                    pagination={pagination}
                    infoAction={true}
                    editAction={true}
                    deleteAction={true}
                    onInfoAction={checkAction}
                    onEditAction={edit}
                    additionalButton={(
                        <button onClick={addClass} className="flex justify-center items-center gap-2 w-fit h-fit p-2 bg-blue-500 rounded-md cursor-pointer text-white hover:bg-blue-600 transition-all">
                            <Icon name="heroicons:plus" shape="outline"/>
                            <p>Tambah Kelas</p>
                        </button>
                    )}
                />
            </div>
        </div>
    )

}