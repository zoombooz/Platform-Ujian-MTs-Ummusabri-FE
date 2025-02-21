import { ITable } from "../models/table.type";
import { Pagination } from "./pagination";

export function Table<T extends Record<string, any>>({title, data, headList, keyList, pagination, classCustom}: ITable<T>) {

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
            <table className="w-full text-sm text-left text-gray-500 border-2 border-gray-300">
                <thead className="text-xs text-gray-700 bg-gray-200">
                    <tr>
                        <th scope="col" className="px-6 py-3 border-r-2 border-gray-300">
                            No.
                        </th>
                        {headList.map((item, index) => {
                            return (
                                <th key={index} scope="col" className="px-6 py-3 border-r-2 border-gray-300">
                                    {item}
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => {
                        return (
                            <tr key={rowIndex} className="bg-white border-b border-gray-200">
                                <td className="px-6 py-4 border-r-2 border-gray-300">
                                    {rowIndex + 1}    
                                </td>
                                {keyList.map((key, index) => {
                                    if(index === 0){
                                        return (
                                            <th key={String(key)} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border-r-2 border-gray-300">
                                                {row[key]}
                                            </th>
                                        )
                                    }else {
                                        return (
                                            <td key={String(key)} className="px-6 py-4 border-r-2 border-gray-300">
                                                {row[key]}    
                                            </td>
                                        )
                                    }
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Pagination pagination={pagination} customClass="mt-4"/>
        </div>

    )
}