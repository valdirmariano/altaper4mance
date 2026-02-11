import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Zap } from 'lucide-react';

interface StatsChartProps {
  xpHistory?: { date: string; xp: number }[];
  weeklyActivity?: { day: string; tasks: number; habits: number; pomodoro: number }[];
}

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
        <div className="bg-popover/90 backdrop-blur-md border border-border/50 rounded-xl p-3 shadow-xl">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs text-muted-foreground">
              {entry.name}: <span className="text-accent font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
        <Tabs defaultValue="xp" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-accent/15">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold text-sm">Estatísticas</h3>
            </div>
            <TabsList className="bg-muted/30 border border-border/30">
              <TabsTrigger value="xp" className="text-xs data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                <Zap className="h-3 w-3 mr-1" />
                XP
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
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
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="xp" name="XP Ganho" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#xpGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-3">
              <div className="text-center">
                <p className="text-lg font-bold text-accent">{xpData.reduce((acc, d) => acc + d.xp, 0)}</p>
                <p className="text-[11px] text-muted-foreground">XP Total (14 dias)</p>
              </div>
              <div className="h-8 w-px bg-border/30" />
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">{Math.round(xpData.reduce((acc, d) => acc + d.xp, 0) / 14)}</p>
                <p className="text-[11px] text-muted-foreground">Média Diária</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="tasks" name="Tarefas" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="habits" name="Hábitos" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pomodoro" name="Pomodoro" fill="hsl(45 93% 47%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-5 mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="text-muted-foreground">Tarefas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Hábitos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">Pomodoro</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default StatsChart;
