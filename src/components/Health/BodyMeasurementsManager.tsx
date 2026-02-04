import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModuleInsight } from '@/components/Accountability/AccountabilityPartner';
import { Plus, Scale, Ruler, Trash2, TrendingUp, TrendingDown, Minus, Heart, Activity } from 'lucide-react';
import { useHealth } from '@/hooks/useHealth';
import { useGamification } from '@/hooks/useGamification';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const BodyMeasurementsManager = () => {
  const { 
    bodyMeasurements, 
    isLoadingMeasurements, 
    addBodyMeasurement, 
    deleteBodyMeasurement,
    latestMeasurement 
  } = useHealth();
  
  const { rewardBodyMeasurement } = useGamification();
  
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    }, {
      onSuccess: () => {
        rewardBodyMeasurement();
      }
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

  const getBMICategory = (bmiValue: string | null) => {
    if (!bmiValue) return null;
    const value = parseFloat(bmiValue);
    if (value < 18.5) return { label: 'Abaixo do peso', color: 'text-yellow-500' };
    if (value < 25) return { label: 'Peso normal', color: 'text-green-500' };
    if (value < 30) return { label: 'Sobrepeso', color: 'text-orange-500' };
    return { label: 'Obesidade', color: 'text-red-500' };
  };

  const bmiCategory = getBMICategory(bmi);

  const getInsightMessage = () => {
    if (bodyMeasurements.length === 0) return 'Registre suas medidas para acompanhar sua evolução física!';
    if (bmiCategory?.label === 'Peso normal') return 'Excelente! Seu IMC está na faixa saudável. Continue assim!';
    if (weightTrend?.diff && parseFloat(weightTrend.diff) < 0) return 'Ótimo progresso! Você está perdendo peso consistentemente.';
    if (bodyMeasurements.length >= 5) return 'Consistência nos registros! Isso ajuda a identificar padrões.';
    return 'Acompanhar suas medidas é o primeiro passo para a transformação!';
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
              <Scale className="h-8 w-8 text-accent" />
            </div>
            Medidas Corporais
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe sua evolução física ao longo do tempo
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
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
              
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={addBodyMeasurement.isPending}>
                Salvar Medidas
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Current Stats */}
      {latestMeasurement && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Peso</p>
              <div className="flex items-center gap-2">
                {weightTrend && (
                  <div className={`flex items-center gap-1 text-xs ${weightTrend.color}`}>
                    <weightTrend.icon className="h-3 w-3" />
                    {weightTrend.diff}
                  </div>
                )}
                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Scale className="h-4 w-4 text-accent" />
                </div>
              </div>
            </div>
            <p className="text-3xl font-bold">
              {latestMeasurement.weight_kg ? `${Number(latestMeasurement.weight_kg).toFixed(1)}` : '-'}
            </p>
            <p className="text-sm text-muted-foreground">kg</p>
          </Card>
          
          <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">IMC</p>
              <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Heart className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-bold">{bmi || '-'}</p>
            {bmiCategory && (
              <p className={`text-sm ${bmiCategory.color}`}>{bmiCategory.label}</p>
            )}
          </Card>

          <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Cintura</p>
              <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <Ruler className="h-4 w-4 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-bold">
              {latestMeasurement.waist_cm ? `${Number(latestMeasurement.waist_cm).toFixed(1)}` : '-'}
            </p>
            <p className="text-sm text-muted-foreground">cm</p>
          </Card>

          <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Gordura</p>
              <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                <Activity className="h-4 w-4 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-bold">
              {latestMeasurement.body_fat_percent ? `${Number(latestMeasurement.body_fat_percent).toFixed(1)}` : '-'}
            </p>
            <p className="text-sm text-muted-foreground">%</p>
          </Card>
        </motion.div>
      )}

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ModuleInsight module="health" customMessage={getInsightMessage()} />
      </motion.div>

      {/* Weight Chart */}
      {weightChartData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Evolução do Peso
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightChartData}>
                  <defs>
                    <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    fill="url(#colorPeso)"
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Measurements List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-accent" />
            Histórico de Medidas
          </h3>
          
          {isLoadingMeasurements ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : bodyMeasurements.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 rounded-2xl bg-accent/10 w-fit mx-auto mb-4">
                <Scale className="h-10 w-10 text-accent" />
              </div>
              <p className="text-muted-foreground">Nenhuma medida registrada</p>
              <p className="text-sm text-muted-foreground mt-1">Clique em "Nova Medição" para começar</p>
            </div>
          ) : (
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {bodyMeasurements.map((measurement, index) => (
                  <motion.div
                    key={measurement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 hover:border-accent/30 transition-all group"
                  >
                    <div>
                      <p className="font-semibold">
                        {format(new Date(measurement.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        {measurement.weight_kg && (
                          <span className="flex items-center gap-1">
                            <Scale className="h-3 w-3" />
                            {Number(measurement.weight_kg).toFixed(1)}kg
                          </span>
                        )}
                        {measurement.waist_cm && (
                          <span className="flex items-center gap-1">
                            <Ruler className="h-3 w-3" />
                            Cintura: {Number(measurement.waist_cm).toFixed(1)}cm
                          </span>
                        )}
                        {measurement.chest_cm && <span>Peito: {Number(measurement.chest_cm).toFixed(1)}cm</span>}
                        {measurement.arm_cm && <span>Braço: {Number(measurement.arm_cm).toFixed(1)}cm</span>}
                        {measurement.body_fat_percent && (
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            {Number(measurement.body_fat_percent).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => deleteBodyMeasurement.mutate(measurement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default BodyMeasurementsManager;
