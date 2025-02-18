import { NavLink } from "react-router";
import { Icon } from "../components/icon";
import { JSX, useState } from "react";

export function VerticalLayout() {

    const [subList, setSubList] = useState<{[key: string]: boolean}>({
        'admin': false,
        'pengaturanUjian': false,
        'ujianOnline': false,
        'hasilUjian': false,
    })

    const openSublist = (option: string) => {
        setSubList(prevSubList => {
            const newSubList = {...prevSubList};
            for (const key in newSubList){
                if (key !== option) {
                    newSubList[key] = false;
                }
            }
            newSubList[option] = !newSubList[option];
            return newSubList;
        })
    }

    const style = {
        option: "flex items-center gap-2 px-4 py-2 transition-all hover:bg-gray-700",
        subOption: "flex items-center gap-2 px-4 py-1 transition-all",
        list: "flex items-center justify-between hover:bg-gray-700 pr-4 transition-all",
        sublist: "flex items-center justify-between hover:bg-gray-700 pl-4 transition-all",
        sublistOpen: 'bg-gray-700',
        active: "bg-red-500 hover:bg-red-600",
        text: "text-sm font-light",
    }

    const ListContainer = ({href, icon, title}: {href: string, icon: string, title: string}) => {
        return (
            <NavLink to={href} className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name={icon} shape="outline"/>
                <p className={style.text}>{title}</p>
            </NavLink>
        )
    }

    const SublistContainer = ({href, icon, title}: {href: string, icon: string, title: string}): JSX.Element => {
        return (
            <NavLink to={href} className={({isActive}) => (isActive ? style.active : '') + ` ${style.sublist}`}>
                <div className={style.subOption}>
                    <Icon name={icon} shape="outline"/>
                    <p className={"text-xs font-light"}>{title}</p>
                </div>
            </NavLink>
        )
    }

    return (
        <div className="h-full w-60 bg-green-900 flex flex-col py-8 text-white overflow-y-hidden">
            <ListContainer href="/" icon="heroicons:home" title="Dashboard" />

            <div onClick={() => openSublist('admin')} className={`${style.list} ${subList['admin'] ? style.sublistOpen : ''} `}>
                <div className={style.option}>
                    <Icon name="heroicons:computer-desktop" shape="outline"/>
                    <p className={style.text}>Administrator</p>
                </div>
                { subList['admin'] 
                    ? <Icon name="heroicons:chevron-down" shape="outline"/>
                    : <Icon name="heroicons:chevron-left" shape="outline"/>
                }
                
            </div>

            {subList['admin'] && 
                (<div className="transition-all">
                    <SublistContainer href="/admin/identitas" icon="heroicons:user" title="Identitas"/>
                    <SublistContainer href="/admin/daftar-kelas" icon="heroicons:user" title="Daftar Kelas"/>
                    <SublistContainer href="/admin/biodata-siswa" icon="heroicons:user" title="Biodata Siswa"/>
                    <SublistContainer href="/admin/data-guru" icon="heroicons:user" title="Data Guru"/>
                    <SublistContainer href="/admin/data-panitia" icon="heroicons:user" title="Data Panitia"/>
                    <SublistContainer href="/admin/kelompok-ujian" icon="heroicons:user" title="Kelompok Ujian"/>
                    <SublistContainer href="/admin/mata-pelajaran" icon="heroicons:user" title="Mata Pelajaran"/>
                </div>)
            }

            <ListContainer href="/daftar-ujian" icon="heroicons:book-open" title="Daftar Ujian" />

            <div onClick={() => openSublist('pengaturanUjian')} className={`${style.list} ${subList['pengaturanUjian'] ? style.sublistOpen : ''}`}>
                <div className={style.option}>
                    <Icon name="heroicons:cog-8-tooth" shape="outline"/>
                    <p className={style.text}>Pengaturan Ujian</p>
                </div>
                { subList['pengaturanUjian'] 
                    ? <Icon name="heroicons:chevron-down" shape="outline"/>
                    : <Icon name="heroicons:chevron-left" shape="outline"/>
                }
            </div>

            { subList['pengaturanUjian'] && 
                (<div className="transition-all">
                    <SublistContainer href="/pengaturan/server-client" icon="heroicons:user" title="Server dan Client"/>
                    <SublistContainer href="/pengaturan/sesi" icon="heroicons:user" title="Pengaturan Sesi"/>
                    <SublistContainer href="/pengaturan/paket-soal" icon="heroicons:user" title="Generate Paket Soal"/>
                    <SublistContainer href="/pengaturan/soal-siswa" icon="heroicons:user" title="Generate Soal Siswa"/>
                    <SublistContainer href="/pengaturan/kartu" icon="heroicons:user" title="Cetak Kartu"/>
                    <SublistContainer href="/pengaturan/daftar-hadir" icon="heroicons:user" title="Cetak Daftar Hadir"/>
                    <SublistContainer href="/pengaturan/berita-acara" icon="heroicons:user" title="Cetak Berita Acara"/>
                </div>)
            }

            <div onClick={() => openSublist('ujianOnline')} className={`${style.list} ${subList['ujianOnline'] ? style.sublistOpen : ''}`}>
                <div className={style.option}>
                    <Icon name="heroicons:globe-asia-australia" shape="outline"/>
                    <p className={style.text}>Ujian Online</p>
                </div>
                { subList['ujianOnline'] 
                    ? <Icon name="heroicons:chevron-down" shape="outline"/>
                    : <Icon name="heroicons:chevron-left" shape="outline"/>
                }
            </div>

            { subList['ujianOnline'] && 
                (<div className="transition-all">
                    <SublistContainer href="/ujian/kontrol" icon="heroicons:user" title="Kontrol Ujian"/>
                    <SublistContainer href="/ujian/perangkat" icon="heroicons:user" title="Kelola Perangkat"/>
                    <SublistContainer href="/ujian/status-peserta" icon="heroicons:user" title="Status Peserta"/>
                </div>)
            }

            <div onClick={() => openSublist('hasilUjian')} className={`${style.list} ${subList['hasilUjian'] ? style.sublistOpen : ''}`}>
                <div className={style.option}>
                    <Icon name="heroicons:pencil-square" shape="outline"/>
                    <p className={style.text}>Ujian Online</p>
                </div>
                { subList['hasilUjian'] 
                    ? <Icon name="heroicons:chevron-down" shape="outline"/>
                    : <Icon name="heroicons:chevron-left" shape="outline"/>
                }
            </div>

            { subList['hasilUjian'] && 
                (<div className="transition-all">
                    <SublistContainer href="/hasil-ujian/hasil" icon="heroicons:user" title="Hasil Siswa"/>
                    <SublistContainer href="/hasil-ujian/cetak-hasil" icon="heroicons:user" title="Cetak Hasil Ujian"/>
                    <SublistContainer href="/hasil-ujian/analisis-hasil" icon="heroicons:user" title="Analisis Hasil Ujian"/>
                    <SublistContainer href="/hasil-ujian/analisis-butir-soal" icon="heroicons:user" title="Analisis Butir Soal"/>
                </div>)
            }

            <ListContainer href="/pesanan" icon="heroicons:shopping-cart" title="Pesanan" />

            <ListContainer href="/logout" icon="heroicons:arrow-left-start-on-rectangle" title="Logout" />
        </div>
    )
}