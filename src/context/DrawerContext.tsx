import { createContext, ReactNode, useContext, useState } from "react";

interface IDrawerContent {
    content: ReactNode
}

interface DrawerContextType {
    openDrawer: (options: any) => void;
    closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

export function DrawerProvider() {

    const [drawerOptions, setDrawerOptions] = useState<IDrawerContent|null>(null);

    const openDrawer = (options: any) => {

    }

    const closeDrawer = () => {

    }

    return (
        <DrawerContext.Provider value={{openDrawer, closeDrawer}}>

        </DrawerContext.Provider>
    )

}