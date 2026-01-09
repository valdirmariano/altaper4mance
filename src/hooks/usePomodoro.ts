import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PomodoroSession {
  id: string;
  session_date: string;
  sessions_count: number;
  focus_minutes: number;
  daily_goal: number;
  created_at: string;
  updated_at: string;
}

export const usePomodoro = () => {
  const [todaySession, setTodaySession] = useState<PomodoroSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const today = new Date().toISOString().split('T')[0];

  const fetchTodaySession = useCallback(async () => {
    if (!user) {
      setTodaySession(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setTodaySession(data as PomodoroSession | null);
    } catch (error) {
      console.error('Error fetching pomodoro session:', error);
    } finally {
      setLoading(false);
    }
  }, [user, today]);

  useEffect(() => {
    fetchTodaySession();
  }, [fetchTodaySession]);

  const incrementSession = async (focusMinutes: number = 25) => {
    if (!user) return;

    try {
      if (todaySession) {
        const { data, error } = await supabase
          .from('pomodoro_sessions')
          .update({
            sessions_count: todaySession.sessions_count + 1,
            focus_minutes: todaySession.focus_minutes + focusMinutes,
          })
          .eq('id', todaySession.id)
          .select()
          .single();

        if (error) throw error;
        setTodaySession(data as PomodoroSession);
      } else {
        const { data, error } = await supabase
          .from('pomodoro_sessions')
          .insert([{
            user_id: user.id,
            session_date: today,
            sessions_count: 1,
            focus_minutes: focusMinutes,
            daily_goal: 8,
          }])
          .select()
          .single();

        if (error) throw error;
        setTodaySession(data as PomodoroSession);
      }
    } catch (error) {
      console.error('Error updating pomodoro session:', error);
    }
  };

  const updateDailyGoal = async (goal: number) => {
    if (!user || !todaySession) return;

    try {
      const { error } = await supabase
        .from('pomodoro_sessions')
        .update({ daily_goal: goal })
        .eq('id', todaySession.id);

      if (error) throw error;
      setTodaySession(prev => prev ? { ...prev, daily_goal: goal } : null);
    } catch (error) {
      console.error('Error updating daily goal:', error);
    }
  };

  return {
    todaySession,
    loading,
    sessionsCount: todaySession?.sessions_count || 0,
    focusMinutes: todaySession?.focus_minutes || 0,
    dailyGoal: todaySession?.daily_goal || 8,
    incrementSession,
    updateDailyGoal,
    refetch: fetchTodaySession,
  };
};
