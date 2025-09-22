import React, { useState } from 'react';
import Sidebar from '../Navigation/Sidebar';
import Dashboard from '../Dashboard';
import TaskManager from '../Tasks/TaskManager';
import GoalsManager from '../Goals/GoalsManager';
import ProjectsManager from '../Projects/ProjectsManager';

const MainLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskManager />;
      case 'goals':
        return <GoalsManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'skills':
        return <div className="p-6"><h1 className="text-2xl font-bold">Habilidades</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'diary':
        return <div className="p-6"><h1 className="text-2xl font-bold">Diário</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'running':
        return <div className="p-6"><h1 className="text-2xl font-bold">Corrida</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'workout':
        return <div className="p-6"><h1 className="text-2xl font-bold">Treino</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'diet':
        return <div className="p-6"><h1 className="text-2xl font-bold">Dieta</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'studies':
        return <div className="p-6"><h1 className="text-2xl font-bold">Estudos</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'books':
        return <div className="p-6"><h1 className="text-2xl font-bold">Livros</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'travels':
        return <div className="p-6"><h1 className="text-2xl font-bold">Viagens</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'movies':
        return <div className="p-6"><h1 className="text-2xl font-bold">Filmes e Séries</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'finances':
        return <div className="p-6"><h1 className="text-2xl font-bold">Finanças</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'crm':
        return <div className="p-6"><h1 className="text-2xl font-bold">CRM</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'content-planner':
        return <div className="p-6"><h1 className="text-2xl font-bold">Planejador de Conteúdo</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'competition':
        return <div className="p-6"><h1 className="text-2xl font-bold">Análise de Concorrência</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'proposal-template':
        return <div className="p-6"><h1 className="text-2xl font-bold">Modelo de Proposta</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'resume-template':
        return <div className="p-6"><h1 className="text-2xl font-bold">Modelo de Currículo</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'quick-notes':
        return <div className="p-6"><h1 className="text-2xl font-bold">Anotações Rápidas</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'notebooks':
        return <div className="p-6"><h1 className="text-2xl font-bold">Caderno de Anotações</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'second-brain':
        return <div className="p-6"><h1 className="text-2xl font-bold">Segundo Cérebro</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'soundscapes':
        return <div className="p-6"><h1 className="text-2xl font-bold">Paisagens Sonoras</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'pomodoro':
        return <div className="p-6"><h1 className="text-2xl font-bold">Pomodoro</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'eisenhower':
        return <div className="p-6"><h1 className="text-2xl font-bold">Matriz de Eisenhower</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'wheel-of-life':
        return <div className="p-6"><h1 className="text-2xl font-bold">Roda da Vida</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'ikigai':
        return <div className="p-6"><h1 className="text-2xl font-bold">Ikigai</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'settings':
        return <div className="p-6"><h1 className="text-2xl font-bold">Configurações</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      case 'help':
        return <div className="p-6"><h1 className="text-2xl font-bold">Ajuda</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
};

export default MainLayout;