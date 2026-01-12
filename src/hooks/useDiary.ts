import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  mood: number | null;
  energy: number | null;
  gratitude: string | null;
  reflection: string | null;
  tags: string[] | null;
  created_at: string;
}

export type DiaryGamificationCallback = (isNewEntry: boolean) => void;

export const useDiary = (onGamificationReward?: DiaryGamificationCallback) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Erro ao buscar entradas do diário:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const getEntryByDate = (date: Date): JournalEntry | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.find(e => e.entry_date === dateStr);
  };

  const saveEntry = async (date: Date, data: {
    mood?: number;
    energy?: number;
    gratitude?: string;
    reflection?: string;
    tags?: string[];
  }) => {
    if (!user) return null;

    const dateStr = format(date, 'yyyy-MM-dd');
    const existingEntry = getEntryByDate(date);

    try {
      if (existingEntry) {
        const { data: updated, error } = await supabase
          .from('journal_entries')
          .update({
            mood: data.mood,
            energy: data.energy,
            gratitude: data.gratitude,
            reflection: data.reflection,
            tags: data.tags,
          })
          .eq('id', existingEntry.id)
          .select()
          .single();

        if (error) throw error;
        setEntries(prev => prev.map(e => e.id === existingEntry.id ? updated : e));
        // Atualização de entrada existente - recompensa menor
        onGamificationReward?.(false);
        return updated;
      } else {
        const { data: created, error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            entry_date: dateStr,
            mood: data.mood,
            energy: data.energy,
            gratitude: data.gratitude,
            reflection: data.reflection,
            tags: data.tags,
          })
          .select()
          .single();

        if (error) throw error;
        setEntries(prev => [created, ...prev]);
        // Nova entrada - recompensa completa
        onGamificationReward?.(true);
        return created;
      }
    } catch (error) {
      console.error('Erro ao salvar entrada do diário:', error);
      return null;
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      setEntries(prev => prev.filter(e => e.id !== entryId));
    } catch (error) {
      console.error('Erro ao deletar entrada do diário:', error);
    }
  };

  const getMoodStats = (days: number = 30) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const recentEntries = entries.filter(e => new Date(e.entry_date) >= cutoff && e.mood);
    if (recentEntries.length === 0) return null;

    const avgMood = recentEntries.reduce((sum, e) => sum + (e.mood || 0), 0) / recentEntries.length;
    return {
      average: Math.round(avgMood * 10) / 10,
      total: recentEntries.length,
      trend: recentEntries.length >= 2 
        ? (recentEntries[0].mood || 0) - (recentEntries[recentEntries.length - 1].mood || 0)
        : 0
    };
  };

  return {
    entries,
    loading,
    getEntryByDate,
    saveEntry,
    deleteEntry,
    getMoodStats,
    refresh: fetchEntries,
  };
};
