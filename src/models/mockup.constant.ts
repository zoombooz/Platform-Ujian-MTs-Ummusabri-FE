// import { IAgama } from "../pages/agama";
// import { IBiodataSiswa } from "../pages/biodata-siswa";
// import { IDaftarKelas } from "../pages/daftar-kelas";
// import { IDataGuru } from "../pages/data-guru";
// import { IDataPanitia } from "../pages/data-panitia";
// import { IJurusan } from "../pages/jurusan";
// import { IKelompokUjian } from "../pages/kelompok-ujian";
// import { IMataPelajaran } from "../pages/mata-pelajaran";
// import { IPeserta } from "../pages/peserta";

// export const daftarKelasList: IDaftarKelas[] = [
//     {id: 1, nama: "Bahasa Indonesia"},
//     {id: 2, nama: "English"},
//     {id: 3, nama: "Math"},
//     {id: 4, nama: "IPS"},
//     {id: 5, nama: "OBA"},
//     {id: 6, nama: "Science"},
//     {id: 7, nama: "VII.G CIBER"}
// ] 

// export const biodataSiswaList: IBiodataSiswa[] = [
//     { nomor_peserta: "202401", nama: "Ahmad Ramadhan", alamat: "Jl. Merdeka No. 10", kelas: "XII-IPA 1", jurusan: "IPA" },
//     { nomor_peserta: "202402", nama: "Budi Santoso", alamat: "Jl. Diponegoro No. 5", kelas: "XII-IPS 2", jurusan: "IPS" },
//     { nomor_peserta: "202403", nama: "Citra Dewi", alamat: "Jl. Sudirman No. 12", kelas: "XII-IPA 3", jurusan: "IPA" },
//     { nomor_peserta: "202404", nama: "Dian Permata", alamat: "Jl. Ahmad Yani No. 8", kelas: "XI-IPS 1", jurusan: "IPS" },
//     { nomor_peserta: "202405", nama: "Eko Wijaya", alamat: "Jl. Gatot Subroto No. 7", kelas: "XII-IPA 2", jurusan: "IPA" },
//     { nomor_peserta: "202406", nama: "Farhan Maulana", alamat: "Jl. Kartini No. 15", kelas: "XI-IPA 1", jurusan: "IPA" },
//     { nomor_peserta: "202407", nama: "Gita Anjani", alamat: "Jl. Mangga No. 22", kelas: "XII-IPS 3", jurusan: "IPS" },
//     { nomor_peserta: "202408", nama: "Hendra Setiawan", alamat: "Jl. Anggrek No. 9", kelas: "XI-IPA 2", jurusan: "IPA" },
//     { nomor_peserta: "202409", nama: "Indah Lestari", alamat: "Jl. Melati No. 3", kelas: "XII-IPS 1", jurusan: "IPS" },
//     { nomor_peserta: "202410", nama: "Joko Prasetyo", alamat: "Jl. Cemara No. 6", kelas: "XI-IPS 2", jurusan: "IPS" },
//     { nomor_peserta: "202411", nama: "Kurnia Sari", alamat: "Jl. Mawar No. 14", kelas: "XII-IPA 4", jurusan: "IPA" },
//     { nomor_peserta: "202412", nama: "Lina Oktaviani", alamat: "Jl. Kenanga No. 2", kelas: "XI-IPA 3", jurusan: "IPA" },
//     { nomor_peserta: "202413", nama: "Mulyadi Putra", alamat: "Jl. Flamboyan No. 19", kelas: "XII-IPS 4", jurusan: "IPS" },
//     { nomor_peserta: "202414", nama: "Novi Andini", alamat: "Jl. Sukun No. 11", kelas: "XI-IPS 3", jurusan: "IPS" },
//     { nomor_peserta: "202415", nama: "Oscar Hidayat", alamat: "Jl. Jambu No. 5", kelas: "XII-IPA 5", jurusan: "IPA" }
// ]

