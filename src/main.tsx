import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import App from './App.tsx';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router';
import { Layout } from './layout/layout.tsx';
import { DashboardPage } from './pages/dashboard.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="" element={<DashboardPage/>} />

                    <Route path="ujian" element={
                        <div>
                            <h1>Ujian Works!!!</h1>
                            <Outlet/>
                        </div>
                    }>
                        <Route index element={<h2>Hello world?!?!?!</h2>} />
                        <Route path="siswa" element={<h2>Siswa here?!?!?!</h2>} />
                    </Route>

                    <Route path="about">
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
                        
                    </Route>

                </Route>

            </Routes>
        </BrowserRouter>
    </StrictMode>
)
