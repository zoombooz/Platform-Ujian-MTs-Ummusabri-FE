import { NavLink } from "react-router";
import { Icon } from "../components/icon";
import { JSX, useState } from "react";
import { useLayout } from "../context/LayoutContext";

export function VerticalLayout() {

    const { isExpanded } = useLayout();

    const [subList, setSubList] = useState<{[key: string]: boolean}>({
        'admin': false,
        'pengaturanUjian': false,
        'ujianOnline': false,
        'hasilUjian': false,
    })

    const style = {
        option: "flex items-center gap-2 px-4 py-2 transition-all hover:bg-gray-700",
        subOption: "flex items-center gap-2 px-4 py-1 transition-all",
        list: "flex items-center justify-between hover:bg-gray-700 transition-all",
        sublist: "flex items-center justify-between hover:bg-gray-700 pl-4 transition-all",
        sublistOpen: 'bg-gray-700',
        active: "bg-red-500 hover:bg-red-600",
        text: "text-sm font-light",
        logo: 'w-20 h-20',
        logo_sm: 'w-12 h-12'
    }

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

    const ListContainer = ({href, icon, title}: {href: string, icon: string, title: string}) => {
        return (
            <NavLink to={href} className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name={icon} shape="outline"/>
                {isExpanded && <p className={style.text}>{title}</p>}
            </NavLink>
        )
    }

    const SublistHead = ({name, title, icon}: {name: string, title: string, icon: string}) => {
        return (
            <div onClick={() => openSublist(name)} className={`${style.list} ${subList[name] ? style.sublistOpen : ''} `}>
                <div className={style.option}>
                    <Icon name={icon} shape="outline"/>
                    {isExpanded && <p className={style.text}>{title}</p>}
                </div>
                {isExpanded && 
                    <div className="pr-4">
                        <Icon name={`heroicons:chevron-${subList[name] ? 'down' : 'left'}`} shape="outline"/>
                    </div>
                }
                
            </div>
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
        <div className={`h-full ${isExpanded ? 'w-60' : 'w-16'} bg-green-900 flex flex-col text-white overflow-y-hidden hide-scrollbar transition-all duration-300`}>

            <div className={`flex ${isExpanded ? 'flex-row' : 'flex-col'} justify-center py-4 px-2`}>
                <img src="src/assets/logo-pesri.png" alt="Logo Pesri" className={isExpanded ? style.logo : style.logo_sm}/>
                <img src="src/assets/logo-cambridge.png" alt="Logo Cambridge" className={`${isExpanded ? style.logo : style.logo_sm} translate-y-2`}/>
            </div>

            <ListContainer href="/" icon="heroicons:home" title="Dashboard" />

            <SublistHead name="admin" title="Administrator" icon="heroicons:computer-desktop" />

            { (subList['admin'] && isExpanded) && 
                (<div className="transition-all">
                    <SublistContainer href="/admin/identitas" icon="heroicons:user" title="Identitas"/>
                    <SublistContainer href="/admin/daftar-kelas" icon="heroicons:user" title="Daftar Kelas"/>
                    <SublistContainer href="/admin/biodata-siswa" icon="heroicons:user" title="Biodata Siswa"/>
                    <SublistContainer href="/admin/data-guru" icon="heroicons:user" title="Data Guru"/>
                    <SublistContainer href="/admin/data-panitia" icon="heroicons:user" title="Data Panitia"/>
                    <SublistContainer href="/admin/kelompok-ujian" icon="heroicons:user" title="Kelompok Ujian"/>
                    <SublistContainer href="/admin/mata-pelajaran" icon="heroicons:user" title="Mata Pelajaran"/>
                    <SublistContainer href="/admin/agama" icon="heroicons:user" title="Agama"/>
                </div>)
            }

            <ListContainer href="/daftar-ujian" icon="heroicons:book-open" title="Daftar Ujian" />

            {/* <SublistHead name="pengaturanUjian" title="Pengaturan Ujian" icon="heroicons:cog-8-tooth" />

            { (subList['pengaturanUjian'] && isExpanded) && 
                (<div className="transition-all">
                    <SublistContainer href="/pengaturan/server-client" icon="heroicons:user" title="Server dan Client"/>
                    <SublistContainer href="/pengaturan/sesi" icon="heroicons:user" title="Pengaturan Sesi"/>
                    <SublistContainer href="/pengaturan/paket-soal" icon="heroicons:user" title="Generate Paket Soal"/>
                    <SublistContainer href="/pengaturan/soal-siswa" icon="heroicons:user" title="Generate Soal Siswa"/>
                    <SublistContainer href="/pengaturan/kartu" icon="heroicons:user" title="Cetak Kartu"/>
                    <SublistContainer href="/pengaturan/daftar-hadir" icon="heroicons:user" title="Cetak Daftar Hadir"/>
                    <SublistContainer href="/pengaturan/berita-acara" icon="heroicons:user" title="Cetak Berita Acara"/>
                </div>)
            } */}

            <SublistHead name="ujianOnline" title="Ujian Online" icon="heroicons:globe-asia-australia" />

            { (subList['ujianOnline'] && isExpanded) && 
                (<div className="transition-all">
                    <SublistContainer href="/ujian-online/kontrol" icon="heroicons:user" title="Kontrol Ujian"/>
                    <SublistContainer href="/ujian-online/perangkat" icon="heroicons:user" title="Kelola Perangkat"/>
                    <SublistContainer href="/ujian-online/status-peserta" icon="heroicons:user" title="Status Peserta"/>
                </div>)
            }

            <SublistHead name="hasilUjian" title="Ujian Online" icon="heroicons:pencil-square" />

            { (subList['hasilUjian'] && isExpanded) && 
                (<div className="transition-all">
                    <SublistContainer href="/hasil-ujian/hasil" icon="heroicons:user" title="Hasil Siswa"/>
                    <SublistContainer href="/hasil-ujian/cetak-hasil" icon="heroicons:user" title="Cetak Hasil Ujian"/>
                    <SublistContainer href="/hasil-ujian/analisis-hasil" icon="heroicons:user" title="Analisis Hasil Ujian"/>
                    <SublistContainer href="/hasil-ujian/analisis-butir-soal" icon="heroicons:user" title="Analisis Butir Soal"/>
                </div>)
            }

            {/* <ListContainer href="/pesanan" icon="heroicons:shopping-cart" title="Pesanan" /> */}

            <ListContainer href="/login" icon="heroicons:arrow-left-start-on-rectangle" title="Logout" />

            <ListContainer href="/ujian" icon="heroicons:arrow-left-start-on-rectangle" title="Ujian" />
        </div>
    )
}