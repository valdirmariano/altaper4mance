import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Scale, Ruler, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useHealth } from '@/hooks/useHealth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BodyMeasurementsManager = () => {
  const { 
    bodyMeasurements, 
    isLoadingMeasurements, 
    addBodyMeasurement, 
    deleteBodyMeasurement,
    latestMeasurement 
  } = useHealth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight_kg: '',
    height_cm: '',
    waist_cm: '',
    chest_cm: '',
    arm_cm: '',
    leg_cm: '',
    body_fat_percent: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBodyMeasurement.mutate({
      date: formData.date,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
      waist_cm: formData.waist_cm ? parseFloat(formData.waist_cm) : null,
      chest_cm: formData.chest_cm ? parseFloat(formData.chest_cm) : null,
      arm_cm: formData.arm_cm ? parseFloat(formData.arm_cm) : null,
      leg_cm: formData.leg_cm ? parseFloat(formData.leg_cm) : null,
      body_fat_percent: formData.body_fat_percent ? parseFloat(formData.body_fat_percent) : null,
      notes: formData.notes || null,
    });
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      weight_kg: '',
      height_cm: '',
      waist_cm: '',
      chest_cm: '',
      arm_cm: '',
      leg_cm: '',
      body_fat_percent: '',
      notes: '',
    });
    setIsOpen(false);
  };

  const weightChartData = [...bodyMeasurements]
    .filter(m => m.weight_kg)
    .reverse()
    .slice(-12)
    .map(m => ({
      date: format(new Date(m.date), 'dd/MM'),
      peso: Number(m.weight_kg),
    }));

  const getTrend = (current: number | null, previous: number | null) => {
    if (!current || !previous) return null;
    const diff = current - previous;
    if (diff > 0) return { icon: TrendingUp, color: 'text-red-400', diff: `+${diff.toFixed(1)}` };
    if (diff < 0) return { icon: TrendingDown, color: 'text-green-400', diff: diff.toFixed(1) };
    return { icon: Minus, color: 'text-muted-foreground', diff: '0' };
  };

  const previousMeasurement = bodyMeasurements[1];
  const weightTrend = getTrend(
    latestMeasurement?.weight_kg ? Number(latestMeasurement.weight_kg) : null,
    previousMeasurement?.weight_kg ? Number(previousMeasurement.weight_kg) : null
  );

  const calculateBMI = () => {
    if (!latestMeasurement?.weight_kg || !latestMeasurement?.height_cm) return null;
    const heightM = Number(latestMeasurement.height_cm) / 100;
    return (Number(latestMeasurement.weight_kg) / (heightM * heightM)).toFixed(1);
  };

  const bmi = calculateBMI();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Medidas Corporais
          </h2>
          <p className="text-muted-foreground">Acompanhe sua evolução física</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Medição
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Medidas</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="75.5"
                    value={formData.weight_kg}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder="175"
                    value={formData.height_cm}
                    onChange={(e) => setFormData(prev => ({ ...prev, height_cm: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="waist">Cintura (cm)</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.1"
                    placeholder="80"
                    value={formData.waist_cm}
                    onChange={(e) => setFormData(prev => ({ ...prev, waist_cm: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="chest">Peito (cm)</Label>
                  <Input
                    id="chest"
                    type="number"
                    step="0.1"
                    placeholder="100"
                    value={formData.chest_cm}
                    onChange={(e) => setFormData(prev => ({ ...prev, chest_cm: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="body_fat">Gordura (%)</Label>
                  <Input
                    id="body_fat"
                    type="number"
                    step="0.1"
                    placeholder="15"
                    value={formData.body_fat_percent}
                    onChange={(e) => setFormData(prev => ({ ...prev, body_fat_percent: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arm">Braço (cm)</Label>
                  <Input
                    id="arm"
                    type="number"
                    step="0.1"
                    placeholder="35"
                    value={formData.arm_cm}
                    onChange={(e) => setFormData(prev => ({ ...prev, arm_cm: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="leg">Perna (cm)</Label>
                  <Input
                    id="leg"
                    type="number"
                    step="0.1"
                    placeholder="55"
                    value={formData.leg_cm}
                    onChange={(e) => setFormData(prev => ({ ...prev, leg_cm: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Observações..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={addBodyMeasurement.isPending}>
                Salvar Medidas
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Stats */}
      {latestMeasurement && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Scale className="h-4 w-4" />
                  <span className="text-xs">Peso</span>
                </div>
                {weightTrend && (
                  <div className={`flex items-center gap-1 text-xs ${weightTrend.color}`}>
                    <weightTrend.icon className="h-3 w-3" />
                    {weightTrend.diff}
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold">
                {latestMeasurement.weight_kg ? `${Number(latestMeasurement.weight_kg).toFixed(1)} kg` : '-'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Ruler className="h-4 w-4" />
                <span className="text-xs">IMC</span>
              </div>
              <p className="text-2xl font-bold">{bmi || '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Ruler className="h-4 w-4" />
                <span className="text-xs">Cintura</span>
              </div>
              <p className="text-2xl font-bold">
                {latestMeasurement.waist_cm ? `${Number(latestMeasurement.waist_cm).toFixed(1)} cm` : '-'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Scale className="h-4 w-4" />
                <span className="text-xs">Gordura</span>
              </div>
              <p className="text-2xl font-bold">
                {latestMeasurement.body_fat_percent ? `${Number(latestMeasurement.body_fat_percent).toFixed(1)}%` : '-'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weight Chart */}
      {weightChartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolução do Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Measurements List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Medidas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMeasurements ? (
            <p className="text-muted-foreground text-center py-4">Carregando...</p>
          ) : bodyMeasurements.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhuma medida registrada</p>
          ) : (
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {bodyMeasurements.map((measurement) => (
                  <div
                    key={measurement.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">
                        {format(new Date(measurement.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                        {measurement.weight_kg && <span>Peso: {Number(measurement.weight_kg).toFixed(1)}kg</span>}
                        {measurement.waist_cm && <span>Cintura: {Number(measurement.waist_cm).toFixed(1)}cm</span>}
                        {measurement.chest_cm && <span>Peito: {Number(measurement.chest_cm).toFixed(1)}cm</span>}
                        {measurement.arm_cm && <span>Braço: {Number(measurement.arm_cm).toFixed(1)}cm</span>}
                        {measurement.body_fat_percent && <span>Gordura: {Number(measurement.body_fat_percent).toFixed(1)}%</span>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteBodyMeasurement.mutate(measurement.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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

export default BodyMeasurementsManager;
