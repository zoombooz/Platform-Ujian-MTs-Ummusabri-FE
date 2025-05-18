import { IPaginationNew } from "../models/table.type";
import { Icon } from "./icon";
import { Pagination } from "./pagination";

export interface ICardList <T> {
    title: string;
    cardTitle: string;
    data: T[];
    headList: string[];
    keyList: string[];
    pagination: IPaginationNew;
    classCustom?: string;
    playAction?: boolean;
    infoAction?: boolean;
    editAction?: boolean;
    deleteAction?: boolean;
    loading?: boolean;
    onPlayAction?: (data: T) => void;
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
    // classCustom,
    infoAction,
    editAction =true,
    deleteAction = true,
    // loading,
    onInfoAction,
    // onEditAction,
    // onDeleteAction,
    isCardDisabled,
    // onChangePage,
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
                    <div id="card" className="p-4 rounded-xl border-2 border-green-600 bg-white shadow-md">
                        <p className="font-semibold text-xl text-green-600 mb-2">{data[cardTitle]}</p>
                        <div className="bg-gray-300 w-full h-1 my-3"></div>
                        <div className="flex flex-col gap-2">
                            {keyList.map((key, index) => {
                                return (
                                    <div>
                                        <p className="font-semibold text-md">{headList[index]}:</p>
                                        <p>{data[key] ? data[key] : '-'}</p>
                                    </div>
                                )
                            })}
                            <div>
                                <p className="font-semibold text-md mb-2">Action</p>
                                <div className="flex gap-2">
                                    {infoAction && (
                                        <button
                                            onClick={() => onInfoAction && onInfoAction(data)}
                                            className={`p-1 rounded-md flex gap-1 ${
                                                isCardDisabled && isCardDisabled(data)
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-green-500 cursor-pointer"
                                            }`}
                                            disabled={isCardDisabled && isCardDisabled(data)}
                                        >
                                            <Icon name="heroicons:play" shape="outline" customClass="text-white" />
                                        </button>
                                    )}
                                    <button className="bg-blue-500 p-1 rounded-md flex gap-1">
                                        <Icon name="heroicons:information-circle" shape="outline" customClass="text-white"/>
                                    </button>
                                    {editAction && (<button className="bg-yellow-500 p-1 rounded-md">
                                        <Icon name="heroicons:pencil-square" shape="outline" customClass="text-white"/>
                                    </button>)}
                                    {deleteAction &&(<button className="bg-red-500 p-1 rounded-md">
                                        <Icon name="heroicons:trash" shape="outline" customClass="text-white"/>
                                    </button>)}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    </>
    )

}