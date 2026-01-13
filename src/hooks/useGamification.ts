import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { 
  triggerLevelUpConfetti, 
  triggerBadgeConfetti, 
  triggerStreakConfetti,
  triggerPerfectDayConfetti 
} from '@/components/Gamification/AchievementNotification';

export interface UserStats {
  level: number;
  xp: number;
  streak: number;
  badges: Badge[];
  lastActivityDate?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'streak' | 'tasks' | 'habits' | 'goals' | 'finance' | 'special';
}

// XP rewards configuration
const XP_REWARDS = {
  COMPLETE_TASK: 10,
  COMPLETE_TASK_P0: 15,
  COMPLETE_HABIT: 5,
  COMPLETE_ALL_HABITS: 50,
  COMPLETE_GOAL: 500,
  JOURNAL_ENTRY: 10,
  POMODORO_SESSION: 20,
  REGISTER_TRANSACTION: 5,
  STUDY_SESSION: 15,
  RUNNING_SESSION: 20,
  WORKOUT_SESSION: 20,
  BODY_MEASUREMENT: 5,
};

// Level thresholds
const getLevelThreshold = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Badge definitions
const BADGE_DEFINITIONS: Omit<Badge, 'unlockedAt'>[] = [
  // Streak badges
  { id: 'streak_7', name: 'Incandescente', description: '7 dias de sequência', icon: '🔥', category: 'streak' },
  { id: 'streak_30', name: 'Campeão', description: '30 dias de sequência', icon: '🏆', category: 'streak' },
  { id: 'streak_100', name: 'Legenda', description: '100 dias de sequência', icon: '👑', category: 'streak' },
  
  // Task badges
  { id: 'tasks_10', name: 'Produtivo', description: 'Complete 10 tarefas', icon: '✅', category: 'tasks' },
  { id: 'tasks_50', name: 'Eficiente', description: 'Complete 50 tarefas', icon: '⚡', category: 'tasks' },
  { id: 'tasks_100', name: 'Relâmpago', description: 'Complete 100 tarefas', icon: '🌟', category: 'tasks' },
  
  // Habit badges
  { id: 'habits_perfect_week', name: 'Semana Perfeita', description: 'Complete todos hábitos por 7 dias', icon: '💫', category: 'habits' },
  { id: 'habits_master', name: 'Mestre dos Hábitos', description: '30 dias de hábitos perfeitos', icon: '🧘', category: 'habits' },
  
  // Goal badges
  { id: 'goals_1', name: 'Visionário', description: 'Alcance sua primeira meta', icon: '🎯', category: 'goals' },
  { id: 'goals_5', name: 'Conquistador', description: 'Alcance 5 metas', icon: '🏅', category: 'goals' },
  { id: 'goals_10', name: 'Elite', description: 'Alcance 10 metas', icon: '🌍', category: 'goals' },
  
  // Health/Fitness badges
  { id: 'runner_10', name: 'Corredor', description: 'Complete 10 corridas', icon: '🏃', category: 'special' },
  { id: 'runner_50km', name: 'Maratonista', description: 'Corra 50km no total', icon: '🥇', category: 'special' },
  { id: 'athlete_20', name: 'Atleta', description: 'Complete 20 treinos', icon: '💪', category: 'special' },
  { id: 'hercules', name: 'Hercules', description: 'Complete 50 treinos', icon: '🦸', category: 'special' },
  
  // Special badges
  { id: 'level_10', name: 'Veterano', description: 'Alcance nível 10', icon: '⭐', category: 'special' },
  { id: 'level_25', name: 'Expert', description: 'Alcance nível 25', icon: '💎', category: 'special' },
  { id: 'level_50', name: 'Mestre', description: 'Alcance nível 50', icon: '🔱', category: 'special' },
  { id: 'first_day', name: 'Primeiro Passo', description: 'Complete seu primeiro dia', icon: '🌱', category: 'special' },
];

