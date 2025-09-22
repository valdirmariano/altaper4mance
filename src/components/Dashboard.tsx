import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  CheckCircle2, 
  Target, 
  Timer, 
  TrendingUp,
  Plus,
  Play,
  Pause,
  Brain,
  Flame,
  Clock,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds

  // Mock data - in real app this would come from state/API
  const todayStats = {
    tasksCompleted: 3,
    totalTasks: 8,
    habitsCompleted: 2,
    totalHabits: 5,
    focusTime: 120, // minutes
    streak: 5
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen gradient-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-slide-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent mb-2">
            Alta Per4mance ⬏
          </h1>
          <p className="text-muted-foreground text-lg">
            Bom dia! Aqui está uma visão do seu progresso hoje.
          </p>
        </div>

        {/* AI Coach Section */}
        <Card className="p-6 gradient-card border-primary/20 animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                Assistente de Responsabilidade
                <Badge variant="secondary" className="text-xs">AI Coach</Badge>
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Você tem {todayStats.totalTasks - todayStats.tasksCompleted} tarefas pendentes para hoje.
                </p>
                <p>
                  O progresso dos seus hábitos de hoje é de {Math.round((todayStats.habitsCompleted / todayStats.totalHabits) * 100)}%
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="gradient" size="sm">
                    <Target className="h-4 w-4" />
                    Gerar Plano do Dia
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver Sugestões
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          <Card className="p-6 gradient-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
                <p className="text-2xl font-bold text-success">
                  {todayStats.tasksCompleted}/{todayStats.totalTasks}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <Progress 
              value={(todayStats.tasksCompleted / todayStats.totalTasks) * 100} 
              className="mt-3"
            />
          </Card>

          <Card className="p-6 gradient-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hábitos</p>
                <p className="text-2xl font-bold text-primary">
                  {todayStats.habitsCompleted}/{todayStats.totalHabits}
                </p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <Progress 
              value={(todayStats.habitsCompleted / todayStats.totalHabits) * 100} 
              className="mt-3"
            />
          </Card>

          <Card className="p-6 gradient-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo de Foco</p>
                <p className="text-2xl font-bold text-secondary">
                  {todayStats.focusTime}min
                </p>
              </div>
              <Timer className="h-8 w-8 text-secondary" />
            </div>
          </Card>

          <Card className="p-6 gradient-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sequência</p>
                <p className="text-2xl font-bold text-warning">
                  {todayStats.streak} dias
                </p>
              </div>
              <Flame className="h-8 w-8 text-warning" />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          
          {/* Today's Tasks */}
          <Card className="p-6 gradient-card lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Tarefas de Hoje
              </h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 1, title: 'Revisar relatório de vendas', completed: true, priority: 'alta' },
                { id: 2, title: 'Reunião com equipe - 14h', completed: true, priority: 'média' },
                { id: 3, title: 'Estudar React avançado', completed: true, priority: 'baixa' },
                { id: 4, title: 'Ir ao mercado', completed: false, priority: 'média' },
                { id: 5, title: 'Lavar o carro', completed: false, priority: 'baixa' },
                { id: 6, title: 'Gravar vídeo para YouTube', completed: false, priority: 'alta' },
                { id: 7, title: 'Planejar próxima semana', completed: false, priority: 'média' },
                { id: 8, title: 'Exercícios - 30min', completed: false, priority: 'alta' },
              ].map((task) => (
                <div 
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    task.completed 
                      ? 'bg-success/10 border-success/20' 
                      : 'bg-card border-border hover:border-primary/40'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      task.completed 
                        ? 'bg-success border-success' 
                        : 'border-muted-foreground hover:border-primary cursor-pointer'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                  <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                    {task.title}
                  </span>
                  <Badge 
                    variant={task.priority === 'alta' ? 'destructive' : task.priority === 'média' ? 'default' : 'secondary'}
                    className="ml-auto text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Pomodoro Timer */}
          <Card className="p-6 gradient-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                Pomodoro
              </h3>
            </div>
            
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-8 border-muted mx-auto flex items-center justify-center">
                  <span className="text-3xl font-mono font-bold">
                    {formatTime(pomodoroTime)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  variant={pomodoroActive ? "destructive" : "premium"} 
                  size="lg" 
                  className="w-full"
                  onClick={() => setPomodoroActive(!pomodoroActive)}
                >
                  {pomodoroActive ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Iniciar Foco
                    </>
                  )}
                </Button>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Button variant="outline" size="sm">25min</Button>
                  <Button variant="outline" size="sm">15min</Button>
                  <Button variant="outline" size="sm">5min</Button>
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* Bottom Section - Habits & Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          
          {/* Habit Tracker */}
          <Card className="p-6 gradient-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Hábitos de Hoje
              </h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Beber 2L de água', completed: true, streak: 5 },
                { name: 'Exercitar 30min', completed: true, streak: 3 },
                { name: 'Ler 20 páginas', completed: false, streak: 2 },
                { name: 'Meditar 10min', completed: false, streak: 1 },
                { name: 'Dormir antes de 23h', completed: false, streak: 0 },
              ].map((habit, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                        habit.completed 
                          ? 'bg-success border-success' 
                          : 'border-muted-foreground hover:border-primary'
                      }`}
                    >
                      {habit.completed && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </div>
                    <span>{habit.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-warning" />
                    <span className="text-sm text-muted-foreground">{habit.streak}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 gradient-card">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Ações Rápidas
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Agenda</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Target className="h-5 w-5" />
                <span className="text-xs">Projetos</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Award className="h-5 w-5" />
                <span className="text-xs">Metas</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1">
                <Brain className="h-5 w-5" />
                <span className="text-xs">Notas</span>
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="premium" className="w-full" size="lg">
                <Plus className="h-5 w-5" />
                Gerar Plano Semanal
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;