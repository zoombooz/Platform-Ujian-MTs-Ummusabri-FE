import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { Login } from "./pages/login";
import { Ujian } from "./pages/ujian";
import { Layout } from "./layout/layout";
import { DashboardPage } from "./pages/dashboard";
import { Identitas } from "./pages/identitas";
import { DaftarKelas } from "./pages/daftar-kelas";
import { BiodataSiswa } from "./pages/biodata-siswa";
import { DataGuru } from "./pages/data-guru";
import { DataPanitia } from "./pages/data-panitia";
import { KelompokUjian } from "./pages/kelompok-ujian";
import { MataPelajaran } from "./pages/mata-pelajaran";
import { Agama } from "./pages/agama";
import { Peserta } from "./pages/peserta";
import { Jurusan } from "./pages/jurusan";
import { UjianCMS } from "./pages/ujian-cms";
import { SoalPage } from "./pages/SoalPage";
import { UjianLanding } from "./pages/UjianLanding";
import { isTokenExpired } from "./utils/jwt";

export function RouteLinks() {

    const ProtectedRoute = () => {
        const isAuthenticated = localStorage.getItem("authToken");

        return (isAuthenticated && !isTokenExpired()) ? <Outlet /> : <Navigate to={"/login-admin"} replace />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="login-admin" element={<Login type="login" role="admin" />} />
                <Route path="register-admin" element={<Login type="register" role="admin" />} />
                <Route path="login-student" element={<Login type="login" role="student" />} />
                
                <Route element={<ProtectedRoute />}>
                    <Route path="ujian" element={<UjianLanding/>} />

                    <Route element={<Layout/>}>
                        <Route path="" element={<DashboardPage/>} />
                        <Route path="admin">
                            <Route path="identitas" element={<Identitas />} />
                            <Route path="daftar-kelas" element={<DaftarKelas />} />
                            <Route path="biodata-siswa" element={<BiodataSiswa />} />
                            <Route path="data-guru" element={<DataGuru />} />
                            <Route path="data-panitia" element={<DataPanitia />} />
                            <Route path="kelompok-ujian" element={<KelompokUjian />} />
                            <Route path="mata-pelajaran" element={<MataPelajaran />} />
                            <Route path="agama" element={<Agama />} />
                            <Route path="peserta" element={<Peserta />} />
                            <Route path="jurusan" element={<Jurusan />} />
                            <Route path="ujian" element={<UjianCMS />} />
                            <Route path="soal/:ujian_id" element={<SoalPage />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )

}