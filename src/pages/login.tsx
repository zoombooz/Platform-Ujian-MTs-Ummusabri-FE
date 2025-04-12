import React, { useState } from "react"
import { Icon } from "../components/icon";
import axios from "axios";
import { Environment } from "../environment/environment";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

interface LoginForm {
    username: string,
    password: string
}

interface RegisterForm extends LoginForm {
    nama: string,
    alamat: string,
}

interface LoginSiswaForm {
    nomor_peserta: string,
    password: string
}

export function Login({type, role}: {type: 'login' | 'register', role: 'admin' | 'student'}) {

    const navigate = useNavigate();

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
    const [loginSiswaForm, setLoginSiswaForm] = useState<LoginSiswaForm>({
        password: '',
        nomor_peserta: ''
    })
    const [showPassword, setShowPassword] = useState(false);

    const getTitle = (): string => {
        if(type === 'login' && role === 'admin'){
            return "Log In Admin"
        }else if(type === 'login' && role === 'student'){
            return "Log In Student"
        }else if(type === 'register' && role === 'admin'){
            return "Register"
        }else {
            return ""
        }
    }

    const endpoints = {
        login_admin: `admin/login`,
        register_admin: `admin/register`,
        login_student: `siswa/login`,
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        if(type === 'login' && role === 'admin'){
            setLoginForm(prevData => ({...prevData, [id]: value}));
        }
        if(type === 'login' && role === 'student'){
            setLoginSiswaForm(prevData => ({...prevData, [id]: value}))
        }
        if(type === 'register'){
            setRegisterForm(prevData => ({...prevData, [id]: value}));
        }
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const body = type === 'login' ? role === 'admin' ? loginForm : loginSiswaForm : registerForm;
        console.log(body)
        const endpoint = type === 'login' ? role === 'admin' ? endpoints['login_admin'] : endpoints['login_student'] : endpoints['register_admin'];
        const url = `${Environment.base_url}${endpoint}`;

        axios.post(url, body)
        .then(res => {
            if(type === 'register'){
                Swal.fire({
                    title: "Account Created!",
                    text: "Please login to enter!",
                    icon: "success"
                }).then(() => {
                    navigate('/login-admin');
                });
            }else {
                const token = res.data.token;
                console.log("Token: ", res)
                if(!res.data['guru']){
                    console.log("Peserta")
                    localStorage.setItem("authToken", token);
                    navigate("/daftar-ujian")
                }else {
                    console.log("Guru")
                    localStorage.setItem("authToken", token);
                    navigate("/");
                }
            }
        }).catch(err => {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.response.data.error,
            });
        })


    }

    const style = {
        input_container: `flex flex-col gap-2`,
        input: `px-2 py-1 w-80`,
        button: `transition-all w-40 text-white px-2 py-2 rounded-sm cursor-pointer`,
        text_button: `text-blue-500 hover:text-blue-600 transition-all hover:underline cursor-pointer`
    }

    return (
        <div className="flex w-full h-screen">

            <div className="relative flex justify-center items-center w-full bg-blue-100">
                <img src="src/assets/students.JPG" alt="Students Studying" className="absolute w-full h-full object-fill"/>

                <div className="relative flex flex-col justify-center items-center p-6 bg-gray-100 text-left gap-6 rounded-md">


                    <div id="header" className="flex flex-col gap-4 w-full">
                        <h1 className="text-3xl text-gray-600 font-light">{getTitle()}</h1>
                        {/* {(type === 'login' && role === 'admin') && (
                            <p className="text-gray-400 font-normal">Belum punya akun? <Link to="/register-admin" className={style.text_button}>Daftar</Link></p>
                        )}

                        {(type === 'register' && role === 'admin') && (
                            <p className="text-gray-400 font-normal">Sudah punya akun? <Link to="/login-admin" className={style.text_button}>Masuk</Link></p>
                        )}  */}
                        
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">

                        {(type === 'login' && role === 'student') &&
                            <div className={style.input_container}>
                                <label htmlFor="nomor_peserta" className="text-sm">Nomor Peserta</label>
                                <div className="flex items-center border border-gray-300 w-fit rounded-md">
                                    <div className="flex justify-center items-center p-1 bg-gray-200 h-full w-10">
                                        <Icon name="heroicons:user" shape="outline"/>
                                    </div>
                                    <input 
                                        required
                                        id="nomor_peserta" 
                                        type="text" 
                                        placeholder="P1918xxx atau U1918xxx" 
                                        className={style.input}
                                        value={loginSiswaForm.nomor_peserta}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        }

                        {(role === 'admin') && 
                            <div className={style.input_container}>
                                <label htmlFor="username" className="text-sm">Username</label>
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
                                        value={type === 'login' ? role === 'admin' ? loginForm.username : '' : registerForm.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        }

                        

                        <div className={style.input_container}>
                            <label htmlFor="password" className="text-sm">Password</label>
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
                                    value={type === 'login' ? role === 'admin' ? loginForm.password : loginSiswaForm.password : registerForm.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {type === 'register' && <>
                            <div className={style.input_container}>
                                <label htmlFor="alamat" className="text-sm">Alamat</label>
                                <div className="flex items-center border border-gray-300 w-fit rounded-md">
                                    <div className="flex justify-center items-center p-1 bg-gray-200 h-full w-10">
                                        <Icon name="heroicons:user" shape="outline"/>
                                    </div>
                                    <input 
                                        required
                                        id="alamat" 
                                        type="text" 
                                        placeholder="Alamat" 
                                        className={style.input}
                                        value={registerForm.alamat}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={style.input_container}>
                                <label htmlFor="nama" className="text-sm">Nama Lengkap</label>
                                <div className="flex items-center border border-gray-300 w-fit rounded-md">
                                    <div className="flex justify-center items-center p-1 bg-gray-200 h-full w-10">
                                        <Icon name="heroicons:user" shape="outline"/>
                                    </div>
                                    <input 
                                        required
                                        id="nama" 
                                        type="text" 
                                        placeholder="Nama lengkap" 
                                        className={style.input}
                                        value={registerForm.nama}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </>}

                        <button className={`bg-blue-500 mt-8 ${style.button}`}>{type === 'login' ? 'Sign In' : 'Sign Up'}</button>

                    </form>
                    {role === 'student'
                    ? <Link to="/login-admin" className="text-blue-500 hover:text-blue-600 hover:underline">Masuk sebagai admin</Link>
                    : <Link to="/login-student" className="text-blue-500 hover:text-blue-600 hover:underline">Masuk sebagai murid</Link>
                    }
                    
                </div>
            </div>

            
        </div>
    )

}