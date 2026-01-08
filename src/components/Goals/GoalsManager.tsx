import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target, 
  Plus, 
  MoreHorizontal,
  Calendar,
  ChevronRight,
  Flag,
  TrendingUp,
  Trash2,
  Edit2
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

  const pillars = ['Saúde', 'Carreira', 'Finanças', 'Desenvolvimento', 'Relacionamentos', 'Lazer'];

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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando metas...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Metas</h1>
          <p className="text-muted-foreground text-sm">
            Defina e acompanhe seus objetivos
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Meta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Título da meta"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Descrição (opcional)"
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={newGoal.pillar}
                  onValueChange={(value) => setNewGoal(prev => ({ ...prev, pillar: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilar" />
                  </SelectTrigger>
                  <SelectContent>
                    {pillars.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newGoal.horizon}
                  onValueChange={(value) => setNewGoal(prev => ({ ...prev, horizon: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Horizonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Curto Prazo</SelectItem>
                    <SelectItem value="medium">Médio Prazo</SelectItem>
                    <SelectItem value="long">Longo Prazo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="date"
                value={newGoal.target_date}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
              />
              <Button onClick={handleAddGoal} className="w-full">
                Criar Meta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total de Metas</p>
              <p className="text-2xl font-semibold">{goals.length}</p>
            </div>
            <Target className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Em Progresso</p>
              <p className="text-2xl font-semibold">{inProgressGoals.length}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Progresso Médio</p>
              <p className="text-2xl font-semibold">{avgProgress}%</p>
            </div>
            <Flag className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Concluídas</p>
              <p className="text-2xl font-semibold">{completedGoals.length}</p>
            </div>
            <Target className="h-5 w-5 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Goals by Horizon */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="short">Curto Prazo</TabsTrigger>
          <TabsTrigger value="medium">Médio Prazo</TabsTrigger>
          <TabsTrigger value="long">Longo Prazo</TabsTrigger>
        </TabsList>

        {['all', 'short', 'medium', 'long'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {goals
                .filter(g => tab === 'all' || g.horizon === tab)
                .map((goal) => (
                  <Card key={goal.id} className="p-5 bg-card border-border hover:border-muted-foreground/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {goal.pillar && (
                            <Badge variant="outline" className="text-xs">
                              {goal.pillar}
                            </Badge>
                          )}
                          {goal.horizon && (
                            <Badge variant="secondary" className="text-xs bg-muted">
                              {horizonLabels[goal.horizon] || goal.horizon}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUpdateProgress(goal.id, (goal.progress ?? 0) + 10)}>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            +10% Progresso
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteGoal(goal.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-medium">{goal.progress ?? 0}%</span>
                        </div>
                        <Progress value={goal.progress ?? 0} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {goal.target_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              {goals.filter(g => tab === 'all' || g.horizon === tab).length === 0 && (
                <p className="text-muted-foreground text-sm col-span-2 text-center py-8">
                  Nenhuma meta encontrada
                </p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Life Pillars Overview */}
      <Card className="p-5 bg-card border-border">
        <h3 className="font-medium mb-4">Pilares da Vida</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pillars.map((pillar) => {
            const pillarGoals = goals.filter(g => g.pillar === pillar);
            const pillarAvgProgress = pillarGoals.length > 0
              ? Math.round(pillarGoals.reduce((acc, g) => acc + (g.progress ?? 0), 0) / pillarGoals.length)
              : 0;
            
            return (
              <div 
                key={pillar}
                className="p-4 rounded-lg border border-border text-center hover:border-muted-foreground/30 transition-colors cursor-pointer"
              >
                <p className="text-xs text-muted-foreground mb-1">{pillar}</p>
                <p className="text-xl font-semibold">{pillarAvgProgress}%</p>
                <p className="text-xs text-muted-foreground">{pillarGoals.length} metas</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default GoalsManager;
