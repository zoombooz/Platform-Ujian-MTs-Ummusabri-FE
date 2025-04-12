export interface ITable <T> {
    title: string;
    data: T[];
    headList: string[];
    keyList: string[];
    selectList?: {[key: string]: {name: string, key: string | number}[]} 
    pagination: IPaginationNew,
    classCustom?: string;
    infoAction?: boolean;
    infoButtonText?: string;
    editAction?: boolean;
    deleteAction?: boolean;
    numberRow?: boolean;
    loading?: boolean;
    showSearch?: boolean;
    showItemPerPage?: boolean;
    customActionButton?: React.ReactNode;
    iconOnActionButton?: boolean;
    onInfoAction?: (data: T) => void;
    onEditAction?: (data: T) => void;
    onDeleteAction?: (data: T) => void;
    onChangePage: (url: string) => void;

    additionalButton?: React.ReactNode;
    isRowDisabled?: (row: T) => boolean;
}

export interface IPaginationNew {
    current_page: number, // Halaman sekarang
    from: number, // Halaman sebelumnya
    last_page: number, // Halaman terakhir berapa
    per_page: number, // Berapa item per halaman
    to: number, // 
    total: number // Berapa total item seluruhnya
    path: string, // url API sekarang
    prev_page_url: string | null, // url API untuk page sebelumnya
    next_page_url: string | null, // url API untuk page selantutnya
    links: {
        url: string | null,
        label: string,
        active: boolean
    }[]
}

export const defaultPaginationValueNew: IPaginationNew = {
    current_page: 1,
    from: 1,
    last_page: 1,
    per_page: 10,
    to: 0,
    total: 0,
    path: '',
    prev_page_url: null,
    next_page_url: null,
    links: []
}

export interface IPagination {
    total_records: number,
    page_size: number,
    current_page: number,
    total_pages: number,
    has_next_page: boolean,
    has_previous_page: boolean
}

export const defaultPaginationValue: IPagination = {
    total_records: 0,
    page_size: 0,
    current_page: 1,
    total_pages: 1,
    has_next_page: false,
    has_previous_page: false
}

export const paginationLimitList: number[] = [10, 20, 30, 40, 50];