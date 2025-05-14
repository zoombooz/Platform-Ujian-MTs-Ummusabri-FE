import { Link } from "react-router";
import logoPesri from "@assets/logo-pesri.png"
import { getTokenPayload } from "../utils/jwt";
import { Icon } from "../components/icon";
export function DashboardPage() {

    const fiturList: {title: string, description: string, link: string, icon: string}[] = [
        {title: "Peserta", description: "Mengatur akun peserta yang akan mengikuti ujian", link: "/admin/peserta", icon: "heroicons:user"},
        {title: "Ujian", description: "Membuat dan mengatur ujian yang akan diikuti peserta", link: "/admin/ujian", icon: "heroicons:document-text"},
        {title: "Kelompok Ujian", description: "Membuat pengelompokkan dari ujian", link: "/admin/kelompok-ujian", icon: "heroicons:tag"},
        {title: "Mata Pelajaran", description: "Atur daftar pelajaran para peserta", link: "/admin/mata-pelajaran", icon: "heroicons:bars-3-bottom-left"},
        {title: "Daftar Kelas", description: "Buat dan atur daftar kelas para peserta", link: "/admindaftar-kelas", icon: "heroicons:users"},
        {title: "Jurusan", description: "Buat dan atur daftar jurusan para peserta", link: "/admin/jurusan", icon: "heroicons:academic-cap"},
        {title: "Agama", description: "Buat dan atur daftar agama para peserta", link: "/admin/agama", icon: "heroicons:moon"}
    ]

    return (
        <div className="flex flex-col items-center gap-6 p-8 w-full h-full bg-gray-100 overflow-y-auto pb-16">
            <div className="flex flex-col gap-4 items-center">
                <img src={logoPesri} alt="Logo Sekolah" className="rounded-full drop-shadow-xl mb-2 w-60 h-60"/>
                <p className="text-gray-500 text-xl font-medium text-center">Dashboard CMS Ujian MTS UMMUSSHABRI</p>
                <p className="text-gray-500 text-lg font-semibold">SELAMAT DATANG, {getTokenPayload().nama.toUpperCase()} DI</p>
                <p className="text-blue-400 text-lg font-semibold">CMS UNTUK {getTokenPayload().role.toUpperCase()} SEKOLAH</p>
            </div>

            <div className="flex flex-col w-full max-w-240 md:px-20">
                <p className="font-semibold text-lg text-gray-700">Halaman</p>
                <div className="w-full h-1 bg-gray-300 my-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {fiturList.map(el => (
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-3 items-center">
                            <Icon name={el.icon} shape="outline" customClass="text-gray-600 w-5 h-5" />
                            <Link to={el.link} className="w-fit font-semibold text-xl text-gray-600 hover:text-gray-800 hover:underline transition-all">
                            {el.title}
                            </Link>
                        </div>
                        <p className="text-sm">{el.description}</p>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}