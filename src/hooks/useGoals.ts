import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  progress: number | null;
  horizon: string | null;
  pillar: string | null;
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast.error('Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goal,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => [data, ...prev]);
      toast.success('Meta criada com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Error adding goal:', error);
      toast.error('Erro ao criar meta');
      return null;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => prev.map(g => g.id === id ? data : g));
      return data;
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast.error('Erro ao atualizar meta');
      return null;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Meta excluída');
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast.error('Erro ao excluir meta');
    }
  };

  const getActiveGoalsCount = (): number => {
    return goals.filter(g => g.status === 'em_progresso' || g.status === 'ativo').length;
  };

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    getActiveGoalsCount,
    refetch: fetchGoals,
  };
};
