import { IAgama } from "../pages/agama";
import { IBiodataSiswa } from "../pages/biodata-siswa";
import { IDaftarKelas } from "../pages/daftar-kelas";
import { IDataGuru } from "../pages/data-guru";
import { IDataPanitia } from "../pages/data-panitia";
import { IKelompokUjian } from "../pages/kelompok-ujian";
import { IMataPelajaran } from "../pages/mata-pelajaran";

export const daftarKelasList: IDaftarKelas[] = [
    {id: 1, nama: "Bahasa Indonesia"},
    {id: 2, nama: "English"},
    {id: 3, nama: "Math"},
    {id: 4, nama: "IPS"},
    {id: 5, nama: "OBA"},
    {id: 6, nama: "Science"},
    {id: 7, nama: "VII.G CIBER"}
] 

export const biodataSiswaList: IBiodataSiswa[] = [
    { nomor_peserta: "202401", nama: "Ahmad Ramadhan", alamat: "Jl. Merdeka No. 10", kelas: "XII-IPA 1", jurusan: "IPA" },
    { nomor_peserta: "202402", nama: "Budi Santoso", alamat: "Jl. Diponegoro No. 5", kelas: "XII-IPS 2", jurusan: "IPS" },
    { nomor_peserta: "202403", nama: "Citra Dewi", alamat: "Jl. Sudirman No. 12", kelas: "XII-IPA 3", jurusan: "IPA" },
    { nomor_peserta: "202404", nama: "Dian Permata", alamat: "Jl. Ahmad Yani No. 8", kelas: "XI-IPS 1", jurusan: "IPS" },
    { nomor_peserta: "202405", nama: "Eko Wijaya", alamat: "Jl. Gatot Subroto No. 7", kelas: "XII-IPA 2", jurusan: "IPA" },
    { nomor_peserta: "202406", nama: "Farhan Maulana", alamat: "Jl. Kartini No. 15", kelas: "XI-IPA 1", jurusan: "IPA" },
    { nomor_peserta: "202407", nama: "Gita Anjani", alamat: "Jl. Mangga No. 22", kelas: "XII-IPS 3", jurusan: "IPS" },
    { nomor_peserta: "202408", nama: "Hendra Setiawan", alamat: "Jl. Anggrek No. 9", kelas: "XI-IPA 2", jurusan: "IPA" },
    { nomor_peserta: "202409", nama: "Indah Lestari", alamat: "Jl. Melati No. 3", kelas: "XII-IPS 1", jurusan: "IPS" },
    { nomor_peserta: "202410", nama: "Joko Prasetyo", alamat: "Jl. Cemara No. 6", kelas: "XI-IPS 2", jurusan: "IPS" },
    { nomor_peserta: "202411", nama: "Kurnia Sari", alamat: "Jl. Mawar No. 14", kelas: "XII-IPA 4", jurusan: "IPA" },
    { nomor_peserta: "202412", nama: "Lina Oktaviani", alamat: "Jl. Kenanga No. 2", kelas: "XI-IPA 3", jurusan: "IPA" },
    { nomor_peserta: "202413", nama: "Mulyadi Putra", alamat: "Jl. Flamboyan No. 19", kelas: "XII-IPS 4", jurusan: "IPS" },
    { nomor_peserta: "202414", nama: "Novi Andini", alamat: "Jl. Sukun No. 11", kelas: "XI-IPS 3", jurusan: "IPS" },
    { nomor_peserta: "202415", nama: "Oscar Hidayat", alamat: "Jl. Jambu No. 5", kelas: "XII-IPA 5", jurusan: "IPA" }
]

