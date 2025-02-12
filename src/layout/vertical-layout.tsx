import { NavLink } from "react-router";
import { Icon } from "../components/icon";

export function VerticalLayout() {

    const style = {
        option: "flex items-center gap-2 px-4 py-2 transition-all hover:bg-gray-700",
        list: "flex items-center justify-between hover:bg-gray-700 pr-4",
        active: "bg-red-500 hover:bg-red-600",
        text: "text-sm font-light"
    }

    return (
        <div className="h-full w-60 bg-green-900 flex flex-col py-8 text-white">
            <NavLink to="/" className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name="heroicons_outline:home" shape="micro"/>
                <p className={style.text}>Dashboard</p>
            </NavLink>

            <NavLink to="/admin" className={({isActive}) => (isActive ? style.active : '') + ` ${style.list}`}>
                <div className={style.option}>
                    <Icon name="heroicons_outline:computer-desktop" shape="outline"/>
                    <p className={style.text}>Administrator</p>
                </div>
                <Icon name="heroicons_outline:chevron-left" shape="outline"/>
            </NavLink>

            <NavLink to="/daftar-ujian" className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name="heroicons_outline:book-open" shape="outline"/>
                <p className={style.text}>Daftar Ujian</p>
            </NavLink>

            <NavLink to="/pengaturan" className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name="heroicons_outline:cog-8-tooth" shape="outline"/>
                <p className={style.text}>Pengaturan Ujian</p>
            </NavLink>

            <NavLink to="/ujian" className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name="heroicons_outline:globe-asia-australia" shape="outline"/>
                <p className={style.text}>Ujian Online</p>
            </NavLink>

            <NavLink to="/hasil" className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name="heroicons_outline:pencil-square" shape="outline"/>
                <p className={style.text}>Hasil Ujian</p>
            </NavLink>

            <NavLink to="/pesanan" className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name="heroicons_outline:shopping-cart" shape="outline"/>
                <p className={style.text}>Pesanan</p>
            </NavLink>

            <NavLink to="/logout" className={({isActive}) => (isActive ? style.active : '') + ` ${style.option}`}>
                <Icon name="heroicons_outline:arrow-left-start-on-rectangle" shape="outline"/>
                <p className={style.text}>Logout</p>
            </NavLink>
        </div>
    )
}