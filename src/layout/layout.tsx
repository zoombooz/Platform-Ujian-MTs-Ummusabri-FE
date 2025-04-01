import { Outlet } from "react-router";
import { HorizontalLayout } from "./horizontal-layout";
import { VerticalLayout } from "./vertical-layout";
import { Footer } from "./footer";
import { Breadcrump } from "../components/breadcrump";
import { LayoutProvider } from "../context/LayoutContext";
import { DialogProvider } from "../context/DialogContext";

export function Layout() {

    return (
        <DialogProvider>
            <LayoutProvider>
                <div className="relative h-screen flex flex-col">
                    <HorizontalLayout/>
                    <div className="flex h-full overflow-y-hidden">
                        <VerticalLayout/>
                        <div className="relative flex flex-col w-full h-full overflow-y-auto">
                            <Breadcrump />
                            <Outlet/>
                            <Footer/>
                        </div>
                    </div>
                </div>
            </LayoutProvider>
        </DialogProvider>
    )
    
}