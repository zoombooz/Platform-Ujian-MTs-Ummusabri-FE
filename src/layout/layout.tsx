import { Outlet } from "react-router";
import { HorizontalLayout } from "./horizontal-layout";
import { VerticalLayout } from "./vertical-layout";

export function Layout() {

    return (
        <div className="h-screen overflow-y-hidden">
            <HorizontalLayout/>
            <div className="flex h-full">
                <VerticalLayout/>
                <Outlet/>
            </div>
        </div>
    )
    
}