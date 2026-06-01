import React, { useMemo } from 'react';
import { useTimer } from '../../context/TimerContext';
import { useTodo } from '../../context/TodoContext';
import { formatTime } from '../../utils/formatTime';
import TimeAnalytics from '../../components/Dashboard/Time-Analytics';
import StreakAnalytics from '../../components/Dashboard/Streak-Analytics';
import { TimePieChart, TimeRadarChart, TimeLineChart } from '../../components/Charts';
import SpiderChartAnalyticsIcon from '../../assets/img/spider-chart-analytics-icon.svg';
import PieChartAnalyticsIcon from '../../assets/img/pie-chart-analytics-icon.svg';
import TimeAnalyticsIcon from "../../assets/img/time-analytics-icon.svg";
import TasksAnalyticsIcon from "../../assets/img/todo-analytics-icon.svg";
import AsideTabAnalytics from '../../assets/img/aside-tab-analytics.svg';
import useAnalyticsData from '../../hooks/useAnalyticsData';

function Analytics() {
    const { labels, logs } = useTimer();
    const { todos } = useTodo();

    const { timerAnalytics, todoAnalytics } = useAnalyticsData(logs, todos);

    const todosCount = useMemo(() => {
        return todos.filter(todo => todo.is_completed).length;
    }, [todos]);

    const { totalTimeMs, pieData, weeklyData, colors } = useMemo(() => {
        const total = Object.values(labels || {}).reduce((acc, label) => acc + (label.time || 0), 0);

        const pie = Object.entries(labels || {}).map(([name, data]) => ({
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

        // 2. Build daily data map
        const weeklyDataMap = {};

        daysOfWeek.forEach((day, index) => {
            weeklyDataMap[day] = { day };
            Object.keys(labels || {}).forEach(labelName => {
                // Only include labels that were used this week
                if (weekTotals[labelName] > 0) {
                    if (index <= currentDayIndex) {
                        // Daily time for past and current days
                        weeklyDataMap[day][labelName] = dailySums[day][labelName] || 0;
                    } else {
                        // For future days, set to null (line stops)
                        weeklyDataMap[day][labelName] = null;
                    }
                }
            });
        });

        const weekly = Object.values(weeklyDataMap);

        const cols = {};
        Object.entries(labels || {}).map(([name, data]) => {
            cols[name] = data.color;
        });

        return { totalTimeMs: total, pieData: pie, weeklyData: weekly, colors: cols };
    }, [labels, logs]);

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4">
                <TimeAnalytics flexWidth="flex-1" title="Total Time" img={TimeAnalyticsIcon} values={timerAnalytics} value={formatTime(totalTimeMs)} />
                <TimeAnalytics flexWidth="flex-1" title="Tasks Done" img={TasksAnalyticsIcon} values={todoAnalytics} value={todosCount} />
                <StreakAnalytics />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <TimeRadarChart data={pieData} formatTime={formatTime} icon={SpiderChartAnalyticsIcon} title="Spider Chart" />
                </div>
                <div className="flex-1">
                    <TimePieChart data={pieData} formatTime={formatTime} icon={PieChartAnalyticsIcon} title="Pie Chart" />
                </div>
            </div>
            <div className="flex gap-4">
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
        </>
    )
}

export default Analytics;