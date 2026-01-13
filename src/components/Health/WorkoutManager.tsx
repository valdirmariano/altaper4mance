import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus, Dumbbell, Timer, Trash2, X } from 'lucide-react';
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
      'Peito': 'bg-red-500/20 text-red-400',
      'Costas': 'bg-blue-500/20 text-blue-400',
      'Ombros': 'bg-orange-500/20 text-orange-400',
      'Bíceps': 'bg-purple-500/20 text-purple-400',
      'Tríceps': 'bg-pink-500/20 text-pink-400',
      'Pernas': 'bg-green-500/20 text-green-400',
      'Glúteos': 'bg-yellow-500/20 text-yellow-400',
      'Abdômen': 'bg-cyan-500/20 text-cyan-400',
      'Full Body': 'bg-primary/20 text-primary',
      'Cardio': 'bg-emerald-500/20 text-emerald-400',
    };
    return group ? colors[group] || 'bg-muted text-muted-foreground' : 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            Treinos
          </h2>
          <p className="text-muted-foreground">Registre seus exercícios e acompanhe evolução</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
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
                  <Button type="button" size="icon" onClick={addExercise} className="col-span-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {exercises.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="text-sm">{exercise.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {exercise.sets}x{exercise.reps} {exercise.weight ? `@ ${exercise.weight}kg` : ''}
                          </span>
                          <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeExercise(index)}>
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
              
              <Button type="submit" className="w-full" disabled={addWorkoutSession.isPending}>
                Salvar Treino
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Dumbbell className="h-4 w-4" />
              <span className="text-xs">Total de Treinos</span>
            </div>
            <p className="text-2xl font-bold">{workoutStats.totalSessions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Timer className="h-4 w-4" />
              <span className="text-xs">Tempo Total</span>
            </div>
            <p className="text-2xl font-bold">{Math.floor(workoutStats.totalMinutes / 60)}h {workoutStats.totalMinutes % 60}m</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Dumbbell className="h-4 w-4" />
              <span className="text-xs">Grupos Trabalhados</span>
            </div>
            <p className="text-2xl font-bold">{workoutStats.muscleGroups.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Treinos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingWorkout ? (
            <p className="text-muted-foreground text-center py-4">Carregando...</p>
          ) : workoutSessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhum treino registrado</p>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {workoutSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{session.name}</h4>
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
                        onClick={() => deleteWorkoutSession.mutate(session.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    
                    {session.exercises && session.exercises.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {session.exercises.map((exercise, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {exercise.name}: {exercise.sets}x{exercise.reps}
                            {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutManager;
