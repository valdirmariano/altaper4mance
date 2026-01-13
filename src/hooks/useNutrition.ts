import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Meal {
  id: string;
  user_id: string;
  date: string;
  meal_type: string;
  name: string;
  description?: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  photo_url?: string;
  created_at: string;
}

export interface NutritionGoals {
  id: string;
  user_id: string;
  daily_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  water_liters: number;
}

export const useNutrition = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<NutritionGoals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMeals();
      fetchGoals();
    }
  }, [user]);

  const fetchMeals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMeals((data || []) as Meal[]);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setGoals(data as NutritionGoals | null);
    } catch (error) {
      console.error('Error fetching nutrition goals:', error);
    }
  };

  const addMeal = async (meal: Omit<Meal, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('meals')
        .insert([{ ...meal, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setMeals(prev => [data as Meal, ...prev]);
      toast.success('Refeição registrada!');
      return data;
    } catch (error) {
      console.error('Error adding meal:', error);
      toast.error('Erro ao registrar refeição');
    }
  };

  const updateMeal = async (id: string, updates: Partial<Meal>) => {
    try {
      const { error } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setMeals(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
      toast.success('Refeição atualizada!');
    } catch (error) {
      console.error('Error updating meal:', error);
      toast.error('Erro ao atualizar refeição');
    }
  };

  const deleteMeal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMeals(prev => prev.filter(m => m.id !== id));
      toast.success('Refeição removida!');
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Erro ao remover refeição');
    }
  };

  const saveGoals = async (newGoals: Omit<NutritionGoals, 'id' | 'user_id'>) => {
    if (!user) return;
    
    try {
      if (goals) {
        const { error } = await supabase
          .from('nutrition_goals')
          .update(newGoals)
          .eq('id', goals.id);

        if (error) throw error;
        setGoals({ ...goals, ...newGoals });
      } else {
        const { data, error } = await supabase
          .from('nutrition_goals')
          .insert([{ ...newGoals, user_id: user.id }])
          .select()
          .single();

        if (error) throw error;
        setGoals(data as NutritionGoals);
      }
      toast.success('Metas nutricionais salvas!');
    } catch (error) {
      console.error('Error saving nutrition goals:', error);
      toast.error('Erro ao salvar metas');
    }
  };

  const getTodayMeals = () => {
    const today = new Date().toISOString().split('T')[0];
    return meals.filter(m => m.date === today);
  };

  const getTodayTotals = () => {
    const todayMeals = getTodayMeals();
    return {
      calories: todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0),
      protein: todayMeals.reduce((sum, m) => sum + (m.protein_g || 0), 0),
      carbs: todayMeals.reduce((sum, m) => sum + (m.carbs_g || 0), 0),
      fat: todayMeals.reduce((sum, m) => sum + (m.fat_g || 0), 0),
    };
  };

  return {
    meals,
    goals,
    loading,
    addMeal,
    updateMeal,
    deleteMeal,
    saveGoals,
    getTodayMeals,
    getTodayTotals,
    refetch: fetchMeals,
  };
};
