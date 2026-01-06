import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
        error: error?.message ?? null,
      }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
        }));

        // Create user profile on first sign up
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

          if (!existingProfile) {
            await supabase.from('user_profiles').insert({
              user_id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
              preferences: {
                theme: 'dark',
                accent_color: '#00D9FF',
                ai_tone: 'motivacional',
                ai_voice: 'pt-BR-female'
              },
              stats: {
                level: 1,
                xp: 0,
                streak: 0,
                badges: []
              }
            });
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      return { error };
    }

    setState(prev => ({
      ...prev,
      loading: false,
      user: data.user,
      session: data.session,
    }));

    return { data };
  };

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      return { error };
    }

    setState(prev => ({
      ...prev,
      loading: false,
      user: data.user,
      session: data.session,
    }));

    return { data };
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }));
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
      return { error };
    }

    setState({
      user: null,
      session: null,
      loading: false,
      error: null,
    });

    return { error: null };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated: !!state.session,
  };
}
