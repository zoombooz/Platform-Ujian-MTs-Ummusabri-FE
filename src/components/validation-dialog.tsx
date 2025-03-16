import { useDialog } from "../context/DialogContext";

interface ValidationDialogType {
    title: string;
    description: string;
    response: (response: boolean) => void;
}

export function ValidationDialog({title, description, response}: ValidationDialogType) {

    const {closeDialog} = useDialog();

    const onClickButton = (res: boolean) => {
        response(res);
        closeDialog();
    }

    return (
        <div className="flex flex-col w-full h-full p-4 bg-white rounded-md">
            <h1 className="h-[25%] text-3xl text-orange-500">{title}</h1>
            <p className="h-[50%] text-black text-lg">{description}</p>
            <div className="h-[25%] flex gap-2 justify-end">
                <button onClick={() => onClickButton(false)} className="text-red-500 hover:bg-red-500 hover:text-white px-3 rounded-md transition duration-300">Cancel</button>
                <button onClick={() => onClickButton(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 rounded-md transition duration-300">Confirm</button>
            </div>
        </div>
    )

}