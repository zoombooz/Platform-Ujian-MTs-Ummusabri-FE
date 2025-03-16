import { JSX } from "react";
import { ITable, paginationLimitList } from "../models/table.type";
import { Pagination } from "./pagination";
import { Icon } from "./icon";

export function Table<T extends Record<string, any>>({title, data, headList, keyList, pagination, classCustom, infoAction = false, editAction = false, deleteAction = false, numberRow = true, onInfoAction, onEditAction, onDeleteAction, additionalButton}: ITable<T>) {
    
    const style = {
        head_column: `px-6 py-3 border border-gray-300 text-md`,
    }

    const actionExist = (): boolean => {
        return infoAction || editAction || deleteAction;
    }

    const Action = ({data}: {data: T}): JSX.Element => {
        if(actionExist()) {
            return (
                <td className="flex gap-1 justify-center items-center py-2">
                    {infoAction && (
                        <button onClick={() => onInfoAction && onInfoAction(data)} className="bg-green-500 py-1.5 px-2 rounded-md text-white cursor-pointer w-16">
                            <p>Info</p>
                        </button>
                    )}
                    {editAction && (
                        <button onClick={() => onEditAction && onEditAction(data)} className="bg-yellow-500 py-1.5 px-2 rounded-md text-white cursor-pointer w-16">
                            <p>Edit</p>
                        </button>
                    )}
                    {deleteAction && (
                        <button onClick={() => onDeleteAction && onDeleteAction(data)} className="bg-red-500 py-1.5 px-2 rounded-md text-white cursor-pointer w-16">
                            <p>Delete</p>
                        </button>
                    )}
                </td>
            )
        }
        return (<></>)
    }

    if(!data.length) {
        return (
            <div>
                No data availables
            </div>
        )
    }

    return (
        <div className={`relative flex flex-col overflow-x-auto ${classCustom}`}>
            <div className="flex justify-between">
                <h1 className="text-xl mb-4">{title}</h1>

                {additionalButton}
            </div>

            <div className="flex justify-between w-full mb-4">
                <div className="w-[40%]">
                    <p className="mb-2">Search your items</p>
                    <input type="text" placeholder="Enter keywords here..." className="w-full border border-gray-500 rounded-md px-2 py-1.5" />
                </div>
                <div className="w-fit">
                    <p className="mb-2">Showing items</p>
                    <select className="w-full border border-gray-500 rounded-lg px-2 py-1.5">
                        {paginationLimitList.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="w-full border border-gray-200">
                <thead className="text-xs bg-gray-100">
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
                    {data.map((row: T, rowIndex) => {
                        return (
                            <tr key={rowIndex} className="bg-white border-b border-gray-200 hover:bg-gray-100">
                                {numberRow && (
                                    <td className="px-6 py-4 border-r border-gray-300">
                                        {rowIndex + 1}    
                                    </td>
                                )}
                                {keyList.map((key) => {
                                    return (
                                        <td key={String(key)} className="px-6 py-4 border-r border-gray-300">
                                            {row[key]}    
                                        </td>
                                    )
                                })}
                                <Action data={row}/>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <Pagination pagination={pagination} customClass="mt-4"/>

        </div>

    )
}