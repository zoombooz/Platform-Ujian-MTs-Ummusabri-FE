import { useState } from "react"

interface IForm <T> {
    data?: T,
    title: string,
    headList: string[],
    keyList: string[],
    type: string[],
    hint?: string[],
    selectList?: {
        [key: string]: {key: string, name: string}[]
    }
    classCustom?: string,
    onSubmit: (data: T) => void,
    onCancel: () => void,
}

export function Form<T extends Record<string, any>>({data, title, headList, keyList, type, hint, selectList, classCustom, onSubmit, onCancel}: IForm<T>) {

    const [formData, setFormData] = useState<T>(() => {
        if(!data){
            return keyList.reduce((acc, key) => ({...acc, [key]: ""}), {} as T)
        }
        return keyList.reduce((acc, key) => ({...acc, [key]: data[key]}), {} as T)
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {id, value} = e.target;
        setFormData((prevData) => ({...prevData, [id]: value}))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData)
        console.log("Form: ", formData);
    }

    const style = {
        button: 'transition-all min-w-30 text-white px-2 py-2 rounded-sm cursor-pointer'
    }

    return (
        <div className={`${classCustom} flex flex-col h-full text-black rounded-md`}>
            <div className="h-16 bg-green-600 py-4 px-4 flex rounded-t-md">
                <h1 className="text-white">{title}</h1>
            </div>

            <form className="flex flex-col gap-2 h-full px-4 py-3">
                {keyList.map((item, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <label htmlFor={item}>{headList[index]}</label>

                        {(type[index] === 'select' && selectList && selectList[item]) && (
                            <select id={item} value={formData[item]} onChange={handleChange} className="bg-white border border-black rounded-sm px-2 py-1.5 text-black">
                                <option value="" disabled>Pilih Item</option>
                                {selectList[item].map(item => (
                                    <option key={item.key} value={item.key}>{item.name}</option>
                                ))}
                            </select>
                        )}

                        {type[index] !== 'select' && (
                            <input
                                id={item} 
                                type={type[index]} 
                                value={formData[item]}
                                onChange={handleChange}
                                className="bg-white border border-black rounded-sm px-2 py-1.5 text-black"
                            />
                        )}

                        {hint?.[index] && (
                            <p className="text-sm">{hint[index]}</p>
                        )}
                    </div>
                ))}
            </form>

            <div className="h-16 bg-green-600 rounded-b-md">
                <div className="flex h-full gap-2 py-4 justify-center items-center">
                    <button 
                        type="button"
                        onClick={handleSubmit}
                        className={"bg-blue-400 hover:bg-blue-500 " + style.button}
                    >UPDATE</button>
                    <button 
                        type="button"
                        onClick={onCancel}
                        className={"bg-red-400 hover:bg-red-500 " + style.button}
                    >BATAL</button>
                </div>
            </div>
        </div>
    )

}