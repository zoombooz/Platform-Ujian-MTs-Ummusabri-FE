import { IPagination, IPaginationNew } from "../models/table.type";
import { Icon } from "./icon";

interface IPaginationComponent {
    pagination: IPaginationNew,
    customClass?: string,
    onChangePage: (url: string) => void,
}

export function Pagination({pagination, customClass, onChangePage}: IPaginationComponent) {

    const style = {
        pagination: `inline-flex size-8 items-center justify-center rounded border border-gray-400/100 bg-white`,
        pagination_disabled: `border-gray-300/100`,
        pagination_hover: `hover:bg-gray-300`,
        arrow_disabled: `text-gray-300`
    }

    const changePage = (url: string | null) => {
        if(!url){
            return;
        }
        onChangePage(url);
    }

    if(!pagination){
        return (
            <></>
        )
    }

    return (
        <div className={`inline-flex items-center justify-center gap-3 ${customClass}`}>
            <button
                className={`${style.pagination} ${!pagination.prev_page_url ? style.pagination_disabled : style.pagination_hover}`}
                disabled={!pagination.prev_page_url}
                onClick={() => changePage(pagination.prev_page_url)}
            >
                <Icon 
                    name="heroicons:chevron-left" 
                    shape="outline" 
                    customClass={`${!pagination.prev_page_url ? style.arrow_disabled : ''}`}
                />
            </button>

            <p className="text-xs">
                {pagination.current_page}
                <span className="mx-0.25">/</span>
                {pagination.last_page}
            </p>

            <button
                className={`${style.pagination} ${!pagination.next_page_url ? style.pagination_disabled : style.pagination_hover}`}
                disabled={!pagination.next_page_url}
                onClick={() => changePage(pagination.next_page_url)}
            >
                <Icon 
                    name="heroicons:chevron-right" 
                    shape="outline" 
                    customClass={`${!pagination.next_page_url ? style.arrow_disabled : ''}`}
                />
            </button>
        </div>
    )

}