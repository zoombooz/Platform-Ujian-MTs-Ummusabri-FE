import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router';
import { Layout } from './layout/layout.tsx';
import { DashboardPage } from './pages/dashboard.tsx';
import { Identitas } from './pages/identitas.tsx';
import { DaftarKelas } from './pages/daftar-kelas.tsx';
import { BiodataSiswa } from './pages/biodata-siswa.tsx';
import { DataGuru } from './pages/data-guru.tsx';
import { DataPanitia } from './pages/data-panitia.tsx';
import { KelompokUjian } from './pages/kelompok-ujian.tsx';
import { MataPelajaran } from './pages/mata-pelajaran.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
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

                    <Route path="ujian" element={
                        <div>
                            <h1>Ujian Works!!!</h1>
                            <Outlet/>
                        </div>
                    }>
                        <Route index element={<h2>Hello world?!?!?!</h2>} />
                        <Route path="siswa" element={<h2>Siswa here?!?!?!</h2>} />
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

                    {/* <Route path="about">
                        <Route  index element={
                            <div>
                                <h1>About works!!!</h1>
                            </div>
                        }/>
                        <Route element={
                            <div>
                                <h1>nested child</h1>
                                <Outlet/>
                            </div>
                        }>
                            <Route path=":idk" element={<h1>Hello idk what to say</h1>}></Route>
                        </Route>
                        
                    </Route> */}

                </Route>

            </Routes>
        </BrowserRouter>
    </StrictMode>
)
