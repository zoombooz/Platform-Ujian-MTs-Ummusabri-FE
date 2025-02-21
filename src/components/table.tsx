import { JSX } from "react";
import { ITable, paginationLimitList } from "../models/table.type";
import { Pagination } from "./pagination";

export function Table<T extends Record<string, any>>({title, data, headList, keyList, pagination, classCustom, infoAction = false, editAction = false, deleteAction = false, numberRow = true, onInfoAction, onEditAction, onDeleteAction}: ITable<T>) {

    const actionExist = (): boolean => {
        return infoAction || editAction || deleteAction;
    }

    const Action = ({data}: {data: T}): JSX.Element => {
        if(actionExist()) {
            return (
                <div className="flex gap-2 justify-center items-center">
                    {infoAction && (
                        <button onClick={() => onInfoAction && onInfoAction(data)} className="bg-green-500 py-1.5 px-2 rounded-md text-white cursor-pointer">
                            Info
                        </button>
                    )}
                    {editAction && (
                        <button onClick={() => onEditAction && onEditAction(data)} className="bg-yellow-500 py-1.5 px-2 rounded-md text-white cursor-pointer">
                            Edit
                        </button>
                    )}
                    {deleteAction && (
                        <button onClick={() => onDeleteAction && onDeleteAction(data)} className="bg-red-500 py-1.5 px-2 rounded-md text-white cursor-pointer">
                            Delete
                        </button>
                    )}
                </div>
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
            <h1 className="text-xl mb-4">{title}</h1>
            <div className="flex justify-between mb-2">
                <input type="text" placeholder="Search..." className="border border-gray-500 rounded-lg px-2 py-1.5" />
                <select className="border border-gray-500 rounded-lg px-2 py-1.5">
                    {paginationLimitList.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                </select>
            </div>
            <table className="w-full border border-gray-200">
                <thead className="text-xs bg-gray-200">
                    <tr>
                        {numberRow && (
                            <th scope="col" className="px-6 py-3 border-r-2 border-gray-300">
                                No.
                            </th>
                        )}
                        {headList.map((item, index) => {
                            return (
                                <th key={index} scope="col" className="px-6 py-3 border-r-2 border-gray-300">
                                    {item}
                                </th>
                            )
                        })}
                        {actionExist() && (
                            <th scope="col" className="px-6 py-3 border-r-2 border-gray-300">
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
                                {keyList.map((key, index) => {
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