import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses, Course } from '@/hooks/useCourses';
import { 
  Plus, 
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Star,
  Search,
  Loader2,
  Trash2
} from 'lucide-react';

const StudiesManager = () => {
  const { courses, loading, addCourse, updateCourse, deleteCourse, getStats } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    platform: '',
    skill: '',
    total_hours: 0,
  });

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inProgress = filteredCourses.filter(c => c.status === 'in-progress');
  const completed = filteredCourses.filter(c => c.status === 'completed');
  const backlog = filteredCourses.filter(c => c.status === 'backlog');

  const stats = getStats();

  const handleAddCourse = async () => {
    if (!newCourse.title.trim()) return;
    
    await addCourse({
      title: newCourse.title,
      platform: newCourse.platform || undefined,
      skill: newCourse.skill || undefined,
      status: 'backlog',
      progress: 0,
      total_hours: newCourse.total_hours || 0,
      completed_hours: 0,
    });
    
    setNewCourse({ title: '', platform: '', skill: '', total_hours: 0 });
    setIsDialogOpen(false);
  };

  const handleStartCourse = async (course: Course) => {
    await updateCourse(course.id, { status: 'in-progress' });
  };

  const handleCompleteCourse = async (course: Course) => {
    await updateCourse(course.id, { 
      status: 'completed', 
      progress: 100,
      completed_hours: course.total_hours 
    });
  };

  const handleUpdateProgress = async (course: Course, progress: number) => {
    const completed_hours = (progress / 100) * course.total_hours;
    await updateCourse(course.id, { progress, completed_hours });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Curso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Nome do curso"
                />
              </div>
              <div>
                <Label>Plataforma</Label>
                <Select
                  value={newCourse.platform}
                  onValueChange={(value) => setNewCourse({ ...newCourse, platform: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Udemy">Udemy</SelectItem>
                    <SelectItem value="Coursera">Coursera</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Rocketseat">Rocketseat</SelectItem>
                    <SelectItem value="Alura">Alura</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Habilidade</Label>
                <Input
                  value={newCourse.skill}
                  onChange={(e) => setNewCourse({ ...newCourse, skill: e.target.value })}
                  placeholder="Ex: Frontend, Backend, Design..."
                />
              </div>
              <div>
                <Label>Duração (horas)</Label>
                <Input
                  type="number"
                  value={newCourse.total_hours || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, total_hours: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <Button onClick={handleAddCourse} className="w-full">
                Adicionar Curso
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Cursos</p>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Em Progresso</p>
            <Play className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-semibold">{stats.inProgress}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Concluídos</p>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-semibold">{stats.completed}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Horas Estudadas</p>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold">{Math.round(stats.totalHours)}h</p>
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
      </div>

      {courses.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum curso cadastrado</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Comece adicionando seus cursos para acompanhar seu aprendizado
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Curso
          </Button>
        </Card>
      ) : (
        <>
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
                        {course.platform && (
                          <Badge variant="outline" className="text-xs">
                            {course.platform}
                          </Badge>
                        )}
                        {course.skill && (
                          <Badge variant="secondary" className="text-xs bg-muted">
                            {course.skill}
                          </Badge>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <h3 className="font-medium mb-3">{course.title}</h3>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">{Math.round(course.progress)}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{Math.round(course.completed_hours)}h de {course.total_hours}h</span>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2"
                            onClick={() => handleUpdateProgress(course, Math.min(100, course.progress + 10))}
                          >
                            +10%
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2"
                            onClick={() => handleCompleteCourse(course)}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Concluir
                          </Button>
                        </div>
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
                          {course.platform && <span>{course.platform}</span>}
                          {course.platform && course.total_hours > 0 && <span>•</span>}
                          {course.total_hours > 0 && <span>{course.total_hours}h</span>}
                        </div>
                      </div>
                      {course.skill && (
                        <Badge variant="secondary" className="text-xs bg-muted shrink-0">
                          {course.skill}
                        </Badge>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="shrink-0"
                        onClick={() => handleStartCourse(course)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Iniciar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive shrink-0"
                        onClick={() => deleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
                          {course.platform && <span>{course.platform}</span>}
                          {course.platform && course.total_hours > 0 && <span>•</span>}
                          {course.total_hours > 0 && <span>{course.total_hours}h</span>}
                        </div>
                      </div>
                      {course.rating && (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-3 w-3 ${star <= course.rating! ? 'text-warning fill-warning' : 'text-muted-foreground'}`} 
                            />
                          ))}
                        </div>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive shrink-0"
                        onClick={() => deleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudiesManager;
