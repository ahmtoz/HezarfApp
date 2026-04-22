import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabaseClient';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [labels, setLabels] = useState({});
    const [lastLabelTime, setLastLabelTime] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);

    const timerRef = useRef(null);
    const timeRef = useRef(time);

    // Başlangıç verilerini yükleme
    useEffect(() => {
        if (authLoading) return;

        const loadData = async () => {
            if (user) {
                // Giriş yapmış kullanıcı için Supabase'den çek
                const { data, error } = await supabase
                    .from('user_timers')
                    .select('time, labels, lastLabelTime')
                    .eq('user_id', user.id)
                    .single();

                if (data) {
                    setTime(data.time || 0);
                    setLabels(data.labels || {});
                    setLastLabelTime(data.lastLabelTime || 0);
                } else if (error && error.code === 'PGRST116') {
                    // Kayıt yoksa oluştur (PGRST116: no rows returned)
                    await supabase.from('user_timers').insert([{ user_id: user.id }]);
                    setTime(0);
                    setLabels({});
                    setLastLabelTime(0);
                }
            } else {
                // Ziyaretçi için LocalStorage'dan çek
                const savedTime = localStorage.getItem('hezarf_time');
                setTime(savedTime ? parseInt(savedTime, 10) : 0);

                const savedLabels = localStorage.getItem('hezarf_labels');
                setLabels(savedLabels ? JSON.parse(savedLabels) : {});

                const savedLastLabel = localStorage.getItem('hezarf_lastLabelTime');
                setLastLabelTime(savedLastLabel ? parseInt(savedLastLabel, 10) : 0);
            }
            setDataLoaded(true);
        };

        loadData();
    }, [user, authLoading]);

    // Time güncellemeleri
    useEffect(() => {
        if (!dataLoaded) return;

        timeRef.current = time;
        if (time > 0 && time % 1000 === 0) {
            localStorage.setItem('hezarf_time', time.toString());
        }

        // Supabase için daha seyrek güncelleme (örneğin her 5 saniyede bir)
        if (user && time > 0 && time % 5000 === 0) {
            supabase.from('user_timers').update({ time }).eq('user_id', user.id).then();
        }
    }, [time, user, dataLoaded]);

    // Labels güncellemeleri
    useEffect(() => {
        if (!dataLoaded) return;

        localStorage.setItem('hezarf_labels', JSON.stringify(labels));
        if (user) {
            supabase.from('user_timers').update({ labels }).eq('user_id', user.id).then();
        }
    }, [labels, user, dataLoaded]);

    // LastLabelTime güncellemeleri
    useEffect(() => {
        if (!dataLoaded) return;

        localStorage.setItem('hezarf_lastLabelTime', lastLabelTime.toString());
        if (user) {
            supabase.from('user_timers').update({ lastLabelTime }).eq('user_id', user.id).then();
        }
    }, [lastLabelTime, user, dataLoaded]);

    // Timer kontrolü
    useEffect(() => {
        if (!dataLoaded) return;

        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else {
            clearInterval(timerRef.current);
            localStorage.setItem('hezarf_time', timeRef.current.toString());
            if (user) {
                // Durdurulduğunda son durumu kesin kaydet
                supabase.from('user_timers').update({ time: timeRef.current }).eq('user_id', user.id).then();
            }
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning, user, dataLoaded]);

    return (
        <TimerContext.Provider value={{
            time, setTime,
            isRunning, setIsRunning,
            labels, setLabels,
            lastLabelTime, setLastLabelTime,
        }}>
            {/* Veriler yüklenene kadar UI gösterilmesini engellemek için */}
            {dataLoaded ? children : null}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);
