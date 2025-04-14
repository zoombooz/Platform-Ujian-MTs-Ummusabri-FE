import { createContext, ReactNode, useContext, useState } from "react";

interface LayoutContextType {
    isExpanded: boolean,
    toggleExpand: () => void,
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({children}: {children: ReactNode}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const toggleExpand = () => {
        setIsExpanded(value => !value);
    }

    return (
        <LayoutContext.Provider value={{isExpanded, toggleExpand}}>
            {children}
        </LayoutContext.Provider>
    )
}

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if(!context){
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
}