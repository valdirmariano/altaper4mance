import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  MoreHorizontal
} from 'lucide-react';

const Dashboard = () => {
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [waterIntake, setWaterIntake] = useState(4);
  const [quickNote, setQuickNote] = useState('');

  const todayStats = {
    tasksCompleted: 3,
    totalTasks: 8,
    habitsCompleted: 2,
    totalHabits: 5,
    streak: 5
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tasks = [
    { id: 1, title: 'Revisar relatório de vendas', completed: true, priority: 'alta' },
    { id: 2, title: 'Reunião com equipe - 14h', completed: true, priority: 'média' },
    { id: 3, title: 'Estudar React avançado', completed: true, priority: 'baixa' },
    { id: 4, title: 'Ir ao mercado', completed: false, priority: 'média' },
    { id: 5, title: 'Gravar vídeo para YouTube', completed: false, priority: 'alta' },
  ];

  const habits = [
    { name: 'Beber 2L de água', completed: true, streak: 5 },
    { name: 'Exercitar 30min', completed: true, streak: 3 },
    { name: 'Ler 20 páginas', completed: false, streak: 2 },
    { name: 'Meditar 10min', completed: false, streak: 1 },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-semibold tracking-tight mb-1">
            Bom dia
          </h1>
          <p className="text-muted-foreground">
            Aqui está uma visão geral do seu dia.
          </p>
        </div>

        {/* Top Grid - Stats & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-slide-up">
          
          {/* Quick Note */}
          <Card className="p-4 col-span-1 lg:col-span-2 bg-card border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Anotação Rápida</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Nova
              </Button>
            </div>
            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Digite uma nota rápida..."
              className="w-full h-20 bg-muted/30 border-0 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-border placeholder:text-muted-foreground/50"
            />
          </Card>

          {/* Hydration Tracker */}
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Hidratação</h3>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                <button
                  key={glass}
                  onClick={() => setWaterIntake(glass)}
                  className={`w-6 h-8 rounded transition-colors ${
                    glass <= waterIntake 
                      ? 'bg-foreground' 
                      : 'bg-muted hover:bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{waterIntake} de 8 copos</p>
          </Card>

          {/* Streak Counter */}
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Sequência</h3>
              <Flame className="h-4 w-4 text-warning" />
            </div>
            <p className="text-3xl font-semibold">{todayStats.streak}</p>
            <p className="text-xs text-muted-foreground">dias consecutivos</p>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          
          {/* Tasks */}
          <Card className="p-5 bg-card border-border lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Tarefas de Hoje</h3>
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                  {todayStats.tasksCompleted}/{todayStats.totalTasks}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Ver todas
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    task.completed 
                      ? 'bg-muted/30 border-transparent' 
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <Checkbox checked={task.completed} />
                  <span className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      task.priority === 'alta' 
                        ? 'border-destructive/50 text-destructive' 
                        : task.priority === 'média' 
                          ? 'border-warning/50 text-warning' 
                          : 'border-muted text-muted-foreground'
                    }`}
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full mt-3 h-9 text-muted-foreground hover:text-foreground">
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
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-4 border-muted flex items-center justify-center">
                  <span className="text-4xl font-light tracking-tight font-mono">
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
                  onClick={() => setPomodoroTime(25 * 60)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-center gap-2 text-xs">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-3"
                  onClick={() => setPomodoroTime(25 * 60)}
                >
                  25min
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-3"
                  onClick={() => setPomodoroTime(15 * 60)}
                >
                  15min
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-3"
                  onClick={() => setPomodoroTime(5 * 60)}
                >
                  5min
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Grid - Habits & Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          
          {/* Habits */}
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Hábitos de Hoje</h3>
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                  {todayStats.habitsCompleted}/{todayStats.totalHabits}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {habits.map((habit, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={habit.completed} />
                    <span className={`text-sm ${habit.completed ? 'text-muted-foreground' : ''}`}>
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Flame className="h-3 w-3 text-warning" />
                    {habit.streak}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Coach */}
          <Card className="p-5 bg-card border-border">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Assistente de Responsabilidade</h3>
            </div>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Você tem <span className="text-foreground font-medium">{todayStats.totalTasks - todayStats.tasksCompleted} tarefas</span> pendentes para hoje.
              </p>
              <p>
                Seu progresso de hábitos está em <span className="text-foreground font-medium">{Math.round((todayStats.habitsCompleted / todayStats.totalHabits) * 100)}%</span>.
              </p>
              <p>
                Continue assim! Você está em uma sequência de <span className="text-foreground font-medium">{todayStats.streak} dias</span>.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Plano do Dia
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
