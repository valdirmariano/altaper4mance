import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, TrendingUp, Timer, MapPin, Trash2, Activity } from 'lucide-react';
import { useHealth } from '@/hooks/useHealth';
import { useGamification } from '@/hooks/useGamification';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    return `${minutes}:${seconds.toString().padStart(2, '0')} min/km`;
  };

  const chartData = [...runningSessions]
    .reverse()
    .slice(-10)
    .map(session => ({
      date: format(new Date(session.date), 'dd/MM'),
      km: Number(session.distance_km),
      pace: Number(session.pace) || 0,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Corridas
          </h2>
          <p className="text-muted-foreground">Rastreie seu progresso nas corridas</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
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
              <Button type="submit" className="w-full" disabled={addRunningSession.isPending}>
                Salvar Corrida
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="h-4 w-4" />
              <span className="text-xs">Total</span>
            </div>
            <p className="text-2xl font-bold">{runningStats.totalKm.toFixed(1)} km</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Corridas</span>
            </div>
            <p className="text-2xl font-bold">{runningStats.totalSessions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Timer className="h-4 w-4" />
              <span className="text-xs">Pace Médio</span>
            </div>
            <p className="text-2xl font-bold">{formatPace(runningStats.averagePace)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Melhor Pace</span>
            </div>
            <p className="text-2xl font-bold text-primary">{formatPace(runningStats.bestPace)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolução de Distância</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="km" 
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

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de Corridas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingRunning ? (
            <p className="text-muted-foreground text-center py-4">Carregando...</p>
          ) : runningSessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhuma corrida registrada</p>
          ) : (
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {runningSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{Number(session.distance_km).toFixed(2)} km</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(session.date), "dd 'de' MMMM", { locale: ptBR })} • {session.terrain}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{session.duration_minutes} min</p>
                        <p className="text-sm text-muted-foreground">{formatPace(Number(session.pace))}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRunningSession.mutate(session.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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

export default RunningManager;
