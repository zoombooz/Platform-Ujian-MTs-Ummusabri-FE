import { Icon } from "../components/icon";
import { useLayout } from "../context/LayoutContext"

export function HorizontalLayout() {

    const {toggleExpand} = useLayout();

    return (
        <div className="flex gap-4 px-4 py-2 h-12 w-full bg-green-700 text-white">
            <button onClick={toggleExpand}>
                <Icon name="heroicons:bars-3" shape="outline"/>
            </button>
        </div>
    )

}