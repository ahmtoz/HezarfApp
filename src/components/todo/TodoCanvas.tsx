import React, { useState, useMemo } from 'react';
import { useTodo } from '../../context/TodoContext';
import { CanvasBlock, Task } from '../../types/todo';

const getWeekString = (date: Date): string => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

const getDaysOfWeek = (date: Date): { name: string; dateStr: string; label: string }[] => {
    const current = new Date(date);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const days = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d.getDate()).padStart(2, '0');
        days.push({
            name: dayNames[i],
            dateStr: `${year}-${month}-${dayStr}`,
            label: `${dayNames[i]} (${dayStr}.${month})`
        });
    }
    return days;
};

export default function TodoCanvas() {
    const {
        blocks,
        addBlock,
        updateBlock,
        deleteBlock,
        addTaskToBlock,
        toggleTaskInBlock,
        deleteTaskFromBlock,
        assignTaskToDate
    } = useTodo();

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [newTaskTitles, setNewTaskTitles] = useState<{ [blockId: string]: string }>({});

    const selectedWeek = useMemo(() => getWeekString(currentDate), [currentDate]);
    const weekDays = useMemo(() => getDaysOfWeek(currentDate), [currentDate]);

    const activeBlocks = useMemo(() => {
        return blocks.filter(b => b.weekId === selectedWeek);
    }, [blocks, selectedWeek]);

    const handlePrevWeek = () => {
        setCurrentDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 7);
            return d;
        });
    };

    const handleNextWeek = () => {
        setCurrentDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 7);
            return d;
        });
    };

    const handleCurrentWeek = () => {
        setCurrentDate(new Date());
    };

    const handleAddTask = (blockId: string) => {
        const title = newTaskTitles[blockId] || '';
        if (title.trim()) {
            addTaskToBlock(blockId, title.trim());
            setNewTaskTitles(prev => ({ ...prev, [blockId]: '' }));
        }
    };

    const dotGridStyle = {
        backgroundImage: 'radial-gradient(rgba(78, 70, 180, 0.15) 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
    };

    return (
        <div className="flex flex-col w-full min-h-[650px] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Canvas Üst Kontrol Paneli */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border-b border-gray-100 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Haftalık Görev Tuvali</h2>
                        <p className="text-xs text-gray-400">Esnek panellerle haftanızı tasarlayın</p>
                    </div>
                </div>

                {/* Hafta Gezinme Araçları */}
                <div className="flex items-center bg-light-gray p-1 rounded-xl gap-1">
                    <button
                        onClick={handlePrevWeek}
                        className="p-2 hover:bg-white rounded-lg transition-all duration-200 text-gray-600 hover:text-primary hover:shadow-sm hover:cursor-pointer"
                        title="Önceki Hafta"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleCurrentWeek}
                        className="px-3 py-1 bg-white hover:bg-gray-50 rounded-lg text-xs font-semibold text-primary shadow-sm hover:cursor-pointer transition-all duration-200"
                    >
                        Bu Hafta
                    </button>
                    <span className="px-3 text-sm font-bold text-gray-700 min-w-[100px] text-center">
                        {selectedWeek}
                    </span>
                    <button
                        onClick={handleNextWeek}
                        className="p-2 hover:bg-white rounded-lg transition-all duration-200 text-gray-600 hover:text-primary hover:shadow-sm hover:cursor-pointer"
                        title="Sonraki Hafta"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Yeni Blok Ekleme Butonları */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => addBlock(selectedWeek, 'text')}
                        className="flex items-center gap-2 px-4 py-2 bg-light-gray text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200/80 transition-all duration-200 hover:cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        + Metin Bloğu
                    </button>
                    <button
                        onClick={() => addBlock(selectedWeek, 'todo')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-all duration-200 hover:cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        + Görev Bloğu
                    </button>
                </div>
            </div>

            {/* Canvas Alanı (Noktalı Tema Arka Plan) */}
            <div
                style={dotGridStyle}
                className="flex-1 p-6 md:p-8 bg-gray-50/50 min-h-[500px]"
            >
                {activeBlocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400 text-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary/40">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">Bu haftaya ait henüz blok eklenmemiş.</p>
                            <p className="text-xs text-gray-400 mt-1">Yukarıdaki butonları kullanarak yeni bloklar oluşturun.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                        {activeBlocks.map(block => (
                            <div
                                key={block.id}
                                className="group relative bg-white border border-gray-100 hover:border-primary/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* Silme ve Ayarlar Butonları */}
                                <button
                                    onClick={() => deleteBlock(block.id)}
                                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-300 hover:text-secondary hover:bg-secondary/5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:cursor-pointer"
                                    title="Bloğu Sil"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>

                                {/* Blok Türüne Göre Render */}
                                {block.type === 'text' ? (
                                    <div className="p-5 flex flex-col h-full min-h-[220px]">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Not Defteri</span>
                                        </div>
                                        <textarea
                                            value={block.content}
                                            onChange={(e) => updateBlock(block.id, { type: 'text', content: e.target.value })}
                                            placeholder="Notlarınızı buraya yazın..."
                                            className="flex-1 w-full text-sm text-gray-700 bg-transparent resize-none border-0 focus:ring-0 focus:outline-none placeholder-gray-300"
                                        />
                                    </div>
                                ) : (
                                    <div className="p-5 flex flex-col h-full min-h-[260px]">
                                        {/* Görev Bloğu Başlığı */}
                                        <div className="flex items-center gap-2 mb-4 pr-6">
                                            <input
                                                type="text"
                                                value={block.title}
                                                onChange={(e) => updateBlock(block.id, { type: 'todo', title: e.target.value })}
                                                className="w-full text-base font-bold text-gray-800 border-b border-transparent hover:border-gray-200 focus:border-primary focus:outline-none transition-colors py-0.5 bg-transparent"
                                                placeholder="Liste Başlığı"
                                            />
                                        </div>

                                        {/* Görev Listesi */}
                                        <div className="flex-1 space-y-2 mb-4 max-h-[260px] overflow-y-auto pr-1">
                                            {block.tasks.length === 0 ? (
                                                <div className="text-xs text-gray-300 italic py-2">Henüz görev eklenmedi.</div>
                                            ) : (
                                                block.tasks.map(task => (
                                                    <div
                                                        key={task.id}
                                                        className="flex items-center gap-2.5 p-2 bg-light-gray rounded-xl hover:bg-gray-100/70 transition-colors group/task"
                                                    >
                                                        {/* Checkbox Düğmesi */}
                                                        <button
                                                            onClick={() => toggleTaskInBlock(block.id, task.id)}
                                                            className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 hover:cursor-pointer transition-colors duration-200 ${task.isCompleted ? 'bg-primary border-primary' : 'border-gray-300 bg-white hover:border-primary'}`}
                                                        >
                                                            {task.isCompleted && (
                                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </button>

                                                        {/* Görev Başlığı Edit Alanı */}
                                                        <input
                                                            type="text"
                                                            value={task.title}
                                                            onChange={(e) => {
                                                                const updatedTasks = block.tasks.map(t =>
                                                                    t.id === task.id ? { ...t, title: e.target.value } : t
                                                                );
                                                                updateBlock(block.id, { type: 'todo', tasks: updatedTasks });
                                                            }}
                                                            className={`flex-1 text-xs bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-700 py-0.5 ${task.isCompleted ? 'line-through text-gray-400' : ''}`}
                                                        />

                                                        {/* Gün Atama (Date Assign) Seçici */}
                                                        <select
                                                            value={task.assignedDate || ''}
                                                            onChange={(e) => assignTaskToDate(block.id, task.id, e.target.value || null)}
                                                            className="text-[10px] px-1.5 py-0.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:border-primary hover:cursor-pointer focus:outline-none transition-colors"
                                                            title="Güne Ata"
                                                        >
                                                            <option value="">Ata...</option>
                                                            {weekDays.map(day => (
                                                                <option key={day.dateStr} value={day.dateStr}>
                                                                    {day.name.substring(0, 3)}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {/* Alt Görev Silme */}
                                                        <button
                                                            onClick={() => deleteTaskFromBlock(block.id, task.id)}
                                                            className="opacity-0 group-hover/task:opacity-100 hover:cursor-pointer text-gray-300 hover:text-secondary transition-all duration-150"
                                                            title="Görevi Sil"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Hızlı Yeni Görev Ekleme Alt Barı */}
                                        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
                                            <input
                                                type="text"
                                                value={newTaskTitles[block.id] || ''}
                                                onChange={(e) => setNewTaskTitles(prev => ({ ...prev, [block.id]: e.target.value }))}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddTask(block.id)}
                                                placeholder="Yeni görev..."
                                                className="flex-1 text-xs px-3 py-2 bg-light-gray rounded-xl border border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all duration-200"
                                            />
                                            <button
                                                onClick={() => handleAddTask(block.id)}
                                                className="px-3 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover hover:cursor-pointer transition-colors"
                                            >
                                                Ekle
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
