import { NavLink } from "react-router";
import { Icon } from "../components/icon";
import { JSX, useState } from "react";

export function VerticalLayout() {

    const [admin, openAdmin] = useState<boolean>(false);
    const [pengaturanUjian, openPengaturanUjian] = useState<boolean>(false);
    const [ujianOnline, openUjianOnline] = useState<boolean>(false);
    const [hasilUjian, openHasilUjian] = useState<boolean>(false);

    const style = {
        option: "flex items-center gap-2 px-4 py-2 transition-all hover:bg-gray-700",
        subOption: "flex items-center gap-2 px-4 py-1 transition-all",
        list: "flex items-center justify-between hover:bg-gray-700 pr-4 transition-all",
        sublist: "flex items-center justify-between hover:bg-gray-700 pl-4 transition-all",
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

            <div onClick={() => openAdmin(!admin)} className={style.list}>
                <div className={style.option}>
                    <Icon name="heroicons:computer-desktop" shape="outline"/>
                    <p className={style.text}>Administrator</p>
                </div>
                <Icon name="heroicons:chevron-left" shape="outline"/>
            </div>

            {admin && 
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

            <NavLink to="/pengaturan" className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name="heroicons:cog-8-tooth" shape="outline"/>
                <p className={style.text}>Pengaturan Ujian</p>
            </NavLink>

            <div onClick={() => openPengaturanUjian(!pengaturanUjian)} className={style.list}>
                <div className={style.option}>
                    <Icon name="heroicons:cog-8-tooth" shape="outline"/>
                    <p className={style.text}>Pengaturan Ujian</p>
                </div>
                <Icon name="heroicons:chevron-left" shape="outline"/>
            </div>

            {pengaturanUjian && 
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

            <NavLink to="/ujian" className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name="heroicons:globe-asia-australia" shape="outline"/>
                <p className={style.text}>Ujian Online</p>
            </NavLink>

            <NavLink to="/hasil" className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name="heroicons:pencil-square" shape="outline"/>
                <p className={style.text}>Hasil Ujian</p>
            </NavLink>

            <ListContainer href="/pesanan" icon="heroicons:shopping-cart" title="Pesanan" />

            <ListContainer href="/logout" icon="heroicons:arrow-left-start-on-rectangle" title="Logout" />
        </div>
    )
}