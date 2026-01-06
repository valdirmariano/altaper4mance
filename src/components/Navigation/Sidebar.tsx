import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown, ChevronRight, ChevronLeft, PanelLeftClose, PanelLeft } from 'lucide-react';
import {
  Home,
  CheckSquare,
  Target,
  FolderOpen,
  BookOpen,
  CalendarDays,
  Dumbbell,
  Utensils,
  TrendingUp,
  Plane,
  Film,
  BookMarked,
  DollarSign,
  Users,
  FileText,
  BarChart3,
  StickyNote,
  Brain,
  Headphones,
  Timer,
  LayoutGrid,
  Heart,
  Lightbulb,
  Settings,
  User,
  HelpCircle,
  Zap,
  Award,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({ activeSection, onSectionChange, isCollapsed = false, onToggleCollapse }: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['personal', 'professional', 'tools']);

  const toggleSection = (section: string) => {
    if (isCollapsed) return;
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const personalItems = [
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare, badge: '5' },
    { id: 'projects', label: 'Projetos', icon: FolderOpen },
    { id: 'skills', label: 'Habilidades', icon: Award },
    { id: 'diary', label: 'Diário', icon: CalendarDays },
    { id: 'running', label: 'Corrida', icon: TrendingUp },
    { id: 'workout', label: 'Treino', icon: Dumbbell },
    { id: 'diet', label: 'Dieta', icon: Utensils },
    { id: 'studies', label: 'Estudos', icon: BookOpen },
    { id: 'books', label: 'Livros', icon: BookMarked },
    { id: 'travel', label: 'Viagens', icon: Plane },
    { id: 'movies', label: 'Filmes e Séries', icon: Film },
  ];

  const professionalItems = [
    { id: 'finance', label: 'Finanças', icon: DollarSign },
    { id: 'crm', label: 'CRM', icon: Users },
    { id: 'content', label: 'Planejador de Conteúdo', icon: FileText },
    { id: 'competition', label: 'Análise de Concorrência', icon: BarChart3 },
    { id: 'proposal', label: 'Modelo de Proposta', icon: FileText },
    { id: 'resume', label: 'Modelo de Currículo', icon: User },
  ];

  const toolsItems = [
    { id: 'quicknotes', label: 'Anotações Rápidas', icon: StickyNote },
    { id: 'notebook', label: 'Caderno de Anotações', icon: BookOpen },
    { id: 'secondbrain', label: 'Segundo Cérebro', icon: Brain },
    { id: 'soundscapes', label: 'Paisagens Sonoras', icon: Headphones },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
    { id: 'eisenhower', label: 'Matriz de Eisenhower', icon: LayoutGrid },
    { id: 'lifewheel', label: 'Roda da Vida', icon: Heart },
    { id: 'ikigai', label: 'Ikigai', icon: Lightbulb },
  ];

  const renderNavItem = (item: { id: string; label: string; icon: React.ElementType; badge?: string }, isActive: boolean) => {
    const content = (
      <Button
        key={item.id}
        variant="ghost"
        className={cn(
          'w-full h-9 px-3 font-normal text-sm',
          isCollapsed ? 'justify-center' : 'justify-start text-left',
          isActive 
            ? 'bg-primary/10 text-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
        onClick={() => onSectionChange(item.id)}
      >
        <item.icon className={cn("h-4 w-4 shrink-0", !isCollapsed && "mr-3")} />
        {!isCollapsed && (
          <>
            <span className="truncate flex-1">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs h-5 min-w-5 px-1.5 bg-muted text-muted-foreground">
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
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              {item.label}
              {item.badge && <Badge variant="secondary" className="text-xs">{item.badge}</Badge>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  const renderSection = (
    title: string, 
    sectionId: string, 
    items: typeof personalItems,
    icon: React.ElementType
  ) => {
    const Icon = icon;
    const isExpanded = expandedSections.includes(sectionId) && !isCollapsed;
    
    if (isCollapsed) {
      return (
        <div className="space-y-1 py-2">
          {items.map((item) => renderNavItem(item, activeSection === item.id))}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <button
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">{title}</span>
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
        {isExpanded && (
          <div className="space-y-0.5 pl-2">
            {items.map((item) => renderNavItem(item, activeSection === item.id))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-full"
    )}>
      {/* Header */}
      <div className={cn("border-b border-border", isCollapsed ? "p-3" : "p-5")}>
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
          <div className={cn(
            "rounded-lg bg-foreground flex items-center justify-center shrink-0",
            isCollapsed ? "w-8 h-8" : "w-9 h-9"
          )}>
            <Zap className={cn("text-background", isCollapsed ? "h-4 w-4" : "h-5 w-5")} />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-base tracking-tight truncate">
                Alta Per4mance
              </h2>
              <p className="text-xs text-muted-foreground truncate">Sistema de Produtividade</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      {onToggleCollapse && (
        <div className={cn("p-2", isCollapsed ? "flex justify-center" : "flex justify-end")}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Dashboard & AI Links */}
      <div className={cn("space-y-1", isCollapsed ? "p-2" : "p-3")}>
        {isCollapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-center h-10',
                    activeSection === 'dashboard' 
                      ? 'bg-primary/10 text-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                  onClick={() => onSectionChange('dashboard')}
                >
                  <Home className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start h-10 px-3 text-left font-medium',
              activeSection === 'dashboard' 
                ? 'bg-primary/10 text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
            onClick={() => onSectionChange('dashboard')}
          >
            <Home className="h-4 w-4 mr-3" />
            Dashboard
          </Button>
        )}
        
        {/* Per4mance AI - Highlighted */}
        {isCollapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-center h-10 relative overflow-hidden group',
                    activeSection === 'ai' 
                      ? 'bg-accent/20 text-accent border border-accent/30' 
                      : 'text-muted-foreground hover:text-accent hover:bg-accent/10 border border-transparent'
                  )}
                  onClick={() => onSectionChange('ai')}
                >
                  <Sparkles className={cn(
                    "h-4 w-4 transition-all",
                    activeSection === 'ai' ? 'text-accent' : 'group-hover:text-accent'
                  )} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-2">
                Per4mance AI
                <Badge className="text-[10px] px-1.5 h-5 bg-accent text-accent-foreground">IA</Badge>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start h-10 px-3 text-left font-medium relative overflow-hidden group',
              activeSection === 'ai' 
                ? 'bg-accent/20 text-accent border border-accent/30' 
                : 'text-muted-foreground hover:text-accent hover:bg-accent/10 border border-transparent'
            )}
            onClick={() => onSectionChange('ai')}
          >
            <Sparkles className={cn(
              "h-4 w-4 mr-3 transition-all",
              activeSection === 'ai' ? 'text-accent' : 'group-hover:text-accent'
            )} />
            <span className="flex-1">Per4mance AI</span>
            <Badge 
              variant="secondary" 
              className={cn(
                "text-[10px] px-1.5 h-5",
                activeSection === 'ai' ? 'bg-accent text-accent-foreground' : 'bg-accent/20 text-accent'
              )}
            >
              IA
            </Badge>
          </Button>
        )}
      </div>

      <Separator className="mx-3" />

      {/* Main Navigation */}
      <div className={cn("flex-1 overflow-y-auto space-y-4", isCollapsed ? "p-2" : "p-3")}>
        {renderSection('Área Pessoal', 'personal', personalItems, User)}
        {!isCollapsed && <Separator className="mx-0" />}
        {renderSection('Área Profissional', 'professional', professionalItems, BarChart3)}
        {!isCollapsed && <Separator className="mx-0" />}
        {renderSection('Ferramentas', 'tools', toolsItems, Sparkles)}
      </div>

      <Separator className="mx-3" />

      {/* Bottom Navigation */}
      <div className={cn("space-y-0.5", isCollapsed ? "p-2" : "p-3")}>
        {renderNavItem({ id: 'settings', label: 'Configurações', icon: Settings }, activeSection === 'settings')}
        {renderNavItem({ id: 'help', label: 'Ajuda', icon: HelpCircle }, activeSection === 'help')}
      </div>

      {/* User Profile */}
      <div className={cn("border-t border-border", isCollapsed ? "p-2" : "p-4")}>
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
          <div className={cn(
            "rounded-full bg-muted flex items-center justify-center",
            isCollapsed ? "w-8 h-8" : "w-8 h-8"
          )}>
            <span className="text-xs font-medium text-muted-foreground">U</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Usuário</p>
              <p className="text-xs text-muted-foreground truncate">Plano Gratuito</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
