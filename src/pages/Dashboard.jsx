import React, { useState } from 'react';
import AsideTabAnalytics from '../assets/img/aside-tab-analytics.svg';
import AsideTabTodo from '../assets/img/aside-tab-todo.svg';
import AsideTabCalendar from '../assets/img/aside-tab-calendar.svg';

export default function Dashboard() {

    const [activeTab, setActiveTab] = useState("ANALYTICS");

    return (
        <main className="flex gap-6 mx-auto pt-10 pb-12 px-5 md:px-40" style={{ maxWidth: "1440px", height: "calc(100vh - 118px)" }}>
            <aside className="flex flex-col gap-6 w-[286px] h-full p-4 bg-[#F5F5F5] rounded-lg">
                <div>
                    <ul>
                        <li>
                            <a href="#" onClick={() => setActiveTab("ANALYTICS")} className={`flex items-center gap-3 text-sm leading-[24px] py-2 px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "ANALYTICS" ? "bg-white" : ""}`}>
                                <img src={AsideTabAnalytics} className='w-6 h-6' alt="Analytics" />
                                <span>Analytics</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => setActiveTab("TO-DO")} className={`flex items-center gap-3 text-sm leading-[24px] py-2 px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "TO-DO" ? "bg-white" : ""}`}>
                                <img src={AsideTabTodo} className='w-6 h-6' alt="To-do List" />
                                <span>To-do List</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => setActiveTab("CALENDAR")} className={`flex items-center gap-3 text-sm leading-[24px] py-2 px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "CALENDAR" ? "bg-white" : ""}`}>
                                <img src={AsideTabCalendar} className='w-6 h-6' alt="Calendar" />
                                <span>Calendar</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
            <section className="flex-1 p-6 bg-[#F5F5F5] rounded-lg">
                <div>
                    <h1>{activeTab}</h1>
                </div>
            </section>
        </main>
    )
}