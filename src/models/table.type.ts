export interface ITable <T> {
    title: string;
    data: T[];
    headList: string[];
    keyList: string[];
    pagination: IPagination,
    classCustom?: string;
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