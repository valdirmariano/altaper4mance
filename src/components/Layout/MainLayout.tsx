import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from '../Navigation/Sidebar';
import Dashboard from '../Dashboard';
import TaskManager from '../Tasks/TaskManager';
import { Menu, Bell, Search, User } from 'lucide-react';

const MainLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskManager />;
      case 'habits':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Rastreador de Hábitos
            </h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      case 'notes':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Segundo Cérebro
            </h2>
            <p className="text-muted-foreground">Sistema de notas em desenvolvimento...</p>
          </div>
        );
      case 'pomodoro':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Timer Pomodoro
            </h2>
            <p className="text-muted-foreground">Timer avançado em desenvolvimento...</p>
          </div>
        );
      case 'calendar':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Agenda & Calendário
            </h2>
            <p className="text-muted-foreground">Calendário integrado em desenvolvimento...</p>
          </div>
        );
      case 'goals':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Metas & Objetivos
            </h2>
            <p className="text-muted-foreground">Sistema de metas em desenvolvimento...</p>
          </div>
        );
      case 'studies':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Estudos & Aprendizado
            </h2>
            <p className="text-muted-foreground">Módulo de estudos em desenvolvimento...</p>
          </div>
        );
      case 'finance':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Controle Financeiro
            </h2>
            <p className="text-muted-foreground">Gestão financeira em desenvolvimento...</p>
          </div>
        );
      case 'fitness':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Treinos & Exercícios
            </h2>
            <p className="text-muted-foreground">Planner de treinos em desenvolvimento...</p>
          </div>
        );
      case 'nutrition':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dieta & Nutrição
            </h2>
            <p className="text-muted-foreground">Controle nutricional em desenvolvimento...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Relatórios & Analytics
            </h2>
            <p className="text-muted-foreground">Dashboard de analytics em desenvolvimento...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Configurações
            </h2>
            <p className="text-muted-foreground">Configurações do sistema em desenvolvimento...</p>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Perfil do Usuário
            </h2>
            <p className="text-muted-foreground">Gerenciamento de perfil em desenvolvimento...</p>
          </div>
        );
      case 'help':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ajuda & Suporte
            </h2>
            <p className="text-muted-foreground">Central de ajuda em desenvolvimento...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={(section) => {
              setActiveSection(section);
              setSidebarOpen(false);
            }} 
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                  <Sidebar 
                    activeSection={activeSection} 
                    onSectionChange={(section) => {
                      setActiveSection(section);
                    }} 
                  />
                </SheetContent>
              </Sheet>

              {/* Search Bar */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar tarefas, notas, hábitos..."
                  className="pl-10 pr-4 py-2 w-80 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;