import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  CheckCircle2,
  Target,
  Brain,
  Timer,
  Calendar,
  TrendingUp,
  BookOpen,
  DollarSign,
  Dumbbell,
  Utensils,
  Settings,
  User,
  HelpCircle,
  Award,
  Folder,
  Activity,
  Heart,
  BookMarked,
  MapPin,
  Film,
  Users,
  FileText,
  PenTool,
  StickyNote,
  Music,
  Grid3x3,
  Circle,
  Upload
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  // Área Pessoal - Personal Area
  const personalAreaItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'goals', label: 'Metas', icon: Target, badge: null },
    { id: 'tasks', label: 'Tarefas', icon: CheckCircle2, badge: '12' },
    { id: 'projects', label: 'Projetos', icon: Folder, badge: '3' },
    { id: 'skills', label: 'Habilidades', icon: TrendingUp, badge: null },
    { id: 'diary', label: 'Diário', icon: BookMarked, badge: null },
    { id: 'running', label: 'Corrida', icon: Activity, badge: null },
    { id: 'workout', label: 'Treino', icon: Dumbbell, badge: null },
    { id: 'diet', label: 'Dieta', icon: Utensils, badge: null },
    { id: 'studies', label: 'Estudos', icon: BookOpen, badge: null },
    { id: 'books', label: 'Livros', icon: BookMarked, badge: null },
    { id: 'travels', label: 'Viagens', icon: MapPin, badge: null },
    { id: 'movies', label: 'Filmes e Séries', icon: Film, badge: null },
  ];

  // Área Profissional - Professional Area  
  const professionalAreaItems = [
    { id: 'finances', label: 'Finanças', icon: DollarSign, badge: null },
    { id: 'crm', label: 'CRM', icon: Users, badge: null },
    { id: 'content-planner', label: 'Planejador de Conteúdo', icon: Calendar, badge: null },
    { id: 'competition', label: 'Análise de Concorrência', icon: TrendingUp, badge: null },
    { id: 'proposal-template', label: 'Modelo de Proposta', icon: FileText, badge: null },
    { id: 'resume-template', label: 'Modelo de Currículo', icon: User, badge: null },
  ];

  // Área Ferramentas - Tools Area
  const toolsAreaItems = [
    { id: 'quick-notes', label: 'Anotações Rápidas', icon: PenTool, badge: null },
    { id: 'notebooks', label: 'Caderno de Anotações', icon: StickyNote, badge: null },
    { id: 'second-brain', label: 'Segundo Cérebro', icon: Brain, badge: null },
    { id: 'soundscapes', label: 'Paisagens Sonoras', icon: Music, badge: null },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer, badge: null },
    { id: 'eisenhower', label: 'Matriz de Eisenhower', icon: Grid3x3, badge: null },
    { id: 'wheel-of-life', label: 'Roda da Vida', icon: Circle, badge: null },
    { id: 'ikigai', label: 'Ikigai', icon: Heart, badge: null },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Configurações', icon: Settings, badge: null },
    { id: 'help', label: 'Ajuda', icon: HelpCircle, badge: null },
  ];

  const renderNavItem = (item: typeof personalAreaItems[0], isActive: boolean) => (
    <Button
      key={item.id}
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start h-10 px-3 text-left font-normal',
        isActive && 'bg-secondary/20 text-foreground border-secondary/30'
      )}
      onClick={() => onSectionChange(item.id)}
    >
      <item.icon className="h-4 w-4 mr-3 shrink-0" />
      <span className="truncate flex-1">{item.label}</span>
      {item.badge && (
        <Badge variant="secondary" className="ml-auto text-xs h-5 min-w-5 px-1">
          {item.badge}
        </Badge>
      )}
    </Button>
  );

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Upload className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">
              Alta Per4mance
            </h2>
            <p className="text-xs text-muted-foreground">Sistema de Produtividade</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Área Pessoal */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Área Pessoal
            </h3>
          </div>
          {personalAreaItems.map((item) => renderNavItem(item, activeSection === item.id))}
        </div>

        <Separator className="mx-3" />

        {/* Área Profissional */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Área Profissional
            </h3>
          </div>
          {professionalAreaItems.map((item) => renderNavItem(item, activeSection === item.id))}
        </div>

        <Separator className="mx-3" />

        {/* Área Ferramentas */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ferramentas
            </h3>
          </div>
          {toolsAreaItems.map((item) => renderNavItem(item, activeSection === item.id))}
        </div>

        <Separator className="mx-3" />

        {/* Premium Upgrade Card */}
        <div className="p-3">
          <div className="mx-3 p-4 rounded-lg bg-primary">
            <div className="text-primary-foreground space-y-2">
              <h4 className="font-semibold text-sm">Upgrade para Pro</h4>
              <p className="text-xs opacity-90">
                Desbloqueie funcionalidades avançadas e integrações ilimitadas.
              </p>
              <Button variant="secondary" size="sm" className="w-full mt-2">
                Fazer Upgrade
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-border space-y-1">
        {bottomItems.map((item) => renderNavItem(item, activeSection === item.id))}
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-semibold">VP</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Usuário Demo</p>
            <p className="text-xs text-muted-foreground truncate">Plano Gratuito</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;