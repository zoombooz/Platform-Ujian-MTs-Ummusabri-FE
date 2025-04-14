// import { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router"

// export function Breadcrump() {

//     // const [path, setPath] = useState<string[]>([]);
//     // const { pathname } = useLocation();

//     // useEffect(() => {
//     //     const segment = pathname.split("/").filter((segment => segment));
//     //     setPath(segment);
//     // }, [pathname])

//     return (
//         <div className="flex items-center gap-2 py-3 px-8 border-b border-gray-300 text-gray-500 text-sm font-light">
//             <Link to="/" className="hover:underline">
//                 Dashboard
//             </Link>

//             {/* {path.length > 0 ? <span className="text-gray-300">•</span> : ""}

//             {path.map((segment, index) => {
//                 const to = "/" + path.slice(0, index + 1).join("/");
//                 const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

//                 return (
//                     <div key={to} className="">
//                         <Link to={to} className="hover:underline">
//                         {formattedSegment}
//                         </Link>
//                         {index !== path.length - 1 && (
//                         <span className="text-gray-300">•</span>
//                         )}
//                     </div>
//                 )
//             })} */}
//         </div>
//     )

// }