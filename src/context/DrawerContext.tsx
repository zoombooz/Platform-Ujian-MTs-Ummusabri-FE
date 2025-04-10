import { createContext, ReactNode, useContext, useRef, useState } from "react";

interface IDrawerContent {
    content: ReactNode
}

interface DrawerContextType {
    openDrawer: (options: any) => void;
    closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

export function DrawerProvider({children}: {children: ReactNode}) {

    const [drawerOptions, setDrawerOptions] = useState<IDrawerContent|null>(null);
    const drawerRef = useRef<HTMLDivElement>(null);
    const mouseDownInside = useRef(false);

    const openDrawer = (options: any) => {
        setDrawerOptions(options);
    }

    const closeDrawer = () => {
        setDrawerOptions(null);
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if(drawerRef.current?.contains(e.target as Node)) {
            mouseDownInside.current = true;
        } else {
            mouseDownInside.current = false;
        }
        console.log(mouseDownInside.current)
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        const mouseUpInside = drawerRef.current?.contains(e.target as Node);
        if (!mouseDownInside.current && !mouseUpInside) {
            closeDrawer();
        }
    }

    return (
        <DrawerContext.Provider value={{openDrawer, closeDrawer}}>
            {children}
            {drawerOptions && (
            <div 
                className="absolute w-full h-full flex bg-dialog-animation overflow-y-hidden"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                <div 
                    ref={drawerRef}
                    className="absolute right-0 w-full md:w-3/4 lg:w-1/2 h-full bg-white rounded-md drawer-animation"
                >
                    {drawerOptions.content}
                </div>
            </div>
            )}
        </DrawerContext.Provider>
    )
}

export function useDrawer() {
    const context = useContext(DrawerContext);
    if(!context) {
        throw new Error("useDialog must be used within a LayoutProvider");
    }
    return context;
}