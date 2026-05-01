import React from 'react';
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
    return (
        <article className="flex flex-col gap-4 bg-white rounded-xl p-4 border border-gray-100 h-full min-h-[300px] w-full">
            <header className="flex items-center gap-2">
                <img src={icon} alt="" />
                <h2>{title}</h2>
            </header>
            <div className="flex-1 w-full h-full">
                <div className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip formatTime={formatTime} />} />
                            <Legend iconType="circle" iconSize={20} wrapperStyle={{ paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </article>
    );
};

export const TimeRadarChart = ({ data, formatTime, title, icon }) => {
    if (data.length < 3) {
        return (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 border border-gray-100 h-full min-h-[300px] w-full text-center border-dashed border-2">
                <h4 className="font-semibold text-gray-700 mb-2">Spider Chart</h4>
                <p className="text-gray-500 text-sm max-w-[200px]">
                    Add at least 3 labels to see the radar chart pattern.
                </p>
            </div>
        );
    }

    return (
        <article className="flex flex-col gap-4 bg-white rounded-xl p-4 border border-gray-100 h-full min-h-[300px] w-full">
            <header className="flex items-center gap-2">
                <img src={icon} alt="" />
                <h2>{title}</h2>
            </header>
            <div className="flex-1 w-full h-full">
                <div className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                            <Radar name="Time" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                            <Tooltip content={<CustomTooltip formatTime={formatTime} />} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </article>
    );
};

export const TimeLineChart = ({ data, colors, formatTime, formatYAxis, title, icon }) => {
    const subjects = data.length > 0
        ? Object.keys(data[0]).filter(key => key !== 'day')
        : [];

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 border border-gray-100 h-full min-h-[300px] w-full text-center border-dashed border-2">
                <h4 className="font-semibold text-gray-700 mb-2">{title || "Line Chart"}</h4>
                <p className="text-gray-500 text-sm max-w-[200px]">
                    No data available for the week.
                </p>
            </div>
        );
    }

    return (
        <article className="flex flex-col gap-4 bg-white rounded-xl p-4 border border-gray-100 h-full min-h-[300px] w-full">
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
};
