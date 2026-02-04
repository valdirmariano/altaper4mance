import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses, Course } from '@/hooks/useCourses';
import { useGamification } from '@/hooks/useGamification';
import { ModuleInsight } from '@/components/Accountability/AccountabilityPartner';
import { 
  Plus, 
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Star,
  Search,
  Loader2,
  Trash2,
  GraduationCap,
  TrendingUp
} from 'lucide-react';

const StudiesManager = () => {
  const { courses, loading, addCourse, updateCourse, deleteCourse, getStats } = useCourses();
  const { rewardStudySession, rewardCourseComplete } = useGamification();
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
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

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
    await rewardCourseComplete();
  };

  const handleUpdateProgress = async (course: Course, progress: number) => {
    const completed_hours = (progress / 100) * course.total_hours;
    await updateCourse(course.id, { progress, completed_hours });
    await rewardStudySession();
  };

  const getInsightMessage = () => {
    if (stats.total === 0) return 'Comece sua jornada de aprendizado! Adicione seu primeiro curso.';
    if (stats.inProgress === 0 && backlog.length > 0) return `Você tem ${backlog.length} cursos na lista. Que tal iniciar um hoje?`;
    if (completionRate >= 70) return `Excelente! Você já completou ${completionRate}% dos seus cursos. Continue assim!`;
    if (stats.totalHours >= 50) return `Incrível! Você já estudou ${Math.round(stats.totalHours)}h. Conhecimento é poder!`;
    return `Você tem ${stats.inProgress} cursos em andamento. Foco no aprendizado!`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10">
              <GraduationCap className="h-8 w-8 text-accent" />
            </div>
            Estudos
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize seus cursos e acompanhe seu aprendizado
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
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
              <Button onClick={handleAddCourse} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Adicionar Curso
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Total de Cursos</p>
            <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <BookOpen className="h-4 w-4 text-accent" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Em Progresso</p>
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <Play className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Concluídos</p>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.completed}</p>
          <p className="text-xs text-muted-foreground mt-1">{completionRate}% de conclusão</p>
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Horas Estudadas</p>
            <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{Math.round(stats.totalHours)}h</p>
        </Card>
      </motion.div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ModuleInsight module="studies" customMessage={getInsightMessage()} />
      </motion.div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-card/50 backdrop-blur border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
        </div>
      </motion.div>

      {courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-12 text-center bg-card/50 backdrop-blur border-border/50">
            <div className="p-4 rounded-2xl bg-accent/10 w-fit mx-auto mb-4">
              <BookOpen className="h-12 w-12 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum curso cadastrado</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Comece adicionando seus cursos para acompanhar seu aprendizado e evoluir constantemente
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Curso
            </Button>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* In Progress */}
          <AnimatePresence>
            {inProgress.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Play className="h-5 w-5 text-blue-500" />
                  Em Progresso
                  <Badge variant="secondary" className="ml-2">{inProgress.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {inProgress.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {course.platform && (
                              <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                                {course.platform}
                              </Badge>
                            )}
                            {course.skill && (
                              <Badge variant="secondary" className="text-xs">
                                {course.skill}
                              </Badge>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <h3 className="font-semibold text-lg mb-4">{course.title}</h3>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-semibold text-accent">{Math.round(course.progress)}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {Math.round(course.completed_hours)}h de {course.total_hours}h
                            </span>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs"
                                onClick={() => handleUpdateProgress(course, Math.min(100, course.progress + 10))}
                              >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +10%
                              </Button>
                              <Button 
                                size="sm" 
                                className="h-8 text-xs bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleCompleteCourse(course)}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Concluir
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Backlog */}
          <AnimatePresence>
            {backlog.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  Na Lista
                  <Badge variant="secondary" className="ml-2">{backlog.length}</Badge>
                </h2>
                <div className="space-y-2">
                  {backlog.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <Card className="p-4 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-muted/50">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{course.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              {course.platform && <span>{course.platform}</span>}
                              {course.platform && course.total_hours > 0 && <span>•</span>}
                              {course.total_hours > 0 && <span>{course.total_hours}h</span>}
                            </div>
                          </div>
                          {course.skill && (
                            <Badge variant="secondary" className="text-xs shrink-0">
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
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={() => deleteCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completed */}
          <AnimatePresence>
            {completed.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Concluídos
                  <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-500">{completed.length}</Badge>
                </h2>
                <div className="space-y-2">
                  {completed.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <Card className="p-4 bg-green-500/5 border-green-500/20 group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-green-500/10">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{course.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              {course.platform && <span>{course.platform}</span>}
                              {course.platform && course.total_hours > 0 && <span>•</span>}
                              {course.total_hours > 0 && <span>{course.total_hours}h concluídas</span>}
                            </div>
                          </div>
                          {course.rating && (
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= course.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`} 
                                />
                              ))}
                            </div>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={() => deleteCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default StudiesManager;