// export const dataGuruList: IDataGuru[] = [
//     { username: "guru01", password: "pass123", nama: "Agus Wijaya", alamat: "Jl. Pahlawan No. 1", mata_pelajaran: "Matematika", aktif: true },
//     { username: "guru02", password: "pass456", nama: "Bambang Supriyadi", alamat: "Jl. Kemerdekaan No. 2", mata_pelajaran: "Fisika", aktif: true },
//     { username: "guru03", password: "pass789", nama: "Citra Lestari", alamat: "Jl. Mawar No. 3", mata_pelajaran: "Kimia", aktif: false },
//     { username: "guru04", password: "pass101", nama: "Dewi Sartika", alamat: "Jl. Melati No. 4", mata_pelajaran: "Biologi", aktif: true },
//     { username: "guru05", password: "pass202", nama: "Eko Prasetyo", alamat: "Jl. Anggrek No. 5", mata_pelajaran: "Bahasa Inggris", aktif: true },
//     { username: "guru06", password: "pass303", nama: "Fajar Hidayat", alamat: "Jl. Cemara No. 6", mata_pelajaran: "Sejarah", aktif: false },
//     { username: "guru07", password: "pass404", nama: "Gita Ananda", alamat: "Jl. Kenanga No. 7", mata_pelajaran: "Ekonomi", aktif: true },
//     { username: "guru08", password: "pass505", nama: "Hadi Setiawan", alamat: "Jl. Flamboyan No. 8", mata_pelajaran: "Sosiologi", aktif: true },
//     { username: "guru09", password: "pass606", nama: "Indah Permatasari", alamat: "Jl. Sukun No. 9", mata_pelajaran: "Geografi", aktif: false },
//     { username: "guru10", password: "pass707", nama: "Joko Santoso", alamat: "Jl. Jambu No. 10", mata_pelajaran: "Pendidikan Kewarganegaraan", aktif: true }
// ];

// export const dataPanitiaList: IDataPanitia[] = [
//     { username: "panitia01", password: "admin123", nama: "Siti Aminah", alamat: "Jl. Pahlawan No. 11" },
//     { username: "panitia02", password: "admin456", nama: "Rudi Hartono", alamat: "Jl. Diponegoro No. 22" },
//     { username: "panitia03", password: "admin789", nama: "Lina Kusuma", alamat: "Jl. Sudirman No. 33" }
// ];

// export const kelompokUjianList: IKelompokUjian[] = [
//     { id: 1, nama: "Kelompok A", id_sekolah: "S001", start_date: "26-11-2025", end_date: "02-12-2025", updated_at: "2025-03-15T03:20:32.000000Z", created_at: "2025-03-15T03:20:32.000000Z"},
//     { id: 2, nama: "Kelompok B", id_sekolah: "S002", start_date: "26-11-2025", end_date: "02-12-2025", updated_at: "2025-03-15T03:20:32.000000Z", created_at: "2025-03-15T03:20:32.000000Z"},
//     { id: 3, nama: "Kelompok C", id_sekolah: "S003", start_date: "26-11-2025", end_date: "02-12-2025", updated_at: "2025-03-15T03:20:32.000000Z", created_at: "2025-03-15T03:20:32.000000Z"},
//     { id: 4, nama: "Kelompok D", id_sekolah: "S004", start_date: "26-11-2025", end_date: "02-12-2025", updated_at: "2025-03-15T03:20:32.000000Z", created_at: "2025-03-15T03:20:32.000000Z"},
//     { id: 5, nama: "Kelompok E", id_sekolah: "S005", start_date: "26-11-2025", end_date: "02-12-2025", updated_at: "2025-03-15T03:20:32.000000Z", created_at: "2025-03-15T03:20:32.000000Z"}
// ];

