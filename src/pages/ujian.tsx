import { useState } from "react"

interface IPilihanGanda {
    nomor: number,
    perintah: string,
    teks: string,
    pertanyaan: string,
    pilihan_jawaban: string[]
}

export function Ujian() {

    const [soal, setSoal] = useState<IPilihanGanda>()

    return (
        <div>
            Ujian Page is here
        </div>
    )
}