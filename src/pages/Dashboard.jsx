import React, { useState } from 'react';
import TimeAnalytics from '../components/Dashboard/Time-Analytics';
import AsideTabAnalytics from '../assets/img/aside-tab-analytics.svg';
import AsideTabTodo from '../assets/img/aside-tab-todo.svg';
import AsideTabCalendar from '../assets/img/aside-tab-calendar.svg';
import SpiderChartAnalyticsIcon from '../assets/img/spider-chart-analytics-icon.svg';
import PieChartAnalyticsIcon from '../assets/img/pie-chart-analytics-icon.svg';

import { useTimer } from '../context/TimerContext';
import { formatTime } from '../utils/formatTime';
import { TimePieChart, TimeRadarChart } from '../components/Charts';

export default function Dashboard() {

    const [activeTab, setActiveTab] = useState("Analytics");
    const { labels } = useTimer();

    // Calculate total time from all labels fetched from Supabase
    const totalTimeMs = Object.values(labels || {}).reduce((total, label) => total + (label.time || 0), 0);

    const pieData = Object.entries(labels || {}).map(([name, data]) => ({
        name,
        value: typeof data === 'object' ? data.time : data,
        color: typeof data === 'object' ? data.color : '#3b82f6'
    }));

    return (
        <main className="flex gap-6 mx-auto pt-10 pb-12 px-5 md:px-10 lg:px-40 max-w-[1440px]">
            <aside className="flex flex-col gap-6 w-[286px] h-auto p-4 bg-light-gray rounded-lg">
                <div>
                    <ul>
                        <li>
                            <a href="#" onClick={() => setActiveTab("Analytics")} className={`flex items-center gap-3 text-sm leading-[24px] py-2 px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "Analytics" ? "bg-white" : ""}`}>
                                <img src={AsideTabAnalytics} className='w-6 h-6' alt="Analytics" />
                                <span>Analytics</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => setActiveTab("To-do List")} className={`flex items-center gap-3 text-sm leading-[24px] py-2 px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "To-do List" ? "bg-white" : ""}`}>
                                <img src={AsideTabTodo} className='w-6 h-6' alt="To-do List" />
                                <span>To-do List</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => setActiveTab("Calendar")} className={`flex items-center gap-3 text-sm leading-[24px] py-2 px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "Calendar" ? "bg-white" : ""}`}>
                                <img src={AsideTabCalendar} className='w-6 h-6' alt="Calendar" />
                                <span>Calendar</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
            <section className="flex-1 p-6 bg-light-gray rounded-lg">
                <div className="flex flex-col gap-4">
                    <div className='flex items-center gap-3 bg-white rounded-lg p-2 mx-2'>
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