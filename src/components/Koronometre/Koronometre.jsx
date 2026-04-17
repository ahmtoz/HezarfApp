import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import startIcon from '../../assets/img/start.svg';
import stopIcon from '../../assets/img/stop.svg';
import resetIcon from '../../assets/img/reset.svg';
import { useTimer } from '../../context/TimerContext';

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
    const {
        time, setTime,
        isRunning, setIsRunning,
        labels, setLabels,
        lastLabelTime, setLastLabelTime
    } = useTimer();

    // Local labeling system state
    const [labelInput, setLabelInput] = useState('');
    const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[5]); // Default to blue
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAllLabels, setShowAllLabels] = useState(false);

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
            <span className="inline-flex flex-col justify-center gap-[0.25em] mx-[0.1em]">
                <span className="rounded-full bg-current w-[0.15em] h-[0.15em]"></span>
                <span className="rounded-full bg-current w-[0.15em] h-[0.15em]"></span>
            </span>
        );

        const renderDigits = (timeStr) => (
            <span className="inline-flex items-center">
                <span className="w-[1ch] inline-block text-center">{timeStr[0]}</span>
                <span className="w-[1ch] inline-block text-center">{timeStr[1]}</span>
            </span>
        );

        return (
            <span className="inline-flex items-center">
                {renderDigits(formatMinutes)}
                {divider}
                {renderDigits(formatSeconds)}
                {divider}
                {renderDigits(formatMilliseconds)}
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
        <section className="pt-15">
            <div className="flex flex-col items-center justify-center gap-12 w-fit mx-auto">
                <div className={`timer-circle-wrapper ${isRunning ? 'is-running' : ''}`}>
                    <div className="inline-flex items-center gap-1 text-5xl leading-[48px] font-bold tracking-tight text-[#070417] z-5 relative">
                        {formatTime(time)}
                    </div>
                </div>
                <div className="flex gap-6">
                    <button onClick={handleStartStop} className={`flex items-center justify-center gap-2 ps-2 pe-4 py-2 rounded-xl cursor-pointer transition-all duration-300 ${isRunning ? 'bg-[#D33030] hover:bg-[#b82828]' : 'bg-[#4E46B4] hover:bg-[#3a358f]'}`}>
                        <img src={isRunning ? stopIcon : startIcon} alt="" className='w-6 h-6' />
                        <span className="text-[14px]/[24px] text-white font-bold">{isRunning ? 'Stop' : 'Start'}</span>
                    </button>
                    <button onClick={handleReset} className="flex items-center justify-center gap-2 ps-2 pe-4 py-2 rounded-xl bg-white border border-[#595D62] cursor-pointer transition-all duration-300 hover:brightness-90">
                        <img src={resetIcon} alt="" className='w-6 h-6' />
                        <span className="text-[14px]/[24px] text-black font-bold">Reset</span>
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
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 md:px-0">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md pt-5 pb-6 animate-in fade-in zoom-in duration-200">
                        <div className="border-b border-[#E2E2E2] px-6 pb-4">
                            <h3 className="text-2xl font-bold text-black">Save tracked time</h3>
                        </div>
                        <div className="flex flex-col px-6 pt-4">
                            <p className="text-[12px]/[16px] text-black mb-2">Enter a label for the recorded time of {formatTime(time - lastLabelTime)}.</p>

                            <form onSubmit={handleSaveLabel}>
                                <input
                                    type="text"
                                    value={labelInput}
                                    onChange={handleLabelInputChange}
                                    placeholder="e.g. Math, Reading, Coding"
                                    className="w-full px-3 py-2 bg-white text-[#595D62] text-[12px]/[16px] font-bold border border-[#E2E2E2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all mb-4"
                                    autoFocus
                                />

                                {/* Color Selection */}
                                <div className="mb-4">
                                    <span className="text-[12px]/[16px] text-black mb-2 block">Colors</span>
                                    <div className="flex flex-wrap gap-[5px]">
                                        {LABEL_COLORS.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-8 h-8 rounded-full border-1 transition-transform cursor-pointer ${selectedColor === color ? 'border-black flex items-center justify-center' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                                aria-label={`Select color ${color}`}
                                                title={`Select color ${color}`}
                                            >
                                                {selectedColor === color && (
                                                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            <span className="text-[12px]/[16px] text-black mb-2 block">Recent Labels</span>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(labels).slice(0, 5).map(([labelName, labelData]) => {
                                                    const btnColor = labelData.color || LABEL_COLORS[0];
                                                    const isSelected = labelInput === labelName;
                                                    return (
                                                        <button
                                                            key={labelName}
                                                            type="button"
                                                            onClick={() => { setLabelInput(labelName); setSelectedColor(btnColor); }}
                                                            className={`px-2 py-1 text-[14px]/[24px] rounded-xl transition-all border cursor-pointer ${isSelected ? 'shadow-md' : 'hover:opacity-80'}`}
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
                                            <span className="text-[12px]/[16px] text-black mb-2 block">Suggestions</span>
                                            <div className="flex flex-wrap gap-2">
                                                {SUGGESTED_LABELS.filter(l => !Object.keys(labels).includes(l.name)).map(label => {
                                                    const btnColor = label.color;
                                                    const isSelected = labelInput === label.name;
                                                    return (
                                                        <button
                                                            key={label.name}
                                                            type="button"
                                                            onClick={() => { setLabelInput(label.name); setSelectedColor(btnColor); }}
                                                            className={`px-2 py-1 text-[14px]/[24px] rounded-xl transition-all border cursor-pointer ${isSelected ? 'shadow-md' : 'hover:opacity-80'}`}
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

                                <div className="flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setLabelInput('');
                                        }}
                                        className="px-3 py-1 text-black hover:bg-gray-100 text-[14px]/[24px] font-bold border border-[#595D62] rounded-xl transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!labelInput.trim()}
                                        className="px-3 py-1 bg-[#4E46B4] text-white text-[14px]/[24px] font-bold rounded-xl hover:hover:bg-[#3a358f] disabled:opacity-40 transition-all cursor-pointer"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Koronometre;
