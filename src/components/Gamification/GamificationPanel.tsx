import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGamification } from '@/hooks/useGamification';
import StatsChart from './StatsChart';
import WeeklyMissions from './WeeklyMissions';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Zap, 
  Trophy, 
  Award,
  Sparkles,
  Medal,
  TrendingUp,
  Target
} from 'lucide-react';

const GamificationPanel = () => {
  const { 
    stats, 
    loading, 
    xpToNextLevel, 
    currentLevelXP, 
    xpProgress,
    allBadges 
  } = useGamification();

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-card/50 rounded-2xl animate-pulse border border-border/50" />
        ))}
      </div>
    );
  }

  const unlockedBadges = stats.badges;
  const lockedBadges = allBadges.filter(b => !unlockedBadges.find(ub => ub.id === b.id));

  const getLevelTitle = (level: number) => {
    if (level < 5) return 'Novato';
    if (level < 10) return 'Aprendiz';
    if (level < 20) return 'Intermediário';
    if (level < 30) return 'Avançado';
    if (level < 50) return 'Expert';
    return 'Mestre';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const statCards = [
    { icon: Zap, label: 'XP Total', value: stats.xp, color: 'text-accent' },
    { icon: Trophy, label: 'Nível', value: stats.level, color: 'text-accent' },
    { icon: Flame, label: 'Streak', value: stats.streak, color: 'text-accent' },
    { icon: Medal, label: 'Badges', value: unlockedBadges.length, color: 'text-accent' },
  ];

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Level & XP Hero Card */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl border-2 border-accent/30 bg-accent/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent">{stats.level}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground rounded-lg p-1">
                    <Zap className="h-3 w-3" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{getLevelTitle(stats.level)}</h3>
                  <p className="text-sm text-muted-foreground">Nível {stats.level}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 text-accent">
                  <Flame className="h-5 w-5" />
                  <span className="text-2xl font-bold">{stats.streak}</span>
                </div>
                <p className="text-xs text-muted-foreground">dias seguidos</p>
              </div>
            </div>

            {/* XP Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso XP</span>
                <span className="font-medium text-accent">{currentLevelXP} / {xpToNextLevel}</span>
              </div>
              <div className="relative">
                <Progress value={xpProgress} className="h-3" />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Faltam <span className="text-accent font-medium">{xpToNextLevel - currentLevelXP} XP</span> para o próximo nível
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-4 bg-card/50 backdrop-blur-sm border-border/50 text-center group hover:border-accent/30 transition-colors">
            <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </motion.div>

      {/* Badges Section */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-2 mb-5">
            <Award className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Conquistas</h3>
            <Badge variant="outline" className="ml-auto border-accent/30 text-accent text-xs">
              {unlockedBadges.length}/{allBadges.length}
            </Badge>
          </div>

          {/* Unlocked Badges */}
          {unlockedBadges.length > 0 && (
            <div className="mb-5">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Desbloqueadas</p>
              <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                  {unlockedBadges.map((badge) => (
                    <Tooltip key={badge.id}>
                      <TooltipTrigger asChild>
                        <motion.div 
                          whileHover={{ scale: 1.15 }}
                          className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-2xl cursor-pointer"
                        >
                          {badge.icon}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-semibold">{badge.name}</p>
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                          <p className="text-xs text-accent mt-1">
                            {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>
          )}

          {/* Locked Badges */}
          <div>
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Bloqueadas</p>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                {lockedBadges.map((badge) => (
                  <Tooltip key={badge.id}>
                    <TooltipTrigger asChild>
                      <div className="w-12 h-12 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-center text-2xl opacity-30 grayscale cursor-pointer hover:opacity-50 transition-opacity">
                        {badge.icon}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-semibold">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                        <p className="text-xs text-accent mt-1">🔒 Bloqueado</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Weekly Missions */}
      <motion.div variants={itemVariants}>
        <WeeklyMissions />
      </motion.div>

      {/* Stats Chart */}
      <motion.div variants={itemVariants}>
        <StatsChart />
      </motion.div>

      {/* AI Coach Tip */}
      <motion.div variants={itemVariants}>
        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Dica do Coach IA</p>
              <p className="text-xs text-muted-foreground mt-1">
                Complete todos os hábitos do dia para ganhar <span className="text-accent font-medium">50 XP</span> de bônus! 
                Você está a {Math.max(0, 7 - stats.streak)} dias de desbloquear o badge "Incandescente".
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default GamificationPanel;
