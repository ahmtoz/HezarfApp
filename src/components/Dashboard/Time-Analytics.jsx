import { useState } from "react";
import TimeAnalyticsIcon from "../../assets/img/time-analytics-icon.svg";

export default function TimeAnalytics({ flexWidth, title, time }) {

    const [activeTime, setActiveTime] = useState("DAILY");

    return (
        <article className={`flex ${flexWidth} flex-col gap-3 p-4 bg-white rounded-2xl`}>
            <header className="flex items-center gap-2">
                <img src={TimeAnalyticsIcon} alt="" />
                <h2>{title}</h2>
            </header>
            <section className="flex flex-col gap-3">
                <div className="flex items-center">
                    <button onClick={() => setActiveTime("DAILY")} className={`relative flex-1 text-sm leading-[24px] font-bold cursor-pointer py-2 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-all after:origin-center after:duration-300 ${activeTime === "DAILY" ? "text-primary after:scale-x-100" : ""}`}>Daily</button>
                    <button onClick={() => setActiveTime("WEEKLY")} className={`relative flex-1 text-sm leading-[24px] font-bold cursor-pointer py-2 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-all after:origin-center after:duration-300 ${activeTime === "WEEKLY" ? "text-primary after:scale-x-100" : ""}`}>Weekly</button>
                    <button onClick={() => setActiveTime("MONTHLY")} className={`relative flex-1 text-sm leading-[24px] font-bold cursor-pointer py-2 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:transition-all after:origin-center after:duration-300 ${activeTime === "MONTHLY" ? "text-primary after:scale-x-100" : ""}`}>Monthly</button>
                </div>
                <div className="flex items-center">
                    <p className="text-[56px] leading-[68px] text-black">{time}</p>
                </div>
            </section>
        </article>
    )
}