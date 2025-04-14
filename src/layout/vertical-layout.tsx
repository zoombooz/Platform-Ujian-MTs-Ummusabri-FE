import { NavLink, useNavigate } from "react-router";
import { Icon } from "../components/icon";
import { JSX, useState } from "react";
import { useLayout } from "../context/LayoutContext";
import logoPesri from '@assets/logo-pesri.png';
import logoCambridge from '@assets/logo-cambridge.png';
import Swal from "sweetalert2";

export function VerticalLayout() {

    const navigate = useNavigate();
    const { isExpanded, toggleExpand } = useLayout();

    const [subList, setSubList] = useState<{[key: string]: boolean}>({
        'admin': false,
        'pengaturanUjian': false,
        'ujianOnline': false,
        'hasilUjian': false,
    })

    const logout = (): void => {
        Swal.fire({
            title: "Log Out",
            text: "Apakah anda yakin ingin keluar?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Iya",
            cancelButtonText: "Tidak"
        }).then(result => {
            if(result.isConfirmed){
                localStorage.removeItem("authToken");
                navigate("/login-admin")
            }
        })
    }

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
            <div onClick={() => {openSublist(name); if(!isExpanded) toggleExpand()}} className={`${style.list} ${subList[name] ? style.sublistOpen : ''} `}>
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
        <div className={`h-full ${isExpanded ? 'w-60' : 'w-0 md:w-16'} absolute md:static bg-green-900 flex flex-col text-white overflow-y-hidden hide-scrollbar transition-all duration-300 z-99`}>

            <div className={`flex ${isExpanded ? 'flex-row' : 'flex-col'} justify-center py-4 px-2`}>
                <img src={logoPesri} alt="Logo Pesri" className={isExpanded ? style.logo : style.logo_sm}/>
                <img src={logoCambridge} alt="Logo Cambridge" className={`${isExpanded ? style.logo : style.logo_sm} translate-y-2`}/>
            </div>

            <ListContainer href="/" icon="heroicons:home" title="Dashboard" />

            <SublistHead name="admin" title="Administrator" icon="heroicons:computer-desktop" />

            { (subList['admin'] && isExpanded) && 
                (<div className="transition-all">
                    <SublistContainer href="/admin/agama" icon="heroicons:moon" title="Agama"/>
                    <SublistContainer href="/admin/peserta" icon="heroicons:user" title="Peserta"/>
                    <SublistContainer href="/admin/jurusan" icon="heroicons:academic-cap" title="Jurusan"/>
                    <SublistContainer href="/admin/mata-pelajaran" icon="heroicons:bars-3-bottom-left" title="Mata Pelajaran"/>
                    <SublistContainer href="/admin/kelompok-ujian" icon="heroicons:tag" title="Kelompok Ujian"/>
                    <SublistContainer href="/admin/daftar-kelas" icon="heroicons:users" title="Daftar Kelas"/>
                    <SublistContainer href="/admin/ujian" icon="heroicons:document-text" title="Ujian"/>
                    <SublistContainer href="/admin/evaluasi" icon="heroicons:document-check" title="Evaluasi Jawaban"/>
                </div>)
            }

            <button className={`${style.option}`} onClick={logout}>
                <Icon name={"heroicons:arrow-left-start-on-rectangle"} shape="outline"/>
                {isExpanded && <p className={style.text}>{'Logout'}</p>}
            </button>
        </div>
    )
}