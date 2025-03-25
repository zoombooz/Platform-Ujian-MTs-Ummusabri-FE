import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router';
import { Layout } from './layout/layout.tsx';
import { DashboardPage } from './pages/dashboard.tsx';
import { Identitas } from './pages/identitas.tsx';
import { DaftarKelas } from './pages/daftar-kelas.tsx';
import { BiodataSiswa } from './pages/biodata-siswa.tsx';
import { DataGuru } from './pages/data-guru.tsx';
import { DataPanitia } from './pages/data-panitia.tsx';
import { KelompokUjian } from './pages/kelompok-ujian.tsx';
import { MataPelajaran } from './pages/mata-pelajaran.tsx';
import { Login } from './pages/login.tsx';
import { Ujian } from './pages/ujian.tsx';
import { Agama } from './pages/agama.tsx';
import { Peserta } from './pages/peserta.tsx';
import { Jurusan } from './pages/jurusan.tsx';
import { UjianCMS } from './pages/ujian-cms.tsx';
import { SoalPage } from './pages/SoalPage.tsx';

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem("authToken");

    return isAuthenticated ? <Outlet /> : <Navigate to={"/login-admin"} replace />
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="login-admin" element={<Login type="login" role="admin" />} />
                <Route path="register-admin" element={<Login type="register" role="admin" />} />
                <Route path="login-student" element={<Login type="login" role="student" />} />
                
                <Route element={<ProtectedRoute />}>
                    <Route path="ujian" element={<Ujian/>} />

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
                        <Route path="daftar-ujian" element={
                            <div>
                                <h1>Daftar Ujian Works!!!</h1>
                                <Outlet/>
                            </div>
                        }>
                            <Route index element={<h2>Hello world?!?!?!</h2>} />
                            <Route path="siswa" element={<h2>Siswa here?!?!?!</h2>} />
                        </Route>
                        <Route path="pengaturan" element={
                            <div>
                                <h1>Pengaturan Works!!!</h1>
                                <Outlet/>
                            </div>
                        }>
                            <Route index element={<h2>Hello world?!?!?!</h2>} />
                            <Route path="siswa" element={<h2>Siswa here?!?!?!</h2>} />
                        </Route>

                        <Route path="ujian-online" element={
                            <div>
                                <h1>Ujian Works!!!</h1>
                                <Outlet/>
                            </div>
                        }>
                            <Route index element={<h2>Hello world?!?!?!</h2>} />
                            <Route path="siswa" element={<h2>Siswa here?!?!?!</h2>} />
                            <Route path="kontrol" element={<h2>Ujian Online - Kontrol Ujian</h2>} />
                            <Route path="perangkat" element={<h2>Ujian Online - Kelola Perangkat</h2>} />
                            <Route path="status-peserta" element={<h2>Ujian Online - Status Peserta</h2>} />
                        </Route>
                        <Route path="hasil" element={
                            <div>
                                <h1>Hasil Works!!!</h1>
                                <Outlet/>
                            </div>
                        }>
                            <Route index element={<h2>Hello world?!?!?!</h2>} />
                            <Route path="siswa" element={<h2>Siswa here?!?!?!</h2>} />
                        </Route>
                        <Route path="pesanan" element={
                            <div>
                                <h1>Pesanan Works!!!</h1>
                                <Outlet/>
                            </div>
                        }>
                            <Route index element={<h2>Hello world?!?!?!</h2>} />
                            <Route path="siswa" element={<h2>Siswa here?!?!?!</h2>} />
                        </Route>

                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" />} />

                

            </Routes>
        </BrowserRouter>
    </StrictMode>
)
