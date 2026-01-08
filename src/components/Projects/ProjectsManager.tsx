import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { toast } from 'sonner';
import { 
  Plus, 
  Search,
  MoreHorizontal,
  Calendar,
  CheckSquare,
  FolderOpen,
  ArrowRight,
  Loader2,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProjectsManager = () => {
  const { user } = useAuth();
  const { projects, loading, addProject, updateProject, deleteProject, getStats } = useProjects();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const statusConfig: Record<string, { label: string; className: string }> = {
    planejado: { label: 'Planejando', className: 'bg-muted text-muted-foreground' },
    em_andamento: { label: 'Ativo', className: 'bg-success/20 text-success' },
    pausado: { label: 'Pausado', className: 'bg-warning/20 text-warning' },
    concluído: { label: 'Concluído', className: 'bg-primary/20 text-primary' }
  };

  const handleAddProject = async () => {
    if (!newProjectTitle.trim()) return;
    
    const result = await addProject({ title: newProjectTitle.trim() });
    if (result) {
      toast.success('Projeto criado com sucesso!');
      setNewProjectTitle('');
      setShowAddForm(false);
    } else {
      toast.error('Erro ao criar projeto');
    }
  };

  const handleUpdateStatus = async (projectId: string, newStatus: string) => {
    const result = await updateProject(projectId, { status: newStatus });
    if (result) {
      toast.success('Status atualizado!');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
    toast.success('Projeto removido!');
  };

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Faça login para acessar seus projetos.</p>
      </div>
    );
  }

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = getStats();
  const activeProjects = filteredProjects.filter(p => p.status === 'em_andamento');
  const otherProjects = filteredProjects.filter(p => p.status !== 'em_andamento');

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
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <Card className="p-4 bg-card border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Nome do projeto..."
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
            />
            <Button onClick={handleAddProject}>Criar</Button>
            <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancelar</Button>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar projetos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-3 bg-card border-border">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-semibold">{stats.total}</p>
        </Card>
        <Card className="p-3 bg-card border-border">
          <p className="text-xs text-muted-foreground">Ativos</p>
          <p className="text-xl font-semibold">{stats.active}</p>
        </Card>
        <Card className="p-3 bg-card border-border">
          <p className="text-xs text-muted-foreground">Pausados</p>
          <p className="text-xl font-semibold">{stats.paused}</p>
        </Card>
        <Card className="p-3 bg-card border-border">
          <p className="text-xs text-muted-foreground">Concluídos</p>
          <p className="text-xl font-semibold">{stats.completed}</p>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
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
                        <Badge variant="secondary" className={`text-xs ${statusConfig[project.status]?.className || ''}`}>
                          {statusConfig[project.status]?.label || project.status}
                        </Badge>
                        {project.category && (
                          <Badge variant="outline" className="text-xs">
                            {project.category}
                          </Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUpdateStatus(project.id, 'planejado')}>
                            Marcar como Planejando
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(project.id, 'pausado')}>
                            Pausar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(project.id, 'concluído')}>
                            Concluir
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="font-medium mb-1">{project.title}</h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                    )}

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-medium">{project.progress || 0}%</span>
                        </div>
                        <Progress value={project.progress || 0} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CheckSquare className="h-3 w-3" />
                          {project.priority || 'Média'} prioridade
                        </div>
                        {project.end_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.end_date).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </div>
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
                          <h3 className="font-medium text-sm truncate">{project.title}</h3>
                          <Badge variant="secondary" className={`text-xs shrink-0 ${statusConfig[project.status]?.className || ''}`}>
                            {statusConfig[project.status]?.label || project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {project.category && <span>{project.category}</span>}
                          {project.end_date && (
                            <span>{new Date(project.end_date).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                      </div>
                      <div className="w-24 shrink-0">
                        <Progress value={project.progress || 0} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right mt-1">{project.progress || 0}%</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUpdateStatus(project.id, 'em_andamento')}>
                            Ativar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(project.id, 'concluído')}>
                            Concluir
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum projeto encontrado</p>
              <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro projeto
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsManager;
