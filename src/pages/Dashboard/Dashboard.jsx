import React, { useState } from 'react';
import AsideTabAnalytics from '../../assets/img/aside-tab-analytics.svg';
import AsideTabTodo from '../../assets/img/aside-tab-todo.svg';
import AsideTabCalendar from '../../assets/img/aside-tab-calendar.svg';
import AsideTabSwitcher from '../../assets/img/aside-tab-switcher.svg';

import Analytics from './Analytics.jsx';
import TodoCanvas from '../../components/todo/TodoCanvas.tsx';
import Calendar from './Calendar.jsx';

export default function Dashboard() {

    const [activeTab, setActiveTab] = useState("Analytics");
    const [isAsideOpen, setIsAsideOpen] = useState(true);

    return (
        <main className="flex flex-col-reverse md:flex-row gap-6 mx-auto pt-10 pb-12 px-5 md:px-10 lg:px-20 xl:px-40 max-w-[1440px]">
            <aside className={`fixed md:relative bottom-0 md:bottom-auto left-0 md:left-auto w-full z-9 flex flex-col gap-6 ${isAsideOpen ? 'md:w-[286px]' : 'md:w-[64px]'} h-auto p-4 bg-light-gray md:rounded-lg transition-width duration-300`}>
                <button
                    onClick={() => setIsAsideOpen(!isAsideOpen)}
                    className="hidden md:block absolute -right-3 top-4 p-1 flex items-center justify-center rounded-full bg-white cursor-pointer transition-width duration-300" style={{ boxShadow: "0px 0px 1px 0px rgba(0, 0, 0, 0.4), 0px 6px 6px -6px rgba(0, 0, 0, 0.16)" }}>
                    {isAsideOpen ? <img src={AsideTabSwitcher} className='block w-4 h-4 rotate-180' alt="Switcher" /> : <img src={AsideTabSwitcher} className='block w-4 h-4' alt="Switcher" />}
                </button>
                <div className={`${isAsideOpen ? 'overflow-visible' : 'overflow-clip'}`}>
                    <ul className="flex flex-row md:flex-col justify-evenly md:justify-start">
                        <li>
                            <a href="#" onClick={() => setActiveTab("Analytics")} className={`flex flex-col md:flex-row items-center gap-0 md:gap-3 text-sm leading-[24px] p-2 md:py-2 md:px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "Analytics" ? "bg-white" : ""}`}>
                                <img src={AsideTabAnalytics} className='w-5 h-5 md:w-6 md:h-6' alt="Analytics" />
                                <span className='whitespace-nowrap text-xs md:text-sm'>Analytics</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => setActiveTab("To-do List")} className={`flex flex-col md:flex-row items-center gap-0 md:gap-3 text-sm leading-[24px] p-2 md:py-2 md:px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "To-do List" ? "bg-white" : ""}`}>
                                <img src={AsideTabTodo} className='w-5 h-5 md:w-6 md:h-6' alt="To-do List" />
                                <span className='whitespace-nowrap text-xs md:text-sm'>To-do List</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => setActiveTab("Calendar")} className={`flex flex-col md:flex-row items-center gap-0 md:gap-3 text-sm leading-[24px] p-2 md:py-2 md:px-1 border-none rounded-md w-full cursor-pointer ${activeTab === "Calendar" ? "bg-white" : ""}`}>
                                <img src={AsideTabCalendar} className='w-5 h-5 md:w-6 md:h-6' alt="Calendar" />
                                <span className='whitespace-nowrap text-xs md:text-sm'>Calendar</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
            <section className="flex-1 p-6 bg-light-gray rounded-lg min-h-[600px]">
                <div className="flex flex-col gap-4 h-full">
                    <div className='flex items-center gap-3 bg-white rounded-lg p-2'>
                        <img src={activeTab === "Analytics" ? AsideTabAnalytics : activeTab === "To-do List" ? AsideTabTodo : AsideTabCalendar} alt="" />
                        <h1 className='text-xl leading-[24px] text-black'>{activeTab} Overview</h1>
                    </div>

                    {/* Analytics Content */}
                    <div className={`flex flex-col gap-4 ${activeTab === "Analytics" ? "" : "hidden"}`}>
                        <Analytics />
                    </div>

                    {/* To-do List Placeholder */}
                    <div className={`flex-1 flex flex-col items-center justify-center gap-4 ${activeTab === "To-do List" ? "" : "hidden"}`}>
                        <TodoCanvas />
                    </div>

                    {/* Calendar Placeholder */}
                    <div className={`flex-1 flex flex-col items-center justify-center gap-4 ${activeTab === "Calendar" ? "" : "hidden"}`}>
                        <Calendar />
                    </div>
                </div>
            </section>
        </main>
    )
}