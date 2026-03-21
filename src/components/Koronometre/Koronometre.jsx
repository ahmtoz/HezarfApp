import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#8dd1e1', '#a4de6c', '#d0ed57'];

const Koronometre = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);

    // Labeling system state
    const [labels, setLabels] = useState({});
    const [labelInput, setLabelInput] = useState('');
    const [lastLabelTime, setLastLabelTime] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        if (isRunning) {
            setIsRunning(false);
            if (time - lastLabelTime > 0) {
                setIsModalOpen(true);
            }
        } else {
            setIsRunning(true);
        }
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
        setIsModalOpen(false);
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

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-lg">
                    <p className="font-semibold text-gray-800">{payload[0].name}</p>
                    <p className="text-gray-600 font-mono">{formatTime(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    const pieData = Object.entries(labels).map(([name, value]) => ({
        name,
        value
    }));

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
            </div>

            {/* Labels List Dashboard */}
            {Object.keys(labels).length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
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

                    {/* Pie Chart Section */}
                    <div className="flex flex-col items-center justify-center bg-gray-50/50 rounded-xl p-4 border border-gray-100 h-full min-h-[300px]">
                        <h4 className="font-semibold text-gray-700 mb-2">Time Distribution</h4>
                        <div className="w-full h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Label Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Save Elapsed Time</h3>
                        <p className="text-gray-600 mb-6">Enter a label for the recorded time of {formatTime(time - lastLabelTime)}.</p>
                        
                        <form onSubmit={handleSaveLabel}>
                            <input
                                type="text"
                                value={labelInput}
                                onChange={(e) => setLabelInput(e.target.value)}
                                placeholder="e.g. Math, Reading, Coding"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all mb-6"
                                autoFocus
                            />
                            
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setLabelInput('');
                                    }}
                                    className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!labelInput.trim()}
                                    className="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-xl shadow-sm hover:bg-blue-600 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                                >
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Koronometre;
