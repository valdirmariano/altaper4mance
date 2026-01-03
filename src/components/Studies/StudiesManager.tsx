import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Star,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  platform: string;
  progress: number;
  status: 'backlog' | 'in-progress' | 'completed';
  totalHours: number;
  completedHours: number;
  skill: string;
}

const StudiesManager = () => {
  const [courses] = useState<Course[]>([
    { id: '1', title: 'React Avançado', platform: 'Udemy', progress: 65, status: 'in-progress', totalHours: 40, completedHours: 26, skill: 'Frontend' },
    { id: '2', title: 'TypeScript Completo', platform: 'Rocketseat', progress: 100, status: 'completed', totalHours: 20, completedHours: 20, skill: 'Programação' },
    { id: '3', title: 'Design System', platform: 'YouTube', progress: 30, status: 'in-progress', totalHours: 8, completedHours: 2.4, skill: 'Design' },
    { id: '4', title: 'Node.js & Express', platform: 'Coursera', progress: 0, status: 'backlog', totalHours: 30, completedHours: 0, skill: 'Backend' },
    { id: '5', title: 'Marketing Digital', platform: 'Hotmart', progress: 45, status: 'in-progress', totalHours: 15, completedHours: 6.75, skill: 'Marketing' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inProgress = filteredCourses.filter(c => c.status === 'in-progress');
  const completed = filteredCourses.filter(c => c.status === 'completed');
  const backlog = filteredCourses.filter(c => c.status === 'backlog');

  const totalHoursStudied = courses.reduce((acc, c) => acc + c.completedHours, 0);
  const totalCoursesCompleted = courses.filter(c => c.status === 'completed').length;

  const statusConfig = {
    'in-progress': { label: 'Em Progresso', className: 'bg-primary/20 text-primary' },
    'completed': { label: 'Concluído', className: 'bg-success/20 text-success' },
    'backlog': { label: 'Na Lista', className: 'bg-muted text-muted-foreground' }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Estudos</h1>
          <p className="text-muted-foreground text-sm">
            Organize seus cursos e acompanhe seu aprendizado
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Cursos</p>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold">{courses.length}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Em Progresso</p>
            <Play className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-semibold">{inProgress.length}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Concluídos</p>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-semibold">{totalCoursesCompleted}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Horas Estudadas</p>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold">{Math.round(totalHoursStudied)}h</p>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </div>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Em Progresso
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inProgress.map((course) => (
              <Card key={course.id} className="p-5 bg-card border-border hover:border-muted-foreground/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {course.platform}
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-muted">
                      {course.skill}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <h3 className="font-medium mb-3">{course.title}</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{course.completedHours}h de {course.totalHours}h</span>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <Play className="h-3 w-3 mr-1" />
                      Continuar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Backlog */}
      {backlog.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Na Lista
          </h2>
          <div className="space-y-2">
            {backlog.map((course) => (
              <Card key={course.id} className="p-4 bg-card border-border hover:border-muted-foreground/30 transition-colors">
                <div className="flex items-center gap-4">
                  <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{course.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{course.platform}</span>
                      <span>•</span>
                      <span>{course.totalHours}h</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-muted shrink-0">
                    {course.skill}
                  </Badge>
                  <Button variant="outline" size="sm" className="shrink-0">
                    <Play className="h-3 w-3 mr-1" />
                    Iniciar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Concluídos
          </h2>
          <div className="space-y-2">
            {completed.map((course) => (
              <Card key={course.id} className="p-4 bg-muted/30 border-transparent">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-muted-foreground">{course.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{course.platform}</span>
                      <span>•</span>
                      <span>{course.totalHours}h</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3 text-warning fill-warning" />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudiesManager;
