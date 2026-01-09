import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGamification } from '@/hooks/useGamification';
import { 
  Flame, 
  Zap, 
  Trophy, 
  Star, 
  Target,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  Medal
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
      <Card className="p-6 bg-card border-border animate-pulse">
        <div className="h-32 bg-muted rounded-lg" />
      </Card>
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

  const getLevelColor = (level: number) => {
    if (level < 5) return 'text-muted-foreground';
    if (level < 10) return 'text-success';
    if (level < 20) return 'text-accent';
    if (level < 30) return 'text-warning';
    if (level < 50) return 'text-orange-500';
    return 'text-purple-500';
  };

  return (
    <div className="space-y-6">
      {/* Level & XP Card */}
      <Card className="p-6 bg-gradient-to-br from-card to-muted/30 border-border overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-warning/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-4 border-accent flex items-center justify-center bg-accent/10`}>
                  <span className="text-2xl font-bold text-accent">{stats.level}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground rounded-full p-1">
                  <Zap className="h-3 w-3" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{getLevelTitle(stats.level)}</h3>
                <p className={`text-sm ${getLevelColor(stats.level)}`}>Nível {stats.level}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 text-warning">
                <Flame className="h-5 w-5 animate-pulse" />
                <span className="text-2xl font-bold">{stats.streak}</span>
              </div>
              <p className="text-xs text-muted-foreground">dias seguidos</p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso XP</span>
              <span className="font-medium">{currentLevelXP} / {xpToNextLevel}</span>
            </div>
            <div className="relative">
              <Progress value={xpProgress} className="h-3" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-medium text-accent-foreground/80">
                  {Math.round(xpProgress)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Faltam {xpToNextLevel - currentLevelXP} XP para o próximo nível
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 bg-card border-border text-center">
          <Zap className="h-6 w-6 text-accent mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.xp}</p>
          <p className="text-xs text-muted-foreground">XP Total</p>
        </Card>
        
        <Card className="p-4 bg-card border-border text-center">
          <Trophy className="h-6 w-6 text-warning mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.level}</p>
          <p className="text-xs text-muted-foreground">Nível</p>
        </Card>
        
        <Card className="p-4 bg-card border-border text-center">
          <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.streak}</p>
          <p className="text-xs text-muted-foreground">Streak</p>
        </Card>
        
        <Card className="p-4 bg-card border-border text-center">
          <Medal className="h-6 w-6 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{unlockedBadges.length}</p>
          <p className="text-xs text-muted-foreground">Badges</p>
        </Card>
      </div>

      {/* Badges Section */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-accent" />
          <h3 className="font-semibold">Conquistas</h3>
          <Badge variant="secondary" className="ml-auto">
            {unlockedBadges.length}/{allBadges.length}
          </Badge>
        </div>

        {/* Unlocked Badges */}
        {unlockedBadges.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Desbloqueadas</p>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                {unlockedBadges.map((badge) => (
                  <Tooltip key={badge.id}>
                    <TooltipTrigger asChild>
                      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform">
                        {badge.icon}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-semibold">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                        <p className="text-xs text-accent mt-1">
                          Desbloqueado em {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
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
          <p className="text-xs text-muted-foreground mb-2">Bloqueadas</p>
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              {lockedBadges.map((badge) => (
                <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-2xl opacity-40 grayscale cursor-pointer hover:opacity-60 transition-opacity">
                      {badge.icon}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      <p className="text-xs text-warning mt-1">🔒 Bloqueado</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </Card>

      {/* Missions/Challenges */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-success" />
          <h3 className="font-semibold">Missões Semanais</h3>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Completar 20 tarefas</span>
              <Badge variant="outline" className="text-xs">+300 XP</Badge>
            </div>
            <Progress value={35} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">7/20 tarefas</p>
          </div>

          <div className="p-3 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Manter streak por 7 dias</span>
              <Badge variant="outline" className="text-xs">+200 XP</Badge>
            </div>
            <Progress value={(stats.streak / 7) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{stats.streak}/7 dias</p>
          </div>

          <div className="p-3 rounded-lg border border-border bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Completar hábitos 6 dias</span>
              <Badge variant="outline" className="text-xs">+150 XP</Badge>
            </div>
            <Progress value={50} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">3/6 dias perfeitos</p>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Dica do Coach IA</p>
            <p className="text-xs text-muted-foreground mt-1">
              Complete todos os hábitos do dia para ganhar 50 XP de bônus! Você está a {7 - stats.streak} dias de desbloquear o badge "Incandescente".
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GamificationPanel;
