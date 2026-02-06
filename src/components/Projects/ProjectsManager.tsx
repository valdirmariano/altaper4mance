import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search,
  MoreHorizontal,
  Calendar,
  CheckSquare,
  FolderOpen,
  Loader2,
  Trash2,
  Rocket,
  PauseCircle,
  CircleCheck,
  LayoutGrid,
  TrendingUp
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

  const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
    planejado: { label: 'Planejando', icon: LayoutGrid, className: 'bg-muted/50 text-muted-foreground' },
    em_andamento: { label: 'Ativo', icon: Rocket, className: 'bg-green-500/10 text-green-400' },
    pausado: { label: 'Pausado', icon: PauseCircle, className: 'bg-yellow-500/10 text-yellow-400' },
    concluído: { label: 'Concluído', icon: CircleCheck, className: 'bg-blue-500/10 text-blue-400' }
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
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Faça login para acessar seus projetos.</p>
        </div>
      </div>
    );
  }

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = getStats();
  const activeProjects = filteredProjects.filter(p => p.status === 'em_andamento');
  const otherProjects = filteredProjects.filter(p => p.status !== 'em_andamento');
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length) 
    : 0;

  const statCards = [
    { icon: FolderOpen, label: 'Total', value: stats.total },
    { icon: Rocket, label: 'Ativos', value: stats.active },
    { icon: PauseCircle, label: 'Pausados', value: stats.paused },
    { icon: CircleCheck, label: 'Concluídos', value: stats.completed },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie suas iniciativas e acompanhe o progresso
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </motion.div>

      {/* Add Project Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do projeto..."
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
                  className="rounded-xl"
                />
                <Button onClick={handleAddProject} className="rounded-xl">Criar</Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)} className="rounded-xl">Cancelar</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted/50">
                  <stat.icon className="h-4 w-4 text-foreground/70" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Average Progress */}
      {projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Progresso Médio</span>
              </div>
              <span className="text-sm font-bold">{avgProgress}%</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-foreground/50 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${avgProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar projetos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 rounded-xl bg-card/50 border-border/50"
        />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Active Projects */}
          {activeProjects.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Projetos Ativos
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeProjects.map((project, i) => {
                  const statusInfo = statusConfig[project.status];
                  const StatusIcon = statusInfo?.icon || FolderOpen;
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:border-border transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4 text-green-400" />
                            <Badge variant="secondary" className={`text-xs ${statusInfo?.className || ''}`}>
                              {statusInfo?.label || project.status}
                            </Badge>
                            {project.category && (
                              <Badge variant="outline" className="text-xs border-border/50">
                                {project.category}
                              </Badge>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
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

                        <h3 className="font-semibold mb-1">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                        )}

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span className="text-muted-foreground">Progresso</span>
                              <span className="font-bold">{project.progress || 0}%</span>
                            </div>
                            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-foreground/50 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress || 0}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                              />
                            </div>
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
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Outros Projetos
              </h2>
              <div className="space-y-2">
                {otherProjects.map((project, i) => {
                  const statusInfo = statusConfig[project.status];
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.03 }}
                    >
                      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:border-border transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-sm truncate">{project.title}</h3>
                              <Badge variant="secondary" className={`text-xs shrink-0 ${statusInfo?.className || ''}`}>
                                {statusInfo?.label || project.status}
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
                            <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-foreground/40 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress || 0}%` }}
                                transition={{ duration: 0.6 }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-right mt-1">{project.progress || 0}%</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground font-medium text-lg">Nenhum projeto encontrado</p>
              <p className="text-sm text-muted-foreground mt-1 opacity-70">Crie seu primeiro projeto para começar</p>
              <Button className="mt-6 rounded-xl" onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro projeto
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsManager;
