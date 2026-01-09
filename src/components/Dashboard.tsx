import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { 
  Calendar, 
  CheckSquare, 
  Target, 
  Timer, 
  Plus,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Droplets,
  ArrowRight,
  Sparkles,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  Award,
  Zap,
  ChevronRight,
  MessageSquare,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { settings } = useAppStore();
  const { user } = useAuth();
  const { stats, xpToNextLevel, currentLevelXP, xpProgress } = useGamification();
  
  // Supabase data hooks
  const { tasks, loading: tasksLoading, toggleTask } = useTasks();
  const { habits, loading: habitsLoading, toggleHabitToday, isHabitCompletedOnDate, getCompletedTodayCount } = useHabits();
  const { goals, loading: goalsLoading, getActiveGoalsCount } = useGoals();
  const { getMonthlyStats, loading: transactionsLoading } = useTransactions();
  
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [waterIntake, setWaterIntake] = useState(4);
  const [quickNote, setQuickNote] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);

  const isLoading = tasksLoading || habitsLoading || goalsLoading || transactionsLoading;

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroTime]);

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.status !== 'done').slice(0, 5);
  const completedToday = tasks.filter(t => t.status === 'done').length;
  const todayHabits = habits.slice(0, 4);
  const completedHabits = getCompletedTodayCount();

  // Calculate finances from Supabase
  const { receitas: totalReceitas, despesas: totalDespesas, saldo } = getMonthlyStats();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Stats */}
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">
                {greeting()} 👋
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Aqui está sua visão geral do dia. Você está no nível {stats.level}!
              </p>
            </div>
            
            {/* XP & Level Badge */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-warning animate-pulse" />
                  <span className="font-semibold text-sm">{stats.streak}</span>
                  <span className="text-xs text-muted-foreground">dias</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="font-semibold text-sm">Nv. {stats.level}</span>
                </div>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>XP: {currentLevelXP} / {xpToNextLevel}</span>
              <span>Próximo nível: {stats.level + 1}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500 rounded-full"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up">
          <Card className="p-4 bg-card border-border card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <CheckSquare className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{completedToday}/{tasks.length}</p>
                <p className="text-xs text-muted-foreground">Tarefas de Hoje</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card border-border card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Target className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{completedHabits}/{habits.length}</p>
                <p className="text-xs text-muted-foreground">Hábitos</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card border-border card-hover">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{goals.filter(g => g.status === 'ativo').length}</p>
                <p className="text-xs text-muted-foreground">Metas Ativas</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card border-border card-hover">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${saldo >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <DollarSign className={`h-5 w-5 ${saldo >= 0 ? 'text-success' : 'text-destructive'}`} />
              </div>
              <div>
                <p className={`text-lg font-semibold ${saldo >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(saldo)}
                </p>
                <p className="text-xs text-muted-foreground">Saldo do Mês</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          
          {/* Tasks Column */}
          <Card className="p-5 bg-card border-border lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Tarefas de Hoje</h3>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                Ver todas
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {todayTasks.map((task) => {
                const isDone = task.status === 'done';
                return (
                  <div 
                    key={task.id}
                    className={`group flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      isDone 
                        ? 'bg-muted/30 border-transparent' 
                        : 'border-border hover:border-accent/30 hover:bg-muted/20'
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <Checkbox 
                      checked={isDone} 
                      className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <span className={`flex-1 text-sm ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
                        task.priority === 'p0' || task.priority === 'alta'
                          ? 'border-destructive/50 text-destructive' 
                          : task.priority === 'p1' || task.priority === 'média'
                            ? 'border-warning/50 text-warning' 
                            : 'border-muted text-muted-foreground'
                      }`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                );
              })}
              
              {todayTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Todas as tarefas concluídas! 🎉</p>
                </div>
              )}
            </div>

            <Button variant="ghost" className="w-full mt-3 h-9 text-muted-foreground hover:text-foreground border-dashed border border-border hover:border-accent/50">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar tarefa
            </Button>
          </Card>

          {/* Pomodoro */}
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Pomodoro</h3>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all ${
                  pomodoroActive ? 'border-accent animate-pulse-glow' : 'border-muted'
                }`}>
                  <span className="text-3xl font-light tracking-tight font-mono">
                    {formatTime(pomodoroTime)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-center gap-2">
                <Button 
                  variant={pomodoroActive ? "secondary" : "default"}
                  size="sm"
                  onClick={() => setPomodoroActive(!pomodoroActive)}
                  className="min-w-24"
                >
                  {pomodoroActive ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Iniciar
                    </>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => { setPomodoroTime(25 * 60); setPomodoroActive(false); }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-center gap-1">
                {[25, 15, 5].map((time) => (
                  <Button 
                    key={time}
                    variant="ghost" 
                    size="sm" 
                    className={`h-7 px-3 text-xs ${pomodoroTime === time * 60 ? 'bg-muted' : ''}`}
                    onClick={() => { setPomodoroTime(time * 60); setPomodoroActive(false); }}
                  >
                    {time}min
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Grid - Habits, Goals, Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          
          {/* Habits */}
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Hábitos</h3>
              </div>
              <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                {completedHabits}/{habits.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {todayHabits.map((habit) => {
                const isCompleted = isHabitCompletedOnDate(habit.id, today);
                const streak = habit.streak || 0;
                return (
                  <div 
                    key={habit.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isCompleted ? 'bg-success/5 border-success/20' : 'border-border hover:border-accent/30'
                    }`}
                    onClick={() => toggleHabitToday(habit.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={isCompleted}
                        className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                      />
                      <span className={`text-sm ${isCompleted ? 'text-muted-foreground' : ''}`}>
                        {habit.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Flame className={`h-3 w-3 ${streak > 0 ? 'text-warning' : 'text-muted-foreground/50'}`} />
                      <span className={streak > 0 ? 'text-warning' : 'text-muted-foreground'}>{streak}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Goals Progress */}
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Metas em Progresso</h3>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {goals.filter(g => g.status === 'em_progresso' || g.status === 'ativo').slice(0, 3).map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate flex-1">{goal.title}</span>
                    <span className="text-xs text-muted-foreground ml-2">{goal.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress || 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{goal.pillar || 'Geral'}</span>
                    <Badge variant="outline" className="text-xs h-5">
                      {goal.horizon === 'curto' ? '1-3 meses' : goal.horizon === 'médio' ? '3-12 meses' : '1+ ano'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Coach Quick Access */}
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-accent" />
              <h3 className="font-medium">Coach IA</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Olá! Baseado no seu dia, aqui está minha análise:
              </p>
              
              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Você tem <span className="text-foreground font-medium">{tasks.filter(t => t.status !== 'done').length} tarefas</span> pendentes. 
                    Foque nas de alta prioridade primeiro.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Sua sequência de <span className="text-warning font-medium">{stats.streak} dias</span> está 
                    ótima! Continue assim.
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4 border-accent/50 text-accent hover:bg-accent/10">
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversar com Coach IA
            </Button>
          </Card>
        </div>

        {/* Hydration & Quick Note Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          {/* Hydration */}
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-info" />
                <h3 className="font-medium">Hidratação</h3>
              </div>
              <span className="text-sm text-muted-foreground">{waterIntake} de 8 copos</span>
            </div>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                <button
                  key={glass}
                  onClick={() => setWaterIntake(glass)}
                  className={`flex-1 h-10 rounded-lg transition-all ${
                    glass <= waterIntake 
                      ? 'bg-info text-info-foreground' 
                      : 'bg-muted hover:bg-muted-light'
                  }`}
                >
                  <Droplets className={`h-4 w-4 mx-auto ${glass <= waterIntake ? 'text-white' : 'text-muted-foreground'}`} />
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Note */}
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Anotação Rápida</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Salvar
              </Button>
            </div>
            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Digite uma ideia ou lembrete..."
              className="w-full h-16 bg-muted/30 border-0 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-muted-foreground/50"
            />
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
