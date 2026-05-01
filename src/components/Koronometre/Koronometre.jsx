import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { TimePieChart, TimeRadarChart } from '../Charts';
import startIcon from '../../assets/img/start.svg';
import stopIcon from '../../assets/img/stop.svg';
import resetIcon from '../../assets/img/reset.svg';
import { useTimer } from '../../context/TimerContext';

const LABEL_COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#FFCE65', // Amber
    '#06B6D4', // Water Blue
    '#3B82F6', // Cyan
    '#6366f1', // Indigo
    '#8B5CF6', // Purple
    '#A855F7', // Pink
    '#EC4899'  // Violet
];

const SUGGESTED_LABELS = [
    { name: 'Math', color: '#06B6D4' },
    { name: 'Coding', color: '#8B5CF6' },
    { name: 'Reading', color: '#FFCE65' },
    { name: 'Language', color: '#EC4899' }
];

const Koronometre = () => {
    const {
        time, setTime,
        isRunning, setIsRunning,
        labels, setLabels,
        lastLabelTime, setLastLabelTime,
        saveTimerLog,
    } = useTimer();

    // Labeling system state
    const [labelInput, setLabelInput] = useState('');
    const [selectedColor, setSelectedColor] = useState(LABEL_COLORS[5]);
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

        saveTimerLog(trimmedLabel, selectedColor, roundTime);

        // Formu sıfırla
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



    const pieData = Object.entries(labels).map(([name, data]) => ({
        name,
        value: typeof data === 'object' ? data.time : data, // fallback for safety
        color: typeof data === 'object' ? data.color : LABEL_COLORS[0]
    }));

    return (
        <section className="pt-15">
            <div className="flex flex-col gap-4 mb-16">
                <p className="text-[32px]/[40px] tracking-tight text-black font-bold">Welcome aboard</p>
                <h1 className="text-[40px]/[48px] tracking-tight text-black font-bold">Start tracking your time.</h1>
            </div>
            <div className="flex flex-col items-center justify-center gap-12 w-fit mx-auto">
                <div className={`timer-circle-wrapper ${isRunning ? 'is-running' : ''}`}>
                    <div className="inline-flex items-center gap-1 text-dark z-5 relative">
                        {formatTime(time)}
                    </div>
                </div>
                <div className="flex gap-6">
                    <button onClick={handleStartStop} className={`flex items-center justify-center gap-2 ps-2 pe-4 py-2 rounded-xl cursor-pointer transition-all duration-300 ${isRunning ? 'bg-secondary hover:bg-secondary-hover' : 'bg-primary hover:bg-primary-hover'}`}>
                        <img src={isRunning ? stopIcon : startIcon} alt="" className='w-6 h-6' />
                        <span className="text-[14px]/[24px] text-white font-bold">{isRunning ? 'Stop' : 'Start'}</span>
                    </button>
                    <button onClick={handleReset} className="flex items-center justify-center gap-2 ps-2 pe-4 py-2 rounded-xl bg-white border border-gray-dark cursor-pointer transition-all duration-300 hover:brightness-90">
                        <img src={resetIcon} alt="" className='w-6 h-6' />
                        <span className="text-[14px]/[24px] text-black font-bold">Reset</span>
                    </button>
                </div>
            </div>

            {/* Labels List Dashboard */}
            {Object.keys(labels).length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-[#C6C6C8] mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1">
                        <ul className="flex flex-col gap-3">
                            {Object.entries(labels)
                                .slice(0, showAllLabels ? undefined : 5)
                                .map(([subject, data]) => (
                                    <li key={subject} className="flex justify-between items-center px-4 py-3 rounded-xl border-2 overflow-hidden" style={{ backgroundColor: `${data.color}60` || LABEL_COLORS[0], borderColor: `color-mix(in srgb, ${data.color}, black 40%)` }}>
                                        <div className="text-base flex items-center gap-3">
                                            <span className="font-bold text-black">{subject}</span>
                                        </div>
                                        <span className="text-base font-medium text-black bg-white px-3 rounded-lg">
                                            {formatTime(data.time || data)}
                                        </span>
                                    </li>
                                )
                                )}
                        </ul>
                        {Object.keys(labels).length > 5 && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => setShowAllLabels(!showAllLabels)}
                                    className="px-6 py-2 text-sm font-semibold bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-gray-200"
                                >
                                    {showAllLabels ? 'Show Less' : `Show More (${Object.keys(labels).length - 5}+)`}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pie Chart Section */}
                    <div className="h-full">
                        <TimePieChart data={pieData} formatTime={formatTime} />
                    </div>

                    {/* Radar Chart Section */}
                    <div className="h-full">
                        <TimeRadarChart data={pieData} formatTime={formatTime} />
                    </div>
                </div>
            )}

            {/* Label Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 md:px-0">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md pt-5 pb-6 animate-in fade-in zoom-in duration-200">
                        <div className="border-b border-gray-light px-6 pb-4">
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
                                    className="w-full px-3 py-2 bg-white text-gray-dark text-[12px]/[16px] font-bold border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all mb-4"
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
                                                            className={`px-2 py-1 text-[14px]/[24px] text-black rounded-md transition-all border cursor-pointer ${isSelected ? '' : 'hover:opacity-80'}`}
                                                            style={{
                                                                backgroundColor: isSelected ? `${btnColor}80` : `${btnColor}40`,
                                                                borderColor: btnColor,
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
                                                            className={`px-2 py-1 text-[14px]/[24px] text-black rounded-md transition-all border cursor-pointer ${isSelected ? '' : 'hover:opacity-80'}`}
                                                            style={{
                                                                backgroundColor: isSelected ? `${btnColor}80` : `${btnColor}40`,
                                                                borderColor: btnColor
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
                                        className="px-3 py-1 text-black hover:bg-gray-100 text-[14px]/[24px] font-bold border border-gray-dark rounded-xl transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!labelInput.trim()}
                                        className="px-3 py-1 bg-primary text-white text-[14px]/[24px] font-bold rounded-xl hover:bg-primary-hover disabled:opacity-40 transition-all cursor-pointer"
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
