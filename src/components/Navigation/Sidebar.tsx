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
  Zap,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'tasks', label: 'Tarefas', icon: CheckCircle2, badge: '8' },
    { id: 'habits', label: 'Hábitos', icon: Target, badge: null },
    { id: 'notes', label: 'Segundo Cérebro', icon: Brain, badge: null },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer, badge: null },
    { id: 'calendar', label: 'Agenda', icon: Calendar, badge: '3' },
  ];

  const lifeAreaItems = [
    { id: 'goals', label: 'Metas & Objetivos', icon: Award, badge: null },
    { id: 'studies', label: 'Estudos', icon: BookOpen, badge: null },
    { id: 'finance', label: 'Finanças', icon: DollarSign, badge: null },
    { id: 'fitness', label: 'Treinos', icon: Dumbbell, badge: null },
    { id: 'nutrition', label: 'Dieta', icon: Utensils, badge: null },
    { id: 'analytics', label: 'Relatórios', icon: TrendingUp, badge: null },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Configurações', icon: Settings, badge: null },
    { id: 'profile', label: 'Perfil', icon: User, badge: null },
    { id: 'help', label: 'Ajuda', icon: HelpCircle, badge: null },
  ];

  const renderNavItem = (item: typeof mainNavItems[0], isActive: boolean) => (
    <Button
      key={item.id}
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start h-10 px-3 text-left font-normal',
        isActive && 'bg-primary/20 text-primary border-primary/30'
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
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Alta Per4mance
            </h2>
            <p className="text-xs text-muted-foreground">Sistema de Produtividade</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Principal
            </h3>
          </div>
          {mainNavItems.map((item) => renderNavItem(item, activeSection === item.id))}
        </div>

        <Separator className="mx-3" />

        {/* Life Areas */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Áreas da Vida
            </h3>
          </div>
          {lifeAreaItems.map((item) => renderNavItem(item, activeSection === item.id))}
        </div>

        <Separator className="mx-3" />

        {/* Premium Upgrade Card */}
        <div className="p-3">
          <div className="mx-3 p-4 rounded-lg gradient-primary">
            <div className="text-white space-y-2">
              <h4 className="font-semibold text-sm">Upgrade para Pro</h4>
              <p className="text-xs opacity-90">
                Desbloqueie AI Coach avançado, integrações ilimitadas e mais.
              </p>
              <Button variant="secondary" size="sm" className="w-full mt-2 text-primary">
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-white text-sm font-semibold">VR</span>
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