export const dataGuruList: IDataGuru[] = [
    { username: "guru01", password: "pass123", nama: "Agus Wijaya", alamat: "Jl. Pahlawan No. 1", mata_pelajaran: "Matematika", aktif: true },
    { username: "guru02", password: "pass456", nama: "Bambang Supriyadi", alamat: "Jl. Kemerdekaan No. 2", mata_pelajaran: "Fisika", aktif: true },
    { username: "guru03", password: "pass789", nama: "Citra Lestari", alamat: "Jl. Mawar No. 3", mata_pelajaran: "Kimia", aktif: false },
    { username: "guru04", password: "pass101", nama: "Dewi Sartika", alamat: "Jl. Melati No. 4", mata_pelajaran: "Biologi", aktif: true },
    { username: "guru05", password: "pass202", nama: "Eko Prasetyo", alamat: "Jl. Anggrek No. 5", mata_pelajaran: "Bahasa Inggris", aktif: true },
    { username: "guru06", password: "pass303", nama: "Fajar Hidayat", alamat: "Jl. Cemara No. 6", mata_pelajaran: "Sejarah", aktif: false },
    { username: "guru07", password: "pass404", nama: "Gita Ananda", alamat: "Jl. Kenanga No. 7", mata_pelajaran: "Ekonomi", aktif: true },
    { username: "guru08", password: "pass505", nama: "Hadi Setiawan", alamat: "Jl. Flamboyan No. 8", mata_pelajaran: "Sosiologi", aktif: true },
    { username: "guru09", password: "pass606", nama: "Indah Permatasari", alamat: "Jl. Sukun No. 9", mata_pelajaran: "Geografi", aktif: false },
    { username: "guru10", password: "pass707", nama: "Joko Santoso", alamat: "Jl. Jambu No. 10", mata_pelajaran: "Pendidikan Kewarganegaraan", aktif: true }
];

export const dataPanitiaList: IDataPanitia[] = [
    { username: "panitia01", password: "admin123", nama: "Siti Aminah", alamat: "Jl. Pahlawan No. 11" },
    { username: "panitia02", password: "admin456", nama: "Rudi Hartono", alamat: "Jl. Diponegoro No. 22" },
    { username: "panitia03", password: "admin789", nama: "Lina Kusuma", alamat: "Jl. Sudirman No. 33" }
];

export const kelompokUjianList: IKelompokUjian[] = [
    { id: "KU001", nama: "Kelompok A", sekolah_id: "S001", jumlah_ujian: 5, status: true },
    { id: "KU002", nama: "Kelompok B", sekolah_id: "S002", jumlah_ujian: 4, status: true },
    { id: "KU003", nama: "Kelompok C", sekolah_id: "S003", jumlah_ujian: 6, status: false },
    { id: "KU004", nama: "Kelompok D", sekolah_id: "S004", jumlah_ujian: 3, status: true },
    { id: "KU005", nama: "Kelompok E", sekolah_id: "S005", jumlah_ujian: 7, status: false }
];

export const mataPelajaranList: IMataPelajaran[] = [
    { nama: "Matematika", sekolah_id: "S001" },
    { nama: "Fisika", sekolah_id: "S002" },
    { nama: "Kimia", sekolah_id: "S003" },
    { nama: "Biologi", sekolah_id: "S004" },
    { nama: "Bahasa Inggris", sekolah_id: "S005" },
    { nama: "Sejarah", sekolah_id: "S006" },
    { nama: "Ekonomi", sekolah_id: "S007" },
    { nama: "Sosiologi", sekolah_id: "S008" },
    { nama: "Geografi", sekolah_id: "S009" },
    { nama: "Pendidikan Kewarganegaraan", sekolah_id: "S010" }
];

export const agamaList: IAgama[] = [
    {
        id: 1,
        nama: "Islam",
        created_at: "2025-03-05T08:36:54.000000Z",
        updated_at: "2025-03-05T08:36:54.000000Z"
    },
    {
        id: 2,
        nama: "Kristen",
        created_at: "2025-03-05T08:36:54.000000Z",
        updated_at: "2025-03-05T08:36:54.000000Z"
    },
    {
        id: 3,
        nama: "Hindu",
        created_at: "2025-03-05T08:36:54.000000Z",
        updated_at: "2025-03-05T08:36:54.000000Z"
    },
    {
        id: 4,
        nama: "Buddha",
        created_at: "2025-03-05T08:36:54.000000Z",
        updated_at: "2025-03-05T08:36:54.000000Z"
    },
    {
        id: 5,
        nama: "Kong Hu Cu",
        created_at: "2025-03-05T08:36:54.000000Z",
        updated_at: "2025-03-05T08:36:54.000000Z"
    }
]
