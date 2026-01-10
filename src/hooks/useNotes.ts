import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type NoteCategory = 'inbox' | 'projects' | 'areas' | 'resources' | 'archive';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  category: NoteCategory;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  category?: NoteCategory;
  tags?: string[];
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  category?: NoteCategory;
  tags?: string[];
}

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setNotes((data || []).map(note => ({
        ...note,
        category: note.category as NoteCategory,
        tags: note.tags || []
      })));
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      toast.error('Erro ao carregar notas');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (input: CreateNoteInput): Promise<Note | null> => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: input.title,
          content: input.content || '',
          category: input.category || 'inbox',
          tags: input.tags || []
        })
        .select()
        .single();

      if (error) throw error;

      const newNote: Note = {
        ...data,
        category: data.category as NoteCategory,
        tags: data.tags || []
      };

      setNotes(prev => [newNote, ...prev]);
      toast.success('Nota criada!');
      return newNote;
    } catch (error) {
      console.error('Erro ao criar nota:', error);
      toast.error('Erro ao criar nota');
      return null;
    }
  };

  const updateNote = async (id: string, input: UpdateNoteInput): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          ...input,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => prev.map(note => 
        note.id === id 
          ? { ...data, category: data.category as NoteCategory, tags: data.tags || [] }
          : note
      ));
      toast.success('Nota atualizada!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
      toast.error('Erro ao atualizar nota');
      return false;
    }
  };

  const deleteNote = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return false;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success('Nota excluída!');
      return true;
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      toast.error('Erro ao excluir nota');
      return false;
    }
  };

  const getCategoryCount = (category: NoteCategory): number => {
    return notes.filter(n => n.category === category).length;
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    getCategoryCount,
    refetch: fetchNotes
  };
}
