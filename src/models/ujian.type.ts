import { IDaftarKelas } from "./kelas.type"
import { IMataPelajaran } from "./mapel.type"

export interface IUjian {
    id: number,
    nama: string,
    kelompok_id: string,
    mapel_id: string,
    kelas_id: string,
    id_sekolah: string | number,
    start_date: string,
    end_date: string,
    status: string,
    updated_at: string,
    created_at: string
}

export interface IKelompokUjian {
    nama: string,
    id_sekolah: string,
    start_date: string,
    end_date: string,
    updated_at: string,
    created_at: string,
    id: number
}

export interface ISesiUjian extends IUjian {
    kelompok_ujian: IKelompokUjian,
    mapel: IMataPelajaran,
    kelas: IDaftarKelas
}