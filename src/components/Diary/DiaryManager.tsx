import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useDiary } from '@/hooks/useDiary';
import { useHabits } from '@/hooks/useHabits';
import { useGamification } from '@/hooks/useGamification';
import { toast } from 'sonner';
import { 
  ChevronLeft,
  ChevronRight,
  Flame,
  Smile,
  Meh,
  Frown,
  Loader2
} from 'lucide-react';

const DiaryManager = () => {
  const { user } = useAuth();
  const { rewardJournalEntry } = useGamification();
  
  const handleDiaryReward = (isNewEntry: boolean) => {
    if (isNewEntry) {
      rewardJournalEntry();
    }
  };
  
  const { getEntryByDate, saveEntry, loading: diaryLoading } = useDiary(handleDiaryReward);
  const { habits, loading: habitsLoading, checkHabitOnDate, toggleHabitToday } = useHabits();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mood, setMood] = useState<number>(3);
  const [gratitude, setGratitude] = useState('');
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);

  // Load entry when date changes
  useEffect(() => {
    const entry = getEntryByDate(selectedDate);
    if (entry) {
      setMood(entry.mood || 3);
      setGratitude(entry.gratitude || '');
      setReflection(entry.reflection || '');
    } else {
      setMood(3);
      setGratitude('');
      setReflection('');
    }
  }, [selectedDate, getEntryByDate]);

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

  const handleSave = async () => {
    setSaving(true);
    const result = await saveEntry(selectedDate, {
      mood,
      gratitude,
      reflection,
    });
    setSaving(false);
    
    if (result) {
      toast.success('Entrada salva com sucesso!');
    } else {
      toast.error('Erro ao salvar entrada');
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleToggleHabit = async (habitId: string) => {
    if (isToday(selectedDate)) {
      await toggleHabitToday(habitId);
    }
  };

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Faça login para acessar o diário.</p>
      </div>
    );
  }

  const loading = diaryLoading || habitsLoading;
  const completedHabitsToday = habits.filter(h => checkHabitOnDate(h.id, selectedDate)).length;

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
          {isToday(selectedDate) && (
            <Badge variant="secondary" className="text-xs mt-1">Hoje</Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigateDate(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Habits Column */}
          <Card className="p-5 bg-card border-border lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Hábitos do Dia</h3>
              <Badge variant="secondary" className="text-xs bg-muted">
                {completedHabitsToday}/{habits.length}
              </Badge>
            </div>

            <div className="space-y-2">
              {habits.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum hábito cadastrado
                </p>
              ) : (
                habits.map((habit) => {
                  const isCompleted = checkHabitOnDate(habit.id, selectedDate);
                  return (
                    <div 
                      key={habit.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isCompleted 
                          ? 'bg-muted/30 border-transparent' 
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <Checkbox 
                        checked={isCompleted}
                        onCheckedChange={() => handleToggleHabit(habit.id)}
                        disabled={!isToday(selectedDate)}
                      />
                      <span className={`flex-1 text-sm ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                        {habit.title}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Flame className="h-3 w-3 text-warning" />
                        {habit.streak || 0}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
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

            <Button className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Entrada'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryManager;
