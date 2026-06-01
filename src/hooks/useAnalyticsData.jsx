import { useMemo } from "react";
import { formatTime } from "../utils/formatTime";

export default function useAnalyticsData(logs, todos) {

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

    return { timerAnalytics, todoAnalytics };
}
