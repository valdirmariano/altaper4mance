import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface RunningSession {
  id: string;
  user_id: string;
  date: string;
  distance_km: number;
  duration_minutes: number;
  pace: number | null;
  terrain: string;
  notes: string | null;
  created_at: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  date: string;
  name: string;
  muscle_group: string | null;
  duration_minutes: number | null;
  exercises: Exercise[];
  notes: string | null;
  created_at: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface BodyMeasurement {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number | null;
  height_cm: number | null;
  waist_cm: number | null;
  chest_cm: number | null;
  arm_cm: number | null;
  leg_cm: number | null;
  body_fat_percent: number | null;
  notes: string | null;
  created_at: string;
}

export const useHealth = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Running Sessions
  const { data: runningSessions = [], isLoading: isLoadingRunning } = useQuery({
    queryKey: ['running-sessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('running_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as RunningSession[];
    },
    enabled: !!user?.id,
  });

  const addRunningSession = useMutation({
    mutationFn: async (session: Omit<RunningSession, 'id' | 'user_id' | 'created_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Calculate pace (min/km)
      const pace = session.duration_minutes / session.distance_km;
      
      const { data, error } = await supabase
        .from('running_sessions')
        .insert([{ ...session, user_id: user.id, pace }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['running-sessions'] });
      toast.success('Corrida registrada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao registrar corrida');
    },
  });

  const deleteRunningSession = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('running_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['running-sessions'] });
      toast.success('Corrida removida!');
    },
  });

  // Workout Sessions
  const { data: workoutSessions = [], isLoading: isLoadingWorkout } = useQuery({
    queryKey: ['workout-sessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return (data as any[]).map(session => ({
        ...session,
        exercises: session.exercises || [],
      })) as WorkoutSession[];
    },
    enabled: !!user?.id,
  });

  const addWorkoutSession = useMutation({
    mutationFn: async (session: Omit<WorkoutSession, 'id' | 'user_id' | 'created_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([{ 
          ...session, 
          user_id: user.id,
          exercises: JSON.parse(JSON.stringify(session.exercises)) // Convert to plain JSON
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-sessions'] });
      toast.success('Treino registrado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao registrar treino');
    },
  });

  const deleteWorkoutSession = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-sessions'] });
      toast.success('Treino removido!');
    },
  });

  // Body Measurements
  const { data: bodyMeasurements = [], isLoading: isLoadingMeasurements } = useQuery({
    queryKey: ['body-measurements', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('body_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as BodyMeasurement[];
    },
    enabled: !!user?.id,
  });

  const addBodyMeasurement = useMutation({
    mutationFn: async (measurement: Omit<BodyMeasurement, 'id' | 'user_id' | 'created_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('body_measurements')
        .insert([{ ...measurement, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-measurements'] });
      toast.success('Medidas registradas com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao registrar medidas');
    },
  });

  const deleteBodyMeasurement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('body_measurements')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-measurements'] });
      toast.success('Medida removida!');
    },
  });

  // Statistics
  const runningStats = {
    totalKm: runningSessions.reduce((acc, s) => acc + Number(s.distance_km), 0),
    totalSessions: runningSessions.length,
    averagePace: runningSessions.length > 0 
      ? runningSessions.reduce((acc, s) => acc + (Number(s.pace) || 0), 0) / runningSessions.length 
      : 0,
    bestPace: runningSessions.length > 0
      ? Math.min(...runningSessions.filter(s => s.pace).map(s => Number(s.pace)))
      : 0,
  };

  const workoutStats = {
    totalSessions: workoutSessions.length,
    totalMinutes: workoutSessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0),
    muscleGroups: [...new Set(workoutSessions.filter(s => s.muscle_group).map(s => s.muscle_group))],
  };

  const latestMeasurement = bodyMeasurements[0];

  return {
    // Running
    runningSessions,
    isLoadingRunning,
    addRunningSession,
    deleteRunningSession,
    runningStats,
    
    // Workout
    workoutSessions,
    isLoadingWorkout,
    addWorkoutSession,
    deleteWorkoutSession,
    workoutStats,
    
    // Body Measurements
    bodyMeasurements,
    isLoadingMeasurements,
    addBodyMeasurement,
    deleteBodyMeasurement,
    latestMeasurement,
  };
};
