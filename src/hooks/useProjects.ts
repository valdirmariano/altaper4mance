import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  category: string | null;
  priority: string | null;
  progress: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const addProject = async (projectData: {
    title: string;
    description?: string;
    status?: string;
    category?: string;
    priority?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: projectData.title,
          description: projectData.description,
          status: projectData.status || 'planejado',
          category: projectData.category,
          priority: projectData.priority || 'média',
          start_date: projectData.start_date,
          end_date: projectData.end_date,
          progress: 0,
        })
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      return null;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === projectId ? data : p));
      return data;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      return null;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
    }
  };

  const getStats = () => {
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'em_andamento').length,
      paused: projects.filter(p => p.status === 'pausado').length,
      completed: projects.filter(p => p.status === 'concluído').length,
      planning: projects.filter(p => p.status === 'planejado').length,
    };
  };

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    getStats,
    refresh: fetchProjects,
  };
};
