import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

// Gamification callback type
type GamificationCallback = ((priority: string) => Promise<void>) | null;

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  project_id: string | null;
  tags: string[] | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  created_at: string;
  updated_at: string;
}

export const useTasks = (onTaskComplete?: GamificationCallback) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'> & { user_id?: string }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...task,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [data, ...prev]);
      toast.success('Tarefa criada com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast.error('Erro ao criar tarefa');
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error('Erro ao atualizar tarefa');
      return null;
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'done' ? 'todo' : 'done';
    const result = await updateTask(id, { status: newStatus });
    
    // Award XP when completing a task (not when uncompleting)
    if (result && newStatus === 'done' && onTaskComplete) {
      await onTaskComplete(task.priority);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Tarefa excluída');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Erro ao excluir tarefa');
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    refetch: fetchTasks,
  };
};
