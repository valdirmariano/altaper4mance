import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Clock, Sparkles, Dumbbell, DollarSign, BookOpen, Timer, Footprints, GraduationCap, Trophy } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';
import { useGamification } from '@/hooks/useGamification';
import { useHealth } from '@/hooks/useHealth';
import { useTransactions } from '@/hooks/useTransactions';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useCourses } from '@/hooks/useCourses';

interface Mission {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  xpReward: number;
  icon: React.ReactNode;
  completed: boolean;
  category: 'tasks' | 'habits' | 'fitness' | 'finance' | 'focus' | 'studies';
}

const WeeklyMissions: React.FC = () => {
  const { tasks } = useTasks();
  const { habits, habitLogs } = useHabits();
  const { stats } = useGamification();
  const { runningSessions, workoutSessions } = useHealth();
  const { transactions } = useTransactions();
  const { sessionsCount: pomodoroTodayCount } = usePomodoro();
  const { courses, getStats: getCourseStats } = useCourses();

  // Calculate date ranges
  const { weekStart, weekEnd } = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { weekStart: start, weekEnd: end };
  }, []);

  // Tasks completed this week
  const tasksThisWeek = useMemo(() => {
    return tasks.filter(t => {
      if (t.status !== 'done') return false;
      const updatedAt = new Date(t.updated_at);
      return updatedAt >= weekStart && updatedAt <= weekEnd;
    }).length;
  }, [tasks, weekStart, weekEnd]);

  // Days with all habits completed this week
  const perfectDays = useMemo(() => {
    const days = new Set<string>();
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (date < weekStart) break;
      
      const logsForDay = habitLogs.filter(log => log.logged_date === dateStr && log.completed);
      if (logsForDay.length >= habits.length && habits.length > 0) {
        days.add(dateStr);
      }
    }
    
    return days.size;
  }, [habitLogs, habits, weekStart]);

  // Workouts this week
  const workoutsThisWeek = useMemo(() => {
    return workoutSessions.filter(w => {
      const date = new Date(w.date);
      return date >= weekStart && date <= weekEnd;
    }).length;
  }, [workoutSessions, weekStart, weekEnd]);

  // Running sessions this week
  const runsThisWeek = useMemo(() => {
    return runningSessions.filter(r => {
      const date = new Date(r.date);
      return date >= weekStart && date <= weekEnd;
    }).length;
  }, [runningSessions, weekStart, weekEnd]);

  // Total km this week
  const kmThisWeek = useMemo(() => {
    return runningSessions.filter(r => {
      const date = new Date(r.date);
      return date >= weekStart && date <= weekEnd;
    }).reduce((acc, r) => acc + r.distance_km, 0);
  }, [runningSessions, weekStart, weekEnd]);

  // Pomodoro - use today's count as approximation (weekly data would require hook changes)
  const pomodoroThisWeek = pomodoroTodayCount;

  // Transactions logged this week
  const transactionsThisWeek = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date);
      return date >= weekStart && date <= weekEnd;
    }).length;
  }, [transactions, weekStart, weekEnd]);

  // Study stats
  const courseStats = getCourseStats();
  const coursesInProgress = courseStats.inProgress;
  const coursesCompleted = courseStats.completed;
  const streakProgress = Math.min(stats.streak, 7);

  // Generate dynamic missions based on user activity
  const missions: Mission[] = useMemo(() => {
    const allMissions: Mission[] = [
      // Task missions
      {
        id: 'tasks_10',
        title: 'Completar 10 tarefas',
        description: 'Finalize 10 tarefas esta semana',
        current: Math.min(tasksThisWeek, 10),
        target: 10,
        xpReward: 150,
        icon: <CheckCircle2 className="h-4 w-4" />,
        completed: tasksThisWeek >= 10,
        category: 'tasks',
      },
      {
        id: 'tasks_20',
        title: 'Completar 20 tarefas',
        description: 'Finalize 20 tarefas esta semana',
        current: Math.min(tasksThisWeek, 20),
        target: 20,
        xpReward: 300,
        icon: <CheckCircle2 className="h-4 w-4" />,
        completed: tasksThisWeek >= 20,
        category: 'tasks',
      },
      // Habit missions
      {
        id: 'streak_7',
        title: 'Streak de 7 dias',
        description: 'Mantenha atividade por 7 dias seguidos',
        current: streakProgress,
        target: 7,
        xpReward: 200,
        icon: <Sparkles className="h-4 w-4" />,
        completed: stats.streak >= 7,
        category: 'habits',
      },
      {
        id: 'perfect_5',
        title: '5 dias perfeitos',
        description: 'Complete todos os hábitos em 5 dias',
        current: Math.min(perfectDays, 5),
        target: 5,
        xpReward: 250,
        icon: <Target className="h-4 w-4" />,
        completed: perfectDays >= 5,
        category: 'habits',
      },
      // Fitness missions
      {
        id: 'workouts_4',
        title: 'Treinar 4 vezes',
        description: 'Complete 4 treinos esta semana',
        current: Math.min(workoutsThisWeek, 4),
        target: 4,
        xpReward: 200,
        icon: <Dumbbell className="h-4 w-4" />,
        completed: workoutsThisWeek >= 4,
        category: 'fitness',
      },
      {
        id: 'run_3',
        title: 'Correr 3 vezes',
        description: 'Faça 3 corridas esta semana',
        current: Math.min(runsThisWeek, 3),
        target: 3,
        xpReward: 150,
        icon: <Footprints className="h-4 w-4" />,
        completed: runsThisWeek >= 3,
        category: 'fitness',
      },
      {
        id: 'run_10km',
        title: 'Correr 10km',
        description: 'Acumule 10km de corrida esta semana',
        current: Math.min(Math.round(kmThisWeek * 10) / 10, 10),
        target: 10,
        xpReward: 200,
        icon: <Footprints className="h-4 w-4" />,
        completed: kmThisWeek >= 10,
        category: 'fitness',
      },
      // Focus missions
      {
        id: 'pomodoro_10',
        title: '10 sessões Pomodoro',
        description: 'Complete 10 sessões de foco',
        current: Math.min(pomodoroThisWeek, 10),
        target: 10,
        xpReward: 200,
        icon: <Timer className="h-4 w-4" />,
        completed: pomodoroThisWeek >= 10,
        category: 'focus',
      },
      // Finance missions
      {
        id: 'transactions_10',
        title: 'Registrar 10 transações',
        description: 'Mantenha suas finanças em dia',
        current: Math.min(transactionsThisWeek, 10),
        target: 10,
        xpReward: 100,
        icon: <DollarSign className="h-4 w-4" />,
        completed: transactionsThisWeek >= 10,
        category: 'finance',
      },
      // Study missions
      {
        id: 'study_courses',
        title: 'Estudar ativamente',
        description: 'Tenha ao menos 1 curso em progresso',
        current: Math.min(coursesInProgress, 1),
        target: 1,
        xpReward: 100,
        icon: <GraduationCap className="h-4 w-4" />,
        completed: coursesInProgress >= 1,
        category: 'studies',
      },
      {
        id: 'complete_course',
        title: 'Concluir um curso',
        description: 'Finalize pelo menos 1 curso',
        current: Math.min(coursesCompleted, 1),
        target: 1,
        xpReward: 300,
        icon: <GraduationCap className="h-4 w-4" />,
        completed: coursesCompleted >= 1,
        category: 'studies',
      },
    ];

    // Filter and prioritize missions based on user activity
    const activeMissions: Mission[] = [];
    const categories = ['tasks', 'habits', 'fitness', 'focus', 'finance', 'studies'] as const;
    
    // Try to get 1-2 missions per category, prioritizing incomplete ones
    categories.forEach(cat => {
      const catMissions = allMissions.filter(m => m.category === cat);
      const incomplete = catMissions.filter(m => !m.completed && m.current > 0);
      const complete = catMissions.filter(m => m.completed);
      const notStarted = catMissions.filter(m => !m.completed && m.current === 0);
      
      // Prioritize in-progress, then completed, then not started
      const sorted = [...incomplete, ...complete, ...notStarted];
      if (sorted.length > 0) {
        activeMissions.push(sorted[0]);
      }
    });

    // Sort by completion status (incomplete first), then by progress percentage
    return activeMissions.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return (b.current / b.target) - (a.current / a.target);
    });
  }, [tasksThisWeek, streakProgress, stats.streak, perfectDays, workoutsThisWeek, runsThisWeek, kmThisWeek, pomodoroThisWeek, transactionsThisWeek, coursesInProgress, coursesCompleted]);

  const completedMissions = missions.filter(m => m.completed).length;
  const totalXP = missions.reduce((acc, m) => acc + (m.completed ? m.xpReward : 0), 0);

  // Days until week ends
  const now = new Date();
  const daysRemaining = 7 - now.getDay();

  const getCategoryColor = (category: Mission['category']) => {
    switch (category) {
      case 'tasks': return 'text-accent';
      case 'habits': return 'text-yellow-400';
      case 'fitness': return 'text-emerald-400';
      case 'finance': return 'text-blue-400';
      case 'focus': return 'text-red-400';
      case 'studies': return 'text-purple-400';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryBg = (category: Mission['category']) => {
    switch (category) {
      case 'tasks': return 'bg-accent/15';
      case 'habits': return 'bg-yellow-400/15';
      case 'fitness': return 'bg-emerald-400/15';
      case 'finance': return 'bg-blue-400/15';
      case 'focus': return 'bg-red-400/15';
      case 'studies': return 'bg-purple-400/15';
      default: return 'bg-muted/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-accent/15">
              <Trophy className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Missões Semanais</h3>
              <p className="text-[11px] text-muted-foreground">
                {completedMissions}/{missions.length} concluídas
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs flex items-center gap-1 border-border/50 bg-muted/30">
            <Clock className="h-3 w-3" />
            {daysRemaining}d restantes
          </Badge>
        </div>

        {/* Overall Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">Progresso geral</span>
            <span className="text-xs font-medium text-accent">
              {missions.length > 0 ? Math.round((completedMissions / missions.length) * 100) : 0}%
            </span>
          </div>
          <Progress 
            value={missions.length > 0 ? (completedMissions / missions.length) * 100 : 0} 
            className="h-2"
          />
        </div>

        {/* Missions List */}
        <div className="space-y-2.5">
          <AnimatePresence>
            {missions.map((mission, index) => {
              const progress = (mission.current / mission.target) * 100;
              
              return (
                <motion.div 
                  key={mission.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    mission.completed 
                      ? 'bg-emerald-500/10 border-emerald-500/20' 
                      : 'bg-muted/20 border-border/30 hover:border-border/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${
                        mission.completed 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : `${getCategoryBg(mission.category)} ${getCategoryColor(mission.category)}`
                      }`}>
                        {mission.icon}
                      </div>
                      <span className={`text-sm font-medium ${
                        mission.completed ? 'text-emerald-400 line-through' : ''
                      }`}>
                        {mission.title}
                      </span>
                    </div>
                    <Badge 
                      variant={mission.completed ? "default" : "outline"} 
                      className={`text-[10px] ${mission.completed ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'border-border/50'}`}
                    >
                      {mission.completed ? '✓ Feito' : `+${mission.xpReward} XP`}
                    </Badge>
                  </div>
                  <Progress 
                    value={progress} 
                    className={`h-1.5 ${mission.completed ? '[&>div]:bg-emerald-500' : ''}`}
                  />
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    {mission.current}/{mission.target} — {mission.description}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Footer XP Summary */}
        {completedMissions > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between"
          >
            <span className="text-sm text-muted-foreground">XP ganho esta semana</span>
            <span className="text-lg font-bold text-accent">+{totalXP} XP</span>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default WeeklyMissions;
