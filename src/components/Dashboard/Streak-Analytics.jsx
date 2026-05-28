import { useMemo } from "react";
import { useTimer } from "../../context/TimerContext";

function StreakAnalyics() {
    const { logs } = useTimer();

    const streakCount = useMemo(() => {
        if (!logs || !Array.isArray(logs) || logs.length === 0) {
            return 0;
        }

        // Get unique local days with activity
        const loggedDates = new Set();
        logs.forEach(log => {
            if (log.created_at) {
                const dateStr = new Date(log.created_at).toLocaleDateString('en-CA');
                loggedDates.add(dateStr);
            }
        });

        let currentStreak = 0;
        let checkDate = new Date();
        let todayStr = checkDate.toLocaleDateString('en-CA');

        if (!loggedDates.has(todayStr)) {
            checkDate.setDate(checkDate.getDate() - 1);
            const yesterdayStr = checkDate.toLocaleDateString('en-CA');
            if (!loggedDates.has(yesterdayStr)) {
                return 0;
            }
        }

        while (true) {
            const checkStr = checkDate.toLocaleDateString('en-CA');
            if (loggedDates.has(checkStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        return currentStreak;
    }, [logs]);

    const last7DaysWithLabels = useMemo(() => {
        const today = new Date();
        const days = [];
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dayStr = d.toLocaleDateString('en-CA');
            const dayName = weekdays[d.getDay()];

            const isActive = logs && Array.isArray(logs) && logs.some(log => {
                if (!log.created_at) return false;
                return new Date(log.created_at).toLocaleDateString('en-CA') === dayStr;
            });

            days.push({
                name: dayName,
                isActive
            });
        }
        return days;
    }, [logs]);


    return (
        <article className="flex flex-col gap-3 p-4 bg-white rounded-2xl flex-1 justify-between min-h-[180px]">
            <header className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.484 12.58C18.89 11.53 18.01 10.63 17 9.93c-.92-.66-1.57-1.54-1.9-2.52-.39-1.18-.32-2.42.18-3.56.09-.2-.05-.44-.27-.41-.95.14-1.87.56-2.63 1.19-2.22 1.82-3.15 4.87-2.14 7.64.12.33-.18.65-.5.53-2.1-.8-3.77-2.43-4.57-4.59-.09-.24-.42-.2-.46.06-.63 3.65.61 7.42 3.32 9.87a8.212 8.212 0 0011.64-1.16c1.69-2.04 2.22-4.8 1.4-7.26-.06-.18-.31-.19-.37-.01zM14.5 18c-.83 0-1.5-.67-1.5-1.5 0-1.17 1.5-2.5 1.5-2.5s1.5 1.33 1.5 2.5c0 .83-.67 1.5-1.5 1.5z" />
                </svg>
                <h2>Activity Streak</h2>
            </header>
            <section className="flex flex-col gap-2">
                <div className="flex items-baseline gap-1">
                    <span className="text-[48px] leading-[52px] font-bold text-black">{streakCount}</span>
                    <span className="text-sm font-semibold text-gray-500">{streakCount === 1 ? 'day' : 'days'}</span>
                </div>

                <div className="flex justify-between items-center gap-1 border-t border-gray-100 pt-3">
                    {last7DaysWithLabels.map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                            <span className="text-[10px] text-gray-400 font-bold">{day.name.substring(0, 1)}</span>
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${day.isActive
                                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                                    : 'bg-gray-100 text-gray-300'
                                    }`}
                                title={`${day.name}: ${day.isActive ? 'Active' : 'Inactive'}`}
                            >
                                {day.isActive ? (
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className="text-xs">•</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </article>
    )
}

export default StreakAnalyics;