export function useGamification() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    streak: 0,
    badges: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch user stats from profile
  const fetchStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('stats')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching gamification stats:', error);
        return;
      }

      if (data?.stats) {
        const statsData = data.stats as unknown as UserStats;
        setStats({
          level: statsData.level || 1,
          xp: statsData.xp || 0,
          streak: statsData.streak || 0,
          badges: statsData.badges || [],
          lastActivityDate: statsData.lastActivityDate,
        });
      }
    } catch (error) {
      console.error('Error in fetchStats:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Save stats to database
  const saveStats = useCallback(async (newStats: UserStats) => {
    if (!user) return;

    try {
      // Convert badges to JSON-compatible format
      const badgesJson = newStats.badges.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        unlockedAt: b.unlockedAt,
        category: b.category,
      }));
      
      const statsJson = {
        level: newStats.level,
        xp: newStats.xp,
        streak: newStats.streak,
        badges: badgesJson,
        lastActivityDate: newStats.lastActivityDate || null,
      };
      
      await supabase
        .from('user_profiles')
        .update({ stats: statsJson })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }, [user]);

  // Calculate new level based on XP
  const calculateLevel = useCallback((xp: number): number => {
    let level = 1;
    let threshold = getLevelThreshold(level);
    
    while (xp >= threshold && level < 100) {
      xp -= threshold;
      level++;
      threshold = getLevelThreshold(level);
    }
    
    return level;
  }, []);

  // Add XP and check for level up
  const addXP = useCallback(async (amount: number, reason?: string) => {
    if (!user) return;

    const newXP = stats.xp + amount;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > stats.level;

    const newStats: UserStats = {
      ...stats,
      xp: newXP,
      level: newLevel,
      lastActivityDate: new Date().toISOString().split('T')[0],
    };

    // Check for level badges
    if (leveledUp) {
      if (newLevel >= 10 && !stats.badges.find(b => b.id === 'level_10')) {
        const badge = BADGE_DEFINITIONS.find(b => b.id === 'level_10')!;
        newStats.badges = [...newStats.badges, { ...badge, unlockedAt: new Date().toISOString() }];
        toast.success(`🏆 Novo badge desbloqueado: ${badge.name}!`);
        triggerBadgeConfetti();
      }
      if (newLevel >= 25 && !stats.badges.find(b => b.id === 'level_25')) {
        const badge = BADGE_DEFINITIONS.find(b => b.id === 'level_25')!;
        newStats.badges = [...newStats.badges, { ...badge, unlockedAt: new Date().toISOString() }];
        toast.success(`🏆 Novo badge desbloqueado: ${badge.name}!`);
        triggerBadgeConfetti();
      }
      if (newLevel >= 50 && !stats.badges.find(b => b.id === 'level_50')) {
        const badge = BADGE_DEFINITIONS.find(b => b.id === 'level_50')!;
        newStats.badges = [...newStats.badges, { ...badge, unlockedAt: new Date().toISOString() }];
        toast.success(`🏆 Novo badge desbloqueado: ${badge.name}!`);
        triggerBadgeConfetti();
      }

      toast.success(`🎉 Parabéns! Você subiu para o nível ${newLevel}!`, {
        duration: 5000,
      });
      triggerLevelUpConfetti(newLevel);
    }

    // Show XP toast
    if (reason) {
      toast.info(`+${amount} XP - ${reason}`, { duration: 2000 });
    }

    setStats(newStats);
    await saveStats(newStats);
  }, [user, stats, calculateLevel, saveStats]);

  // Update streak
  const updateStreak = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    let newStreak = stats.streak;
    
    if (stats.lastActivityDate === yesterday) {
      newStreak = stats.streak + 1;
    } else if (stats.lastActivityDate !== today) {
      newStreak = 1;
    }

    const newStats: UserStats = {
      ...stats,
      streak: newStreak,
      lastActivityDate: today,
    };

    // Check for streak badges
    if (newStreak >= 7 && !stats.badges.find(b => b.id === 'streak_7')) {
      const badge = BADGE_DEFINITIONS.find(b => b.id === 'streak_7')!;
      newStats.badges = [...newStats.badges, { ...badge, unlockedAt: new Date().toISOString() }];
      toast.success(`🔥 Novo badge desbloqueado: ${badge.name}!`);
      triggerStreakConfetti(newStreak);
    }
    if (newStreak >= 30 && !stats.badges.find(b => b.id === 'streak_30')) {
      const badge = BADGE_DEFINITIONS.find(b => b.id === 'streak_30')!;
      newStats.badges = [...newStats.badges, { ...badge, unlockedAt: new Date().toISOString() }];
      toast.success(`🏆 Novo badge desbloqueado: ${badge.name}!`);
      triggerStreakConfetti(newStreak);
    }
    if (newStreak >= 100 && !stats.badges.find(b => b.id === 'streak_100')) {
      const badge = BADGE_DEFINITIONS.find(b => b.id === 'streak_100')!;
      newStats.badges = [...newStats.badges, { ...badge, unlockedAt: new Date().toISOString() }];
      toast.success(`👑 Novo badge desbloqueado: ${badge.name}!`);
      triggerStreakConfetti(newStreak);
    }

    setStats(newStats);
    await saveStats(newStats);
  }, [user, stats, saveStats]);

  // Award badge
  const awardBadge = useCallback(async (badgeId: string) => {
    if (!user || stats.badges.find(b => b.id === badgeId)) return;

    const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badgeId);
    if (!badgeDef) return;

    const newBadge: Badge = {
      ...badgeDef,
      unlockedAt: new Date().toISOString(),
    };

    const newStats: UserStats = {
      ...stats,
      badges: [...stats.badges, newBadge],
    };

    toast.success(`🏆 Novo badge desbloqueado: ${newBadge.name}!`, {
      description: newBadge.description,
      duration: 5000,
    });
    
    triggerBadgeConfetti();

    setStats(newStats);
    await saveStats(newStats);
  }, [user, stats, saveStats]);

  // Reward handlers for different actions
  const rewardTaskComplete = useCallback(async (priority: string) => {
    const xp = priority === 'p0' ? XP_REWARDS.COMPLETE_TASK_P0 : XP_REWARDS.COMPLETE_TASK;
    await addXP(xp, 'Tarefa concluída');
    await updateStreak();
  }, [addXP, updateStreak]);

  const rewardHabitComplete = useCallback(async (allCompleted: boolean) => {
    await addXP(XP_REWARDS.COMPLETE_HABIT, 'Hábito completado');
    if (allCompleted) {
      await addXP(XP_REWARDS.COMPLETE_ALL_HABITS, 'Dia perfeito de hábitos! 🌟');
      triggerPerfectDayConfetti();
    }
    await updateStreak();
  }, [addXP, updateStreak]);

  const rewardGoalComplete = useCallback(async () => {
    await addXP(XP_REWARDS.COMPLETE_GOAL, 'Meta alcançada! 🎯');
    await updateStreak();
  }, [addXP, updateStreak]);

  const rewardJournalEntry = useCallback(async () => {
    await addXP(XP_REWARDS.JOURNAL_ENTRY, 'Entrada no diário');
    await updateStreak();
  }, [addXP, updateStreak]);

  const rewardPomodoroSession = useCallback(async () => {
    await addXP(XP_REWARDS.POMODORO_SESSION, 'Sessão Pomodoro');
    await updateStreak();
  }, [addXP, updateStreak]);

  const rewardTransaction = useCallback(async () => {
    await addXP(XP_REWARDS.REGISTER_TRANSACTION, 'Transação registrada');
  }, [addXP]);

  const rewardStudySession = useCallback(async () => {
    await addXP(XP_REWARDS.STUDY_SESSION, 'Sessão de estudo');
    await updateStreak();
  }, [addXP, updateStreak]);

  // Check and award fitness badges based on real data
  const checkFitnessBadges = useCallback(async () => {
    if (!user) return;

    try {
      // Check running stats
      const { data: runs } = await supabase
        .from('running_sessions')
        .select('distance_km')
        .eq('user_id', user.id);

      if (runs) {
        const totalRuns = runs.length;
        const totalKm = runs.reduce((sum, r) => sum + (r.distance_km || 0), 0);

        // Runner badge - 10 corridas
        if (totalRuns >= 10 && !stats.badges.find(b => b.id === 'runner_10')) {
          await awardBadge('runner_10');
        }

        // Marathoner badge - 50km total
        if (totalKm >= 50 && !stats.badges.find(b => b.id === 'runner_50km')) {
          await awardBadge('runner_50km');
        }
      }

      // Check workout stats
      const { data: workouts } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('user_id', user.id);

      if (workouts) {
        const totalWorkouts = workouts.length;

        // Athlete badge - 20 treinos
        if (totalWorkouts >= 20 && !stats.badges.find(b => b.id === 'athlete_20')) {
          await awardBadge('athlete_20');
        }

        // Hercules badge - 50 treinos
        if (totalWorkouts >= 50 && !stats.badges.find(b => b.id === 'hercules')) {
          await awardBadge('hercules');
        }
      }
    } catch (error) {
      console.error('Error checking fitness badges:', error);
    }
  }, [user, stats.badges, awardBadge]);

  const rewardRunningSession = useCallback(async () => {
    await addXP(XP_REWARDS.RUNNING_SESSION, 'Corrida completada 🏃');
    await updateStreak();
    await checkFitnessBadges();
  }, [addXP, updateStreak, checkFitnessBadges]);

  const rewardWorkoutSession = useCallback(async () => {
    await addXP(XP_REWARDS.WORKOUT_SESSION, 'Treino completado 💪');
    await updateStreak();
    await checkFitnessBadges();
  }, [addXP, updateStreak, checkFitnessBadges]);

  const rewardBodyMeasurement = useCallback(async () => {
    await addXP(XP_REWARDS.BODY_MEASUREMENT, 'Medida registrada');
  }, [addXP]);

  // Calculate XP needed for next level
  const xpToNextLevel = getLevelThreshold(stats.level);
  const currentLevelXP = stats.xp - (stats.level > 1 
    ? Array.from({ length: stats.level - 1 }, (_, i) => getLevelThreshold(i + 1)).reduce((a, b) => a + b, 0) 
    : 0);

  return {
    stats,
    loading,
    addXP,
    updateStreak,
    awardBadge,
    rewardTaskComplete,
    rewardHabitComplete,
    rewardGoalComplete,
    rewardJournalEntry,
    rewardPomodoroSession,
    rewardTransaction,
    rewardStudySession,
    rewardRunningSession,
    rewardWorkoutSession,
    rewardBodyMeasurement,
    xpToNextLevel,
    currentLevelXP: Math.max(0, currentLevelXP),
    xpProgress: Math.min(100, (currentLevelXP / xpToNextLevel) * 100),
    allBadges: BADGE_DEFINITIONS,
  };
}
