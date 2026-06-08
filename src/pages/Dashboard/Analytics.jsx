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

    const {
        timerAnalytics,
        todoAnalytics,
        labelAnalytics,
        totalTimeMs,
        weeklyData,
        colors
    } = useAnalyticsData(logs, todos, labels);


    const todosCount = useMemo(() => {
        return todos.filter(todo => todo.is_completed).length;
    }, [todos]);

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4">
                <TimeAnalytics flexWidth="flex-1" title="Total Time" img={TimeAnalyticsIcon} values={timerAnalytics} value={formatTime(totalTimeMs)} />
                <TimeAnalytics flexWidth="flex-1" title="Tasks Done" img={TasksAnalyticsIcon} values={todoAnalytics} value={todosCount} />
                <StreakAnalytics />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <TimeRadarChart data={labelAnalytics} formatTime={formatTime} icon={SpiderChartAnalyticsIcon} title="Spider Chart" />
                </div>
                <div className="flex-1">
                    <TimePieChart data={labelAnalytics} formatTime={formatTime} icon={PieChartAnalyticsIcon} title="Pie Chart" />
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