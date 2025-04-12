import { useEffect } from "react";

export function TabSwitchingDetector() {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                console.log("User switched to another tab or minimized the window");
                // You can pause videos, save state, etc.
            } else {
                console.log("User returned to the tab");
                // Resume activity, sync data, etc.
            }
        };
    
        document.addEventListener("visibilitychange", handleVisibilityChange);
    
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);
    
    return <div>Tracking tab visibility...</div>;
}