// export const mataPelajaranList: IMataPelajaran[] = [
//     { nama: "Matematika", sekolah_id: "S001" },
//     { nama: "Fisika", sekolah_id: "S002" },
//     { nama: "Kimia", sekolah_id: "S003" },
//     { nama: "Biologi", sekolah_id: "S004" },
//     { nama: "Bahasa Inggris", sekolah_id: "S005" },
//     { nama: "Sejarah", sekolah_id: "S006" },
//     { nama: "Ekonomi", sekolah_id: "S007" },
//     { nama: "Sosiologi", sekolah_id: "S008" },
//     { nama: "Geografi", sekolah_id: "S009" },
//     { nama: "Pendidikan Kewarganegaraan", sekolah_id: "S010" }
// ];

// export const agamaList: IAgama[] = [
//     {
//         id: 1,
//         nama: "Islam",
//         created_at: "2025-03-05T08:36:54.000000Z",
//         updated_at: "2025-03-05T08:36:54.000000Z"
//     },
//     {
//         id: 2,
//         nama: "Kristen",
//         created_at: "2025-03-05T08:36:54.000000Z",
//         updated_at: "2025-03-05T08:36:54.000000Z"
//     },
//     {
//         id: 3,
//         nama: "Hindu",
//         created_at: "2025-03-05T08:36:54.000000Z",
//         updated_at: "2025-03-05T08:36:54.000000Z"
//     },
//     {
//         id: 4,
//         nama: "Buddha",
//         created_at: "2025-03-05T08:36:54.000000Z",
//         updated_at: "2025-03-05T08:36:54.000000Z"
//     },
//     {
//         id: 5,
//         nama: "Kong Hu Cu",
//         created_at: "2025-03-05T08:36:54.000000Z",
//         updated_at: "2025-03-05T08:36:54.000000Z"
//     }
// ]

// export const pesertaList: IPeserta[] = [
//     {
//       "id": 1,
//       "nama": "Ahmad Fauzi",
//       "password": "password123",
//       "jurusan_id": "1",
//       "agama_id": "1",
//       "kelas_id": "101",
//       "nomor_peserta": "PES2025001",
//       "created_at": "2025-03-22T11:00:00Z",
//       "updated_at": "2025-03-22T11:00:00Z"
//     },
//     {
//       "id": 2,
//       "nama": "Siti Aisyah",
//       "password": "password234",
//       "jurusan_id": "2",
//       "agama_id": "2",
//       "kelas_id": "102",
//       "nomor_peserta": "PES2025002",
//       "created_at": "2025-03-22T11:05:00Z",
//       "updated_at": "2025-03-22T11:05:00Z"
//     },
//     {
//       "id": 3,
//       "nama": "Budi Santoso",
//       "password": "password345",
//       "jurusan_id": "3",
//       "agama_id": "1",
//       "kelas_id": "103",
//       "nomor_peserta": "PES2025003",
//       "created_at": "2025-03-22T11:10:00Z",
//       "updated_at": "2025-03-22T11:10:00Z"
//     },
//     {
//       "id": 4,
//       "nama": "Dewi Kartika",
//       "password": "password456",
//       "jurusan_id": "4",
//       "agama_id": "2",
//       "kelas_id": "104",
//       "nomor_peserta": "PES2025004",
//       "created_at": "2025-03-22T11:15:00Z",
//       "updated_at": "2025-03-22T11:15:00Z"
//     },
//     {
//       "id": 5,
//       "nama": "Rizky Hidayat",
//       "password": "password567",
//       "jurusan_id": "5",
//       "agama_id": "1",
//       "kelas_id": "105",
//       "nomor_peserta": "PES2025005",
//       "created_at": "2025-03-22T11:20:00Z",
//       "updated_at": "2025-03-22T11:20:00Z"
//     },
//     {
//       "id": 6,
//       "nama": "Fitri Amalia",
//       "password": "password678",
//       "jurusan_id": "6",
//       "agama_id": "2",
//       "kelas_id": "106",
//       "nomor_peserta": "PES2025006",
//       "created_at": "2025-03-22T11:25:00Z",
//       "updated_at": "2025-03-22T11:25:00Z"
//     },
//     {
//       "id": 7,
//       "nama": "Hendra Wijaya",
//       "password": "password789",
//       "jurusan_id": "7",
//       "agama_id": "1",
//       "kelas_id": "107",
//       "nomor_peserta": "PES2025007",
//       "created_at": "2025-03-22T11:30:00Z",
//       "updated_at": "2025-03-22T11:30:00Z"
//     },
//     {
//       "id": 8,
//       "nama": "Nadia Rahma",
//       "password": "password890",
//       "jurusan_id": "8",
//       "agama_id": "2",
//       "kelas_id": "108",
//       "nomor_peserta": "PES2025008",
//       "created_at": "2025-03-22T11:35:00Z",
//       "updated_at": "2025-03-22T11:35:00Z"
//     },
//     {
//       "id": 9,
//       "nama": "Faisal Maulana",
//       "password": "password901",
//       "jurusan_id": "9",
//       "agama_id": "1",
//       "kelas_id": "109",
//       "nomor_peserta": "PES2025009",
//       "created_at": "2025-03-22T11:40:00Z",
//       "updated_at": "2025-03-22T11:40:00Z"
//     },
//     {
//       "id": 10,
//       "nama": "Lina Putri",
//       "password": "password012",
//       "jurusan_id": "10",
//       "agama_id": "2",
//       "kelas_id": "110",
//       "nomor_peserta": "PES2025010",
//       "created_at": "2025-03-22T11:45:00Z",
//       "updated_at": "2025-03-22T11:45:00Z"
//     }
//   ]
  

