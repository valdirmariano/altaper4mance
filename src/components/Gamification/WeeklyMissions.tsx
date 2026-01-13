import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle2, Clock, Sparkles, Dumbbell, DollarSign, BookOpen, Timer, Footprints, GraduationCap } from 'lucide-react';
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

  // Streak progress
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
      const progressA = a.current / a.target;
      const progressB = b.current / b.target;
      return progressB - progressA;
    });
  }, [tasksThisWeek, streakProgress, stats.streak, perfectDays, workoutsThisWeek, runsThisWeek, kmThisWeek, pomodoroThisWeek, transactionsThisWeek, coursesInProgress, coursesCompleted]);

  const completedMissions = missions.filter(m => m.completed).length;
  const totalXP = missions.reduce((acc, m) => acc + (m.completed ? m.xpReward : 0), 0);

  // Days until week ends
  const now = new Date();
  const daysRemaining = 7 - now.getDay();

  const getCategoryColor = (category: Mission['category']) => {
    switch (category) {
      case 'tasks': return 'text-primary';
      case 'habits': return 'text-warning';
      case 'fitness': return 'text-success';
      case 'finance': return 'text-accent';
      case 'focus': return 'text-destructive';
      case 'studies': return 'text-info';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-success" />
          <h3 className="font-semibold">Missões Semanais</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {completedMissions}/{missions.length}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {daysRemaining} dias
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => {
          const progress = (mission.current / mission.target) * 100;
          
          return (
            <div 
              key={mission.id}
              className={`p-3 rounded-lg border transition-all ${
                mission.completed 
                  ? 'bg-success/10 border-success/30' 
                  : 'bg-muted/30 border-border hover:border-muted-foreground/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${
                    mission.completed 
                      ? 'bg-success/20 text-success' 
                      : `bg-muted ${getCategoryColor(mission.category)}`
                  }`}>
                    {mission.icon}
                  </div>
                  <span className={`text-sm font-medium ${
                    mission.completed ? 'text-success line-through' : ''
                  }`}>
                    {mission.title}
                  </span>
                </div>
                <Badge 
                  variant={mission.completed ? "default" : "outline"} 
                  className={`text-xs ${mission.completed ? 'bg-success text-success-foreground' : ''}`}
                >
                  {mission.completed ? '✓' : `+${mission.xpReward} XP`}
                </Badge>
              </div>
              <Progress 
                value={progress} 
                className={`h-2 ${mission.completed ? '[&>div]:bg-success' : ''}`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {mission.current}/{mission.target} - {mission.description}
              </p>
            </div>
          );
        })}
      </div>

      {completedMissions > 0 && (
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">XP ganho esta semana:</span>
          <span className="text-lg font-bold text-success">+{totalXP} XP</span>
        </div>
      )}
    </Card>
  );
};

export default WeeklyMissions;
