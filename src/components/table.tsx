import { JSX, useEffect } from "react";
import { ITable, paginationLimitList } from "../models/table.type";
import { Pagination } from "./pagination";
import { Loader } from "./loader";
import { Icon } from "./icon";

export function Table<T extends Record<string, any>>({title, data, headList, keyList, selectList, pagination, classCustom, infoAction = false, infoButtonText, editAction = false, deleteAction = false, numberRow = true, loading, onInfoAction, onEditAction, onDeleteAction, additionalButton, onChangePage, customActionButton, showSearch = false, showItemPerPage = false}: ITable<T>) {
    
    const style = {
        head_column: `px-6 py-3 text-md text-start`,
    }

    useEffect(() => {
        console.log("Checking dulu: ", selectList)
    }, [])

    const actionExist = (): boolean => {
        if(customActionButton){
            return true;
        }
        return infoAction || editAction || deleteAction;
    }

    const Action = ({data}: {data: T}): JSX.Element => {
        if(actionExist()) {
            return (
                <td className="flex gap-1 items-center py-2">
                    {infoAction && (
                        <button onClick={() => onInfoAction && onInfoAction(data)} className="flex gap-2 bg-green-500 py-1.5 px-2 rounded-md text-white cursor-pointer min-w-16">
                            <Icon name="heroicons:information-circle" shape="outline"/>
                            <p className="font-semibold">{infoButtonText ? infoButtonText : 'Info'}</p>
                        </button>
                    )}
                    {editAction && (
                        <button onClick={() => onEditAction && onEditAction(data)} className="flex gap-2 bg-yellow-500 py-1.5 px-2 rounded-md text-white cursor-pointer min-w-16">
                            <Icon name="heroicons:pencil-square" shape="outline"/>
                            <p className="font-semibold">Edit</p>
                        </button>
                    )}
                    {deleteAction && (
                        <button onClick={() => onDeleteAction && onDeleteAction(data)} className="flex gap-2 bg-red-500 py-1.5 px-2 rounded-md text-white cursor-pointer min-w-16">
                            <Icon name="heroicons:trash" shape="outline"/>
                            <p className="font-semibold">Delete</p>
                        </button>
                    )}
                    {customActionButton}
                </td>
            )
        }
        return (<></>)
    }

    if(!data.length && loading !== undefined && !loading) {
        return (
            <div className={`relative flex flex-col overflow-x-auto ${classCustom}`}>
                <div className="flex justify-between">
                    <h1 className="text-xl mb-4">{title}</h1>

                    {additionalButton}
                </div>
                <div>
                    No data availables
                </div>
            </div>
        )
    }

    return (
        <div className={`relative flex flex-col overflow-x-auto ${classCustom}`}>
            <div className="flex justify-between">
                <h1 className="text-2xl mb-4 font-bold text-gray-600">{title}</h1>

                {additionalButton}
            </div>

            <div className="flex justify-between w-full mb-4">
                {showSearch &&
                <div className="w-[40%]">
                    <p className="mb-2">Search your items</p>
                    <input type="text" placeholder="Enter keywords here..." className="w-full border border-gray-500 rounded-md px-2 py-1.5" />
                </div>
                }
                {showItemPerPage &&
                <div className="w-fit">
                    <p className="mb-2">Showing items</p>
                    <select className="w-full border border-gray-500 rounded-lg px-2 py-1.5">
                        {paginationLimitList.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
                </div>
                }
            </div>

            {loading
            ? <div className="flex w-full h-80 justify-center items-center"><Loader/></div>
            : <>
                <table className="w-full rounded-lg overflow-hidden shadow-md">
                    <thead className="text-xs bg-slate-700 text-white">
                        <tr>
                            {numberRow && (
                                <th scope="col" className={style.head_column}>
                                    No.
                                </th>
                            )}
                            {headList.map((item, index) => {
                                return (
                                    <th key={index} scope="col" className={style.head_column}>
                                        {item}
                                    </th>
                                )
                            })}
                            {actionExist() && (
                                <th scope="col" className={style.head_column}>
                                    Action
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((data: T, rowIndex) => {
                            return (
                                <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-200`}>
                                    {numberRow && (
                                        <td className="px-6 py-4">
                                            {rowIndex + 1}    
                                        </td>
                                    )}
                                    {keyList.map((key) => {
                                        if(selectList && selectList[key] && data){
                                        const selectedData = selectList[key]?.find((el) => el.key === data[key]);
                                        return (
                                            <td key={String(key)} className="px-6 py-4">
                                                {selectedData ? selectedData.name : data[key]}
                                            </td>
                                        )
                                        }
                                        return (
                                            <td key={String(key)} className="px-6 py-4">
                                                {data[key]}    
                                            </td>
                                        )
                                    })}
                                    <Action data={data}/>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <Pagination pagination={pagination} customClass="mt-4" onChangePage={onChangePage}/>
            </>
            }

        </div>

    )
}