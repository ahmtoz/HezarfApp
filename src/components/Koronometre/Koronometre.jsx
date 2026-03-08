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
        <section className="overflow-hidden py-12 px-16">
            <div className="flex flex-col items-center justify-center gap-4">
                <div>
                    <h2 className="text-4xl font-bold">{formatTime(time)}</h2>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleStartStop} className={`w-16 py-2 text-white rounded-md cursor-pointer transition-colors ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                        {isRunning ? 'Stop' : 'Start'}
                    </button>
                    <button onClick={handleReset} className="w-16 py-2 bg-green-500 text-white rounded-md cursor-pointer transition-colors hover:bg-green-600">
                        Reset
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Koronometre;
