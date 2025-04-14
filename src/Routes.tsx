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
import { SoalPage } from "./pages/SoalPage";
import { UjianLanding } from "./pages/UjianLanding";
import { getTokenPayload, isTokenExpired } from "./utils/jwt";
import { Evaluasi } from "./pages/Evaluasi";

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

    const IsAdmin = () => {
        const tokenPayload = getTokenPayload();

        return (!tokenPayload.nomor_peserta) ? <Outlet /> : <Navigate to={"/daftar-ujian"} replace/>
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="login-admin" element={<Login type="login" role="admin" />} />
                {/* <Route path="register-admin" element={<Login type="register" role="admin" />} /> */}
                <Route path="login-student" element={<Login type="login" role="student" />} />
                
                <Route element={<ProtectedRoute />}>
                    <Route element={<IsStudent />}>
                        <Route path="daftar-ujian" element={<UjianLanding/>} />
                        <Route path="ujian/:ujian_id" element={<Ujian/>} />
                    </Route>

                    <Route element={<IsAdmin/>}>
                        <Route element={<Layout/>}>
                            <Route path="" element={<DashboardPage/>} />
                            <Route path="admin">
                                <Route path="daftar-kelas" element={<DaftarKelas />} />
                                <Route path="kelompok-ujian" element={<KelompokUjian />} />
                                <Route path="mata-pelajaran" element={<MataPelajaran />} />
                                <Route path="agama" element={<Agama />} />
                                <Route path="peserta" element={<Peserta />} />
                                <Route path="jurusan" element={<Jurusan />} />
                                <Route path="ujian" element={<UjianCMS />} />
                                <Route path="evaluasi" element={<Evaluasi />} />
                                <Route path="soal/:ujian_id/:nama_ujian" element={<SoalPage />} />
                            </Route>
                        </Route>
                    </Route>

                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )

}