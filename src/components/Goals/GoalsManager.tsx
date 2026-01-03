import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Plus, 
  MoreHorizontal,
  Calendar,
  ChevronRight,
  Flag,
  TrendingUp
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  pillar: string;
  horizon: 'short' | 'medium' | 'long';
  progress: number;
  dueDate: string;
  keyResults: { title: string; progress: number }[];
}

const GoalsManager = () => {
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Ler 24 livros este ano',
      description: 'Desenvolver hábito consistente de leitura',
      pillar: 'Desenvolvimento',
      horizon: 'long',
      progress: 42,
      dueDate: '2026-12-31',
      keyResults: [
        { title: 'Ler 2 livros por mês', progress: 50 },
        { title: 'Fazer anotações de cada livro', progress: 30 },
      ]
    },
    {
      id: '2',
      title: 'Perder 5kg',
      description: 'Alcançar peso saudável',
      pillar: 'Saúde',
      horizon: 'medium',
      progress: 60,
      dueDate: '2026-06-30',
      keyResults: [
        { title: 'Treinar 4x por semana', progress: 75 },
        { title: 'Seguir dieta balanceada', progress: 50 },
      ]
    },
    {
      id: '3',
      title: 'Lançar curso online',
      description: 'Criar e lançar primeiro produto digital',
      pillar: 'Carreira',
      horizon: 'medium',
      progress: 25,
      dueDate: '2026-09-01',
      keyResults: [
        { title: 'Gravar 20 aulas', progress: 15 },
        { title: 'Criar material de apoio', progress: 10 },
        { title: 'Configurar plataforma', progress: 50 },
      ]
    },
    {
      id: '4',
      title: 'Economizar R$10.000',
      description: 'Reserva de emergência',
      pillar: 'Finanças',
      horizon: 'short',
      progress: 80,
      dueDate: '2026-03-31',
      keyResults: [
        { title: 'Guardar R$2.500/mês', progress: 80 },
      ]
    },
  ]);

  const horizonLabels = {
    short: 'Curto Prazo',
    medium: 'Médio Prazo',
    long: 'Longo Prazo'
  };

  const pillars = ['Saúde', 'Carreira', 'Finanças', 'Desenvolvimento', 'Relacionamentos', 'Lazer'];

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
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
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
              <p className="text-2xl font-semibold">{goals.filter(g => g.progress > 0 && g.progress < 100).length}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Progresso Médio</p>
              <p className="text-2xl font-semibold">
                {Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)}%
              </p>
            </div>
            <Flag className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Concluídas</p>
              <p className="text-2xl font-semibold">{goals.filter(g => g.progress === 100).length}</p>
            </div>
            <Target className="h-5 w-5 text-success" />
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
                          <Badge variant="outline" className="text-xs">
                            {goal.pillar}
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-muted">
                            {horizonLabels[goal.horizon]}
                          </Badge>
                        </div>
                        <h3 className="font-medium">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(goal.dueDate).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-1">
                          {goal.keyResults.length} resultados-chave
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
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
            const avgProgress = pillarGoals.length > 0
              ? Math.round(pillarGoals.reduce((acc, g) => acc + g.progress, 0) / pillarGoals.length)
              : 0;
            
            return (
              <div 
                key={pillar}
                className="p-4 rounded-lg border border-border text-center hover:border-muted-foreground/30 transition-colors cursor-pointer"
              >
                <p className="text-xs text-muted-foreground mb-1">{pillar}</p>
                <p className="text-xl font-semibold">{avgProgress}%</p>
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
