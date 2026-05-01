import React from 'react';

export default function ProgressTable({ labels, formatTime }) {
    // Determine max time for the progress bar, supporting old numeric format and new object format
    const normalizedLabels = Object.entries(labels || {}).map(([name, data]) => [
        name,
        {
            time: typeof data === 'object' ? data.time : data,
            color: typeof data === 'object' ? data.color : '#3b82f6'
        }
    ]);
    const labelEntries = normalizedLabels.filter(([name, data]) => data.time > 0);
    const maxTime = Math.max(...labelEntries.map(([_, data]) => data.time), 1); // fallback to 1 to avoid division by 0

    return (
        <article className="flex flex-col gap-4 bg-white rounded-xl p-6 border border-gray-100 w-full">
            <header className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-800">Subject Progress</h2>
            </header>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="py-3 px-4 font-semibold text-sm text-gray-500 w-1/3">Subject</th>
                            <th className="py-3 px-4 font-semibold text-sm text-gray-500 w-1/4">Total Time</th>
                            <th className="py-3 px-4 font-semibold text-sm text-gray-500 w-5/12">Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labelEntries.length > 0 ? (
                            labelEntries.sort((a, b) => b[1].time - a[1].time).map(([name, data]) => {
                                const progressPercentage = Math.min(100, Math.round((data.time / maxTime) * 100));
                                return (
                                    <tr key={name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <span 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: data.color || '#3b82f6' }}
                                                ></span>
                                                <span className="font-medium text-gray-800">{name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">
                                            {formatTime ? formatTime(data.time) : data.time}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{ 
                                                            width: `${progressPercentage}%`,
                                                            backgroundColor: data.color || '#3b82f6'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-gray-500 text-sm">
                                    No study data available yet. Start a timer to see your progress!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </article>
    );
}
