import React, { useState } from 'react';
import TimeAnalytics from '../components/Dashboard/Time-Analytics';
import AsideTabAnalytics from '../assets/img/aside-tab-analytics.svg';
import AsideTabTodo from '../assets/img/aside-tab-todo.svg';
import AsideTabCalendar from '../assets/img/aside-tab-calendar.svg';
import AsideTabSwitcher from '../assets/img/aside-tab-switcher.svg';
import SpiderChartAnalyticsIcon from '../assets/img/spider-chart-analytics-icon.svg';
import PieChartAnalyticsIcon from '../assets/img/pie-chart-analytics-icon.svg';

import { useTimer } from '../context/TimerContext';
import { formatTime } from '../utils/formatTime';
import { TimePieChart, TimeRadarChart, TimeLineChart } from '../components/Charts';

export default function Dashboard() {

    const [activeTab, setActiveTab] = useState("Analytics");
    const { labels, logs } = useTimer();

    // Calculate total time from all labels fetched from Supabase
    const totalTimeMs = Object.values(labels || {}).reduce((total, label) => total + (label.time || 0), 0);

    const pieData = Object.entries(labels || {}).map(([name, data]) => ({
        name,
        value: typeof data === 'object' ? data.time : data,
        color: typeof data === 'object' ? data.color : '#3b82f6'
    }));

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Get current week's Monday 00:00:00
    const now = new Date();
    const currentDay = now.getDay();
    const diffToMonday = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const startOfWeek = new Date(now.setDate(diffToMonday));
    startOfWeek.setHours(0, 0, 0, 0);

    const currentDayIndex = currentDay === 0 ? 6 : currentDay - 1;

    // 1. Calculate daily sums and weekly totals
    const dailySums = {};
    const weekTotals = {};
    daysOfWeek.forEach(day => { dailySums[day] = {}; });
    Object.keys(labels || {}).forEach(labelName => { weekTotals[labelName] = 0; });

    if (logs && Array.isArray(logs)) {
        logs.forEach(log => {
            if (!log.created_at) return;
            const logDate = new Date(log.created_at);
            if (logDate >= startOfWeek) {
                const dayIndex = logDate.getDay() === 0 ? 6 : logDate.getDay() - 1;
                const dayName = daysOfWeek[dayIndex];

                const labelName = Object.keys(labels || {}).find(name =>
                    labels[name].id === log.label_id || name === log.label_id
                );

                if (labelName && dayName) {
                    const duration = log.duration_ms !== undefined && log.duration_ms !== null
                        ? log.duration_ms
                        : (log.duration_seconds ? log.duration_seconds * 1000 : 0);

                    dailySums[dayName][labelName] = (dailySums[dayName][labelName] || 0) + duration;
                    weekTotals[labelName] = (weekTotals[labelName] || 0) + duration;
                }
            }
        });
    }

    // 2. Build cumulative data map
    const weeklyDataMap = {};
    const cumulativeSums = {};
    Object.keys(labels || {}).forEach(labelName => { cumulativeSums[labelName] = 0; });

    daysOfWeek.forEach((day, index) => {
        weeklyDataMap[day] = { day };
        Object.keys(labels || {}).forEach(labelName => {
            // Only include labels that were used this week
            if (weekTotals[labelName] > 0) {
                if (index <= currentDayIndex) {
                    // Accumulate time for past and current days
                    cumulativeSums[labelName] += (dailySums[day][labelName] || 0);
                    weeklyDataMap[day][labelName] = cumulativeSums[labelName];
                } else {
                    // For future days, either set to null (line stops) or keep flat.
                    // The user requested it to stay where it left off, so we keep the cumulative sum flat.
                    // Setting to null stops the line at today instead of drawing a flat line to Sunday.
                    // Using null is the professional best practice for future dates.
                    weeklyDataMap[day][labelName] = null;
                }
            }
        });
    });

    const weeklyData = Object.values(weeklyDataMap);

    const colors = {};
    Object.entries(labels || {}).map(([name, data]) => {
        colors[name] = data.color;
    });

    const [isAsideOpen, setIsAsideOpen] = useState(true);

    return (
        <main className="flex gap-6 mx-auto pt-10 pb-12 px-5 md:px-10 lg:px-20 xl:px-40 max-w-[1440px]">
            <aside className={`relative flex flex-col gap-6 ${isAsideOpen ? 'w-[286px]' : 'w-[64px]'} h-auto p-4 bg-light-gray rounded-lg transition-width duration-300`}>
                <button
                    onClick={() => setIsAsideOpen(!isAsideOpen)}
                    className="absolute -right-3 top-4 p-1 flex items-center justify-center rounded-full bg-white cursor-pointer transition-width duration-300" style={{ boxShadow: "0px 0px 1px 0px rgba(0, 0, 0, 0.4), 0px 6px 6px -6px rgba(0, 0, 0, 0.16)" }}>
                    {isAsideOpen ? <img src={AsideTabSwitcher} className='block w-4 h-4 rotate-180' alt="Switcher" /> : <img src={AsideTabSwitcher} className='block w-4 h-4' alt="Switcher" />}
                </button>
                <div className={`${isAsideOpen ? 'overflow-visible' : 'overflow-clip'}`}>
                    <ul>
                        <li>
                            <a href="#" onClick={() => setActiveTab("Analytics")} className={`flex items-center gap-3 text-sm leading-[24px] py-2 px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "Analytics" ? "bg-white" : ""}`}>
                                <img src={AsideTabAnalytics} className='w-6 h-6' alt="Analytics" />
                                <span className='whitespace-nowrap'>Analytics</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => setActiveTab("To-do List")} className={`flex items-center gap-3 text-sm leading-[24px] py-2 px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "To-do List" ? "bg-white" : ""}`}>
                                <img src={AsideTabTodo} className='w-6 h-6' alt="To-do List" />
                                <span className='whitespace-nowrap'>To-do List</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => setActiveTab("Calendar")} className={`flex items-center gap-3 text-sm leading-[24px] py-2 px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "Calendar" ? "bg-white" : ""}`}>
                                <img src={AsideTabCalendar} className='w-6 h-6' alt="Calendar" />
                                <span className='whitespace-nowrap'>Calendar</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
            <section className="flex-1 p-6 bg-light-gray rounded-lg">
                <div className="flex flex-col gap-4">
                    <div className='flex items-center gap-3 bg-white rounded-lg p-2'>
                        <img src={activeTab === "Analytics" ? AsideTabAnalytics : activeTab === "To-do List" ? AsideTabTodo : AsideTabCalendar} alt="" />
                        <h1 className='text-xl leading-[24px] text-black'>{activeTab} Overview</h1>
                    </div>
                    <div className={`flex gap-4 ${activeTab === "Analytics" ? "" : "hidden"}`}>
                        <TimeAnalytics title="Total Time" time={formatTime(totalTimeMs)} />
                        <TimeAnalytics flexWidth="flex-1" title="Completion of To-do’s" time="00:00:00" />
                    </div>
                    <div className={`flex gap-4 ${activeTab === "Analytics" ? "" : "hidden"}`}>
                        <div className="flex-1">
                            <TimeRadarChart data={pieData} formatTime={formatTime} icon={SpiderChartAnalyticsIcon} title="Spider Chart" />
                        </div>
                        <div className="flex-1">
                            <TimePieChart data={pieData} formatTime={formatTime} icon={PieChartAnalyticsIcon} title="Pie Chart" />
                        </div>
                    </div>
                    <div className={`flex gap-4 ${activeTab === "Analytics" ? "" : "hidden"}`}>
                        <div className="flex-1">
                            <TimeLineChart
                                data={weeklyData}
                                colors={colors}
                                formatTime={formatTime}
                                icon={AsideTabAnalytics}
                                title="Time Overview"
                            />
                        </div>
                    </div>
                    <div className={`flex gap-4 ${activeTab === "To-do List" ? "" : "hidden"}`}>
                        <h1>To-do List</h1>
                    </div>
                    <div className={`flex gap-4 ${activeTab === "Calendar" ? "" : "hidden"}`}>
                        <h1>Calendar</h1>
                    </div>
                </div>
            </section>
        </main>
    )
}