// export const jurusanList: IJurusan[] = [
//     {
//       "id": "1",
//       "nama": "Teknik Informatika",
//       "created_at": "2025-03-22T10:00:00Z",
//       "updated_at": "2025-03-22T10:00:00Z"
//     },
//     {
//       "id": "2",
//       "nama": "Sistem Informasi",
//       "created_at": "2025-03-22T10:05:00Z",
//       "updated_at": "2025-03-22T10:05:00Z"
//     },
//     {
//       "id": "3",
//       "nama": "Teknik Elektro",
//       "created_at": "2025-03-22T10:10:00Z",
//       "updated_at": "2025-03-22T10:10:00Z"
//     },
//     {
//       "id": "4",
//       "nama": "Manajemen",
//       "created_at": "2025-03-22T10:15:00Z",
//       "updated_at": "2025-03-22T10:15:00Z"
//     },
//     {
//       "id": "5",
//       "nama": "Akuntansi",
//       "created_at": "2025-03-22T10:20:00Z",
//       "updated_at": "2025-03-22T10:20:00Z"
//     },
//     {
//       "id": "6",
//       "nama": "Teknik Mesin",
//       "created_at": "2025-03-22T10:25:00Z",
//       "updated_at": "2025-03-22T10:25:00Z"
//     },
//     {
//       "id": "7",
//       "nama": "Teknik Sipil",
//       "created_at": "2025-03-22T10:30:00Z",
//       "updated_at": "2025-03-22T10:30:00Z"
//     },
//     {
//       "id": "8",
//       "nama": "Desain Komunikasi Visual",
//       "created_at": "2025-03-22T10:35:00Z",
//       "updated_at": "2025-03-22T10:35:00Z"
//     },
//     {
//       "id": "9",
//       "nama": "Ilmu Komunikasi",
//       "created_at": "2025-03-22T10:40:00Z",
//       "updated_at": "2025-03-22T10:40:00Z"
//     },
//     {
//       "id": "10",
//       "nama": "Psikologi",
//       "created_at": "2025-03-22T10:45:00Z",
//       "updated_at": "2025-03-22T10:45:00Z"
//     }
//   ]
  
