import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { FloatingInsight, AccountabilityButton } from '@/components/Accountability/AccountabilityPartner';
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
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
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Award,
  Zap,
  ChevronRight,
  Clock,
  Heart,
  Brain,
  Dumbbell
} from 'lucide-react';

interface DashboardProps {
  onNavigateToSection?: (section: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToSection }) => {
  const { settings } = useAppStore();
  const { user } = useAuth();
  const { stats, xpToNextLevel, currentLevelXP, xpProgress } = useGamification();
  
  // Supabase data hooks
  const { tasks, loading: tasksLoading, toggleTask } = useTasks();
  const { habits, loading: habitsLoading, toggleHabitToday, isHabitCompletedOnDate, getCompletedTodayCount } = useHabits();
  const { goals, loading: goalsLoading } = useGoals();
  const { transactions, getMonthlyStats, loading: transactionsLoading } = useTransactions();
  
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);

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
  const todayHabits = habits.slice(0, 6);
  const completedHabits = getCompletedTodayCount();

  // Calculate finances from Supabase
  const { receitas: totalReceitas, despesas: totalDespesas, saldo } = getMonthlyStats();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Mock weekly activity data for chart
  const weeklyData = [
    { day: 'Seg', tasks: 5, habits: 4, focus: 2 },
    { day: 'Ter', tasks: 8, habits: 5, focus: 3 },
    { day: 'Qua', tasks: 4, habits: 6, focus: 4 },
    { day: 'Qui', tasks: 6, habits: 5, focus: 2 },
    { day: 'Sex', tasks: 7, habits: 4, focus: 5 },
    { day: 'Sáb', tasks: 3, habits: 3, focus: 1 },
    { day: 'Dom', tasks: 2, habits: 5, focus: 0 },
  ];

  // Category spending for pie chart
  const spendingCategories = [
    { name: 'Moradia', value: 35, color: 'hsl(var(--accent))' },
    { name: 'Alimentação', value: 25, color: 'hsl(var(--success))' },
    { name: 'Transporte', value: 15, color: 'hsl(var(--warning))' },
    { name: 'Lazer', value: 15, color: 'hsl(var(--info))' },
    { name: 'Outros', value: 10, color: 'hsl(var(--muted-foreground))' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-[calc(100vh-1px)]">
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-1">
                  {greeting()} 👋
                </h1>
                <p className="text-muted-foreground">
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              
              {/* Level & Streak Badge */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-gradient-to-r from-card to-muted/30 border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-warning/20 flex items-center justify-center">
                      <Flame className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{stats.streak}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Dias</p>
                    </div>
                  </div>
                  
                  <div className="w-px h-10 bg-border/50" />
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">Nv.{stats.level}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stats.xp} XP</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* XP Progress Bar */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="font-medium">Progresso do Nível</span>
                <span>{currentLevelXP} / {xpToNextLevel} XP</span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>

            {/* Accountability Partner Insight */}
            <motion.div variants={itemVariants}>
              <FloatingInsight onNavigateToAI={() => onNavigateToSection?.('ai')} />
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tasks Card */}
              <Card className="p-4 bg-gradient-to-br from-card to-muted/20 border-border/50 hover:border-accent/30 transition-all duration-300 group cursor-pointer"
                onClick={() => onNavigateToSection?.('tasks')}>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckSquare className="h-5 w-5 text-accent" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold">{completedToday}<span className="text-lg text-muted-foreground">/{tasks.length}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Tarefas concluídas</p>
                </div>
              </Card>

              {/* Habits Card */}
              <Card className="p-4 bg-gradient-to-br from-card to-muted/20 border-border/50 hover:border-success/30 transition-all duration-300 group cursor-pointer"
                onClick={() => onNavigateToSection?.('habits')}>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="h-5 w-5 text-success" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold">{completedHabits}<span className="text-lg text-muted-foreground">/{habits.length}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Hábitos de hoje</p>
                </div>
              </Card>

              {/* Goals Card */}
              <Card className="p-4 bg-gradient-to-br from-card to-muted/20 border-border/50 hover:border-warning/30 transition-all duration-300 group cursor-pointer"
                onClick={() => onNavigateToSection?.('goals')}>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-5 w-5 text-warning" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold">{goals.filter(g => g.status === 'ativo' || g.status === 'em_progresso').length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Metas ativas</p>
                </div>
              </Card>

              {/* Balance Card */}
              <Card className={cn(
                "p-4 bg-gradient-to-br from-card to-muted/20 border-border/50 transition-all duration-300 group cursor-pointer",
                saldo >= 0 ? "hover:border-success/30" : "hover:border-destructive/30"
              )} onClick={() => onNavigateToSection?.('finance')}>
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform",
                    saldo >= 0 ? "bg-success/10" : "bg-destructive/10"
                  )}>
                    <DollarSign className={cn("h-5 w-5", saldo >= 0 ? "text-success" : "text-destructive")} />
                  </div>
                  <div className="flex items-center gap-1">
                    {saldo >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className={cn("text-2xl font-bold", saldo >= 0 ? "text-success" : "text-destructive")}>
                    {formatCurrency(saldo)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Saldo do mês</p>
                </div>
              </Card>
            </motion.div>

            {/* Main Content Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Tasks Section */}
              <Card className="lg:col-span-2 p-5 bg-card border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <CheckSquare className="h-4 w-4 text-accent" />
                    </div>
                    <h3 className="font-semibold">Tarefas Prioritárias</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-muted-foreground hover:text-accent"
                    onClick={() => onNavigateToSection?.('tasks')}
                  >
                    Ver todas
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {todayTasks.map((task) => {
                    const isDone = task.status === 'done';
                    return (
                      <motion.div 
                        key={task.id}
                        whileHover={{ x: 4 }}
                        className={cn(
                          "group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                          isDone 
                            ? 'bg-muted/30 border-transparent' 
                            : 'border-border/50 hover:border-accent/30 hover:bg-muted/20'
                        )}
                        onClick={() => toggleTask(task.id)}
                      >
                        <Checkbox 
                          checked={isDone} 
                          className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                        <span className={cn(
                          "flex-1 text-sm",
                          isDone && 'line-through text-muted-foreground'
                        )}>
                          {task.title}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] px-2 opacity-0 group-hover:opacity-100 transition-opacity",
                            task.priority === 'p0' || task.priority === 'alta'
                              ? 'border-destructive/50 text-destructive' 
                              : task.priority === 'p1' || task.priority === 'média'
                                ? 'border-warning/50 text-warning' 
                                : 'border-muted text-muted-foreground'
                          )}
                        >
                          {task.priority}
                        </Badge>
                      </motion.div>
                    );
                  })}
                  
                  {todayTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">Todas as tarefas concluídas!</p>
                      <p className="text-xs mt-1">Excelente trabalho 🎉</p>
                    </div>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-dashed border-border/50 hover:border-accent/50 hover:bg-accent/5"
                  onClick={() => onNavigateToSection?.('tasks')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar tarefa
                </Button>
              </Card>

              {/* Pomodoro Timer */}
              <Card className="p-5 bg-card border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Timer className="h-4 w-4 text-accent" />
                  </div>
                  <h3 className="font-semibold">Modo Foco</h3>
                </div>
                
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    {/* Outer ring */}
                    <div className={cn(
                      "absolute inset-0 rounded-full border-4 transition-all duration-300",
                      pomodoroActive 
                        ? "border-accent/30 shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]" 
                        : "border-muted/30"
                    )} />
                    
                    {/* Timer display */}
                    <div className={cn(
                      "w-36 h-36 rounded-full flex flex-col items-center justify-center",
                      "bg-gradient-to-br from-muted/20 to-transparent",
                      "border-2 transition-all duration-300",
                      pomodoroActive ? "border-accent" : "border-border/50"
                    )}>
                      <span className="text-4xl font-light tracking-tight font-mono">
                        {formatTime(pomodoroTime)}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                        {pomodoroActive ? 'Focando...' : 'Pronto'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-4">
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
                      size="icon"
                      onClick={() => { setPomodoroTime(25 * 60); setPomodoroActive(false); }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex justify-center gap-2">
                    {[25, 15, 5].map((time) => (
                      <Button 
                        key={time}
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                          "h-8 px-4 text-xs rounded-full",
                          pomodoroTime === time * 60 && 'bg-muted'
                        )}
                        onClick={() => { setPomodoroTime(time * 60); setPomodoroActive(false); }}
                      >
                        {time}min
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Bottom Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Habits */}
              <Card className="p-5 bg-card border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <Flame className="h-4 w-4 text-success" />
                    </div>
                    <h3 className="font-semibold">Hábitos de Hoje</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-muted/50">
                    {completedHabits}/{habits.length}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {todayHabits.map((habit) => {
                    const isCompleted = isHabitCompletedOnDate(habit.id, today);
                    const streak = habit.streak || 0;
                    return (
                      <motion.div 
                        key={habit.id} 
                        whileHover={{ x: 4 }}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                          isCompleted 
                            ? 'bg-success/5 border-success/20' 
                            : 'border-border/50 hover:border-accent/30'
                        )}
                        onClick={() => toggleHabitToday(habit.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={isCompleted}
                            className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                          />
                          <span className={cn(
                            "text-sm",
                            isCompleted && 'text-muted-foreground'
                          )}>
                            {habit.title}
                          </span>
                        </div>
                        {streak > 0 && (
                          <div className="flex items-center gap-1 text-xs text-warning">
                            <Flame className="h-3 w-3" />
                            <span>{streak}</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              {/* Weekly Activity Chart */}
              <Card className="p-5 bg-card border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </div>
                  <h3 className="font-semibold">Atividade Semanal</h3>
                </div>
                
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="tasks" 
                        stroke="hsl(var(--accent))" 
                        fillOpacity={1}
                        fill="url(#colorTasks)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Goals Progress */}
              <Card className="p-5 bg-card border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Award className="h-4 w-4 text-warning" />
                    </div>
                    <h3 className="font-semibold">Metas em Progresso</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0"
                    onClick={() => onNavigateToSection?.('goals')}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {goals.filter(g => g.status === 'em_progresso' || g.status === 'ativo').slice(0, 3).map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate flex-1">{goal.title}</span>
                        <span className="text-xs text-muted-foreground ml-2 font-medium">{goal.progress || 0}%</span>
                      </div>
                      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress || 0}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {goals.filter(g => g.status === 'em_progresso' || g.status === 'ativo').length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <Target className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Nenhuma meta ativa</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Finance Overview */}
            <motion.div variants={itemVariants}>
              <Card className="p-5 bg-card border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-accent" />
                    </div>
                    <h3 className="font-semibold">Visão Financeira do Mês</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => onNavigateToSection?.('finance')}
                  >
                    Ver detalhes
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Income */}
                  <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUpRight className="h-4 w-4 text-success" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Receitas</span>
                    </div>
                    <p className="text-2xl font-bold text-success">{formatCurrency(totalReceitas)}</p>
                  </div>

                  {/* Expenses */}
                  <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Despesas</span>
                    </div>
                    <p className="text-2xl font-bold text-destructive">{formatCurrency(totalDespesas)}</p>
                  </div>

                  {/* Balance */}
                  <div className={cn(
                    "p-4 rounded-xl border",
                    saldo >= 0 
                      ? "bg-success/5 border-success/20" 
                      : "bg-destructive/5 border-destructive/20"
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className={cn("h-4 w-4", saldo >= 0 ? "text-success" : "text-destructive")} />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Saldo</span>
                    </div>
                    <p className={cn(
                      "text-2xl font-bold",
                      saldo >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {formatCurrency(saldo)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </ScrollArea>

      {/* Floating AI Button */}
      <AccountabilityButton onClick={() => onNavigateToSection?.('ai')} />
    </div>
  );
};

export default Dashboard;
