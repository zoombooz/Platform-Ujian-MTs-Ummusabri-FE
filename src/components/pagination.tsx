import { IPagination } from "../models/table.type";
import { Icon } from "./icon";

export function Pagination({pagination, customClass}: {pagination: IPagination, customClass?: string}) {

    const style = {
        pagination: `inline-flex size-8 items-center justify-center rounded border border-gray-400/100 bg-white`,
        pagination_disabled: `border-gray-300/100`,
        pagination_hover: `hover:bg-gray-300`,
        arrow_disabled: `text-gray-300`
    }

    const check = () => {
        alert("Check dulu")
    }

    if(!pagination){
        return (
            <></>
        )
    }

    return (
        <div className={`inline-flex items-center justify-center gap-3 ${customClass}`}>
            <button
                className={`${style.pagination} ${!pagination.has_previous_page ? style.pagination_disabled : style.pagination_hover}`}
                disabled={!pagination.has_previous_page}
                onClick={() => {check()}}
            >
                <Icon 
                    name="heroicons:chevron-left" 
                    shape="outline" 
                    customClass={`${!pagination.has_previous_page ? style.arrow_disabled : ''}`}
                />
            </button>

            <p className="text-xs">
                {pagination.current_page}
                <span className="mx-0.25">/</span>
                {pagination.total_pages}
            </p>

            <button
                className={`${style.pagination} ${!pagination.has_next_page ? style.pagination_disabled : style.pagination_hover}`}
                disabled={!pagination.has_next_page}
                onClick={() => {check()}}
            >
                <Icon 
                    name="heroicons:chevron-right" 
                    shape="outline" 
                    customClass={`${!pagination.has_next_page ? style.arrow_disabled : ''}`}
                />
            </button>
        </div>
    )

}