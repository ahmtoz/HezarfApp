import React from 'react';
import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

export const CustomTooltip = ({ active, payload, formatTime }) => {
    if (active && payload && payload.length) {
        const labelName = payload[0].payload?.name || payload[0].name;
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg">
                <p className="font-semibold text-gray-800">{labelName}</p>
                <p className="text-gray-600">{formatTime ? formatTime(payload[0].value) : payload[0].value}</p>
            </div>
        );
    }
    return null;
};

export const TimePieChart = ({ data, formatTime, title, icon }) => {
    const isArrayData = Array.isArray(data);
    const [activeTime, setActiveTime] = useState("DAILY");
    const currentValue = isArrayData ? data : (data ? (data[activeTime] || []) : []);
    const hasData = currentValue.some(entry => entry.value > 0);

    try {
        return (
            <article className="flex flex-col gap-4 bg-white rounded-xl p-4 border border-gray-100 h-full min-h-[300px] w-full">
                <header className="flex items-center gap-2">
                    {icon && <img src={icon} alt="" className="w-6 h-6" />}
                    <h2>{title || "Pie Chart"}</h2>
                </header>
                <section className="flex flex-col gap-2">
                    {!isArrayData && (
                        <div className="flex items-center">
                            <button onClick={() => setActiveTime("DAILY")} className={`relative flex-1 text-sm leading-[24px] font-bold cursor-pointer py-2 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-all after:origin-center after:duration-300 ${activeTime === "DAILY" ? "text-primary after:scale-x-100" : ""}`}>Daily</button>
                            <button onClick={() => setActiveTime("WEEKLY")} className={`relative flex-1 text-sm leading-[24px] font-bold cursor-pointer py-2 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-all after:origin-center after:duration-300 ${activeTime === "WEEKLY" ? "text-primary after:scale-x-100" : ""}`}>Weekly</button>
                            <button onClick={() => setActiveTime("MONTHLY")} className={`relative flex-1 text-sm leading-[24px] font-bold cursor-pointer py-2 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-all after:origin-center after:duration-300 ${activeTime === "MONTHLY" ? "text-primary after:scale-x-100" : ""}`}>Monthly</button>
                        </div>
                    )}
                    <div className="flex-1 w-full h-full min-h-[250px] flex items-center justify-center">
                        {hasData ? (
                            <div className="w-full h-full min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={currentValue}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {currentValue.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip formatTime={formatTime} />} />
                                        <Legend 
                                            iconType="circle" 
                                            iconSize={10} 
                                            wrapperStyle={{ paddingTop: '20px' }} 
                                            formatter={(value) => value && value.length > 12 ? value.substring(0, 10) + '...' : value}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No time logged for this period.</p>
                        )}
                    </div>
                </section>
            </article>
        );
    } catch (err) {
        console.error("CRASH IN TimePieChart:", err);
        return <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-700">Error in Pie Chart: {err.message}</div>;
    }
};

