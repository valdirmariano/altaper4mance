import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModuleInsight } from '@/components/Accountability/AccountabilityPartner';
import { Plus, Utensils, Target, Flame, Beef, Wheat, Droplets, Trash2, Settings, Apple } from 'lucide-react';
import { useNutrition, Meal } from '@/hooks/useNutrition';
import { useGamification } from '@/hooks/useGamification';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const mealTypes = [
  { value: 'breakfast', label: 'Café da Manhã', icon: '🌅' },
  { value: 'lunch', label: 'Almoço', icon: '☀️' },
  { value: 'snack', label: 'Lanche', icon: '🍎' },
  { value: 'dinner', label: 'Jantar', icon: '🌙' },
];

export const NutritionManager = () => {
  const { meals, goals, loading, addMeal, deleteMeal, saveGoals, getTodayMeals, getTodayTotals } = useNutrition();
  const { rewardMealRegistered } = useGamification();
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [newMeal, setNewMeal] = useState({
    date: new Date().toISOString().split('T')[0],
    meal_type: 'lunch',
    name: '',
    description: '',
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
  });
  const [editGoals, setEditGoals] = useState({
    daily_calories: goals?.daily_calories || 2000,
    protein_g: goals?.protein_g || 150,
    carbs_g: goals?.carbs_g || 200,
    fat_g: goals?.fat_g || 65,
    water_liters: goals?.water_liters || 3,
  });

  const todayTotals = getTodayTotals();
  const todayMeals = getTodayMeals();

  const handleAddMeal = async () => {
    if (!newMeal.name) return;
    await addMeal(newMeal);
    await rewardMealRegistered();
    setNewMeal({
      date: new Date().toISOString().split('T')[0],
      meal_type: 'lunch',
      name: '',
      description: '',
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
    });
    setIsAddingMeal(false);
  };

  const handleSaveGoals = async () => {
    await saveGoals(editGoals);
    setIsEditingGoals(false);
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const groupMealsByDate = () => {
    const grouped: Record<string, Meal[]> = {};
    meals.forEach(meal => {
      if (!grouped[meal.date]) {
        grouped[meal.date] = [];
      }
      grouped[meal.date].push(meal);
    });
    return grouped;
  };

  const getInsightMessage = () => {
    const calorieProgress = getProgressPercentage(todayTotals.calories, goals?.daily_calories || 2000);
    const proteinProgress = getProgressPercentage(todayTotals.protein, goals?.protein_g || 150);
    
    if (meals.length === 0) return 'Registre suas refeições para acompanhar sua nutrição diária!';
    if (proteinProgress >= 100) return 'Meta de proteína atingida! Excelente para seus músculos.';
    if (calorieProgress >= 80 && calorieProgress <= 100) return 'Ótimo controle calórico hoje! Continue assim.';
    if (calorieProgress > 100) return 'Você excedeu as calorias hoje. Amanhã é um novo dia!';
    return 'Mantenha o foco na alimentação. Cada refeição conta!';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
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
              <Apple className="h-8 w-8 text-accent" />
            </div>
            Nutrição
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe sua alimentação e macros diários
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditingGoals} onOpenChange={setIsEditingGoals}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="border-border/50">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Metas Nutricionais Diárias
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Calorias (kcal)</Label>
                    <Input
                      type="number"
                      value={editGoals.daily_calories}
                      onChange={(e) => setEditGoals({ ...editGoals, daily_calories: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Proteína (g)</Label>
                    <Input
                      type="number"
                      value={editGoals.protein_g}
                      onChange={(e) => setEditGoals({ ...editGoals, protein_g: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Carboidratos (g)</Label>
                    <Input
                      type="number"
                      value={editGoals.carbs_g}
                      onChange={(e) => setEditGoals({ ...editGoals, carbs_g: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gordura (g)</Label>
                    <Input
                      type="number"
                      value={editGoals.fat_g}
                      onChange={(e) => setEditGoals({ ...editGoals, fat_g: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Água (litros)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={editGoals.water_liters}
                      onChange={(e) => setEditGoals({ ...editGoals, water_liters: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveGoals} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Salvar Metas
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingMeal} onOpenChange={setIsAddingMeal}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Refeição
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Refeição</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={newMeal.date}
                      onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={newMeal.meal_type} onValueChange={(v) => setNewMeal({ ...newMeal, meal_type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mealTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nome da Refeição</Label>
                  <Input
                    placeholder="Ex: Frango grelhado com arroz"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição (opcional)</Label>
                  <Textarea
                    placeholder="Ingredientes, observações..."
                    value={newMeal.description}
                    onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-500" /> Calorias
                    </Label>
                    <Input
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Beef className="h-3 w-3 text-red-500" /> Proteína (g)
                    </Label>
                    <Input
                      type="number"
                      value={newMeal.protein_g}
                      onChange={(e) => setNewMeal({ ...newMeal, protein_g: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Wheat className="h-3 w-3 text-amber-500" /> Carboidratos (g)
                    </Label>
                    <Input
                      type="number"
                      value={newMeal.carbs_g}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs_g: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-yellow-500" /> Gordura (g)
                    </Label>
                    <Input
                      type="number"
                      value={newMeal.fat_g}
                      onChange={(e) => setNewMeal({ ...newMeal, fat_g: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <Button onClick={handleAddMeal} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!newMeal.name}>
                  Registrar Refeição
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Today's Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-orange-500/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Calorias</p>
            <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-2">
            {todayTotals.calories} <span className="text-sm font-normal text-muted-foreground">/ {goals?.daily_calories || 2000}</span>
          </p>
          <Progress 
            value={getProgressPercentage(todayTotals.calories, goals?.daily_calories || 2000)} 
            className="h-2"
          />
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-red-500/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Proteína</p>
            <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <Beef className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-2">
            {todayTotals.protein.toFixed(0)}g <span className="text-sm font-normal text-muted-foreground">/ {goals?.protein_g || 150}g</span>
          </p>
          <Progress 
            value={getProgressPercentage(todayTotals.protein, goals?.protein_g || 150)} 
            className="h-2"
          />
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-amber-500/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Carboidratos</p>
            <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
              <Wheat className="h-4 w-4 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-2">
            {todayTotals.carbs.toFixed(0)}g <span className="text-sm font-normal text-muted-foreground">/ {goals?.carbs_g || 200}g</span>
          </p>
          <Progress 
            value={getProgressPercentage(todayTotals.carbs, goals?.carbs_g || 200)} 
            className="h-2"
          />
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-yellow-500/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Gordura</p>
            <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
              <Droplets className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-2">
            {todayTotals.fat.toFixed(0)}g <span className="text-sm font-normal text-muted-foreground">/ {goals?.fat_g || 65}g</span>
          </p>
          <Progress 
            value={getProgressPercentage(todayTotals.fat, goals?.fat_g || 65)} 
            className="h-2"
          />
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

      {/* Tabs for Today and History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4 mt-4">
            {todayMeals.length === 0 ? (
              <Card className="p-12 text-center bg-card/50 backdrop-blur border-border/50">
                <div className="p-4 rounded-2xl bg-accent/10 w-fit mx-auto mb-4">
                  <Utensils className="h-12 w-12 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhuma refeição registrada hoje</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Comece a rastrear sua alimentação para atingir suas metas nutricionais
                </p>
                <Button onClick={() => setIsAddingMeal(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Refeição
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {mealTypes.map((type) => {
                  const typeMeals = todayMeals.filter(m => m.meal_type === type.value);
                  if (typeMeals.length === 0) return null;

                  return (
                    <Card key={type.value} className="p-5 bg-card/50 backdrop-blur border-border/50">
                      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <span className="text-lg">{type.icon}</span>
                        {type.label}
                      </h3>
                      <div className="space-y-3">
                        {typeMeals.map((meal) => (
                          <div key={meal.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/30 hover:border-accent/30 transition-all group">
                            <div>
                              <p className="font-medium">{meal.name}</p>
                              {meal.description && (
                                <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>
                              )}
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Flame className="h-3 w-3 text-orange-500" />
                                  {meal.calories} kcal
                                </span>
                                <span className="flex items-center gap-1">
                                  <Beef className="h-3 w-3 text-red-500" />
                                  {meal.protein_g}g
                                </span>
                                <span className="flex items-center gap-1">
                                  <Wheat className="h-3 w-3 text-amber-500" />
                                  {meal.carbs_g}g
                                </span>
                                <span className="flex items-center gap-1">
                                  <Droplets className="h-3 w-3 text-yellow-500" />
                                  {meal.fat_g}g
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                              onClick={() => deleteMeal(meal.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <ScrollArea className="h-96">
                <div className="space-y-6">
                  {Object.entries(groupMealsByDate()).map(([date, dateMeals]) => (
                    <div key={date}>
                      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                        {format(new Date(date + 'T12:00:00'), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </h3>
                      <div className="space-y-2">
                        {dateMeals.map((meal) => {
                          const mealType = mealTypes.find(t => t.value === meal.meal_type);
                          return (
                            <div key={meal.id} className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30 group">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{mealType?.icon}</span>
                                <div>
                                  <p className="font-medium text-sm">{meal.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {meal.calories} kcal • {meal.protein_g}g P • {meal.carbs_g}g C • {meal.fat_g}g G
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                onClick={() => deleteMeal(meal.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default NutritionManager;
