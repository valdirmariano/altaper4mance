import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Brain,
  Timer,
  Activity,
  Plus,
  Play,
  Pause,
  Award,
  Flame
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu sistema de produtividade</p>
        </div>
        <Button className="gap-2">
          <Brain className="h-4 w-4" />
          AI Coach
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tarefas de Hoje</p>
              <p className="text-2xl font-bold text-foreground">3/12</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <Progress value={25} className="mt-3" />
        </Card>

        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Projetos Ativos</p>
              <p className="text-2xl font-bold text-foreground">2</p>
            </div>
            <Target className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hábitos</p>
              <p className="text-2xl font-bold text-foreground">2/5</p>
            </div>
            <Activity className="h-8 w-8 text-secondary" />
          </div>
          <Progress value={40} className="mt-3" />
        </Card>

        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sequência</p>
              <p className="text-2xl font-bold text-foreground">5 dias</p>
            </div>
            <Flame className="h-8 w-8 text-warning" />
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Coach Section */}
        <Card className="p-6 lg:col-span-2 shadow-card">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Assistente de Responsabilidade
              <Badge variant="secondary" className="text-xs">AI Coach</Badge>
            </CardTitle>
            <CardDescription>
              Recomendações personalizadas baseadas no seu progresso
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-sm mb-2">🎯 Próximas Ações Sugeridas</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Complete as 9 tarefas pendentes para manter o foco</li>
                <li>• Seus hábitos de hidratação e leitura precisam de atenção</li>
                <li>• Considere usar o Pomodoro para as tarefas de alta prioridade</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="gap-2">
                <Target className="h-4 w-4" />
                Gerar Plano do Dia
              </Button>
              <Button variant="outline" size="sm">
                Ver Sugestões Detalhadas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 shadow-card">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex-col gap-1" size="sm">
                <Plus className="h-4 w-4" />
                <span className="text-xs">Nova Tarefa</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1" size="sm">
                <Timer className="h-4 w-4" />
                <span className="text-xs">Pomodoro</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1" size="sm">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Agenda</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1" size="sm">
                <Award className="h-4 w-4" />
                <span className="text-xs">Metas</span>
              </Button>
            </div>
            <Button className="w-full mt-4 gap-2" size="lg">
              <Plus className="h-4 w-4" />
              Gerar Plano Semanal
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Tasks */}
        <Card className="p-6 shadow-card">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Tarefas de Hoje
              </span>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            {[
              { title: 'Revisar relatório de vendas', completed: true, priority: 'alta' },
              { title: 'Reunião com equipe - 14h', completed: true, priority: 'média' },
              { title: 'Estudar React avançado', completed: true, priority: 'baixa' },
              { title: 'Ir ao mercado', completed: false, priority: 'média' },
              { title: 'Gravar vídeo para YouTube', completed: false, priority: 'alta' },
            ].slice(0, 5).map((task, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <div className={`w-4 h-4 rounded border-2 ${task.completed ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                  {task.completed && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                </div>
                <span className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </span>
                <Badge variant={task.priority === 'alta' ? 'destructive' : task.priority === 'média' ? 'default' : 'secondary'} className="text-xs">
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="p-6 shadow-card">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Projetos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            {[
              { name: 'Gravar vídeo para YouTube', progress: 25, tasks: '1/4 tarefas' },
              { name: 'Projetos Pessoais', progress: 20, tasks: '1/5 tarefas' },
            ].map((project, index) => (
              <div key={index} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{project.name}</h4>
                  <span className="text-xs text-muted-foreground">{project.tasks}</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;