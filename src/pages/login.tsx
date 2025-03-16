import React, { useState } from "react"
import { Icon } from "../components/icon";
import axios from "axios";
import { Environment } from "../environment/environment";

interface LoginForm {
    username: string,
    password: string
}

interface RegisterForm extends LoginForm {
    nama: string,
    alamat: string,
}

export function Login() {

    const [page, setPage] = useState<'login' | 'register'>('login');
    const [loginForm, setLoginForm] = useState<LoginForm>({
        username: '',
        password: ''
    });
    const [registerForm, setRegisterForm] = useState<RegisterForm>({
        username: '',
        password: '',
        nama: '',
        alamat: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const endpoints = {
        login: `admin/login`,
        register: `admin/agama`
    }
    
    const changePage = () => {
        setPage(prevPage => {
            if(prevPage === 'login'){
                setLoginForm({username: '', password: ''});
                return 'register';
            }
            setRegisterForm({username: '', password: '', nama: '', alamat: ''});
            return 'login';
        })
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        if(page === 'login'){
            setLoginForm(prevData => ({...prevData, [id]: value}));
        }
        if(page === 'register'){
            setRegisterForm(prevData => ({...prevData, [id]: value}));
        }
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(page === 'login' ? loginForm : registerForm)
        const url = `${Environment.base_url}${page === 'login' ? endpoints['login'] : endpoints['register']}`;

        const response = await axios.get(url);
    }

    const style = {
        input_container: `flex items-center gap-2`,
        input: `px-2 py-1 w-80`,
        button: `transition-all w-40 text-white px-2 py-2 rounded-sm cursor-pointer`,
        text_button: `text-blue-500 hover:text-blue-600 transition-all hover:underline cursor-pointer`
    }

    return (
        <div className="flex w-full h-screen">

            <div className="flex w-1/2 bg-blue-100">
                <img src="src/assets/students.JPG" alt="Students Studying" className="object-cover"/>
            </div>

            <div className="relative flex flex-col justify-center items-center w-1/2 bg-white p-6 text-left gap-10">
                <div className="flex flex-col gap-4 w-[80%]">
                    <h1 className="text-3xl text-gray-600 font-light">CMS Ujian</h1>
                    {page === 'login' 
                    ? <p className="text-gray-400 font-normal">Belum punya akun? <button className={style.text_button} onClick={() => changePage()}>Daftar</button></p>
                    : <p className="text-gray-400 font-normal">Sudah punya akun? <button className={style.text_button} onClick={() => changePage()}>Masuk</button></p>
                    }
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">

                    <div className={style.input_container}>
                        <label htmlFor="username" className="text-sm w-20">Username</label>
                        <div className="flex items-center border border-gray-300 w-fit rounded-md">
                            <div className="flex justify-center items-center p-1 bg-gray-200 h-full w-10">
                                <Icon name="heroicons:user" shape="outline"/>
                            </div>
                            <input 
                                required
                                id="username" 
                                type="text" 
                                placeholder="P1918xxx atau U1918xxx" 
                                className={style.input}
                                value={page === 'login' ? loginForm.username : registerForm.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={style.input_container}>
                        <label htmlFor="password" className="text-sm w-20">Password</label>
                        <div className="flex items-center border border-gray-300 w-fit rounded-md">
                            <div onClick={() => setShowPassword(!showPassword)} className="flex justify-center items-center p-1 bg-gray-200 h-full w-10">
                                <Icon name={`heroicons:eye${showPassword ? '-slash' : ''}`} shape="outline" />
                            </div>
                            <input 
                                required
                                id="password" 
                                type={showPassword ? "text" : "password"}
                                placeholder="Password" 
                                className={style.input}
                                value={page === 'login' ? loginForm.password : registerForm.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {page === 'register' && <>
                        <div className={style.input_container}>
                            <label htmlFor="alamat" className="text-sm w-20">Alamat</label>
                            <div className="flex items-center border border-gray-300 w-fit rounded-md">
                                <div className="flex justify-center items-center p-1 bg-gray-200 h-full w-10">
                                    <Icon name="heroicons:user" shape="outline"/>
                                </div>
                                <input 
                                    required
                                    id="alamat" 
                                    type="text" 
                                    placeholder="P1918xxx atau U1918xxx" 
                                    className={style.input}
                                    value={registerForm.alamat}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={style.input_container}>
                            <label htmlFor="nama" className="text-sm w-20">Nama</label>
                            <div className="flex items-center border border-gray-300 w-fit rounded-md">
                                <div className="flex justify-center items-center p-1 bg-gray-200 h-full w-10">
                                    <Icon name="heroicons:user" shape="outline"/>
                                </div>
                                <input 
                                    required
                                    id="nama" 
                                    type="text" 
                                    placeholder="P1918xxx atau U1918xxx" 
                                    className={style.input}
                                    value={registerForm.nama}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </>}

                    <button className={`bg-blue-500 mt-8 ${style.button}`}>Sign In</button>

                </form>

                <div className="absolute bottom-2 right-4">
                    <p className="text-gray-400">Copyright © Work In Progress </p>
                </div>
            </div>
        </div>
    )

}