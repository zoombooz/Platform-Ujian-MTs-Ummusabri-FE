import { Icon } from "./icon";

export function Card() {

    function onClick() {
        alert('Check')
    }

    return (
        <div className="min-w-60 overflow-hidden rounded-md">
            <div className="relative w-full bg-blue-400 text-end py-4 px-4 text-white font-extralight">
                <div className="absolute">
                    <Icon name='heroicons:chat-bubble-left-right' shape="outline" stroke={1.5} size={'40px'}/>

                </div>
                <p className="text-4xl">84/100</p>
                <p className="text-lg">Jumlah ujian</p>
            </div>

            <div onClick={onClick} className="flex justify-between items-center w-full bg-blue-500 text-white px-2 py-1.5 cursor-pointer">
                <p className="text-xs font-extralight">VIEW MORE</p>
                <Icon name='heroicons:arrow-right-circle' shape='outline' stroke={0.9}/>
            </div>
        </div>
    )

}