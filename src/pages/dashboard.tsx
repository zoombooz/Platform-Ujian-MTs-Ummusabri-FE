import { Card } from "../components/card";

export function DashboardPage() {

    const style = {
        button_list: 'text-gray-400 border-t border-gray-200 py-2 px-4 hover:bg-gray-100 transition-all cursor-pointer'
    }

    return (
        <div className="flex flex-col gap-8 p-8 w-full h-full overflow-y-scroll">

            <h1 className="text-2xl font-extralight mb-8">Dashboard</h1>

            <div className="w-full grid grid-cols-4 gap-6">
                <Card />
                <Card />
                <Card />
                <Card />
            </div>

            <div className="w-full h-fit flex flex-col md:flex-row gap-4 mb-12">
                <div className="flex flex-col justify-between w-1/4 h-full border border-gray-200 shadow-md rounded-md">
                    <div className="flex flex-col items-center p-6">
                        <img src="https://picsum.photos/200" className="rounded-full drop-shadow-xl mb-4"></img>
                        <p className="text-gray-500 text-xl font-medium">MTS UMMUSABRI</p>
                        <p className="text-blue-400 text-sm font-semibold">ADMIN SEKOLAH</p>
                    </div>

                    <div className="w-full">
                        <div className={style.button_list}>Home</div>
                        <div className={style.button_list}>Account Setting</div>
                    </div>
                </div>

                <div className="w-3/4 h-full border border-gray-200 p-4 shadow-md rounded-md">
                    test2
                </div>
            </div>

        </div>
    )
}