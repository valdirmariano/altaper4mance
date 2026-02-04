import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ModuleInsight } from '@/components/Accountability/AccountabilityPartner';
import { Plus, Dumbbell, Timer, Trash2, X, Flame, Target } from 'lucide-react';
import { useHealth, Exercise } from '@/hooks/useHealth';
import { useGamification } from '@/hooks/useGamification';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const muscleGroups = [
  'Peito',
  'Costas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Pernas',
  'Glúteos',
  'Abdômen',
  'Full Body',
  'Cardio',
];

const WorkoutManager = () => {
  const { 
    workoutSessions, 
    isLoadingWorkout, 
    addWorkoutSession, 
    deleteWorkoutSession,
    workoutStats 
  } = useHealth();
  
  const { rewardWorkoutSession } = useGamification();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    name: '',
    muscle_group: '',
    duration_minutes: '',
    notes: '',
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', weight: '' });

  const addExercise = () => {
    if (newExercise.name && newExercise.sets && newExercise.reps) {
      setExercises(prev => [...prev, {
        name: newExercise.name,
        sets: parseInt(newExercise.sets),
        reps: parseInt(newExercise.reps),
        weight: newExercise.weight ? parseFloat(newExercise.weight) : undefined,
      }]);
      setNewExercise({ name: '', sets: '', reps: '', weight: '' });
    }
  };

  const removeExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addWorkoutSession.mutate({
      date: formData.date,
      name: formData.name,
      muscle_group: formData.muscle_group || null,
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
      exercises,
      notes: formData.notes || null,
    }, {
      onSuccess: () => {
        rewardWorkoutSession();
      }
    });
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      name: '',
      muscle_group: '',
      duration_minutes: '',
      notes: '',
    });
    setExercises([]);
    setIsOpen(false);
  };

  const getMuscleGroupColor = (group: string | null) => {
    const colors: Record<string, string> = {
      'Peito': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Costas': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Ombros': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Bíceps': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Tríceps': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Pernas': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Glúteos': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Abdômen': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Full Body': 'bg-accent/20 text-accent border-accent/30',
      'Cardio': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
    return group ? colors[group] || 'bg-muted text-muted-foreground' : 'bg-muted text-muted-foreground';
  };

  const getInsightMessage = () => {
    if (workoutSessions.length === 0) return 'Comece sua transformação física! Registre seu primeiro treino.';
    if (workoutStats.totalSessions >= 50) return `${workoutStats.totalSessions} treinos! Você é uma máquina de disciplina!`;
    if (workoutStats.totalMinutes >= 1000) return `Mais de ${Math.floor(workoutStats.totalMinutes / 60)}h de treino acumuladas. Resultados vêm!`;
    if (workoutStats.muscleGroups.length >= 5) return `Treino completo! Você trabalha ${workoutStats.muscleGroups.length} grupos musculares diferentes.`;
    return 'Consistência é a chave. Cada treino te aproxima do seu objetivo!';
  };

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
              <Dumbbell className="h-8 w-8 text-accent" />
            </div>
            Treinos
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre seus exercícios e acompanhe sua evolução
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Novo Treino
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Treino</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nome do Treino</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Treino A - Peito e Tríceps"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="muscle_group">Grupo Muscular</Label>
                  <Select value={formData.muscle_group} onValueChange={(value) => setFormData(prev => ({ ...prev, muscle_group: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {muscleGroups.map(group => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duração (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                  />
                </div>
              </div>

              {/* Exercise Entry */}
              <div className="space-y-3">
                <Label>Exercícios</Label>
                <div className="grid grid-cols-12 gap-2">
                  <Input
                    className="col-span-4"
                    placeholder="Nome do exercício"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    placeholder="Séries"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, sets: e.target.value }))}
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    placeholder="Reps"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, reps: e.target.value }))}
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    step="0.5"
                    placeholder="Kg"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, weight: e.target.value }))}
                  />
                  <Button type="button" size="icon" onClick={addExercise} className="col-span-2 bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {exercises.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20">
                        <span className="font-medium">{exercise.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {exercise.sets}x{exercise.reps} {exercise.weight ? `@ ${exercise.weight}kg` : ''}
                          </span>
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive" onClick={() => removeExercise(index)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Como foi o treino?"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={addWorkoutSession.isPending}>
                Salvar Treino
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Total de Treinos</p>
            <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Dumbbell className="h-4 w-4 text-accent" />
            </div>
          </div>
          <p className="text-3xl font-bold">{workoutStats.totalSessions}</p>
          <p className="text-sm text-muted-foreground">sessões registradas</p>
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Tempo Total</p>
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <Timer className="h-4 w-4 text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{Math.floor(workoutStats.totalMinutes / 60)}h {workoutStats.totalMinutes % 60}m</p>
          <p className="text-sm text-muted-foreground">de exercícios</p>
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Grupos Trabalhados</p>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <Target className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{workoutStats.muscleGroups.length}</p>
          <p className="text-sm text-muted-foreground">grupos musculares</p>
        </Card>
      </motion.div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ModuleInsight module="health" customMessage={getInsightMessage()} />
      </motion.div>

      {/* Sessions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-accent" />
            Histórico de Treinos
          </h3>
          
          {isLoadingWorkout ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : workoutSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 rounded-2xl bg-accent/10 w-fit mx-auto mb-4">
                <Dumbbell className="h-10 w-10 text-accent" />
              </div>
              <p className="text-muted-foreground">Nenhum treino registrado</p>
              <p className="text-sm text-muted-foreground mt-1">Clique em "Novo Treino" para começar</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {workoutSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="p-5 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 hover:border-accent/30 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg">{session.name}</h4>
                          {session.muscle_group && (
                            <Badge className={getMuscleGroupColor(session.muscle_group)}>
                              {session.muscle_group}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(session.date), "dd 'de' MMMM", { locale: ptBR })}
                          {session.duration_minutes && ` • ${session.duration_minutes} min`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={() => deleteWorkoutSession.mutate(session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {session.exercises && session.exercises.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {session.exercises.map((exercise, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-border/50 bg-background/50">
                            {exercise.name}: {exercise.sets}x{exercise.reps}
                            {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default WorkoutManager;
