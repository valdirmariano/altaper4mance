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
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft,
  ChevronRight,
  Flame,
  Smile,
  Meh,
  Frown,
  Loader2,
  Heart,
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Zap
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

  const moodOptions = [
    { value: 1, icon: Frown, label: 'Péssimo', color: 'text-red-400' },
    { value: 2, icon: Frown, label: 'Ruim', color: 'text-orange-400' },
    { value: 3, icon: Meh, label: 'Normal', color: 'text-yellow-400' },
    { value: 4, icon: Smile, label: 'Bom', color: 'text-green-400' },
    { value: 5, icon: Sparkles, label: 'Ótimo', color: 'text-emerald-400' },
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
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Faça login para acessar o diário.</p>
        </div>
      </div>
    );
  }

  const loading = diaryLoading || habitsLoading;
  const completedHabitsToday = habits.filter(h => checkHabitOnDate(h.id, selectedDate)).length;
  const habitsProgress = habits.length > 0 ? Math.round((completedHabitsToday / habits.length) * 100) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const GreetingIcon = hour < 12 ? Sun : hour < 18 ? Sun : Moon;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <GreetingIcon className="h-5 w-5 text-yellow-400" />
          <span className="text-muted-foreground text-sm">{greeting}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Diário</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Registre seu dia e acompanhe seus hábitos
        </p>
      </motion.div>

      {/* Date Navigation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => navigateDate(-1)} className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <p className="font-semibold capitalize">{formatDate(selectedDate)}</p>
              {isToday(selectedDate) && (
                <Badge variant="secondary" className="text-xs mt-1 bg-foreground/10">Hoje</Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigateDate(1)} className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Habits Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-4"
          >
            <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Hábitos do Dia
                </h3>
                <Badge variant="secondary" className="text-xs bg-muted/50">
                  {completedHabitsToday}/{habits.length}
                </Badge>
              </div>

              {/* Progress Bar */}
              {habits.length > 0 && (
                <div className="mb-4">
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-foreground/60 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${habitsProgress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{habitsProgress}% concluído</p>
                </div>
              )}

              <div className="space-y-2">
                {habits.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Nenhum hábito cadastrado
                  </p>
                ) : (
                  habits.map((habit, i) => {
                    const isCompleted = checkHabitOnDate(habit.id, selectedDate);
                    return (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.03 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-foreground/5 border-foreground/10' 
                            : 'border-border/30 hover:border-border/60'
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
                          <Flame className="h-3 w-3 text-orange-400" />
                          {habit.streak || 0}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </Card>
          </motion.div>

          {/* Journal Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Mood */}
            <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Como você está se sentindo?
              </h3>
              <div className="flex justify-center gap-2 md:gap-4">
                {moodOptions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMood(item.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 md:p-4 rounded-xl transition-all duration-300 ${
                        mood === item.value 
                          ? 'bg-foreground text-background shadow-lg scale-105' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${mood === item.value ? '' : item.color}`} />
                      <span className="text-xs font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </Card>

            {/* Gratitude */}
            <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                Pelo que você é grato hoje?
              </h3>
              <Textarea
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="Liste 3 coisas pelas quais você é grato..."
                className="min-h-24 bg-muted/20 border-border/30 resize-none rounded-xl focus:ring-1 focus:ring-foreground/20"
              />
            </Card>

            {/* Reflection */}
            <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Reflexão do Dia
              </h3>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="O que você aprendeu hoje? Quais foram seus desafios e vitórias?"
                className="min-h-32 bg-muted/20 border-border/30 resize-none rounded-xl focus:ring-1 focus:ring-foreground/20"
              />
            </Card>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button className="w-full h-12 rounded-xl text-base font-medium" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Entrada'
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DiaryManager;
