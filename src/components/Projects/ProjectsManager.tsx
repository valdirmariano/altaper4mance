import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search,
  MoreHorizontal,
  Calendar,
  CheckSquare,
  FolderOpen,
  ArrowRight
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  progress: number;
  totalTasks: number;
  completedTasks: number;
  dueDate?: string;
  area: string;
}

const ProjectsManager = () => {
  const [projects] = useState<Project[]>([
    { 
      id: '1', 
      name: 'Lançamento Curso Online', 
      description: 'Criar e lançar curso de produtividade',
      status: 'active',
      progress: 35,
      totalTasks: 24,
      completedTasks: 8,
      dueDate: '2026-06-01',
      area: 'Profissional'
    },
    { 
      id: '2', 
      name: 'Reforma do Escritório', 
      description: 'Renovar espaço de trabalho em casa',
      status: 'planning',
      progress: 10,
      totalTasks: 15,
      completedTasks: 1,
      dueDate: '2026-03-15',
      area: 'Pessoal'
    },
    { 
      id: '3', 
      name: 'App de Finanças', 
      description: 'Desenvolver aplicativo pessoal de finanças',
      status: 'active',
      progress: 65,
      totalTasks: 40,
      completedTasks: 26,
      dueDate: '2026-04-01',
      area: 'Desenvolvimento'
    },
    { 
      id: '4', 
      name: 'Maratona 10K', 
      description: 'Preparação para corrida de 10km',
      status: 'active',
      progress: 80,
      totalTasks: 20,
      completedTasks: 16,
      dueDate: '2026-02-15',
      area: 'Saúde'
    },
    { 
      id: '5', 
      name: 'Viagem Portugal', 
      description: 'Planejamento de férias em Portugal',
      status: 'paused',
      progress: 40,
      totalTasks: 12,
      completedTasks: 5,
      dueDate: '2026-07-01',
      area: 'Lazer'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const statusConfig = {
    planning: { label: 'Planejando', className: 'bg-muted text-muted-foreground' },
    active: { label: 'Ativo', className: 'bg-success/20 text-success' },
    paused: { label: 'Pausado', className: 'bg-warning/20 text-warning' },
    completed: { label: 'Concluído', className: 'bg-primary/20 text-primary' }
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProjects = filteredProjects.filter(p => p.status === 'active');
  const otherProjects = filteredProjects.filter(p => p.status !== 'active');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie suas iniciativas e acompanhe o progresso
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar projetos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-4 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-3 bg-card border-border">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-semibold">{projects.length}</p>
        </Card>
        <Card className="p-3 bg-card border-border">
          <p className="text-xs text-muted-foreground">Ativos</p>
          <p className="text-xl font-semibold">{projects.filter(p => p.status === 'active').length}</p>
        </Card>
        <Card className="p-3 bg-card border-border">
          <p className="text-xs text-muted-foreground">Pausados</p>
          <p className="text-xl font-semibold">{projects.filter(p => p.status === 'paused').length}</p>
        </Card>
        <Card className="p-3 bg-card border-border">
          <p className="text-xs text-muted-foreground">Concluídos</p>
          <p className="text-xl font-semibold">{projects.filter(p => p.status === 'completed').length}</p>
        </Card>
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Projetos Ativos
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeProjects.map((project) => (
              <Card key={project.id} className="p-5 bg-card border-border hover:border-muted-foreground/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className={`text-xs ${statusConfig[project.status].className}`}>
                      {statusConfig[project.status].label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {project.area}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <h3 className="font-medium mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckSquare className="h-3 w-3" />
                      {project.completedTasks}/{project.totalTasks} tarefas
                    </div>
                    {project.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>

                <Button variant="ghost" className="w-full mt-4 h-8 text-xs">
                  Ver Detalhes
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Outros Projetos
          </h2>
          <div className="space-y-2">
            {otherProjects.map((project) => (
              <Card key={project.id} className="p-4 bg-card border-border hover:border-muted-foreground/30 transition-colors">
                <div className="flex items-center gap-4">
                  <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm truncate">{project.name}</h3>
                      <Badge variant="secondary" className={`text-xs shrink-0 ${statusConfig[project.status].className}`}>
                        {statusConfig[project.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{project.area}</span>
                      <span>{project.completedTasks}/{project.totalTasks} tarefas</span>
                      {project.dueDate && (
                        <span>{new Date(project.dueDate).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-24 shrink-0">
                    <Progress value={project.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right mt-1">{project.progress}%</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
