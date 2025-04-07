import { createContext, ReactNode, useContext, useState } from "react";

interface IDialogOptions {
    content: ReactNode;
    width?: string;
    height?: string;
    data?: any;
}

interface DialogContextType {
    openDialog: (options: IDialogOptions) => void;
    closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType|undefined>(undefined);

export function DialogProvider({children}: {children: ReactNode}) {

    const [dialogOptions, setDialogOptions] = useState<IDialogOptions|null>(null);

    const openDialog = (options: IDialogOptions) => {
        setDialogOptions(options)
    }

    const closeDialog = () => {
        setDialogOptions(null);
    }

    return (
        <DialogContext.Provider value={{openDialog, closeDialog}}>
            {children}
            {dialogOptions && (
                <div 
                    className="fixed inset-0 w-full h-full flex justify-center items-center bg-dialog-animation"
                    onClick={closeDialog}
                >
                    <div 
                        className="bg-white dialog-animation rounded-md"
                        style={{
                            width: dialogOptions.width || "500px",
                            height: dialogOptions.height || "300px",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {dialogOptions.content}
                    </div>
                </div>
            )}
        </DialogContext.Provider>
    )

}

export const useDialog = () => {
    const context = useContext(DialogContext);
    if(!context){
        throw new Error("useDialog must be used within a LayoutProvider");
    }
    return context;
}