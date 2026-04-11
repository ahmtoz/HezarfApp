import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const LABEL_COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#f59e0b', // Amber
    '#22c55e', // Green
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#8b5cf6'  // Violet
];

const SUGGESTED_LABELS = [
    { name: 'Math', color: '#3b82f6' },
    { name: 'Reading', color: '#22c55e' },
    { name: 'Coding', color: '#8b5cf6' },
    { name: 'Science', color: '#06b6d4' },
    { name: 'English', color: '#ec4899' }
];

const Koronometre = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);

    // Labeling system state
    const [labels, setLabels] = useState({});
    const [labelInput, setLabelInput] = useState('');
    const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[5]); // Default to blue
    const [lastLabelTime, setLastLabelTime] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAllLabels, setShowAllLabels] = useState(false);

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

        setLabels((prev) => {
            const existing = prev[trimmedLabel];
            return {
                ...prev,
                [trimmedLabel]: {
                    time: (existing?.time || 0) + roundTime,
                    color: selectedColor
                }
            };
        });

        // Reset label input and update last label time
        setLastLabelTime(time);
        setLabelInput('');
        setSelectedColor(LABEL_COLORS[5]); // Reset to default blue
        setIsModalOpen(false);
    };

    const handleLabelInputChange = (e) => {
        const val = e.target.value;
        setLabelInput(val);
        if (labels[val]) {
            setSelectedColor(labels[val].color);
        } else {
            const suggested = SUGGESTED_LABELS.find(l => l.name === val);
            if (suggested) {
                setSelectedColor(suggested.color);
            }
        }
    };

    const formatTime = (timeInMs) => {
        const minutes = Math.floor(timeInMs / 60000);
        const seconds = Math.floor((timeInMs % 60000) / 1000);
        const milliseconds = Math.floor((timeInMs % 1000) / 10);

        const formatMinutes = minutes.toString().padStart(2, '0');
        const formatSeconds = seconds.toString().padStart(2, '0');
        const formatMilliseconds = milliseconds.toString().padStart(2, '0');

        const divider = (
            <span className="inline-flex flex-col justify-center gap-[0.25em] mx-[0.05em]">
                <span className="rounded-full bg-current w-[0.15em] h-[0.15em]"></span>
                <span className="rounded-full bg-current w-[0.15em] h-[0.15em]"></span>
            </span>
        );

        return (
            <span className="inline-flex items-center">
                <span className="tabular-nums">{formatMinutes}</span>
                {divider}
                <span className="tabular-nums">{formatSeconds}</span>
                {divider}
                <span className="tabular-nums">{formatMilliseconds}</span>
            </span>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const labelName = payload[0].payload?.name || payload[0].name;
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-lg">
                    <p className="font-semibold text-gray-800">{labelName}</p>
                    <p className="text-gray-600">{formatTime(payload[0].value)}</p>
                </div>
            );
        }
        return null;
    };

    const pieData = Object.entries(labels).map(([name, data]) => ({
        name,
        value: typeof data === 'object' ? data.time : data, // fallback for safety
        color: typeof data === 'object' ? data.color : LABEL_COLORS[0]
    }));

    return (
        <section className="overflow-hidden py-25 px-40">
            <div className="flex flex-col items-center justify-center gap-6 w-fit mx-auto">
                <div className={`timer-circle-wrapper ${isRunning ? 'is-running' : ''}`}>
                    <div className="inline-flex items-center gap-1 text-5xl leading-[48px] font-bold tracking-tight text-[#070417] z-10 relative">
                        {formatTime(time)}
                    </div>
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
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
                            <span>Dashboard</span>
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {Object.entries(labels)
                                .slice(0, showAllLabels ? undefined : 5)
                                .map(([subject, data]) => (
                                    <li key={subject} className="flex justify-between items-center bg-gray-50/80 hover:bg-gray-50 p-4 rounded-xl border border-gray-100 transition-colors overflow-hidden" style={{ backgroundColor: data.color || LABEL_COLORS[0] }}>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-white">{subject}</span>
                                        </div>
                                        <span className="text-lg font-medium text-gray-900 bg-white px-4 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                                            {formatTime(data.time || data)}
                                        </span>
                                    </li>
                                ))}
                        </ul>
                        {Object.keys(labels).length > 5 && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => setShowAllLabels(!showAllLabels)}
                                    className="px-6 py-2 text-sm font-semibold bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-gray-200"
                                >
                                    {showAllLabels ? 'Daha Az Göster' : `Diğerlerini Gör (${Object.keys(labels).length - 5}+)`}
                                </button>
                            </div>
                        )}
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
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Radar Chart Section */}
                    {Object.keys(labels).length >= 3 ? (
                        <div className="flex flex-col items-center justify-center bg-gray-50/50 rounded-xl p-4 border border-gray-100 h-full min-h-[300px]">
                            <h4 className="font-semibold text-gray-700 mb-2">Performance Radar</h4>
                            <div className="w-full h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={pieData}>
                                        <PolarGrid stroke="#e5e7eb" />
                                        <PolarAngleAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 12 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                                        <Radar name="Time" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                                        <Tooltip content={<CustomTooltip />} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-gray-50/50 rounded-xl p-4 border border-gray-100 h-full min-h-[300px] text-center border-dashed border-2">
                            <h4 className="font-semibold text-gray-700 mb-2">Performance Radar</h4>
                            <p className="text-gray-500 text-sm max-w-[200px]">
                                Add at least 3 labels to see the radar chart pattern.
                            </p>
                        </div>
                    )}
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
                                onChange={handleLabelInputChange}
                                placeholder="e.g. Math, Reading, Coding"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all mb-5"
                                autoFocus
                            />

                            {/* Color Selection */}
                            <div className="mb-6">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Color</span>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                                    {LABEL_COLORS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${selectedColor === color ? 'border-gray-800 scale-110 shadow-md flex items-center justify-center' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                            aria-label={`Select color ${color}`}
                                            title={`Select color ${color}`}
                                        >
                                            {selectedColor === color && (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Label Suggestions */}
                            <div className="mb-6 space-y-4">
                                {/* Recent Labels */}
                                {Object.keys(labels).length > 0 && (
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Recent Labels</span>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(labels).slice(0, 5).map(([labelName, labelData]) => {
                                                const btnColor = labelData.color || LABEL_COLORS[0];
                                                const isSelected = labelInput === labelName;
                                                return (
                                                    <button
                                                        key={labelName}
                                                        type="button"
                                                        onClick={() => { setLabelInput(labelName); setSelectedColor(btnColor); }}
                                                        className={`px-4 py-1.5 text-sm font-semibold rounded-xl transition-all border cursor-pointer hover:-translate-y-0.5 ${isSelected ? 'shadow-md shadow-' + btnColor + '/20' : 'hover:opacity-80'}`}
                                                        style={{
                                                            backgroundColor: isSelected ? btnColor : `${btnColor}15`,
                                                            borderColor: isSelected ? btnColor : `${btnColor}30`,
                                                            color: isSelected ? '#ffffff' : btnColor
                                                        }}
                                                    >
                                                        {labelName}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Suggested Labels */}
                                {SUGGESTED_LABELS.filter(l => !Object.keys(labels).includes(l.name)).length > 0 && (
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Suggestions</span>
                                        <div className="flex flex-wrap gap-2">
                                            {SUGGESTED_LABELS.filter(l => !Object.keys(labels).includes(l.name)).map(label => {
                                                const btnColor = label.color;
                                                const isSelected = labelInput === label.name;
                                                return (
                                                    <button
                                                        key={label.name}
                                                        type="button"
                                                        onClick={() => { setLabelInput(label.name); setSelectedColor(btnColor); }}
                                                        className={`px-4 py-1.5 text-sm font-semibold rounded-xl transition-all border cursor-pointer hover:-translate-y-0.5 ${isSelected ? 'shadow-md' : 'hover:opacity-80'}`}
                                                        style={{
                                                            backgroundColor: isSelected ? btnColor : `${btnColor}15`,
                                                            borderColor: isSelected ? btnColor : `${btnColor}30`,
                                                            color: isSelected ? '#ffffff' : btnColor
                                                        }}
                                                    >
                                                        {label.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setLabelInput('');
                                    }}
                                    className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!labelInput.trim()}
                                    className="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-xl shadow-sm hover:bg-blue-600 disabled:opacity-50 transition-all hover:-translate-y-0.5 cursor-pointer"
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
