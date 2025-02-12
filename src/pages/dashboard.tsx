import { Card } from "../components/card";
import { Icon } from "../components/icon";

export function DashboardPage() {

    const style = {
        button_list: 'flex items-center gap-2 text-gray-400 border-t border-gray-200 py-2 px-4 hover:bg-gray-100 transition-all cursor-pointer'
    }

    return (
        <div className="flex flex-col gap-8 p-8 w-full">

            <h1 className="text-2xl font-extralight">Dashboard</h1>

            <div className="w-full grid grid-cols-4 gap-6">
                <Card />
                <Card />
                <Card />
                <Card />
            </div>

            <div className="w-full h-fit flex flex-col md:flex-row gap-4 mb-12">
                <div className="flex flex-col justify-between w-1/4 h-full border border-gray-200 shadow-md rounded-md">
                    <div className="flex flex-col items-center p-6">
                        <img src="https://picsum.photos/200" className="rounded-full drop-shadow-xl mb-4"></img>
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

                <div className="w-3/4 h-full border border-gray-200 p-6 shadow-md rounded-md">
                
                    <h2 className="text-blue-600/50 text-lg font-bold">DASHBOARD *USER*</h2>

                    <hr className="text-gray-200 my-4"/>

                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-light">Selamat Datang</h2>
                        <p>Hai <strong>*NAMA SEKOLAH*</strong>, selamat datang di halaman Proktor Sekolah.</p>
                        <p>
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
                        </p>
                    </div>

                </div>
            </div>

        </div>
    )
}