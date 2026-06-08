import { useMemo } from "react";
import { formatTime } from "../utils/formatTime";

export default function useAnalyticsData(logs, todos, labels) {

    const timerAnalytics = useMemo(() => {
        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now);
        startOfMonth.setDate(startOfMonth.getDate() - 30);
        startOfMonth.setHours(0, 0, 0, 0);

        let dailySum = 0;
        let weeklySum = 0;
        let monthlySum = 0;

        if (logs && Array.isArray(logs)) {
            logs.forEach(log => {
                if (!log.created_at) return;
                const logDate = new Date(log.created_at);
                const duration = log.duration_ms !== undefined && log.duration_ms !== null
                    ? log.duration_ms
                    : (log.duration_seconds ? log.duration_seconds * 1000 : 0);

                if (logDate >= startOfToday) {
                    dailySum += duration;
                }
                if (logDate >= startOfWeek) {
                    weeklySum += duration;
                }
                if (logDate >= startOfMonth) {
                    monthlySum += duration;
                }
            });
        }

        return {
            DAILY: formatTime(dailySum),
            WEEKLY: formatTime(weeklySum),
            MONTHLY: formatTime(monthlySum)
        };
    }, [logs]);

    const todoAnalytics = useMemo(() => {
        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now);
        startOfMonth.setDate(startOfMonth.getDate() - 30);
        startOfMonth.setHours(0, 0, 0, 0);

        let dailyCount = 0;
        let weeklyCount = 0;
        let monthlyCount = 0;

        if (todos && Array.isArray(todos)) {
            todos.forEach(todo => {
                if (!todo.is_completed) return;

                // Fallback: if completed_at isn't set, fallback to created_at or default to now
                const completedDate = todo.completed_at
                    ? new Date(todo.completed_at)
                    : new Date(todo.created_at || now);

                if (completedDate >= startOfToday) {
                    dailyCount++;
                }
                if (completedDate >= startOfWeek) {
                    weeklyCount++;
                }
                if (completedDate >= startOfMonth) {
                    monthlyCount++;
                }
            });
        }

        return {
            DAILY: dailyCount,
            WEEKLY: weeklyCount,
            MONTHLY: monthlyCount
        };
    }, [todos]);

    const labelAnalytics = useMemo(() => {
        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(now);
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now);
        startOfMonth.setDate(startOfMonth.getDate() - 30);
        startOfMonth.setHours(0, 0, 0, 0);

        const dailySums = {};
        const weeklySums = {};
        const monthlySums = {};

        if (labels) {
            Object.entries(labels).forEach(([name, labelData]) => {
                const color = typeof labelData === 'object' ? labelData.color : '#3b82f6';
                dailySums[name] = { name, value: 0, color };
                weeklySums[name] = { name, value: 0, color };
                monthlySums[name] = { name, value: 0, color };
            });
        }

        if (logs && Array.isArray(logs)) {
            logs.forEach(log => {
                if (!log.created_at) return;
                const logDate = new Date(log.created_at);
                const duration = log.duration_ms !== undefined && log.duration_ms !== null
                    ? log.duration_ms
                    : (log.duration_seconds ? log.duration_seconds * 1000 : 0);

                const labelName = labels ? Object.keys(labels).find(name =>
                    labels[name].id === log.label_id || name === log.label_id
                ) : null;

                if (labelName && dailySums[labelName]) {
                    if (logDate >= startOfToday) {
                        dailySums[labelName].value += duration;
                    }
                    if (logDate >= startOfWeek) {
                        weeklySums[labelName].value += duration;
                    }
                    if (logDate >= startOfMonth) {
                        monthlySums[labelName].value += duration;
                    }
                }
            });
        }

        return {
            DAILY: Object.values(dailySums),
            WEEKLY: Object.values(weeklySums),
            MONTHLY: Object.values(monthlySums)
        };
    }, [logs, labels]);

    const totalTimeMs = useMemo(() => {
        if (!labels) return 0;
        return Object.values(labels).reduce((acc, label) => acc + (label.time || 0), 0);
    }, [labels]);

    const { weeklyData, colors } = useMemo(() => {
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        const now = new Date();
        const currentDay = now.getDay();
        const diffToMonday = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
        const startOfWeek = new Date(now.setDate(diffToMonday));
        startOfWeek.setHours(0, 0, 0, 0);

        const currentDayIndex = currentDay === 0 ? 6 : currentDay - 1;

        const dailySums = {};
        const weekTotals = {};
        daysOfWeek.forEach(day => { dailySums[day] = {}; });
        
        if (labels) {
            Object.keys(labels).forEach(labelName => { weekTotals[labelName] = 0; });
        }

        if (logs && Array.isArray(logs) && labels) {
            logs.forEach(log => {
                if (!log.created_at) return;
                const logDate = new Date(log.created_at);
                if (logDate >= startOfWeek) {
                    const dayIndex = logDate.getDay() === 0 ? 6 : logDate.getDay() - 1;
                    const dayName = daysOfWeek[dayIndex];

                    const labelName = Object.keys(labels).find(name =>
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

        const weeklyDataMap = {};
        daysOfWeek.forEach((day, index) => {
            weeklyDataMap[day] = { day };
            if (labels) {
                Object.keys(labels).forEach(labelName => {
                    if (weekTotals[labelName] > 0) {
                        if (index <= currentDayIndex) {
                            weeklyDataMap[day][labelName] = dailySums[day][labelName] || 0;
                        } else {
                            weeklyDataMap[day][labelName] = null;
                        }
                    }
                });
            }
        });

        const weekly = Object.values(weeklyDataMap);

        const cols = {};
        if (labels) {
            Object.entries(labels).forEach(([name, data]) => {
                cols[name] = data.color;
            });
        }

        return { weeklyData: weekly, colors: cols };
    }, [labels, logs]);

    return { timerAnalytics, todoAnalytics, labelAnalytics, totalTimeMs, weeklyData, colors };
}
