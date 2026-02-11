import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Home, CheckSquare, Target, FolderOpen, BookOpen, CalendarDays, Dumbbell, Utensils, TrendingUp,
  Plane, Film, BookMarked, DollarSign, Users, Brain, Headphones, Timer, Heart, Settings,
  HelpCircle, Zap, Award, Sparkles, Trophy, Flame, Calendar
} from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({ activeSection, onSectionChange, isCollapsed = false, onToggleCollapse }: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['productivity', 'health', 'development']);
  const { stats } = useGamification();

  const toggleSection = (section: string) => {
    if (isCollapsed) return;
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const mainItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
  ];

  const productivityItems = [
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'projects', label: 'Projetos', icon: FolderOpen },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'habits', label: 'Hábitos', icon: Flame },
    { id: 'pomodoro', label: 'Foco', icon: Timer },
  ];

  const healthItems = [
    { id: 'running', label: 'Corrida', icon: TrendingUp },
    { id: 'workout', label: 'Treino', icon: Dumbbell },
    { id: 'measurements', label: 'Medidas', icon: Heart },
    { id: 'diet', label: 'Nutrição', icon: Utensils },
  ];

  const developmentItems = [
    { id: 'studies', label: 'Estudos', icon: BookOpen },
    { id: 'skills', label: 'Habilidades', icon: Award },
    { id: 'secondbrain', label: 'Segundo Cérebro', icon: Brain },
    { id: 'diary', label: 'Diário', icon: CalendarDays },
  ];

  const financeItems = [
    { id: 'finance', label: 'Finanças', icon: DollarSign },
    { id: 'crm', label: 'CRM', icon: Users },
  ];

  const toolsItems = [
    { id: 'gamification', label: 'Conquistas', icon: Trophy },
    { id: 'soundscapes', label: 'Foco Sonoro', icon: Headphones },
    { id: 'books', label: 'Livros', icon: BookMarked },
    { id: 'travel', label: 'Viagens', icon: Plane },
    { id: 'movies', label: 'Entretenimento', icon: Film },
  ];

  const renderNavItem = (
    item: { id: string; label: string; icon: React.ElementType; badge?: string },
    isActive: boolean,
    isMainItem = false
  ) => {
    const IconComponent = item.icon;

    const buttonContent = (
      <Button
        key={item.id}
        variant="ghost"
        className={cn(
          'w-full relative group transition-all duration-200',
          isCollapsed ? 'h-11 w-11 p-0 justify-center mx-auto' : 'h-10 px-3 justify-start',
          isActive
            ? 'bg-accent/10 text-accent'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
          isMainItem && 'font-medium'
        )}
        onClick={() => onSectionChange(item.id)}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-full"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
        <IconComponent className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors",
          !isCollapsed && "mr-3",
          isActive && "text-accent"
        )} />
        {!isCollapsed && (
          <>
            <span className="truncate flex-1 text-left text-[13px]">{item.label}</span>
            {item.badge && (
              <Badge
                variant="secondary"
                className={cn(
                  "ml-auto text-[10px] h-5 min-w-5 px-1.5 font-medium",
                  isActive ? "bg-accent/20 text-accent" : "bg-muted/50 text-muted-foreground"
                )}
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider key={item.id} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
            <TooltipContent side="right" className="bg-popover/90 backdrop-blur-md border-border/50">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return buttonContent;
  };

  const renderSection = (
    title: string,
    sectionId: string,
    items: typeof productivityItems,
    icon: React.ElementType
  ) => {
    const IconComponent = icon;
    const isExpanded = expandedSections.includes(sectionId) && !isCollapsed;

    if (isCollapsed) {
      return (
        <div key={sectionId} className="flex flex-col items-center gap-1 py-2">
          {items.map((item) => renderNavItem(item, activeSection === item.id))}
        </div>
      );
    }

    return (
      <div key={sectionId} className="space-y-0.5">
        <button
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest hover:text-muted-foreground transition-colors"
        >
          <IconComponent className="h-3 w-3" />
          <span className="flex-1 text-left">{title}</span>
          <ChevronDown className={cn(
            "h-3 w-3 transition-transform duration-200",
            !isExpanded && "-rotate-90"
          )} />
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden space-y-0.5"
            >
              {items.map((item) => renderNavItem(item, activeSection === item.id))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background/80 backdrop-blur-md border-r border-border/30 transition-all duration-300 ease-out",
      isCollapsed ? "w-[68px]" : "w-[260px]"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center border-b border-border/20 transition-all duration-300",
        isCollapsed ? "p-3 justify-center" : "p-4 gap-3"
      )}>
        <div className="rounded-xl bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center shrink-0 w-10 h-10 shadow-lg">
          <Zap className="h-5 w-5 text-background" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-[15px] tracking-tight">Alta Per4mance</h2>
            <p className="text-[11px] text-muted-foreground">Sistema de Produtividade</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      {onToggleCollapse && (
        <div className={cn("flex py-2 px-2", isCollapsed ? "justify-center" : "justify-end")}>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/30" onClick={onToggleCollapse}>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Main Nav */}
      <div className={cn("space-y-0.5", isCollapsed ? "px-2 py-2" : "px-3 py-2")}>
        {mainItems.map((item) => renderNavItem(item, activeSection === item.id, true))}

        {/* AI Button - Highlighted */}
        {isCollapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-11 h-11 p-0 justify-center mx-auto relative transition-all duration-200',
                    activeSection === 'ai'
                      ? 'bg-accent/15 text-accent border border-accent/30'
                      : 'text-muted-foreground hover:text-accent hover:bg-accent/10'
                  )}
                  onClick={() => onSectionChange('ai')}
                >
                  <Sparkles className="h-[18px] w-[18px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover/90 backdrop-blur-md border-border/50 flex items-center gap-2">
                Parceiro de Responsabilidade
                <Badge className="text-[10px] px-1.5 h-4 bg-accent text-accent-foreground">IA</Badge>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              'w-full h-10 px-3 justify-start relative transition-all duration-200',
              activeSection === 'ai'
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-muted-foreground hover:text-accent hover:bg-accent/10'
            )}
            onClick={() => onSectionChange('ai')}
          >
            {activeSection === 'ai' && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <Sparkles className={cn("h-[18px] w-[18px] mr-3 transition-colors", activeSection === 'ai' && "text-accent")} />
            <span className="flex-1 text-left text-[13px] font-medium">Parceiro IA</span>
            <Badge className="text-[10px] px-1.5 h-5 bg-accent/15 text-accent border-none">IA</Badge>
          </Button>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

      {/* Sections */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-3 py-2">
          {renderSection('Produtividade', 'productivity', productivityItems, CheckSquare)}
          {renderSection('Saúde & Fitness', 'health', healthItems, Heart)}
          {renderSection('Desenvolvimento', 'development', developmentItems, Brain)}
          {renderSection('Finanças', 'finance', financeItems, DollarSign)}
          {renderSection('Ferramentas', 'tools', toolsItems, Sparkles)}
        </div>
      </ScrollArea>

      {/* Divider */}
      <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

      {/* Bottom Nav */}
      <div className={cn("space-y-0.5 pb-2", isCollapsed ? "px-2" : "px-3")}>
        {renderNavItem({ id: 'settings', label: 'Configurações', icon: Settings }, activeSection === 'settings')}
        {renderNavItem({ id: 'help', label: 'Ajuda', icon: HelpCircle }, activeSection === 'help')}
      </div>

      {/* User Footer */}
      <div className={cn("border-t border-border/20 transition-all duration-300", isCollapsed ? "p-2" : "p-3")}>
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-xl bg-muted/20 transition-all duration-300",
          isCollapsed && "justify-center"
        )}>
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
              <span className="text-xs font-semibold text-accent">U</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center border-2 border-background">
              {stats.level}
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Usuário</p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-yellow-400" />
                  <span>{stats.streak}d</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-accent" />
                  <span>{stats.xp} XP</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
