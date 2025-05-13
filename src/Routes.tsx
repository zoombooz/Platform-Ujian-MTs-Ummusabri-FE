import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { Login } from "./pages/login";
import { Ujian } from "./pages/ujian";
import { Layout } from "./layout/layout";
import { DashboardPage } from "./pages/dashboard";
import { DaftarKelas } from "./pages/daftar-kelas";
import { KelompokUjian } from "./pages/kelompok-ujian";
import { MataPelajaran } from "./pages/mata-pelajaran";
import { Agama } from "./pages/agama";
import { Peserta } from "./pages/peserta";
import { Jurusan } from "./pages/jurusan";
import { UjianCMS } from "./pages/ujian-cms";
import { UjianLanding } from "./pages/UjianLanding";
import { getTokenPayload, isTokenExpired } from "./utils/jwt";
import { Evaluasi } from "./pages/Evaluasi";
import { HasilUjian } from "./pages/HasilUjian";
import { Guru } from "./pages/Guru";
import { SoalPage2 } from "./pages/SoalPage2";
import { MonitoringPage } from "./pages/Monitoring";
import { Tingkatan } from "./pages/tingkatan";
export function RouteLinks() {

    const ProtectedRoute = () => {
        const isAuthenticated = localStorage.getItem("authToken");

        console.log("Is Expired", isTokenExpired())

        return (isAuthenticated && !isTokenExpired()) ? <Outlet /> : <Navigate to={"/login-admin"} replace />
    }

    const IsStudent = () => {
        const tokenPayload = getTokenPayload();

        return (tokenPayload.nomor_peserta) ? <Outlet /> : <Navigate to={"/"} replace/>
    }

    const IsAdminOrGuru = () => {
        const tokenPayload = getTokenPayload();

        return (!tokenPayload.nomor_peserta) ? <Outlet /> : <Navigate to={"/daftar-ujian"} replace/>
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="login-admin" element={<Login type="login" role="admin" />} />
                <Route path="login-student" element={<Login type="login" role="student" />} />
                
                <Route element={<ProtectedRoute />}>
                    <Route element={<IsStudent />}>
                        <Route path="daftar-ujian" element={<UjianLanding/>} />
                        <Route path="ujian/:ujian_id" element={<Ujian/>} />
                    </Route>

                    <Route element={<IsAdminOrGuru/>}>
                        <Route element={<Layout/>}>
                            <Route path="" element={<DashboardPage/>} />
                            <Route path="monitoring" element={<MonitoringPage/>} />
                            <Route path="admin">
                                    <Route path="daftar-kelas" element={<DaftarKelas />} />
                                    <Route path="kelompok-ujian" element={<KelompokUjian />} />
                                    <Route path="mata-pelajaran" element={<MataPelajaran />} />
                                    <Route path="agama" element={<Agama />} />
                                    <Route path="peserta" element={<Peserta />} />
                                    <Route path="guru" element={<Guru />} />
                                    <Route path="jurusan" element={<Jurusan />} />
                                    <Route path="tingkatan" element={<Tingkatan />} />
                                    <Route path="ujian" element={<UjianCMS />} />
                                    <Route path="evaluasi/:nomor_peserta/" element={<Evaluasi />} />
                                    <Route path="evaluasi/:nomor_peserta/:ujian_id" element={<HasilUjian />} />
                                    <Route path="soal/:ujian_id/:nama_ujian" element={<SoalPage2 />} />

                            </Route>
                        </Route>
                    </Route>

                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )

}