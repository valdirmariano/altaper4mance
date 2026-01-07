import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Habit {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  frequency: string | null;
  target: string | null;
  color: string | null;
  streak: number | null;
  reminder_time: string | null;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  logged_date: string;
  completed: boolean | null;
  notes: string | null;
}

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setHabitLogs([]);
      setLoading(false);
      return;
    }

    try {
      const [habitsRes, logsRes] = await Promise.all([
        supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('habit_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('logged_date', { ascending: false })
          .limit(500)
      ]);

      if (habitsRes.error) throw habitsRes.error;
      if (logsRes.error) throw logsRes.error;

      setHabits(habitsRes.data || []);
      setHabitLogs(logsRes.data || []);
    } catch (error: any) {
      console.error('Error fetching habits:', error);
      toast.error('Erro ao carregar hábitos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = async (habit: { title: string; description?: string; category?: string; frequency?: string }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          ...habit,
          user_id: user.id,
          streak: 0,
        })
        .select()
        .single();

      if (error) throw error;
      setHabits(prev => [data, ...prev]);
      toast.success('Hábito criado com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Error adding habit:', error);
      toast.error('Erro ao criar hábito');
      return null;
    }
  };

  const toggleHabitToday = async (habitId: string) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const existingLog = habitLogs.find(
      log => log.habit_id === habitId && log.logged_date === today
    );

    try {
      if (existingLog) {
        // Toggle existing log
        const newCompleted = !existingLog.completed;
        const { error } = await supabase
          .from('habit_logs')
          .update({ completed: newCompleted })
          .eq('id', existingLog.id);

        if (error) throw error;
        setHabitLogs(prev => 
          prev.map(log => log.id === existingLog.id ? { ...log, completed: newCompleted } : log)
        );

        // Update streak
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          const newStreak = newCompleted ? (habit.streak || 0) + 1 : Math.max(0, (habit.streak || 0) - 1);
          await supabase.from('habits').update({ streak: newStreak }).eq('id', habitId);
          setHabits(prev => prev.map(h => h.id === habitId ? { ...h, streak: newStreak } : h));
        }
      } else {
        // Create new log
        const { data, error } = await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            logged_date: today,
            completed: true,
          })
          .select()
          .single();

        if (error) throw error;
        setHabitLogs(prev => [data, ...prev]);

        // Update streak
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          const newStreak = (habit.streak || 0) + 1;
          await supabase.from('habits').update({ streak: newStreak }).eq('id', habitId);
          setHabits(prev => prev.map(h => h.id === habitId ? { ...h, streak: newStreak } : h));
        }
      }
    } catch (error: any) {
      console.error('Error toggling habit:', error);
      toast.error('Erro ao atualizar hábito');
    }
  };

  const isHabitCompletedOnDate = (habitId: string, date: string): boolean => {
    return habitLogs.some(
      log => log.habit_id === habitId && log.logged_date === date && log.completed
    );
  };

  const deleteHabit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHabits(prev => prev.filter(h => h.id !== id));
      toast.success('Hábito excluído');
    } catch (error: any) {
      console.error('Error deleting habit:', error);
      toast.error('Erro ao excluir hábito');
    }
  };

  const getCompletedTodayCount = (): number => {
    const today = new Date().toISOString().split('T')[0];
    return habitLogs.filter(log => log.logged_date === today && log.completed).length;
  };

  return {
    habits,
    habitLogs,
    loading,
    addHabit,
    toggleHabitToday,
    isHabitCompletedOnDate,
    deleteHabit,
    getCompletedTodayCount,
    refetch: fetchHabits,
  };
};
