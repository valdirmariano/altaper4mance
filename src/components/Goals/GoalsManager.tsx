import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ModuleInsight } from '@/components/Accountability/AccountabilityPartner';
import { 
  Target, 
  Plus, 
  MoreHorizontal,
  Calendar,
  Flag,
  TrendingUp,
  Trash2,
  Trophy,
  Rocket,
  Sparkles,
  ChevronUp
} from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const GoalsManager = () => {
  const { goals, loading, addGoal, updateGoal, deleteGoal } = useGoals();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    pillar: 'Desenvolvimento',
    horizon: 'medium',
    target_date: '',
    progress: 0,
    status: 'em_progresso'
  });

  const horizonLabels: Record<string, string> = {
    short: 'Curto Prazo',
    medium: 'Médio Prazo',
    long: 'Longo Prazo'
  };

  const horizonColors: Record<string, string> = {
    short: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    long: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  const pillars = ['Saúde', 'Carreira', 'Finanças', 'Desenvolvimento', 'Relacionamentos', 'Lazer'];

  const pillarIcons: Record<string, React.ReactNode> = {
    'Saúde': '❤️',
    'Carreira': '💼',
    'Finanças': '💰',
    'Desenvolvimento': '🚀',
    'Relacionamentos': '👥',
    'Lazer': '🎮'
  };

  const handleAddGoal = async () => {
    if (!newGoal.title.trim()) return;
    
    await addGoal({
      title: newGoal.title,
      description: newGoal.description || null,
      pillar: newGoal.pillar,
      horizon: newGoal.horizon,
      target_date: newGoal.target_date || null,
      progress: newGoal.progress,
      status: newGoal.status
    });
    
    setNewGoal({
      title: '',
      description: '',
      pillar: 'Desenvolvimento',
      horizon: 'medium',
      target_date: '',
      progress: 0,
      status: 'em_progresso'
    });
    setIsAddOpen(false);
  };

  const handleUpdateProgress = async (id: string, progress: number) => {
    const newProgress = Math.min(100, Math.max(0, progress));
    await updateGoal(id, { 
      progress: newProgress,
      status: newProgress === 100 ? 'alcancado' : 'em_progresso'
    });
  };

  const inProgressGoals = goals.filter(g => (g.progress ?? 0) > 0 && (g.progress ?? 0) < 100);
  const completedGoals = goals.filter(g => (g.progress ?? 0) === 100);
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + (g.progress ?? 0), 0) / goals.length)
    : 0;

  // Motivation insight
  const getMotivationInsight = () => {
    if (completedGoals.length > 0 && completedGoals.length === goals.length) {
      return "Todas as metas alcançadas! Hora de sonhar mais alto! 🚀";
    }
    if (avgProgress >= 70) {
      return `Progresso médio de ${avgProgress}%! Você está na reta final.`;
    }
    if (goals.length === 0) {
      return "Defina suas metas. Quem não sabe onde quer chegar, nunca vai chegar!";
    }
    const nearestGoal = goals.filter(g => (g.progress ?? 0) < 100).sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))[0];
    if (nearestGoal && (nearestGoal.progress ?? 0) >= 80) {
      return `"${nearestGoal.title}" está quase lá! Só faltam ${100 - (nearestGoal.progress ?? 0)}%.`;
    }
    return "Grandes jornadas começam com um único passo. Continue avançando!";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10 backdrop-blur-sm">
              <Target className="h-7 w-7 text-accent" />
            </div>
            Metas
          </h1>
          <p className="text-muted-foreground mt-1">
            Defina e acompanhe seus objetivos de vida
          </p>
        </motion.div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-accent" />
                Nova Meta
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Título da meta"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                className="bg-background/50"
              />
              <Textarea
                placeholder="Descrição (opcional)"
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                className="bg-background/50"
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={newGoal.pillar}
                  onValueChange={(value) => setNewGoal(prev => ({ ...prev, pillar: value }))}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Pilar" />
                  </SelectTrigger>
                  <SelectContent>
                    {pillars.map(p => (
                      <SelectItem key={p} value={p}>
                        {pillarIcons[p]} {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newGoal.horizon}
                  onValueChange={(value) => setNewGoal(prev => ({ ...prev, horizon: value }))}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Horizonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">🎯 Curto Prazo</SelectItem>
                    <SelectItem value="medium">📅 Médio Prazo</SelectItem>
                    <SelectItem value="long">🚀 Longo Prazo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="date"
                value={newGoal.target_date}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
                className="bg-background/50"
              />
              <Button onClick={handleAddGoal} className="w-full bg-accent hover:bg-accent/90">
                <Sparkles className="h-4 w-4 mr-2" />
                Criar Meta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Accountability Partner Insight */}
      <ModuleInsight 
        module="goals" 
        customMessage={getMotivationInsight()}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Total de Metas', value: goals.length, color: 'foreground' },
          { icon: TrendingUp, label: 'Em Progresso', value: inProgressGoals.length, color: 'amber' },
          { icon: Flag, label: 'Progresso Médio', value: `${avgProgress}%`, color: 'accent' },
          { icon: Trophy, label: 'Concluídas', value: completedGoals.length, color: 'green' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card className="glass-card p-5 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${
                    stat.color === 'green' ? 'text-green-400' : 
                    stat.color === 'amber' ? 'text-amber-400' : 
                    stat.color === 'accent' ? 'text-accent' : ''
                  }`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${
                  stat.color === 'green' ? 'bg-green-500/10' : 
                  stat.color === 'amber' ? 'bg-amber-500/10' : 
                  stat.color === 'accent' ? 'bg-accent/10' : 
                  'bg-foreground/5'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === 'green' ? 'text-green-400' : 
                    stat.color === 'amber' ? 'text-amber-400' : 
                    stat.color === 'accent' ? 'text-accent' : 
                    'text-foreground/70'
                  }`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Goals by Horizon */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/30 border border-border/50 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            Todas
          </TabsTrigger>
          <TabsTrigger value="short" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            Curto Prazo
          </TabsTrigger>
          <TabsTrigger value="medium" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            Médio Prazo
          </TabsTrigger>
          <TabsTrigger value="long" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            Longo Prazo
          </TabsTrigger>
        </TabsList>

        {['all', 'short', 'medium', 'long'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {goals
                  .filter(g => tab === 'all' || g.horizon === tab)
                  .map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <Card className="glass-card p-5 hover-lift group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              {goal.pillar && (
                                <Badge variant="outline" className="text-xs gap-1">
                                  {pillarIcons[goal.pillar]} {goal.pillar}
                                </Badge>
                              )}
                              {goal.horizon && (
                                <Badge className={`text-xs border ${horizonColors[goal.horizon] || 'bg-muted'}`}>
                                  {horizonLabels[goal.horizon] || goal.horizon}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg">{goal.title}</h3>
                            {goal.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {goal.description}
                              </p>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-card border-border/50">
                              <DropdownMenuItem onClick={() => handleUpdateProgress(goal.id, (goal.progress ?? 0) + 10)}>
                                <ChevronUp className="h-4 w-4 mr-2" />
                                +10% Progresso
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteGoal(goal.id)}
                                className="text-red-400 focus:text-red-400"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Progresso</span>
                              <span className={`font-bold ${
                                (goal.progress ?? 0) === 100 ? 'text-green-400' : 
                                (goal.progress ?? 0) >= 70 ? 'text-amber-400' : 
                                'text-foreground'
                              }`}>
                                {goal.progress ?? 0}%
                              </span>
                            </div>
                            <div className="h-3 rounded-full bg-muted/50 overflow-hidden">
                              <motion.div 
                                className={`h-full rounded-full ${
                                  (goal.progress ?? 0) === 100 ? 'bg-gradient-to-r from-green-500 to-green-400' : 
                                  'bg-gradient-to-r from-accent to-accent/70'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${goal.progress ?? 0}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>

                          {goal.target_date && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Meta: {new Date(goal.target_date).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {goals.filter(g => tab === 'all' || g.horizon === tab).length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-2"
                >
                  <Card className="glass-card p-12 text-center">
                    <div className="p-4 rounded-full bg-accent/10 w-fit mx-auto mb-4">
                      <Target className="h-10 w-10 text-accent" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Nenhuma meta encontrada</h3>
                    <p className="text-sm text-muted-foreground">
                      Crie sua primeira meta e comece a acompanhar seu progresso!
                    </p>
                  </Card>
                </motion.div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Life Pillars Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card p-6">
          <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Pilares da Vida
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pillars.map((pillar, index) => {
              const pillarGoals = goals.filter(g => g.pillar === pillar);
              const pillarAvgProgress = pillarGoals.length > 0
                ? Math.round(pillarGoals.reduce((acc, g) => acc + (g.progress ?? 0), 0) / pillarGoals.length)
                : 0;
              
              return (
                <motion.div 
                  key={pillar}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="p-5 rounded-xl bg-muted/30 border border-border/50 text-center hover:border-accent/30 transition-all cursor-pointer group"
                >
                  <div className="text-2xl mb-2">{pillarIcons[pillar]}</div>
                  <p className="text-xs text-muted-foreground mb-1">{pillar}</p>
                  <p className={`text-2xl font-bold ${
                    pillarAvgProgress >= 70 ? 'text-green-400' : 
                    pillarAvgProgress >= 40 ? 'text-amber-400' : 
                    'text-foreground'
                  }`}>
                    {pillarAvgProgress}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pillarGoals.length} {pillarGoals.length === 1 ? 'meta' : 'metas'}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default GoalsManager;
