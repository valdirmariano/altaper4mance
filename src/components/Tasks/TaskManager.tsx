import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  BarChart3
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'baixa' | 'média' | 'alta' | 'crítica';
  dueDate?: Date;
  project?: string;
  tags: string[];
  createdAt: Date;
  estimatedTime?: number; // in minutes
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Revisar relatório de vendas Q1',
      description: 'Analisar métricas e preparar apresentação',
      completed: true,
      priority: 'alta',
      dueDate: new Date(2025, 0, 22),
      project: 'Vendas',
      tags: ['relatório', 'vendas'],
      createdAt: new Date(2025, 0, 20),
      estimatedTime: 60
    },
    {
      id: '2',
      title: 'Reunião com equipe de desenvolvimento',
      completed: true,
      priority: 'média',
      dueDate: new Date(2025, 0, 22, 14, 0),
      project: 'Desenvolvimento',
      tags: ['reunião', 'equipe'],
      createdAt: new Date(2025, 0, 21),
      estimatedTime: 90
    },
    {
      id: '3',
      title: 'Estudar React Query v5',
      description: 'Revisar nova sintaxe e features',
      completed: false,
      priority: 'baixa',
      project: 'Estudos',
      tags: ['react', 'desenvolvimento', 'estudos'],
      createdAt: new Date(2025, 0, 21),
      estimatedTime: 120
    },
    {
      id: '4',
      title: 'Planejar sprint da próxima semana',
      completed: false,
      priority: 'alta',
      dueDate: new Date(2025, 0, 24),
      project: 'Planejamento',
      tags: ['sprint', 'planejamento'],
      createdAt: new Date(2025, 0, 21),
      estimatedTime: 45
    },
    {
      id: '5',
      title: 'Gravar vídeo tutorial sobre produtividade',
      completed: false,
      priority: 'média',
      project: 'Conteúdo',
      tags: ['vídeo', 'youtube', 'conteúdo'],
      createdAt: new Date(2025, 0, 20),
      estimatedTime: 180
    }
  ]);

  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'kanban' | 'timeline'>('list');

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      priority: 'média',
      tags: [],
      createdAt: new Date()
    };
    
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    switch (filter) {
      case 'active':
        return !task.completed && matchesSearch;
      case 'completed':
        return task.completed && matchesSearch;
      case 'today':
        return task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString() && matchesSearch;
      case 'high-priority':
        return ['alta', 'crítica'].includes(task.priority) && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'crítica': return 'destructive';
      case 'alta': return 'destructive';
      case 'média': return 'default';
      case 'baixa': return 'secondary';
      default: return 'secondary';
    }
  };

  const getProjectStats = () => {
    const projects = tasks.reduce((acc, task) => {
      if (!task.project) return acc;
      if (!acc[task.project]) acc[task.project] = { total: 0, completed: 0 };
      acc[task.project].total++;
      if (task.completed) acc[task.project].completed++;
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    return Object.entries(projects).map(([name, stats]) => ({
      name,
      progress: (stats.completed / stats.total) * 100,
      completed: stats.completed,
      total: stats.total
    }));
  };

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
              <p className="text-2xl font-bold text-success">{tasks.filter(t => t.completed).length}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
        </Card>
        <Card className="p-4 gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-warning">{tasks.filter(t => !t.completed).length}</p>
            </div>
            <Clock className="h-8 w-8 text-warning" />
          </div>
        </Card>
        <Card className="p-4 gradient-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alta Prioridade</p>
              <p className="text-2xl font-bold text-destructive">
                {tasks.filter(t => ['alta', 'crítica'].includes(t.priority)).length}
              </p>
            </div>
            <Flag className="h-8 w-8 text-destructive" />
          </div>
        </Card>
      </div>

      {/* Add New Task */}
      <Card className="p-4 gradient-card">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua nova tarefa... (ex: 'Reunião com cliente às 14h #reunião @alta')"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1"
          />
          <Button onClick={addTask} variant="premium">
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Use linguagem natural: mencione horários, adicione #tags e defina @prioridade
        </p>
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
      <Tabs value="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Tarefas ({filteredTasks.length})</TabsTrigger>
          <TabsTrigger value="projects">Projetos ({getProjectStats().length})</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-3">
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
                task.completed ? 'opacity-75' : ''
              }`}>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed 
                        ? 'bg-success border-success shadow-success' 
                        : 'border-muted-foreground hover:border-primary'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className={`text-sm mt-1 ${
                            task.completed ? 'text-muted-foreground' : 'text-muted-foreground'
                          }`}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                            {task.priority}
                          </Badge>
                          {task.project && (
                            <Badge variant="outline" className="text-xs">
                              {task.project}
                            </Badge>
                          )}
                          {task.dueDate && (
                            <Badge variant="secondary" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {task.dueDate.toLocaleDateString('pt-BR')}
                            </Badge>
                          )}
                          {task.estimatedTime && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.estimatedTime}min
                            </Badge>
                          )}
                        </div>
                        
                        {task.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {task.tags.map((tag, index) => (
                              <span key={index} className="text-xs text-primary">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {getProjectStats().map((project) => (
            <Card key={project.name} className="p-4 gradient-card">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{project.name}</h4>
                <span className="text-sm text-muted-foreground">
                  {project.completed}/{project.total}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round(project.progress)}% concluído
              </p>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskManager;