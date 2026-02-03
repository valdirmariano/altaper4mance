import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { ModuleInsight } from '@/components/Accountability/AccountabilityPartner';
import { useHabits } from '@/hooks/useHabits';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { 
  Plus, 
  Flame, 
  Target, 
  TrendingUp,
  Trophy,
  Sparkles,
  Heart,
  Brain,
  DollarSign,
  Zap,
  CheckCircle2,
  Loader2,
  Trash2,
  Calendar
} from 'lucide-react';

const HabitsManager = () => {
  const { user } = useAuth();
  const { rewardHabitComplete } = useGamification();
  const { habits, loading, addHabit, deleteHabit, toggleHabitToday, isHabitCompletedOnDate } = useHabits(rewardHabitComplete);
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
  const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

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
      case 'health': return 'text-red-400 bg-red-500/10';
      case 'productivity': return 'text-amber-400 bg-amber-500/10';
      case 'learning': return 'text-blue-400 bg-blue-500/10';
      case 'wellness': return 'text-accent bg-accent/10';
      case 'finance': return 'text-green-400 bg-green-500/10';
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

  const weekDayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const checkHabitOnDate = (habitId: string, date: string) => {
    return isHabitCompletedOnDate(habitId, date);
  };

  // Motivation insight
  const getMotivationInsight = () => {
    if (progressPercent === 100) {
      return "Dia perfeito! Você completou todos os hábitos. Continue assim! 🏆";
    }
    if (progressPercent >= 70) {
      return `Quase lá! Só faltam ${habits.length - completedToday} hábitos. Você consegue!`;
    }
    if (bestStreak >= 7) {
      return `Sequência de ${bestStreak} dias! Não quebre o ciclo agora.`;
    }
    if (completedToday === 0 && habits.length > 0) {
      return "Comece pelo hábito mais rápido. Momentum é tudo!";
    }
    return "Pequenos hábitos, grandes transformações. Cada dia conta!";
  };

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
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10 backdrop-blur-sm">
              <Target className="h-7 w-7 text-accent" />
            </div>
            Hábitos
          </h1>
          <p className="text-muted-foreground mt-1">
            Construa consistência e transforme sua rotina
          </p>
        </motion.div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4" />
              Novo Hábito
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/50">
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
                className="bg-background/50"
              />
              <Input
                placeholder="Descrição (opcional)"
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                className="bg-background/50"
              />
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  value={newHabit.frequency} 
                  onValueChange={(value) => setNewHabit({ ...newHabit, frequency: value })}
                >
                  <SelectTrigger className="bg-background/50">
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
                  <SelectTrigger className="bg-background/50">
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
              <Button onClick={handleAddHabit} className="bg-accent hover:bg-accent/90">
                Criar Hábito
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Accountability Partner Insight */}
      <ModuleInsight 
        module="habits" 
        customMessage={getMotivationInsight()}
      />

      {/* Today's Progress - Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card p-6 lg:p-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-accent/10 backdrop-blur-sm">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold">Progresso de Hoje</h2>
                  <p className="text-muted-foreground">
                    {completedToday} de {habits.length} hábitos completados
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{Math.round(progressPercent)}%</span>
                  <span className="text-muted-foreground">Meta: 100%</span>
                </div>
                <div className="h-4 rounded-full bg-muted/50 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 lg:gap-6">
              <motion.div 
                className="flex-1 lg:flex-none text-center p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Flame className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-amber-400">{totalStreak}</p>
                <p className="text-xs text-muted-foreground">Total Streak</p>
              </motion.div>
              <motion.div 
                className="flex-1 lg:flex-none text-center p-5 rounded-2xl bg-green-500/10 border border-green-500/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Trophy className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-green-400">{bestStreak}</p>
                <p className="text-xs text-muted-foreground">Melhor</p>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Week View Table */}
      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card p-6 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Última Semana</h3>
            </div>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr>
                    <th className="text-left text-sm font-medium text-muted-foreground pb-4 pr-4 min-w-[180px]">
                      Hábito
                    </th>
                    {last7Days.map((date, idx) => (
                      <th key={date} className="text-center text-xs font-medium text-muted-foreground pb-4 px-2 w-12">
                        <div className={date === today ? 'text-accent' : ''}>
                          {weekDayNames[new Date(date + 'T12:00:00').getDay()]}
                        </div>
                        <div className={`text-sm mt-1 ${date === today ? 'font-bold text-accent' : ''}`}>
                          {new Date(date + 'T12:00:00').getDate()}
                        </div>
                      </th>
                    ))}
                    <th className="text-center text-sm font-medium text-muted-foreground pb-4 px-2 w-16">🔥</th>
                  </tr>
                </thead>
                <tbody>
                  {habits.map((habit) => (
                    <tr key={habit.id} className="border-t border-border/50">
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getCategoryColor(habit.category || 'health')}`}>
                            {getCategoryIcon(habit.category || 'health')}
                          </div>
                          <span className="font-medium text-sm truncate">{habit.title}</span>
                        </div>
                      </td>
                      {last7Days.map((date) => {
                        const isCompleted = checkHabitOnDate(habit.id, date);
                        const isToday = date === today;
                        return (
                          <td key={date} className="text-center py-4 px-2">
                            <motion.button
                              onClick={() => isToday && handleToggleHabit(habit.id)}
                              disabled={!isToday}
                              whileHover={isToday ? { scale: 1.1 } : {}}
                              whileTap={isToday ? { scale: 0.95 } : {}}
                              className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center mx-auto ${
                                isCompleted 
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                                  : isToday
                                    ? 'bg-muted/50 hover:bg-accent/20 border-2 border-dashed border-accent/40 cursor-pointer'
                                    : 'bg-muted/30'
                              }`}
                            >
                              {isCompleted && <CheckCircle2 className="h-5 w-5" />}
                            </motion.button>
                          </td>
                        );
                      })}
                      <td className="text-center py-4 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <Flame className={`h-4 w-4 ${(habit.streak || 0) > 0 ? 'text-amber-400' : 'text-muted-foreground/30'}`} />
                          <span className={`text-sm font-bold ${(habit.streak || 0) > 0 ? 'text-amber-400' : 'text-muted-foreground'}`}>
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
        </motion.div>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {habits.map((habit, index) => {
            const isCompleted = isHabitCompletedToday(habit.id);
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card 
                  className={`glass-card p-5 transition-all cursor-pointer group hover-lift ${
                    isCompleted ? 'ring-2 ring-green-500/30 bg-green-500/5' : ''
                  }`}
                  onClick={() => handleToggleHabit(habit.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${getCategoryColor(habit.category || 'health')}`}>
                        {getCategoryIcon(habit.category || 'health')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{habit.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {getCategoryLabel(habit.category || 'health')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-muted-foreground/40'
                      }`}>
                        {isCompleted && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHabit(habit.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className={`h-4 w-4 ${(habit.streak || 0) > 0 ? 'text-amber-400' : 'text-muted-foreground/50'}`} />
                      <span className={`text-sm font-semibold ${(habit.streak || 0) > 0 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                        {habit.streak || 0} dias
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getFrequencyLabel(habit.frequency || 'daily')}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add Habit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: habits.length * 0.05 }}
        >
          <Card 
            className="glass-card p-5 border-dashed border-2 border-muted-foreground/20 hover:border-accent/50 cursor-pointer transition-all flex items-center justify-center min-h-[140px] hover-lift"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <div className="text-center">
              <div className="p-3 rounded-xl bg-accent/10 w-fit mx-auto mb-3">
                <Plus className="h-6 w-6 text-accent" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Adicionar Hábito</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Hábitos ativos', value: habits.length, color: 'accent' },
          { icon: TrendingUp, label: 'Taxa de hoje', value: `${Math.round(progressPercent)}%`, color: 'green' },
          { icon: Flame, label: 'Total Streak', value: totalStreak, color: 'amber' },
          { icon: Trophy, label: 'Melhor Streak', value: bestStreak, color: 'accent' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-${stat.color}-500/10`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color === 'accent' ? 'accent' : stat.color + '-400'}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HabitsManager;
