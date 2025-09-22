import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Folder, CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  tasks: Task[];
  status: 'planning' | 'active' | 'paused' | 'completed';
  completedTasks: number;
  totalTasks: number;
}

const ProjectsManager = () => {
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Gravar vídeo para YouTube',
      description: 'Criar conteúdo educativo sobre produtividade',
      progress: 25,
      status: 'active',
      completedTasks: 1,
      totalTasks: 4,
      tasks: [
        { id: '1', name: 'Definir roteiro', completed: true, priority: 'high' },
        { id: '2', name: 'Preparar cenário', completed: false, priority: 'medium' },
        { id: '3', name: 'Gravar vídeo', completed: false, priority: 'high' },
        { id: '4', name: 'Editar e publicar', completed: false, priority: 'medium' },
      ]
    },
    {
      id: '2',
      name: 'Pessoal',
      description: 'Tarefas e atividades pessoais do dia a dia',
      progress: 20,
      status: 'active',
      completedTasks: 1,
      totalTasks: 5,
      tasks: [
        { id: '5', name: 'Estudar', completed: false, priority: 'high' },
        { id: '6', name: 'Tirar o lixo', completed: true, priority: 'low' },
        { id: '7', name: 'Lavar o carro', completed: false, priority: 'medium' },
        { id: '8', name: 'Ir ao mercado', completed: false, priority: 'medium' },
        { id: '9', name: 'Jogar Video Game', completed: false, priority: 'low' },
      ]
    }
  ]);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'secondary';
      case 'active': return 'default';
      case 'paused': return 'outline';
      case 'completed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'Planejamento';
      case 'active': return 'Ativo';
      case 'paused': return 'Pausado';
      case 'completed': return 'Concluído';
      default: return 'Desconhecido';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
          <p className="text-muted-foreground">Gerencie seus projetos e acompanhe o progresso</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="active">Ativos ({projects.filter(p => p.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{projects.length}</div>
                    <div className="text-xs text-muted-foreground">Total de Projetos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-secondary" />
                  <div>
                    <div className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</div>
                    <div className="text-xs text-muted-foreground">Projetos Ativos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <div>
                    <div className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.completedTasks, 0)}</div>
                    <div className="text-xs text-muted-foreground">Tarefas Concluídas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.totalTasks, 0)}</div>
                    <div className="text-xs text-muted-foreground">Total de Tarefas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects List */}
          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Folder className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{project.progress}%</div>
                        <div className="text-xs text-muted-foreground">
                          {project.completedTasks}/{project.totalTasks} tarefas
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={project.progress} className="h-2" />
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Tarefas do Projeto</h4>
                    <div className="space-y-2">
                      {project.tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                          <div className={`w-4 h-4 rounded border-2 ${task.completed ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                            {task.completed && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <span className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.name}
                          </span>
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                        </div>
                      ))}
                      {project.tasks.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center py-1">
                          +{project.tasks.length - 3} tarefas adicionais
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {projects.filter(p => p.status === 'active').map((project) => (
              <Card key={project.id} className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-primary" />
                    {project.name}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={project.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {project.completedTasks} de {project.totalTasks} tarefas concluídas
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhum projeto concluído ainda</h3>
            <p className="text-sm">Continue trabalhando nos seus projetos ativos!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectsManager;