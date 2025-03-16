import { useEffect, useState } from "react";

export function Countdown({deadline, onDone}: {deadline: number, onDone: () => void}) {

    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const timeLeft = deadline - now;
        return timeLeft > 0 ? timeLeft : 0;
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
            if(calculateTimeLeft() <= 0) {
                onDone();
                clearInterval(timer);
            }
        }, 1000)

        return () => clearInterval(timer);
    }, [])

    const formatTime = (time: number): string => {
        const hours = Math.floor((time / 1000 / 60 / 60) % 24);
        const minutes = Math.floor((time / 1000 / 60) % 60);
        const seconds = Math.floor((time / 1000) % 60);
        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }

    const padZero = (num: number): string => {
        if(num >= 10 || num <= -10) {
            return `${num}`;
        }
        return `0${num}`
    }

    return (
        <span>{formatTime(timeLeft)}</span>
    )

}