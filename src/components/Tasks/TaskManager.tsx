import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModuleInsight } from '@/components/Accountability/AccountabilityPartner';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { 
  CheckCircle2, 
  Plus, 
  Calendar,
  Target,
  Filter,
  Search,
  Clock,
  Flag,
  List,
  LayoutGrid,
  Trash2,
  Loader2,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';

const TaskManager = () => {
  const { user } = useAuth();
  const { rewardTaskComplete } = useGamification();
  const { tasks, loading, addTask, deleteTask, toggleTask } = useTasks(rewardTaskComplete);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'kanban'>('list');

  const handleToggleTask = async (taskId: string) => {
    await toggleTask(taskId);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask({
      title: newTaskTitle,
      description: null,
      priority: 'p2',
      status: 'todo',
      due_date: null,
      project_id: null,
      tags: null,
      estimated_hours: null,
      actual_hours: null,
    });
    setNewTaskTitle('');
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filter) {
      case 'active':
        return task.status !== 'done' && matchesSearch;
      case 'completed':
        return task.status === 'done' && matchesSearch;
      case 'today':
        return task.due_date && new Date(task.due_date).toDateString() === new Date().toDateString() && matchesSearch;
      case 'high-priority':
        return ['p0', 'p1'].includes(task.priority) && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'p0': return 'Crítica';
      case 'p1': return 'Alta';
      case 'p2': return 'Média';
      case 'p3': return 'Baixa';
      default: return priority;
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'p0': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'p1': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'p2': return 'bg-accent/20 text-accent border-accent/30';
      case 'p3': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const completedCount = tasks.filter(t => t.status === 'done').length;
  const pendingCount = tasks.filter(t => t.status !== 'done').length;
  const highPriorityCount = tasks.filter(t => ['p0', 'p1'].includes(t.priority) && t.status !== 'done').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Generate motivation insight
  const getMotivationInsight = () => {
    if (completedCount === 0 && tasks.length > 0) {
      return "Comece com a tarefa mais fácil. Pequenas vitórias geram momentum!";
    }
    if (highPriorityCount > 3) {
      return `Você tem ${highPriorityCount} tarefas urgentes. Foque em uma de cada vez.`;
    }
    if (completionRate >= 80) {
      return "Excelente progresso! Você está arrasando hoje! 🔥";
    }
    if (pendingCount === 0) {
      return "Inbox zero! Que tal planejar as tarefas de amanhã?";
    }
    return "Cada tarefa concluída é um passo para seus objetivos. Vamos lá!";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Faça login para gerenciar suas tarefas</p>
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10 backdrop-blur-sm">
              <Target className="h-7 w-7 text-accent" />
            </div>
            Tarefas
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize e conquiste seus objetivos
          </p>
        </motion.div>
        
        <div className="flex gap-2">
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-accent text-accent-foreground' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('kanban')}
            className={view === 'kanban' ? 'bg-accent text-accent-foreground' : ''}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Accountability Partner Insight */}
      <ModuleInsight 
        module="tasks" 
        customMessage={getMotivationInsight()}
      />

      {/* Stats Cards - Glassmorphism */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card p-5 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
                <p className="text-3xl font-bold mt-1">{tasks.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-foreground/5">
                <Target className="h-6 w-6 text-foreground/70" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="glass-card p-5 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Concluídas</p>
                <p className="text-3xl font-bold mt-1 text-green-400">{completedCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card p-5 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Pendentes</p>
                <p className="text-3xl font-bold mt-1 text-amber-400">{pendingCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10">
                <Clock className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="glass-card p-5 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Taxa</p>
                <p className="text-3xl font-bold mt-1 text-accent">{completionRate}%</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Add New Task */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="O que você precisa fazer?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                className="pl-11 h-12 bg-background/50 border-border/50 focus:border-accent"
              />
            </div>
            <Button 
              onClick={handleAddTask} 
              className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-background/50 border-border/50"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-52 bg-background/50 border-border/50">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Filtrar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as tarefas</SelectItem>
            <SelectItem value="active">Pendentes</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
            <SelectItem value="today">Para hoje</SelectItem>
            <SelectItem value="high-priority">Alta prioridade</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Tasks List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="glass-card p-12 text-center">
                <div className="p-4 rounded-full bg-accent/10 w-fit mx-auto mb-4">
                  <Target className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Nenhuma tarefa encontrada
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {tasks.length === 0 
                    ? 'Comece adicionando sua primeira tarefa acima!' 
                    : 'Tente ajustar os filtros de busca.'}
                </p>
              </Card>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.03 }}
                layout
              >
                <Card className={`glass-card p-4 transition-all hover-lift group ${
                  task.status === 'done' ? 'opacity-60' : ''
                }`}>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.status === 'done' 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-muted-foreground/40 hover:border-accent hover:scale-110'
                      }`}
                    >
                      {task.status === 'done' && (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className={`font-medium ${
                          task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                          {task.title}
                        </h4>
                        <Badge className={`text-xs border ${getPriorityStyles(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        {task.due_date && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString('pt-BR')}
                          </Badge>
                        )}
                        {task.estimated_hours && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimated_hours}h
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TaskManager;
