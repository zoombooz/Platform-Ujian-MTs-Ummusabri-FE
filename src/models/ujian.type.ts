import { IDaftarKelas } from "./kelas.type"
import { IMataPelajaran } from "./mapel.type"
import { IPeserta } from "./peserta.type"

export interface IUjian {
    id: number,
    nama: string,
    kelompok_id: string,
    mapel_id: string,
    kelas_id: string,
    id_sekolah: string | number,
    start_date: string,
    end_date: string,
    status: boolean | string | number,
    updated_at: string,
    created_at: string,
    isTrue: any,
    kelompok_ujian: IKelompokUjian,
    mapel: IMataPelajaran,
    kelas: IDaftarKelas
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

export interface ISesiUjian {
    created_at: string,
    updated_at: string,
    ujian_id: number,
    end_date: string,
    start_date: string,
    id: number,
    isTrue: number,
    nomor_peserta: number,
    peserta: IPeserta,
    ujian: IUjian,
}

export interface IHasilUjian {
    id: number,
    nama: string,
    nomor_peserta: number,
    ujian_id: number,
    soal: string,
    tipe_soal: string,
    jawaban_soal: string,
    jawaban_sesi: string,
    isTrue: number
}