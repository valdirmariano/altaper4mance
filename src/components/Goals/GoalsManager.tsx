import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, Award, TrendingUp, Calendar } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  pillar: string;
  deadline: string;
  progress: number;
  keyResults: KeyResult[];
}

interface KeyResult {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
}

interface WheelOfLifeArea {
  name: string;
  rating: number;
  objective: string;
}

const GoalsManager = () => {
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Ganhar 10 kg de músculos',
      pillar: 'Saúde',
      deadline: '31 de dezembro de 2025',
      progress: 72,
      keyResults: [
        { id: '1', name: 'Me inscrever em uma academia', target: 1, current: 1, unit: 'academia' },
        { id: '2', name: 'Academia 4 dias/semana por 12 meses', target: 192, current: 69, unit: 'dias' },
        { id: '3', name: 'Consumir 4.000 calorias saudáveis por dia', target: 4000, current: 3200, unit: 'calorias' },
      ]
    },
    {
      id: '2',
      name: 'Ganhar R$ 10 mil/mês',
      pillar: 'Finanças',
      deadline: '31 de dezembro de 2025',
      progress: 37,
      keyResults: [
        { id: '4', name: 'Aprender 3 habilidades de alto valor', target: 3, current: 1, unit: 'habilidades' },
        { id: '5', name: 'Aumentar minha Receita Mensal Recorrente (MRR)', target: 10000, current: 4000, unit: 'R$' },
      ]
    }
  ]);

  const [wheelOfLife] = useState<WheelOfLifeArea[]>([
    { name: 'Saúde', rating: 7, objective: 'Ganhar 10 kg de músculos' },
    { name: 'Intelecto', rating: 8, objective: '' },
    { name: 'Emocional', rating: 6, objective: '' },
    { name: 'Propósito', rating: 5, objective: '' },
    { name: 'Finanças', rating: 4, objective: 'Ganhar R$ 10 mil/mês' },
    { name: 'Caridade', rating: 2, objective: '' },
    { name: 'Família', rating: 8, objective: '' },
    { name: 'Relacionamento', rating: 8, objective: '' },
    { name: 'Social', rating: 4, objective: '' },
    { name: 'Lazer', rating: 4, objective: '' },
    { name: 'Plenitude', rating: 5, objective: '' },
    { name: 'Espiritualidade', rating: 5, objective: '' },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Metas</h1>
          <p className="text-muted-foreground">Gerencie seus objetivos e resultados-chave</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">Objetivos</TabsTrigger>
          <TabsTrigger value="pillars">Pilares</TabsTrigger>
          <TabsTrigger value="wheel">Roda da Vida</TabsTrigger>
          <TabsTrigger value="dream-board">Quadro dos Sonhos</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid gap-4">
            {goals.map((goal) => (
              <Card key={goal.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="secondary">{goal.pillar}</Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {goal.deadline}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{goal.progress}%</div>
                      <div className="text-xs text-muted-foreground">Progresso</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={goal.progress} className="h-2" />
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Resultados-chave</h4>
                    {goal.keyResults.map((kr) => (
                      <div key={kr.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{kr.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={(kr.current / kr.target) * 100} className="h-1 flex-1" />
                            <span className="text-xs text-muted-foreground">
                              {kr.current} / {kr.target} {kr.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pillars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Pilares da Vida
              </CardTitle>
              <CardDescription>
                Organize suas metas por pilares fundamentais da sua vida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {['Saúde', 'Finanças', 'Relacionamentos', 'Carreira', 'Crescimento Pessoal', 'Lazer', 'Família', 'Espiritualidade'].map((pillar) => (
                  <Card key={pillar} className="text-center p-4">
                    <h3 className="font-semibold">{pillar}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {goals.filter(g => g.pillar === pillar).length} meta(s)
                    </p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wheel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Roda da Vida
              </CardTitle>
              <CardDescription>
                Avalie o equilíbrio entre as diferentes áreas da sua vida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {wheelOfLife.map((area) => (
                  <div key={area.name} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{area.name}</h3>
                        <Badge variant="outline">{area.rating}/10</Badge>
                      </div>
                      <Progress value={area.rating * 10} className="h-2 mb-2" />
                      {area.objective && (
                        <p className="text-xs text-muted-foreground">{area.objective}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dream-board" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quadro dos Sonhos</CardTitle>
              <CardDescription>
                Visualize seus sonhos e aspirações de longo prazo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Quadro dos Sonhos</h3>
                <p className="text-sm">Adicione imagens e descrições dos seus sonhos e objetivos de vida</p>
                <Button variant="outline" className="mt-4">
                  Adicionar Sonho
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalsManager;