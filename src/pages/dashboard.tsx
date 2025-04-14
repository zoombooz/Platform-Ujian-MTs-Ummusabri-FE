import { Link } from "react-router";
import logoPesri from "@assets/logo-pesri.png"

export function DashboardPage() {

    const fiturList: {title: string, description: string, link: string}[] = [
        {title: "Peserta", description: "Mengatur akun peserta yang akan mengikuti ujian", link: "/admin/peserta"},
        {title: "Ujian", description: "Membuat dan mengatur ujian yang akan diikuti peserta", link: "/admin/ujian"},
        {title: "Kelompok Ujian", description: "Membuat pengelompokkan dari ujian", link: "/admin/kelompok-ujian"},
        {title: "Mata Pelajaran", description: "Atur daftar pelajaran para peserta", link: "/admin/mata-pelajaran"},
        {title: "Daftar Kelas", description: "Buat dan atur daftar kelas para peserta", link: "/admindaftar-kelas"},
        {title: "Jurusan", description: "Buat dan atur daftar jurusan para peserta", link: "/admin/jurusan"},
        {title: "Agama", description: "Buat dan atur daftar agama para peserta", link: "/admin/agama"}
    ]

    // const style = {
    //     button_list: 'flex items-center gap-2 text-gray-400 border-t border-gray-200 py-2 px-4 hover:bg-gray-100 transition-all cursor-pointer'
    // }

    return (
        <div className="flex flex-col items-center gap-6 p-8 w-full bg-gray-100 overflow-y-auto pb-16">

            {/* <h1 className="text-2xl font-extralight">Dashboard</h1> */}
            
            <div className="flex flex-col gap-4 items-center">
                <img src={logoPesri} alt="Logo Sekolah" className="rounded-full drop-shadow-xl mb-2 w-60 h-60"/>
                <p className="text-gray-500 text-xl font-medium text-center">Dashboard CMS Ujian MTS UMMUSABRI</p>
                <p className="text-blue-400 text-lg font-semibold">ADMIN SEKOLAH</p>
            </div>

            <div className="flex flex-col w-full max-w-240 md:px-20">
                <p className="font-semibold text-lg text-gray-700">Halaman</p>
                <div className="w-full h-1 bg-gray-300 my-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {fiturList.map(el => (
                    <div className="flex flex-col gap-2">
                        <Link to={el.link} className="w-fit font-semibold text-xl text-gray-600 hover:text-gray-800 hover:underline transition-all">{el.title}</Link>
                        <p className="text-sm">{el.description}</p>
                    </div>
                    ))}
                </div>
            </div>

            {/* <div className="w-full h-fit flex flex-col md:flex-row gap-4 mb-12">
                <div className="flex flex-col justify-between w-1/4 h-fit border border-gray-200 shadow-md rounded-md bg-white">
                    <div className="flex flex-col items-center p-6">
                        <img src={logoPesri} alt="Logo Sekolah" className="rounded-full drop-shadow-xl mb-4 w-60 h-60"/>
                        <p className="text-gray-500 text-xl font-medium">MTS UMMUSABRI</p>
                        <p className="text-blue-400 text-sm font-semibold">ADMIN SEKOLAH</p>
                    </div>

                    <div className="w-full">
                        <div className={style.button_list}>
                            <Icon name="heroicons:information-circle" shape="outline" stroke={1.2} />
                            <p>Home</p>
                        </div>
                        <div className={style.button_list}>
                            <Icon name="heroicons:cog-8-tooth" shape="outline" stroke={1.2} />
                            <p>Account Setting</p>
                        </div>
                    </div>
                </div>

                <div className="w-3/4 h-full border border-gray-200 p-6 shadow-md rounded-md bg-white">

                    <h2 className="text-blue-400 text-lg font-bold">DASHBOARD *USER*</h2>

                    <hr className="text-gray-200 my-4"/>

                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-light">Selamat Datang</h2>
                        <p>Hai <strong>*NAMA SEKOLAH*</strong>, selamat datang di halaman Proktor Sekolah.</p>
                        <div>
                            <strong>Anda sedang login sebagai Proktor sekolah</strong>, fasilitas yang dapat anda manfaatkan adalah :
                            <ol className="list-decimal translate-x-4">
                                <li>Mengatur Akun guru yang menggunakan aplikasi ini.</li>
                                <li>Mengatur Tingkatan.</li>
                                <li>Mengatur Mata Pelajaran Guru.</li>
                                <li>Mencetak Kartu Tes Untuk Peserta Ujian.</li>
                                <li>Mencetak Hasil Ujian.</li>
                                <li>Mengakses daftar ujian dari guru di sekolah anda.</li>
                                <li>Upload data peserta ujian.</li>
                                <li>Upload Soal Ujian.</li>
                                <li>Generate Paket Soal Ujian.</li>
                                <li>Generate Soal Siswa.</li>
                                <li>Mengatur Ruangan dan Sesi Ujian.</li>
                                <li>Mencetak Analisis Hasil Ujian.</li>
                                <li>Mencetak Analisis Butir Soal.</li>
                                <li>Melihat Detail Hasil Ujian Siswa.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}