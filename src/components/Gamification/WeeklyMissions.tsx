import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';
import { useGamification } from '@/hooks/useGamification';

interface Mission {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  xpReward: number;
  icon: React.ReactNode;
  completed: boolean;
}

const WeeklyMissions: React.FC = () => {
  const { tasks } = useTasks();
  const { habits, habitLogs } = useHabits();
  const { stats } = useGamification();

  // Calculate mission progress
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  // Tasks completed this week
  const tasksThisWeek = tasks.filter(t => {
    if (t.status !== 'done') return false;
    const updatedAt = new Date(t.updated_at);
    return updatedAt >= weekStart;
  }).length;

  // Days with all habits completed this week
  const perfectDays = (() => {
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
  })();

  // Streak progress
  const streakProgress = Math.min(stats.streak, 7);

  const missions: Mission[] = [
    {
      id: 'tasks_20',
      title: 'Completar 20 tarefas',
      description: 'Finalize 20 tarefas esta semana',
      current: Math.min(tasksThisWeek, 20),
      target: 20,
      xpReward: 300,
      icon: <CheckCircle2 className="h-4 w-4" />,
      completed: tasksThisWeek >= 20,
    },
    {
      id: 'streak_7',
      title: 'Streak de 7 dias',
      description: 'Mantenha atividade por 7 dias seguidos',
      current: streakProgress,
      target: 7,
      xpReward: 200,
      icon: <Sparkles className="h-4 w-4" />,
      completed: stats.streak >= 7,
    },
    {
      id: 'perfect_6',
      title: '6 dias perfeitos',
      description: 'Complete todos os hábitos em 6 dias',
      current: Math.min(perfectDays, 6),
      target: 6,
      xpReward: 150,
      icon: <Target className="h-4 w-4" />,
      completed: perfectDays >= 6,
    },
  ];

  const completedMissions = missions.filter(m => m.completed).length;
  const totalXP = missions.reduce((acc, m) => acc + (m.completed ? m.xpReward : 0), 0);

  // Days until week ends
  const daysRemaining = 7 - now.getDay();

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
                    mission.completed ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
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
