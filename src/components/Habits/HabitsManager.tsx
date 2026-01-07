import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useHabits } from '@/hooks/useHabits';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  Flame, 
  Target, 
  TrendingUp,
  Award,
  Trophy,
  Sparkles,
  Heart,
  Brain,
  DollarSign,
  Zap,
  CheckCircle2,
  Loader2,
  Trash2
} from 'lucide-react';

const HabitsManager = () => {
  const { user } = useAuth();
  const { habits, habitLogs, loading, addHabit, deleteHabit, toggleHabitToday, isHabitCompletedOnDate } = useHabits();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({ 
    title: '', 
    description: '',
    frequency: 'daily',
    category: 'health'
  });

  const today = new Date().toISOString().split('T')[0];
  
  const isHabitCompletedToday = (habitId: string) => {
    return isHabitCompletedOnDate(habitId, today);
  };

  const completedToday = habits.filter(h => isHabitCompletedToday(h.id)).length;
  const progressPercent = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return <Heart className="h-4 w-4" />;
      case 'productivity': return <Zap className="h-4 w-4" />;
      case 'learning': return <Brain className="h-4 w-4" />;
      case 'wellness': return <Sparkles className="h-4 w-4" />;
      case 'finance': return <DollarSign className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'health': return 'Saúde';
      case 'productivity': return 'Produtividade';
      case 'learning': return 'Aprendizado';
      case 'wellness': return 'Bem-estar';
      case 'finance': return 'Finanças';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'text-destructive bg-destructive/10';
      case 'productivity': return 'text-warning bg-warning/10';
      case 'learning': return 'text-info bg-info/10';
      case 'wellness': return 'text-accent bg-accent/10';
      case 'finance': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Diário';
      case '3x_week': return '3x/sem';
      case '2x_week': return '2x/sem';
      case 'weekly': return 'Semanal';
      default: return frequency;
    }
  };

  const handleAddHabit = () => {
    if (!newHabit.title.trim()) return;
    addHabit({
      title: newHabit.title,
      description: newHabit.description || undefined,
      frequency: newHabit.frequency,
      category: newHabit.category,
    });
    setNewHabit({ title: '', description: '', frequency: 'daily', category: 'health' });
    setIsAddDialogOpen(false);
  };

  const handleToggleHabit = (habitId: string) => {
    toggleHabitToday(habitId);
  };

  // Generate last 7 days for the week view
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const weekDayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const checkHabitOnDate = (habitId: string, date: string) => {
    return isHabitCompletedOnDate(habitId, date);
  };

  // Calculate total streak
  const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Faça login para gerenciar seus hábitos</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6" />
            Rastreador de Hábitos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Construa consistência e transforme sua rotina
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Hábito
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Hábito</DialogTitle>
              <DialogDescription>
                Defina um novo hábito para acompanhar diariamente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Nome do hábito (ex: Meditar 10 minutos)"
                value={newHabit.title}
                onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
              />
              <Input
                placeholder="Descrição (opcional)"
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  value={newHabit.frequency} 
                  onValueChange={(value) => setNewHabit({ ...newHabit, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="3x_week">3x por semana</SelectItem>
                    <SelectItem value="2x_week">2x por semana</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={newHabit.category} 
                  onValueChange={(value) => setNewHabit({ ...newHabit, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">❤️ Saúde</SelectItem>
                    <SelectItem value="productivity">⚡ Produtividade</SelectItem>
                    <SelectItem value="learning">🧠 Aprendizado</SelectItem>
                    <SelectItem value="wellness">✨ Bem-estar</SelectItem>
                    <SelectItem value="finance">💰 Finanças</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddHabit}>Criar Hábito</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Progress */}
      <Card className="p-6 bg-card border-border">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Progresso de Hoje</h2>
                <p className="text-sm text-muted-foreground">
                  {completedToday} de {habits.length} hábitos completados
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{Math.round(progressPercent)}%</span>
                <span className="text-muted-foreground">Meta: 100%</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-center p-4 rounded-xl bg-warning/10 border border-warning/20">
              <Flame className="h-6 w-6 text-warning mx-auto mb-1" />
              <p className="text-2xl font-bold text-warning">{totalStreak}</p>
              <p className="text-xs text-muted-foreground">Total Streak</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-success/10 border border-success/20">
              <Trophy className="h-6 w-6 text-success mx-auto mb-1" />
              <p className="text-2xl font-bold text-success">{bestStreak}</p>
              <p className="text-xs text-muted-foreground">Melhor</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Week View */}
      {habits.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h3 className="font-medium mb-4">Última Semana</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3 pr-4 min-w-[200px]">Hábito</th>
                  {last7Days.map((date) => (
                    <th key={date} className="text-center text-xs font-medium text-muted-foreground pb-3 px-2 min-w-[50px]">
                      <div>{weekDayNames[new Date(date + 'T12:00:00').getDay()]}</div>
                      <div className={date === today ? 'text-accent font-bold' : ''}>
                        {new Date(date + 'T12:00:00').getDate()}
                      </div>
                    </th>
                  ))}
                  <th className="text-center text-sm font-medium text-muted-foreground pb-3 px-2">🔥</th>
                </tr>
              </thead>
              <tbody>
                {habits.map((habit) => (
                  <tr key={habit.id} className="border-t border-border">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${getCategoryColor(habit.category || 'health')}`}>
                          {getCategoryIcon(habit.category || 'health')}
                        </div>
                        <span className="text-sm font-medium truncate">{habit.title}</span>
                      </div>
                    </td>
                    {last7Days.map((date) => {
                      const isCompleted = checkHabitOnDate(habit.id, date);
                      const isToday = date === today;
                      return (
                        <td key={date} className="text-center py-3 px-2">
                          <button
                            onClick={() => isToday && handleToggleHabit(habit.id)}
                            disabled={!isToday}
                            className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center mx-auto ${
                              isCompleted 
                                ? 'bg-success text-success-foreground' 
                                : isToday
                                  ? 'bg-muted hover:bg-muted-light border-2 border-dashed border-accent/50'
                                  : 'bg-muted/50'
                            }`}
                          >
                            {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                          </button>
                        </td>
                      );
                    })}
                    <td className="text-center py-3 px-2">
                      <div className="flex items-center justify-center gap-1">
                        <Flame className={`h-4 w-4 ${(habit.streak || 0) > 0 ? 'text-warning' : 'text-muted-foreground/30'}`} />
                        <span className={`text-sm font-medium ${(habit.streak || 0) > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                          {habit.streak || 0}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => {
          const isCompleted = isHabitCompletedToday(habit.id);
          return (
            <Card 
              key={habit.id}
              className={`p-4 transition-all ${
                isCompleted 
                  ? 'bg-success/5 border-success/30' 
                  : 'bg-card border-border hover:border-accent/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                  onClick={() => handleToggleHabit(habit.id)}
                >
                  <div className={`p-2 rounded-lg ${getCategoryColor(habit.category || 'health')}`}>
                    {getCategoryIcon(habit.category || 'health')}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{habit.title}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{getCategoryLabel(habit.category || 'health')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={isCompleted}
                    onCheckedChange={() => handleToggleHabit(habit.id)}
                    className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Flame className={`h-4 w-4 ${(habit.streak || 0) > 0 ? 'text-warning' : 'text-muted-foreground/50'}`} />
                    <span className="text-sm font-medium">{habit.streak || 0}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getFrequencyLabel(habit.frequency || 'daily')}
                </Badge>
              </div>
            </Card>
          );
        })}

        {/* Add Habit Card */}
        <Card 
          className="p-4 border-dashed border-2 border-muted-foreground/20 hover:border-accent/50 cursor-pointer transition-all flex items-center justify-center min-h-[140px]"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <div className="text-center">
            <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Adicionar Hábito</p>
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{habits.length}</p>
              <p className="text-xs text-muted-foreground">Hábitos ativos</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{Math.round(progressPercent)}%</p>
              <p className="text-xs text-muted-foreground">Taxa de hoje</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Flame className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalStreak}</p>
              <p className="text-xs text-muted-foreground">Total streak</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Award className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{completedToday}</p>
              <p className="text-xs text-muted-foreground">Completos hoje</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HabitsManager;
