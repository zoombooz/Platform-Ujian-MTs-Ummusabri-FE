import React, { useState } from "react"
import { Icon } from "../components/icon";

export function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const style = {
        input_container: `flex items-center gap-2`,
        input: `px-2 py-1 w-80`,
        button: `transition-all w-40 text-white px-2 py-2 rounded-sm cursor-pointer`,
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log({
            username,
            password
        })
    }

    return (
        <div className="flex w-full h-screen">

            <div className="flex justify-center items-center w-1/2 bg-blue-100">
                Insert image here later
            </div>

            <div className="relative flex flex-col justify-center items-center w-1/2 bg-white p-6 text-left gap-10">
                <div className="flex flex-col gap-4 w-[80%]">
                    <h1 className="text-3xl text-gray-600 font-light">Nama Aplikasi</h1>
                    <p className="text-gray-400 font-normal">Silahkan masukkan username dan password anda untuk menggunakan aplikasi ini.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">

                    <div className={style.input_container}>
                        <label htmlFor="username" className="text-sm w-20">Username</label>
                        <div className="flex items-center border border-gray-300 w-fit rounded-md">
                            <div className="flex justify-center items-center p-1 bg-gray-200 h-full w-10">
                                <Icon name="heroicons:user" shape="outline"/>
                            </div>
                            <input 
                                id="username" 
                                type="text" 
                                placeholder="P1918xxx atau U1918xxx" 
                                className={style.input}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                                id="password" 
                                type={showPassword ? "text" : "password"}
                                placeholder="Password" 
                                className={style.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className={`bg-blue-500 mt-8 ${style.button}`}>Sign In</button>

                </form>

                <div className="absolute bottom-2 right-4">
                    <p className="text-gray-400">Copyright © Work In Progress </p>
                </div>
            </div>
        </div>
    )

}