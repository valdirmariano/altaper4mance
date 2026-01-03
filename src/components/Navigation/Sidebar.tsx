import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
  Droplets,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['personal', 'professional', 'tools']);

  const toggleSection = (section: string) => {
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

  const renderNavItem = (item: { id: string; label: string; icon: React.ElementType; badge?: string }, isActive: boolean) => (
    <Button
      key={item.id}
      variant="ghost"
      className={cn(
        'w-full justify-start h-9 px-3 text-left font-normal text-sm',
        isActive 
          ? 'bg-primary/10 text-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
      onClick={() => onSectionChange(item.id)}
    >
      <item.icon className="h-4 w-4 mr-3 shrink-0" />
      <span className="truncate flex-1">{item.label}</span>
      {item.badge && (
        <Badge variant="secondary" className="ml-auto text-xs h-5 min-w-5 px-1.5 bg-muted text-muted-foreground">
          {item.badge}
        </Badge>
      )}
    </Button>
  );

  const renderSection = (
    title: string, 
    sectionId: string, 
    items: typeof personalItems,
    icon: React.ElementType
  ) => {
    const Icon = icon;
    const isExpanded = expandedSections.includes(sectionId);
    
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
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center">
            <Zap className="h-5 w-5 text-background" />
          </div>
          <div>
            <h2 className="font-semibold text-base tracking-tight">
              Alta Per4mance
            </h2>
            <p className="text-xs text-muted-foreground">Sistema de Produtividade</p>
          </div>
        </div>
      </div>

      {/* Dashboard Link */}
      <div className="p-3">
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
      </div>

      <Separator className="mx-3" />

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {renderSection('Área Pessoal', 'personal', personalItems, User)}
        {renderSection('Área Profissional', 'professional', professionalItems, BarChart3)}
        {renderSection('Ferramentas', 'tools', toolsItems, Sparkles)}
      </div>

      <Separator className="mx-3" />

      {/* Bottom Navigation */}
      <div className="p-3 space-y-0.5">
        {renderNavItem({ id: 'settings', label: 'Configurações', icon: Settings }, activeSection === 'settings')}
        {renderNavItem({ id: 'help', label: 'Ajuda', icon: HelpCircle }, activeSection === 'help')}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Usuário</p>
            <p className="text-xs text-muted-foreground truncate">Plano Gratuito</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
