import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calendar, Zap } from 'lucide-react';

interface StatsChartProps {
  xpHistory?: { date: string; xp: number }[];
  weeklyActivity?: { day: string; tasks: number; habits: number; pomodoro: number }[];
}

// Generate mock data for demonstration (will be replaced with real data)
const generateMockXPHistory = () => {
  const today = new Date();
  const data = [];
  let cumulative = 0;
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dailyXP = Math.floor(Math.random() * 100) + 20;
    cumulative += dailyXP;
    data.push({
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      xp: dailyXP,
      total: cumulative,
    });
  }
  return data;
};

const generateMockWeeklyActivity = () => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days.map(day => ({
    day,
    tasks: Math.floor(Math.random() * 8) + 1,
    habits: Math.floor(Math.random() * 6) + 1,
    pomodoro: Math.floor(Math.random() * 4),
  }));
};

const StatsChart: React.FC<StatsChartProps> = () => {
  const xpData = generateMockXPHistory();
  const weeklyData = generateMockWeeklyActivity();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs text-muted-foreground">
              {entry.name}: <span className="text-accent font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const COLORS = {
    tasks: 'hsl(var(--accent))',
    habits: 'hsl(var(--success))',
    pomodoro: 'hsl(var(--warning))',
  };

  return (
    <Card className="p-6 bg-card border-border">
      <Tabs defaultValue="xp" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Estatísticas
          </h3>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="xp" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              XP
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Atividade
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="xp" className="mt-4">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="xp" 
                  name="XP Ganho"
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  fill="url(#xpGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="text-center">
              <p className="text-lg font-bold text-accent">
                {xpData.reduce((acc, d) => acc + d.xp, 0)}
              </p>
              <p className="text-xs text-muted-foreground">XP Total (14 dias)</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-lg font-bold text-success">
                {Math.round(xpData.reduce((acc, d) => acc + d.xp, 0) / 14)}
              </p>
              <p className="text-xs text-muted-foreground">Média Diária</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tasks" name="Tarefas" fill={COLORS.tasks} radius={[2, 2, 0, 0]} />
                <Bar dataKey="habits" name="Hábitos" fill={COLORS.habits} radius={[2, 2, 0, 0]} />
                <Bar dataKey="pomodoro" name="Pomodoro" fill={COLORS.pomodoro} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-accent" />
              <span className="text-muted-foreground">Tarefas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-success" />
              <span className="text-muted-foreground">Hábitos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-warning" />
              <span className="text-muted-foreground">Pomodoro</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default StatsChart;
