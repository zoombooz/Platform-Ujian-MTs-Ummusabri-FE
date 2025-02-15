import { Icon } from "./icon";

export function Card() {

    return (
        <div className="min-w-60 overflow-hidden rounded-md">
            <div className={`relative w-full text-end py-4 px-4 text-white font-extralight bg-blue-400`}>
                <div className="absolute">
                    <Icon name='heroicons:chat-bubble-left-right' shape="outline" stroke={1.5} size={'40px'}/>

                </div>
                <p className="text-4xl">84/100</p>
                <p className="text-lg">Jumlah ujian</p>
            </div>

            <div className={`flex justify-between items-center w-full text-white px-2 py-1.5 cursor-pointer bg-blue-500`}>
                <p className="text-xs font-extralight">VIEW MORE</p>
                <Icon name='heroicons:arrow-right-circle' shape='outline' stroke={0.9}/>
            </div>
        </div>
    )

}