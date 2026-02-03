import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  Flame, 
  Target, 
  TrendingUp, 
  Trophy,
  Lightbulb,
  Heart,
  Zap,
  MessageSquare,
  CheckSquare,
  DollarSign,
  Dumbbell
} from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';

interface InsightCardProps {
  type: 'motivation' | 'tip' | 'celebration' | 'reminder' | 'challenge';
  title: string;
  message: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  type, 
  title, 
  message, 
  icon: Icon = Sparkles,
  action,
  onDismiss 
}) => {
  const typeStyles = {
    motivation: 'from-accent/20 to-accent/5 border-accent/30',
    tip: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
    celebration: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
    reminder: 'from-orange-500/20 to-orange-500/5 border-orange-500/30',
    challenge: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
  };

  const iconColors = {
    motivation: 'text-accent',
    tip: 'text-blue-400',
    celebration: 'text-yellow-400',
    reminder: 'text-orange-400',
    challenge: 'text-purple-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className={cn(
        "relative overflow-hidden p-4 border bg-gradient-to-br backdrop-blur-sm",
        typeStyles[type]
      )}>
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/5 to-transparent opacity-50" />
        
        {/* Dismiss button */}
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground/50 hover:text-foreground"
            onClick={onDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        <div className="flex gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            "bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
          )}>
            <Icon className={cn("h-5 w-5", iconColors[type])} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-semibold text-foreground">{title}</h4>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-white/20">
                Parceiro IA
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {message}
            </p>

            {action && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 h-8 px-3 text-xs font-medium hover:bg-white/10"
                onClick={action.onClick}
              >
                {action.label}
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Floating Motivation Widget for Dashboard
export const FloatingInsight: React.FC<{
  onNavigateToAI: () => void;
}> = ({ onNavigateToAI }) => {
  const { stats } = useGamification();
  const { tasks } = useTasks();
  const { habits, getCompletedTodayCount } = useHabits();
  const { goals } = useGoals();
  
  const [currentInsight, setCurrentInsight] = useState<InsightCardProps | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Generate contextual insights based on user data
    const generateInsight = () => {
      const completedHabits = getCompletedTodayCount();
      const totalHabits = habits.length;
      const pendingTasks = tasks.filter(t => t.status !== 'done').length;
      const activeGoals = goals.filter(g => g.status === 'ativo' || g.status === 'em_progresso').length;
      const hour = new Date().getHours();

      // Morning motivation
      if (hour >= 6 && hour < 12) {
        if (completedHabits === 0 && totalHabits > 0) {
          return {
            type: 'motivation' as const,
            title: 'Bom dia! 🌅',
            message: `Você tem ${totalHabits} hábitos para conquistar hoje. Cada pequeno passo conta. Comece pelo mais fácil!`,
            icon: Flame,
          };
        }
      }

      // Streak celebration
      if (stats.streak >= 7) {
        return {
          type: 'celebration' as const,
          title: `${stats.streak} dias de sequência! 🔥`,
          message: 'Sua consistência é inspiradora. Você está construindo hábitos que vão transformar sua vida.',
          icon: Trophy,
        };
      }

      // Habit progress
      if (completedHabits > 0 && completedHabits < totalHabits) {
        const remaining = totalHabits - completedHabits;
        return {
          type: 'tip' as const,
          title: 'Você está no caminho certo!',
          message: `${completedHabits}/${totalHabits} hábitos concluídos. Faltam apenas ${remaining}. Você consegue!`,
          icon: Target,
        };
      }

      // All habits done
      if (completedHabits === totalHabits && totalHabits > 0) {
        return {
          type: 'celebration' as const,
          title: 'Dia perfeito! 🎉',
          message: 'Você completou todos os hábitos de hoje. Sua dedicação está rendendo frutos!',
          icon: Trophy,
        };
      }

      // Task reminder
      if (pendingTasks > 5) {
        return {
          type: 'reminder' as const,
          title: 'Organize seu dia',
          message: `Você tem ${pendingTasks} tarefas pendentes. Priorize as 3 mais importantes e foque nelas.`,
          icon: Lightbulb,
        };
      }

      // Goal progress
      if (activeGoals > 0) {
        return {
          type: 'challenge' as const,
          title: 'Suas metas estão te esperando',
          message: `Você tem ${activeGoals} metas ativas. Cada ação de hoje te aproxima delas.`,
          icon: TrendingUp,
        };
      }

      // Default motivation
      return {
        type: 'motivation' as const,
        title: 'Lembre-se do seu propósito',
        message: 'O sucesso é a soma de pequenos esforços repetidos dia após dia. Continue avançando!',
        icon: Heart,
      };
    };

    if (!dismissed) {
      setCurrentInsight(generateInsight());
    }
  }, [stats, tasks, habits, goals, dismissed, getCompletedTodayCount]);

  if (dismissed || !currentInsight) return null;

  return (
    <div className="mb-6">
      <InsightCard
        {...currentInsight}
        onDismiss={() => setDismissed(true)}
        action={{
          label: 'Conversar com Parceiro IA',
          onClick: onNavigateToAI
        }}
      />
    </div>
  );
};

// Mini floating button for quick access
export const AccountabilityButton: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  const { stats } = useGamification();
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "w-14 h-14 rounded-2xl",
        "bg-gradient-to-br from-accent to-accent/80",
        "flex items-center justify-center",
        "shadow-lg shadow-accent/30",
        "border border-accent/50",
        "hover:shadow-xl hover:shadow-accent/40",
        "transition-shadow duration-300"
      )}
    >
      <div className="relative">
        <Sparkles className="h-6 w-6 text-accent-foreground" />
        {stats.streak > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-warning text-[10px] font-bold text-warning-foreground flex items-center justify-center border-2 border-background">
            {stats.streak}
          </div>
        )}
      </div>
    </motion.button>
  );
};

// Inline insights for specific modules
export const ModuleInsight: React.FC<{
  module: 'tasks' | 'habits' | 'goals' | 'finance' | 'workout';
  data?: Record<string, unknown>;
  customMessage?: string;
}> = ({ module, data, customMessage }) => {
  const getModuleInsight = () => {
    switch (module) {
      case 'tasks':
        return {
          icon: CheckSquare,
          message: 'Divida tarefas grandes em subtarefas menores. Cada check é uma vitória!',
        };
      case 'habits':
        return {
          icon: Flame,
          message: 'A consistência supera a intensidade. Um hábito por vez, um dia por vez.',
        };
      case 'goals':
        return {
          icon: Target,
          message: 'Metas claras levam a resultados claros. Visualize o sucesso.',
        };
      case 'finance':
        return {
          icon: DollarSign,
          message: 'Controle financeiro é liberdade. Cada real conta.',
        };
      case 'workout':
        return {
          icon: Dumbbell,
          message: 'Seu único competidor é quem você foi ontem. Supere-se!',
        };
      default:
        return null;
    }
  };

  const insight = getModuleInsight();
  if (!insight) return null;

  const displayMessage = customMessage || insight.message;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20 backdrop-blur-sm"
    >
      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
        <Sparkles className="h-5 w-5 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground/90 leading-relaxed">
          "{displayMessage}"
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">— Parceiro de Responsabilidade</p>
      </div>
    </motion.div>
  );
};

export default InsightCard;
