import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
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
  BarChart3,
  Trash2,
  Loader2
} from 'lucide-react';

const TaskManager = () => {
  const { user } = useAuth();
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'kanban' | 'timeline'>('list');

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    await updateTask(taskId, { status: newStatus });
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'p0': return 'destructive';
      case 'p1': return 'destructive';
      case 'p2': return 'default';
      case 'p3': return 'secondary';
      default: return 'secondary';
    }
  };

  const completedCount = tasks.filter(t => t.status === 'done').length;
  const pendingCount = tasks.filter(t => t.status !== 'done').length;
  const highPriorityCount = tasks.filter(t => ['p0', 'p1'].includes(t.priority)).length;

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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gerenciador de Tarefas
          </h2>
          <p className="text-muted-foreground">
            Organize e acompanhe suas tarefas e projetos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('kanban')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('timeline')}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
            <Target className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Concluídas</p>
              <p className="text-2xl font-bold text-success">{completedCount}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
        </Card>
        <Card className="p-4 gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-warning">{pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-warning" />
          </div>
        </Card>
        <Card className="p-4 gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alta Prioridade</p>
              <p className="text-2xl font-bold text-destructive">{highPriorityCount}</p>
            </div>
            <Flag className="h-8 w-8 text-destructive" />
          </div>
        </Card>
      </div>

      {/* Add New Task */}
      <Card className="p-4 gradient-card">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua nova tarefa..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            className="flex-1"
          />
          <Button onClick={handleAddTask} variant="premium">
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
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
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center gradient-card">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-sm text-muted-foreground">
              {tasks.length === 0 ? 'Comece adicionando sua primeira tarefa!' : 'Tente ajustar os filtros de busca.'}
            </p>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className={`p-4 gradient-card transition-all hover:shadow-lg ${
              task.status === 'done' ? 'opacity-75' : ''
            }`}>
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTask(task.id, task.status)}
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.status === 'done' 
                      ? 'bg-success border-success shadow-success' 
                      : 'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {task.status === 'done' && <CheckCircle2 className="h-3 w-3 text-white" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className={`font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm mt-1 text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        {task.due_date && (
                          <Badge variant="secondary" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(task.due_date).toLocaleDateString('pt-BR')}
                          </Badge>
                        )}
                        {task.estimated_hours && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.estimated_hours}h
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
