import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Course {
  id: string;
  title: string;
  description?: string;
  platform?: string;
  skill?: string;
  status: 'backlog' | 'in-progress' | 'completed';
  progress: number;
  total_hours: number;
  completed_hours: number;
  url?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCourses = useCallback(async () => {
    if (!user) {
      setCourses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses((data as Course[]) || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const addCourse = async (course: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{ ...course, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setCourses(prev => [data as Course, ...prev]);
      toast.success('Curso adicionado!');
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Erro ao adicionar curso');
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      toast.success('Curso atualizado!');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Erro ao atualizar curso');
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCourses(prev => prev.filter(c => c.id !== id));
      toast.success('Curso removido!');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Erro ao remover curso');
    }
  };

  const getStats = () => {
    const inProgress = courses.filter(c => c.status === 'in-progress').length;
    const completed = courses.filter(c => c.status === 'completed').length;
    const totalHours = courses.reduce((acc, c) => acc + (c.completed_hours || 0), 0);
    return { total: courses.length, inProgress, completed, totalHours };
  };

  return {
    courses,
    loading,
    addCourse,
    updateCourse,
    deleteCourse,
    getStats,
    refetch: fetchCourses,
  };
};
