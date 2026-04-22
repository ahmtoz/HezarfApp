import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabaseClient';

const TimerContext = createContext();

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
    const [dataLoaded, setDataLoaded] = useState(false);

    const timerRef = useRef(null);
    const timeRef = useRef(time);

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
                        dbLogs.forEach(log => {
                            const label = dbLabels.find(l => l.id === log.label_id);
                            if (label && aggregatedLabels[label.name]) {
                                aggregatedLabels[label.name].time += (log.duration_seconds * 1000);
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
            }
            setDataLoaded(true);
        };

        loadData();
    }, [user, authLoading]);

    useEffect(() => {
        timeRef.current = time;
        if (time > 0 && time % 1000 === 0) {
            localStorage.setItem('hezarf_time', time.toString());
        }
    }, [time]);

    // Ziyaretçiler için labels değiştiğinde LocalStorage'a kaydet
    useEffect(() => {
        if (!dataLoaded) return;
        if (!user) {
            localStorage.setItem('hezarf_labels', JSON.stringify(labels));
        }
    }, [labels, user, dataLoaded]);

    useEffect(() => {
        localStorage.setItem('hezarf_lastLabelTime', lastLabelTime.toString());
    }, [lastLabelTime]);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else {
            clearInterval(timerRef.current);
            localStorage.setItem('hezarf_time', timeRef.current.toString());
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const saveTimerLog = async (name, color, durationMs) => {
        if (durationMs <= 0) return;

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

                const durationSeconds = Math.round(durationMs / 1000);
                if (durationSeconds > 0 && labelId) {
                    const { error: logError } = await supabase
                        .from('time_logs')
                        .insert([{ user_id: user.id, label_id: labelId, duration_seconds: durationSeconds }]);

                    if (logError) console.error("Time log kaydetme hatası:", logError);
                }
            } catch (err) {
                console.error("Kayıt işlemi sırasında hata:", err);
            }
        }
    };

    return (
        <TimerContext.Provider value={{
            time, setTime,
            isRunning, setIsRunning,
            labels, setLabels,
            lastLabelTime, setLastLabelTime,
            saveTimerLog
        }}>
            {dataLoaded ? children : null}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);
