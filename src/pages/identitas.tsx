import { JSX } from "react"

export function Identitas() {

    const style = {
        button: "transition-all min-w-30 text-white px-2 py-2 rounded-sm cursor-pointer"
    }

    const InputTextContainer = ({title, id}: {title: string, id: string}): JSX.Element => {
        return (
            <div className="flex flex-col gap-1.5">
                <label htmlFor={id}>{title}</label>
                <input id={id} type="text" className="border border-gray-400 rounded-sm py-1.5 px-2 ring-0"/>
            </div>
        )
    }

    return (
        <div className="p-4 bg-gray-100">
            <div className="bg-white rounded-lg w-full h-full p-6 shadow-md">

                <div className="flex justify-between">
                    <p className="font-bold text-blue-400">IDENTITAS</p>
                    <div className="flex gap-3">
                        <button className="pb-4 px-3 border-b-4 border-blue-400">Data Instansi</button>
                        <button className="pb-4 px-3 border-b-4 border-blue-400">Ganti Foto</button>
                    </div>
                </div>
                
                <hr className="text-gray-200 mb-4"/>

                <form className="flex flex-col gap-3">

                    <InputTextContainer title="Nama Lembaga" id="namaLembaga" />
                    <InputTextContainer title="Alamat" id="alamat" />
                    <InputTextContainer title="Nama Ujian" id="namaUjian" />
                    <InputTextContainer title="Nama Ujian Detail" id="namaUjianDetail" />
                    <InputTextContainer title="Nama Instansi" id="namaInstansi" />
                    <InputTextContainer title="Nomor Whatsapp Admin" id="noWhatsappAdmin" />
                    <InputTextContainer title="Nama Kepala Sekolah/Madrasah" id="namaKepalaSekolahMadrasah" />
                    <InputTextContainer title="NIP Kepala Sekolah/Madrasah" id="nipKepalaSekolahMadrasah" />

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="timezone">Timezone</label>

                        <select id="timezone" className="border border-gray-400 rounded-sm py-1.5 px-2 ring-0">
                            {['WIB', 'WITA', 'WIT'].map((item, index) => (
                                <option key={index}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button type="submit" className={"bg-blue-400 hover:bg-blue-500 " + style.button}>UPDATE</button>
                        <button type="reset" className={"bg-red-400 hover:bg-red-500 " + style.button}>BATAL</button>
                    </div>

                </form>

            </div>
        </div>
    )

}