export const TimeRadarChart = ({ data, formatTime, title, icon }) => {
    const isArrayData = Array.isArray(data);
    const [activeTime, setActiveTime] = useState("DAILY");
    const currentValue = isArrayData ? data : (data ? (data[activeTime] || []) : []);
    const hasData = currentValue.some(entry => entry.value > 0);

    if (!currentValue || currentValue.length < 3) {
        return (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 h-full min-h-[300px] w-full text-center">
                <h4 className="font-semibold text-gray-700 mb-2">{title || "Spider Chart"}</h4>
                <p className="text-gray-500 text-sm max-w-[200px]">
                    Add at least 3 labels to see the radar chart pattern.
                </p>
            </div>
        );
    }

    try {
        return (
            <article className="flex flex-col gap-4 bg-white rounded-xl p-4 border border-gray-100 h-full min-h-[300px] w-full">
                <header className="flex items-center gap-2">
                    {icon && <img src={icon} alt="" />}
                    <h2>{title || "Spider Chart"}</h2>
                </header>
                <section className="flex flex-col gap-2">
                    {!isArrayData && (
                        <div className="flex items-center">
                            <button onClick={() => setActiveTime("DAILY")} className={`relative flex-1 text-sm leading-[24px] font-bold cursor-pointer py-2 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-all after:origin-center after:duration-300 ${activeTime === "DAILY" ? "text-primary after:scale-x-100" : ""}`}>Daily</button>
                            <button onClick={() => setActiveTime("WEEKLY")} className={`relative flex-1 text-sm leading-[24px] font-bold cursor-pointer py-2 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-all after:origin-center after:duration-300 ${activeTime === "WEEKLY" ? "text-primary after:scale-x-100" : ""}`}>Weekly</button>
                            <button onClick={() => setActiveTime("MONTHLY")} className={`relative flex-1 text-sm leading-[24px] font-bold cursor-pointer py-2 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-all after:origin-center after:duration-300 ${activeTime === "MONTHLY" ? "text-primary after:scale-x-100" : ""}`}>Monthly</button>
                        </div>
                    )}
                    <div className="flex-1 w-full h-full min-h-[250px] flex items-center justify-center">
                        {hasData ? (
                            <div className="w-full h-full min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" margin={{ top: 10, right: 10, bottom: 10, left: 10 }} data={currentValue}>
                                        <PolarGrid stroke="#e5e7eb" />
                                        <PolarAngleAxis
                                            dataKey="name"
                                            tick={{ fill: '#4b5563', fontSize: 11 }}
                                            tickFormatter={(value) => value && value.length > 12 ? value.substring(0, 10) + '...' : value}
                                        />
                                        <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                                        <Radar name="Time" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                                        <Tooltip content={<CustomTooltip formatTime={formatTime} />} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No time logged for this period.</p>
                        )}
                    </div>
                </section>
            </article>
        );
    } catch (err) {
        console.error("CRASH IN TimeRadarChart:", err);
        return <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-700">Error in Radar Chart: {err.message}</div>;
    }
};

export const TimeLineChart = ({ data, colors, formatTime, formatYAxis, title, icon }) => {
    try {
        const subjects = (data && data.length > 0)
            ? Object.keys(data[0]).filter(key => key !== 'day')
            : [];

        if (!data || data.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 h-full min-h-[300px] w-full text-center">
                    <h4 className="font-semibold text-gray-700 mb-2">{title || "Line Chart"}</h4>
                    <p className="text-gray-500 text-sm max-w-[200px]">
                        No data available for the week.
                    </p>
                </div>
            );
        }

        return (
            <article className="flex flex-col gap-4 bg-white rounded-xl p-4 h-full min-h-[300px] w-full">
                <header className="flex items-center gap-2">
                    {icon && <img src={icon} alt="" />}
                    <h2>{title}</h2>
                </header>
                <div className="flex-1 w-full h-full">
                    <div className="w-full h-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickFormatter={(val) => {
                                        if (val === 0) return "0";
                                        const minutes = Math.floor(val / 60000);
                                        const seconds = Math.floor((val % 60000) / 1000);
                                        if (minutes === 0) return `${seconds}s`;
                                        if (minutes >= 60) {
                                            const hours = Math.floor(minutes / 60);
                                            const remainingMins = minutes % 60;
                                            return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
                                        }
                                        return `${minutes}m`;
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value, name) => [formatTime ? formatTime(value) : value, name]}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                {subjects.map((subject, index) => (
                                    <Line
                                        key={subject}
                                        type="monotone"
                                        dataKey={subject}
                                        stroke={colors?.[subject] || `hsl(${index * 45}, 70%, 50%)`}
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </article>
        );
    } catch (err) {
        console.error("CRASH IN TimeLineChart:", err);
        return <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-700">Error in Line Chart: {err.message}</div>;
    }
};
