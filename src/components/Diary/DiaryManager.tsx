import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  ChevronLeft,
  ChevronRight,
  Flame,
  Droplets,
  Moon,
  Sun,
  Smile,
  Meh,
  Frown,
  BookOpen,
  Dumbbell,
  Heart
} from 'lucide-react';

const DiaryManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mood, setMood] = useState<number>(3);
  const [gratitude, setGratitude] = useState('');
  const [reflection, setReflection] = useState('');
  
  const habits = [
    { id: '1', name: 'Beber 2L de água', icon: Droplets, completed: true, streak: 5 },
    { id: '2', name: 'Exercitar 30min', icon: Dumbbell, completed: false, streak: 3 },
    { id: '3', name: 'Ler 20 páginas', icon: BookOpen, completed: true, streak: 8 },
    { id: '4', name: 'Meditar 10min', icon: Heart, completed: false, streak: 2 },
    { id: '5', name: 'Dormir antes de 23h', icon: Moon, completed: false, streak: 0 },
    { id: '6', name: 'Acordar às 6h', icon: Sun, completed: true, streak: 4 },
  ];

  const moodIcons = [
    { value: 1, icon: Frown, label: 'Péssimo' },
    { value: 2, icon: Frown, label: 'Ruim' },
    { value: 3, icon: Meh, label: 'Normal' },
    { value: 4, icon: Smile, label: 'Bom' },
    { value: 5, icon: Smile, label: 'Ótimo' },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const completedHabits = habits.filter(h => h.completed).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Diário</h1>
          <p className="text-muted-foreground text-sm">
            Registre seu dia e acompanhe seus hábitos
          </p>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigateDate(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <p className="font-medium capitalize">{formatDate(selectedDate)}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigateDate(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habits Column */}
        <Card className="p-5 bg-card border-border lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Hábitos do Dia</h3>
            <Badge variant="secondary" className="text-xs bg-muted">
              {completedHabits}/{habits.length}
            </Badge>
          </div>

          <div className="space-y-2">
            {habits.map((habit) => {
              const Icon = habit.icon;
              return (
                <div 
                  key={habit.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    habit.completed 
                      ? 'bg-muted/30 border-transparent' 
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <Checkbox checked={habit.completed} />
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className={`flex-1 text-sm ${habit.completed ? 'text-muted-foreground' : ''}`}>
                    {habit.name}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Flame className="h-3 w-3 text-warning" />
                    {habit.streak}
                  </div>
                </div>
              );
            })}
          </div>

          <Button variant="ghost" className="w-full mt-3 h-9 text-muted-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar hábito
          </Button>
        </Card>

        {/* Journal Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mood */}
          <Card className="p-5 bg-card border-border">
            <h3 className="font-medium mb-4">Como você está se sentindo?</h3>
            <div className="flex justify-center gap-3">
              {moodIcons.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    onClick={() => setMood(item.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                      mood === item.value 
                        ? 'bg-foreground text-background' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Gratitude */}
          <Card className="p-5 bg-card border-border">
            <h3 className="font-medium mb-3">Pelo que você é grato hoje?</h3>
            <Textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="Liste 3 coisas pelas quais você é grato..."
              className="min-h-24 bg-muted/30 border-0 resize-none"
            />
          </Card>

          {/* Reflection */}
          <Card className="p-5 bg-card border-border">
            <h3 className="font-medium mb-3">Reflexão do Dia</h3>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="O que você aprendeu hoje? Quais foram seus desafios e vitórias?"
              className="min-h-32 bg-muted/30 border-0 resize-none"
            />
          </Card>

          <Button className="w-full">
            Salvar Entrada
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiaryManager;
