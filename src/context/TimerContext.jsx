import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabaseClient';
import { formatTime } from '../utils/formatTime';

const TimerContext = createContext();

export const formatTimeForTitle = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);

    const formatMinutes = minutes.toString().padStart(2, '0');
    const formatSeconds = seconds.toString().padStart(2, '0');

    return `${formatMinutes}:${formatSeconds}`;
};

export const TimerProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();

    const [time, setTime] = useState(() => {
        const savedTime = localStorage.getItem('hezarf_time');
        return savedTime ? parseInt(savedTime, 10) : 0;
    });
    const [lastLabelTime, setLastLabelTime] = useState(() => {
        const savedLastLabel = localStorage.getItem('hezarf_lastLabelTime');
        return savedLastLabel ? parseInt(savedLastLabel, 10) : 0;
    });

    const [isRunning, setIsRunning] = useState(false);
    const [labels, setLabels] = useState({});
    const [logs, setLogs] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    
    const [hiddenLabels, setHiddenLabels] = useState(() => {
        const savedHidden = localStorage.getItem('hezarf_hiddenLabels');
        return savedHidden ? JSON.parse(savedHidden) : [];
    });

    const timerRef = useRef(null);
    const timeRef = useRef(time);
    const lastSavedTimeRef = useRef(time);

    useEffect(() => {
        if (authLoading) return;

        const loadData = async () => {
            if (user) {
                try {
                    const { data: dbLabels, error: labelsError } = await supabase
                        .from('labels')
                        .select('*')
                        .eq('user_id', user.id);

                    if (labelsError) throw labelsError;

                    const { data: dbLogs, error: logsError } = await supabase
                        .from('time_logs')
                        .select('*')
                        .eq('user_id', user.id);

                    if (logsError) throw logsError;

                    // Format: { "Math": { id: "uuid", time: 5000, color: "#blue" } }
                    const aggregatedLabels = {};

                    if (dbLabels) {
                        dbLabels.forEach(l => {
                            aggregatedLabels[l.name] = { id: l.id, time: 0, color: l.color };
                        });
                    }

                    if (dbLogs && dbLabels) {
                        setLogs(dbLogs);
                        dbLogs.forEach(log => {
                            const label = dbLabels.find(l => l.id === log.label_id);
                            if (label && aggregatedLabels[label.name]) {
                                // Prefer duration_ms, fallback to duration_seconds for old data
                                const duration = log.duration_ms !== undefined && log.duration_ms !== null
                                    ? log.duration_ms
                                    : (log.duration_seconds * 1000);
                                aggregatedLabels[label.name].time += duration;
                            }
                        });
                    }

                    setLabels(aggregatedLabels);
                } catch (error) {
                    console.error("Supabase Veri Çekme Hatası:", error);
                }
            } else {
                // Ziyaretçi için LocalStorage'dan çek
                const savedLabels = localStorage.getItem('hezarf_labels');
                setLabels(savedLabels ? JSON.parse(savedLabels) : {});

                const savedLogs = localStorage.getItem('hezarf_logs');
                setLogs(savedLogs ? JSON.parse(savedLogs) : []);
            }
            setDataLoaded(true);
        };

        loadData();
    }, [user, authLoading]);

    useEffect(() => {
        timeRef.current = time;
        if (Math.abs(time - lastSavedTimeRef.current) >= 1000 || time === 0) {
            localStorage.setItem('hezarf_time', time.toString());
            lastSavedTimeRef.current = time;
        }
    }, [time]);

    // Ziyaretçiler için labels değiştiğinde LocalStorage'a kaydet
    useEffect(() => {
        if (!dataLoaded) return;
        if (!user) {
            localStorage.setItem('hezarf_labels', JSON.stringify(labels));
            localStorage.setItem('hezarf_logs', JSON.stringify(logs));
        }
    }, [labels, logs, user, dataLoaded]);

    useEffect(() => {
        localStorage.setItem('hezarf_lastLabelTime', lastLabelTime.toString());
    }, [lastLabelTime]);

    useEffect(() => {
        localStorage.setItem('hezarf_hiddenLabels', JSON.stringify(hiddenLabels));
    }, [hiddenLabels]);


    useEffect(() => {
        if (isRunning) {
            document.title = `${formatTimeForTitle(time)} - Hezarfapp`;
        } else if (time > 0) {
            document.title = `${formatTimeForTitle(time)} - Hezarfapp`;
        } else {
            document.title = "Hezarfapp";
        }
    }, [time, isRunning]);

    useEffect(() => {
        if (isRunning) {
            let lastTick = Date.now();
            timerRef.current = setInterval(() => {
                const now = Date.now();
                const delta = now - lastTick;
                lastTick = now;
                setTime((prevTime) => prevTime + delta);
            }, 10);
        } else {
            clearInterval(timerRef.current);
            localStorage.setItem('hezarf_time', timeRef.current.toString());
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const saveTimerLog = async (name, color, durationMs) => {
        if (durationMs <= 0) return;

        // Ensure the label is visible if it was previously hidden
        setHiddenLabels(prev => prev.filter(l => l !== name));

        setLabels(prev => {
            const existing = prev[name];
            return {
                ...prev,
                [name]: {
                    ...existing,
                    time: (existing?.time || 0) + durationMs,
                    color: color
                }
            };
        });

        setLastLabelTime(prev => prev + durationMs);

        // Veritabanı İşlemleri
        if (user) {
            try {
                let labelId = null;

                const { data: existingLabel, error: checkError } = await supabase
                    .from('labels')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('name', name)
                    .maybeSingle();

                if (existingLabel) {
                    labelId = existingLabel.id;
                } else {
                    const { data: newLabel, error: insertError } = await supabase
                        .from('labels')
                        .insert([{ user_id: user.id, name, color }])
                        .select()
                        .single();

                    if (insertError) {
                        console.error("Etiket kaydetme hatası:", insertError);
                        return;
                    }
                    if (newLabel) {
                        labelId = newLabel.id;
                        setLabels(prev => ({ ...prev, [name]: { ...prev[name], id: labelId } }));
                    }
                }

                if (durationMs > 0 && labelId) {
                    const newLog = {
                        user_id: user.id,
                        label_id: labelId,
                        duration_ms: durationMs,
                        duration_seconds: Math.round(durationMs / 1000),
                    };

                    const { data: insertedLog, error: logError } = await supabase
                        .from('time_logs')
                        .insert([newLog])
                        .select()
                        .single();

                    if (logError) {
                        console.error("Time log kaydetme hatası:", logError);
                    } else if (insertedLog) {
                        setLogs(prev => [...prev, insertedLog]);
                    }
                }
            } catch (err) {
                console.error("Kayıt işlemi sırasında hata:", err);
            }
        } else if (!user && durationMs > 0) {
            const visitorLog = {
                id: Math.random().toString(36).substring(7),
                label_id: name,
                duration_ms: durationMs,
                created_at: new Date().toISOString()
            };
            setLogs(prev => [...prev, visitorLog]);
        }
    };

    const clearLabel = (name) => {
        setHiddenLabels(prev => {
            if (!prev.includes(name)) return [...prev, name];
            return prev;
        });
    };

    const deleteLabel = async (id, name) => {
        setLabels(prev => {
            const newLabels = { ...prev };
            delete newLabels[name];
            return newLabels;
        });
        setLogs(prev => prev.filter(log => log.label_id !== id && log.label_id !== name));
        
        // Ensure it's removed from hidden labels if deleted
        setHiddenLabels(prev => prev.filter(l => l !== name));

        if (user && id) {
            try {
                const { error: logsError } = await supabase
                    .from('time_logs')
                    .delete()
                    .eq('label_id', id);
                
                if (logsError) console.error("Time log delete error:", logsError);

                const { error: labelError } = await supabase
                    .from('labels')
                    .delete()
                    .eq('id', id);

                if (labelError) console.error("Label delete error:", labelError);
            } catch (err) {
                console.error("Delete operation failed:", err);
            }
        }
    };

    const clearAllLabels = () => {
        setHiddenLabels(Object.keys(labels));
    };

    const deleteAllLabels = async () => {
        setLabels({});
        setLogs([]);
        setHiddenLabels([]);

        if (user) {
            try {
                const { error: logsError } = await supabase
                    .from('time_logs')
                    .delete()
                    .eq('user_id', user.id);
                
                if (logsError) console.error("All time logs delete error:", logsError);

                const { error: labelsError } = await supabase
                    .from('labels')
                    .delete()
                    .eq('user_id', user.id);

                if (labelsError) console.error("All labels delete error:", labelsError);
            } catch (err) {
                console.error("Delete all operation failed:", err);
            }
        }
    };

    const visibleLabels = Object.fromEntries(
        Object.entries(labels).filter(([name]) => !hiddenLabels.includes(name))
    );

    return (
        <TimerContext.Provider value={{
            time, setTime,
            isRunning, setIsRunning,
            labels: visibleLabels, setLabels,
            logs, setLogs,
            lastLabelTime, setLastLabelTime,
            saveTimerLog,
            clearLabel,
            deleteLabel,
            clearAllLabels,
            deleteAllLabels
        }}>
            {dataLoaded ? children : null}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);
