import React, { useState, useEffect, useRef } from 'react';

const Koronometre = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);

    // Labeling system state
    const [labels, setLabels] = useState({});
    const [labelInput, setLabelInput] = useState('');
    const [lastLabelTime, setLastLabelTime] = useState(0);

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
        setLastLabelTime(0);
    };

    const handleSaveLabel = (e) => {
        e.preventDefault();
        const trimmedLabel = labelInput.trim();
        const roundTime = time - lastLabelTime;
        if (!trimmedLabel || roundTime <= 0) return;

        setLabels((prev) => ({
            ...prev,
            [trimmedLabel]: (prev[trimmedLabel] || 0) + roundTime,
        }));

        // Reset label input and update last label time
        setLastLabelTime(time);
        setLabelInput('');
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
            <div className="flex flex-col items-center justify-center gap-4 w-fit mx-auto">
                <div>
                    <h2 className="text-6xl font-bold font-mono tracking-tight text-gray-800">{formatTime(time)}</h2>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleStartStop} className={`w-28 py-3 text-lg font-semibold text-white rounded-xl shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 ${isRunning ? 'bg-red-500 hover:bg-red-600 hover:shadow-red-500/30' : 'bg-blue-500 hover:bg-blue-600 hover:shadow-blue-500/30'}`}>
                        {isRunning ? 'Stop' : 'Start'}
                    </button>
                    <button onClick={handleReset} className="w-28 py-3 text-lg font-semibold bg-gray-500 text-white rounded-xl shadow-sm cursor-pointer transition-all hover:bg-gray-600 hover:-translate-y-0.5 hover:shadow-gray-500/30">
                        Reset
                    </button>
                </div>

                {/* Label Assignment Form */}
                <form
                    onSubmit={handleSaveLabel}
                    className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4 bg-gray-50 p-2 rounded-xl border border-gray-200"
                >
                    <input
                        type="text"
                        value={labelInput}
                        onChange={(e) => setLabelInput(e.target.value)}
                        placeholder="e.g. Math, Reading, Coding"
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!labelInput.trim() || (time - lastLabelTime) <= 0}
                        className="px-6 py-2.5 bg-green-500 text-white font-semibold rounded-lg shadow-sm transition-all hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                        Save Time
                    </button>
                </form>
            </div>

            {/* Labels List Dashboard */}
            {Object.keys(labels).length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
                        <span>📊</span> Subjects Dashboard
                    </h3>
                    <ul className="flex flex-col gap-3">
                        {Object.entries(labels).map(([subject, totalTimeMs]) => (
                            <li key={subject} className="flex justify-between items-center bg-gray-50/80 hover:bg-gray-50 p-4 rounded-xl border border-gray-100 transition-colors">
                                <span className="font-semibold text-gray-700">{subject}</span>
                                <span className="font-mono text-lg font-medium text-gray-900 bg-white px-4 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                                    {formatTime(totalTimeMs)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};

export default Koronometre;
