import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from '../Navigation/Sidebar';
import Dashboard from '../Dashboard';
import TaskManager from '../Tasks/TaskManager';
import GoalsManager from '../Goals/GoalsManager';
import ProjectsManager from '../Projects/ProjectsManager';
import DiaryManager from '../Diary/DiaryManager';
import FinanceManager from '../Finance/FinanceManager';
import StudiesManager from '../Studies/StudiesManager';
import PomodoroTimer from '../Tools/PomodoroTimer';
import SecondBrain from '../Tools/SecondBrain';
import HabitsManager from '../Habits/HabitsManager';
import GamificationPanel from '../Gamification/GamificationPanel';
import Per4manceAI from '../AI/Per4manceAI';
import AuthModal from '../Auth/AuthModal';
import RunningManager from '../Health/RunningManager';
import WorkoutManager from '../Health/WorkoutManager';
import BodyMeasurementsManager from '../Health/BodyMeasurementsManager';
import { NutritionManager } from '../Health/NutritionManager';
import ThemeSettings from '../Settings/ThemeSettings';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { getThemeById } from '@/lib/themes';
import { Menu, Bell, Search, User, Sun, Moon, LogOut, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MainLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { settings, updateSettings } = useAppStore();
  const { user, loading, signOut, isAuthenticated } = useAuth();
  
  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (settings.theme === 'light') {
      root.classList.add('light');
    }
    // Remove all accent classes and apply selected
    const accentClasses = ['accent-white', 'accent-cyan', 'accent-coral', 'accent-purple', 'accent-green', 
      'accent-yellow', 'accent-pink', 'accent-blue', 'accent-orange', 'accent-mint', 
      'accent-lavender', 'accent-rosegold', 'accent-electric', 'accent-lime', 'accent-ruby', 'accent-neon'];
    accentClasses.forEach(cls => root.classList.remove(cls));
    
    const theme = getThemeById(settings.accentColor);
    if (theme) {
      root.classList.add(theme.class);
    }
  }, [settings.theme, settings.accentColor]);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard onNavigateToSection={setActiveSection} />;
      case 'tasks': return <TaskManager />;
      case 'goals': return <GoalsManager />;
      case 'projects': return <ProjectsManager />;
      case 'diary': return <DiaryManager />;
      case 'habits': return <HabitsManager />;
      case 'finance': return <FinanceManager />;
      case 'studies': return <StudiesManager />;
      case 'pomodoro': return <PomodoroTimer />;
      case 'secondbrain': return <SecondBrain />;
      case 'gamification': return <GamificationPanel />;
      case 'ai': return <Per4manceAI />;
      case 'running': return <RunningManager />;
      case 'workout': return <WorkoutManager />;
      case 'measurements': return <BodyMeasurementsManager />;
      case 'diet': return <NutritionManager />;
      case 'settings': return <ThemeSettings />;
      default:
        return (
          <div className="p-6 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2 capitalize">
                {activeSection.replace(/-/g, ' ')}
              </h2>
              <p className="text-muted-foreground">Módulo em desenvolvimento...</p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-72'}`}>
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
                </SheetContent>
              </Sheet>

              {/* Search */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-9 pr-4 py-1.5 w-64 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
                {settings.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
              </Button>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium truncate">{user?.email}</p>
                      <p className="text-xs text-muted-foreground">Conta ativa</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openAuth('login')}>
                    Entrar
                  </Button>
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => openAuth('register')}>
                    Cadastrar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode}
      />
    </div>
  );
};

export default MainLayout;
