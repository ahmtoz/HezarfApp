import React, { useState, useEffect, useRef } from 'react';

const Koronometre = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            // Update the time every 10 milliseconds
            timerRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
    };

    const formatTime = (timeInMs) => {
        const minutes = Math.floor(timeInMs / 60000);
        const seconds = Math.floor((timeInMs % 60000) / 1000);
        const milliseconds = Math.floor((timeInMs % 1000) / 10);

        const formatMinutes = minutes.toString().padStart(2, '0');
        const formatSeconds = seconds.toString().padStart(2, '0');
        const formatMilliseconds = milliseconds.toString().padStart(2, '0');

        return `${formatMinutes}:${formatSeconds}:${formatMilliseconds}`;
    };

    return (
        <div>
            <div>
                <h2>{formatTime(time)}</h2>
            </div>
            <div>
                <button onClick={handleStartStop}>
                    {isRunning ? 'Stop' : 'Start'}
                </button>
                <button onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Koronometre;
