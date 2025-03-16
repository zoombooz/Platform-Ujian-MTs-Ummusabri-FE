import { Icon } from "../components/icon";
import { ValidationDialog } from "../components/validation-dialog";
import { useDialog } from "../context/DialogContext";
import { useLayout } from "../context/LayoutContext"

export function HorizontalLayout() {

    const {toggleExpand} = useLayout();
    const {openDialog} = useDialog();

    const onOpenDialogValidation = () => {
        openDialog({
            width: '400px',
            height: '200px',
            content: (
                <ValidationDialog 
                    title="Validation Dialog Open"  
                    description="It works, yeah!!!"
                    response={res => console.log(res)}
                />
            )
        })
    }

    const onOpenDialogForm = () => {
        openDialog({
            width: '1200px',
            height: '700px',
            content: (
                <div>Placeholder</div>
            )
        })
    }

    const style = {
        logo: 'w-16 h-16'
    }

    return (
        <div className="flex justify-between gap-4 px-4 py-2 h-12 w-full bg-green-700 text-white">
            <button onClick={toggleExpand}>
                <Icon name="heroicons:bars-3" shape="outline"/>
            </button>

            {/* <button onClick={onOpenDialogValidation} className="cursor-pointer">
                Buka Validation
            </button>

            <button onClick={(onOpenDialogForm)} className="cursor-pointer">
                Buka Form
            </button> */}
            <div className="flex gap-2">
            </div>
        </div>
    )

}