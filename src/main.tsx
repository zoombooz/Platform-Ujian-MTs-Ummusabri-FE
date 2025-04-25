import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouteLinks } from './Routes.tsx';

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    //     <RouteLinks></RouteLinks>
    // </StrictMode>
    <RouteLinks></RouteLinks>
)
