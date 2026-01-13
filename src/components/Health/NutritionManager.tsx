import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Utensils, Target, Flame, Beef, Wheat, Droplets, Trash2, Settings } from 'lucide-react';
import { useNutrition, Meal } from '@/hooks/useNutrition';
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

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-primary';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary" />
            Nutrição
          </h2>
          <p className="text-muted-foreground">Acompanhe sua alimentação e macros</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditingGoals} onOpenChange={setIsEditingGoals}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
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
                <Button onClick={handleSaveGoals} className="w-full">
                  Salvar Metas
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingMeal} onOpenChange={setIsAddingMeal}>
            <DialogTrigger asChild>
              <Button>
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

                <Button onClick={handleAddMeal} className="w-full" disabled={!newMeal.name}>
                  Registrar Refeição
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" /> Calorias
              </span>
              <span className="text-sm text-muted-foreground">
                {todayTotals.calories} / {goals?.daily_calories || 2000}
              </span>
            </div>
            <Progress 
              value={Math.min((todayTotals.calories / (goals?.daily_calories || 2000)) * 100, 100)} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-1">
                <Beef className="h-4 w-4 text-red-500" /> Proteína
              </span>
              <span className="text-sm text-muted-foreground">
                {todayTotals.protein.toFixed(0)}g / {goals?.protein_g || 150}g
              </span>
            </div>
            <Progress 
              value={Math.min((todayTotals.protein / (goals?.protein_g || 150)) * 100, 100)} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-1">
                <Wheat className="h-4 w-4 text-amber-500" /> Carboidratos
              </span>
              <span className="text-sm text-muted-foreground">
                {todayTotals.carbs.toFixed(0)}g / {goals?.carbs_g || 200}g
              </span>
            </div>
            <Progress 
              value={Math.min((todayTotals.carbs / (goals?.carbs_g || 200)) * 100, 100)} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-1">
                <Droplets className="h-4 w-4 text-yellow-500" /> Gordura
              </span>
              <span className="text-sm text-muted-foreground">
                {todayTotals.fat.toFixed(0)}g / {goals?.fat_g || 65}g
              </span>
            </div>
            <Progress 
              value={Math.min((todayTotals.fat / (goals?.fat_g || 65)) * 100, 100)} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Today and History */}
      <Tabs defaultValue="today" className="w-full">
        <TabsList>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {todayMeals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma refeição registrada hoje</h3>
                <p className="text-muted-foreground mb-4">
                  Comece a rastrear sua alimentação para atingir suas metas nutricionais
                </p>
                <Button onClick={() => setIsAddingMeal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Refeição
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {mealTypes.map((type) => {
                const typeMeals = todayMeals.filter(m => m.meal_type === type.value);
                if (typeMeals.length === 0) return null;

                return (
                  <Card key={type.value}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <span>{type.icon}</span>
                        {type.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {typeMeals.map((meal) => (
                        <div key={meal.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">{meal.name}</p>
                            {meal.description && (
                              <p className="text-sm text-muted-foreground">{meal.description}</p>
                            )}
                            <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                              <span>{meal.calories} kcal</span>
                              <span>{meal.protein_g}g P</span>
                              <span>{meal.carbs_g}g C</span>
                              <span>{meal.fat_g}g G</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteMeal(meal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {Object.entries(groupMealsByDate()).map(([date, dateMeals]) => (
            <Card key={date}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {format(new Date(date + 'T12:00:00'), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dateMeals.map((meal) => {
                  const mealType = mealTypes.find(t => t.value === meal.meal_type);
                  return (
                    <div key={meal.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span>{mealType?.icon}</span>
                        <div>
                          <p className="font-medium">{meal.name}</p>
                          <div className="flex gap-3 text-xs text-muted-foreground">
                            <span>{meal.calories} kcal</span>
                            <span>{meal.protein_g}g P</span>
                            <span>{meal.carbs_g}g C</span>
                            <span>{meal.fat_g}g G</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteMeal(meal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
