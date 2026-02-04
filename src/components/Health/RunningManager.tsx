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
import { Plus, TrendingUp, Timer, MapPin, Trash2, Activity, Zap, Award } from 'lucide-react';
import { useHealth } from '@/hooks/useHealth';
import { useGamification } from '@/hooks/useGamification';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const RunningManager = () => {
  const { 
    runningSessions, 
    isLoadingRunning, 
    addRunningSession, 
    deleteRunningSession,
    runningStats 
  } = useHealth();
  
  const { rewardRunningSession } = useGamification();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    distance_km: '',
    duration_minutes: '',
    terrain: 'asfalto',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addRunningSession.mutate({
      date: formData.date,
      distance_km: parseFloat(formData.distance_km),
      duration_minutes: parseInt(formData.duration_minutes),
      terrain: formData.terrain,
      notes: formData.notes || null,
      pace: null,
    }, {
      onSuccess: () => {
        rewardRunningSession();
      }
    });
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      distance_km: '',
      duration_minutes: '',
      terrain: 'asfalto',
      notes: '',
    });
    setIsOpen(false);
  };

  const formatPace = (pace: number | null) => {
    if (!pace) return '-';
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const chartData = [...runningSessions]
    .reverse()
    .slice(-10)
    .map(session => ({
      date: format(new Date(session.date), 'dd/MM'),
      km: Number(session.distance_km),
      pace: Number(session.pace) || 0,
    }));

  const getInsightMessage = () => {
    if (runningSessions.length === 0) return 'Registre sua primeira corrida e inicie sua jornada de transformação!';
    if (runningStats.totalKm >= 100) return `Incrível! Você já correu ${runningStats.totalKm.toFixed(0)}km. Verdadeiro atleta!`;
    if (runningStats.totalSessions >= 20) return `${runningStats.totalSessions} corridas registradas! Consistência é a chave.`;
    if (runningStats.bestPace) return `Seu melhor pace é ${formatPace(runningStats.bestPace)} min/km. Continue evoluindo!`;
    return 'Cada corrida conta. Mantenha o ritmo e supere seus limites!';
  };

  const getTerrainColor = (terrain: string) => {
    const colors: Record<string, string> = {
      'asfalto': 'bg-slate-500/20 text-slate-400',
      'trilha': 'bg-green-500/20 text-green-400',
      'pista': 'bg-orange-500/20 text-orange-400',
      'esteira': 'bg-blue-500/20 text-blue-400',
      'areia': 'bg-yellow-500/20 text-yellow-400',
    };
    return colors[terrain] || 'bg-muted text-muted-foreground';
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
              <Activity className="h-8 w-8 text-accent" />
            </div>
            Corridas
          </h1>
          <p className="text-muted-foreground mt-1">
            Rastreie seu progresso e evolua constantemente
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Nova Corrida
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Corrida</DialogTitle>
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
                  <Label htmlFor="distance">Distância (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.01"
                    placeholder="5.00"
                    value={formData.distance_km}
                    onChange={(e) => setFormData(prev => ({ ...prev, distance_km: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duração (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="terrain">Terreno</Label>
                <Select value={formData.terrain} onValueChange={(value) => setFormData(prev => ({ ...prev, terrain: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asfalto">Asfalto</SelectItem>
                    <SelectItem value="trilha">Trilha</SelectItem>
                    <SelectItem value="pista">Pista</SelectItem>
                    <SelectItem value="esteira">Esteira</SelectItem>
                    <SelectItem value="areia">Areia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Como foi a corrida?"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={addRunningSession.isPending}>
                Salvar Corrida
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
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Distância Total</p>
            <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <MapPin className="h-4 w-4 text-accent" />
            </div>
          </div>
          <p className="text-3xl font-bold">{runningStats.totalKm.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">quilômetros</p>
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Corridas</p>
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{runningStats.totalSessions}</p>
          <p className="text-sm text-muted-foreground">sessões</p>
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-accent/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Pace Médio</p>
            <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <Timer className="h-4 w-4 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">{formatPace(runningStats.averagePace)}</p>
          <p className="text-sm text-muted-foreground">min/km</p>
        </Card>

        <Card className="p-5 bg-card/50 backdrop-blur border-border/50 hover:border-green-500/30 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">Melhor Pace</p>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <Award className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-500">{formatPace(runningStats.bestPace)}</p>
          <p className="text-sm text-muted-foreground">min/km</p>
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

      {/* Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Evolução de Distância
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="km" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    fill="url(#colorKm)"
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Sessions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Histórico de Corridas
          </h3>
          
          {isLoadingRunning ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : runningSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 rounded-2xl bg-accent/10 w-fit mx-auto mb-4">
                <Activity className="h-10 w-10 text-accent" />
              </div>
              <p className="text-muted-foreground">Nenhuma corrida registrada</p>
              <p className="text-sm text-muted-foreground mt-1">Clique em "Nova Corrida" para começar</p>
            </div>
          ) : (
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {runningSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 hover:border-accent/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg">{Number(session.distance_km).toFixed(2)} km</p>
                          <Badge className={getTerrainColor(session.terrain || 'asfalto')}>
                            {session.terrain}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(session.date), "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold">{session.duration_minutes} min</p>
                        <p className="text-sm text-accent">{formatPace(Number(session.pace))} min/km</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={() => deleteRunningSession.mutate(session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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

export default RunningManager;
