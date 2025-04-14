import { IPaginationNew } from "../models/table.type";
import { Pagination } from "./pagination";

export interface ICardList <T> {
    title: string;
    cardTitle: string;
    data: T[];
    headList: string[];
    keyList: string[];
    pagination: IPaginationNew;
    classCustom?: string;
    infoAction?: boolean;
    editAction?: boolean;
    deleteAction?: boolean;
    loading?: boolean;
    onInfoAction?: (data: T) => void;
    onEditAction?: (data: T) => void;
    onDeleteAction?: (data: T) => void;
    isCardDisabled?: (data: T) => boolean;
    onChangePage: (url: string) => void;
}

export function CardList<T extends Record<string, any>>({
    title,
    cardTitle,
    data,
    headList,
    keyList,
    pagination,
    classCustom,
    infoAction,
    editAction,
    deleteAction,
    loading,
    onInfoAction,
    onEditAction,
    onDeleteAction,
    isCardDisabled,
    onChangePage,
}: ICardList<T>) {

    return (
    <>
        <div id="header" className="flex justify-between items-center mb-4">
            <p className="text-xl font-semibold">{title}</p>
            <Pagination 
                pagination={pagination} 
                onChangePage={() => {}}
            />
        </div>
        <div id="card-list" className="flex flex-col gap-4 overflow-y-auto h-full">
            {data.map((data) => {
                return (
                    <div id="card" className="p-4 rounded-xl border-2 border-green-600 shadow-md">
                        <p className="font-semibold text-xl text-green-600 mb-2">{data[cardTitle]}</p>
                        <div className="bg-gray-300 w-full h-1 my-3"></div>
                        <div className="flex flex-col gap-2">
                            {keyList.map((key, index) => {
                                return (
                                    <div className="">
                                        <p className="font-semibold text-md">{headList[index]}:</p>
                                        <p>{data[key] ? data[key] : '-'}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    </>
    )

}