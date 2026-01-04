// Alta Per4mance - Global State Management
// Using simple React state patterns for MVP - can migrate to Zustand later

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'alta' | 'média' | 'baixa';
  status: 'todo' | 'doing' | 'done';
  dueDate?: string;
  projectId?: string;
  createdAt: string;
  completedAt?: string;
  tags?: string[];
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | '3x-week' | '2x-week' | 'weekly';
  category: 'saúde' | 'produtividade' | 'aprendizado' | 'bem-estar' | 'finanças';
  streak: number;
  bestStreak: number;
  completedDates: string[];
  createdAt: string;
  reminderTime?: string;
  color?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: 'curto' | 'médio' | 'longo';
  pillar: string;
  progress: number;
  targetValue?: number;
  currentValue?: number;
  deadline?: string;
  status: 'ativo' | 'pausado' | 'concluído';
  keyResults?: KeyResult[];
  createdAt: string;
}

export interface KeyResult {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planejado' | 'em_andamento' | 'pausado' | 'concluído';
  priority: 'alta' | 'média' | 'baixa';
  startDate?: string;
  endDate?: string;
  progress: number;
  taskIds: string[];
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'receita' | 'despesa';
  amount: number;
  description: string;
  category: string;
  date: string;
  account?: string;
  recurring?: boolean;
  tags?: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: number; // 1-5
  energy: number; // 1-5
  gratitude: string[];
  reflection?: string;
  wins?: string[];
  challenges?: string[];
  habitProgress: { habitId: string; completed: boolean }[];
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  tasksCompleted: number;
  habitsCompleted: number;
  goalsAchieved: number;
  badges: string[];
}

export interface Settings {
  theme: 'dark' | 'light';
  accentColor: 'cyan' | 'coral' | 'purple' | 'green' | 'yellow' | 'pink' | 'blue' | 'orange';
  notifications: boolean;
  soundEnabled: boolean;
  language: 'pt-BR';
}

interface AppState {
  // Data
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  projects: Project[];
  transactions: Transaction[];
  journalEntries: JournalEntry[];
  
  // User
  userStats: UserStats;
  settings: Settings;
  
  // Actions - Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  // Actions - Habits
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'bestStreak' | 'completedDates'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitToday: (id: string) => void;
  
  // Actions - Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Actions - Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Actions - Finance
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Actions - Journal
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  
  // Actions - Gamification
  addXP: (amount: number) => void;
  awardBadge: (badge: string) => void;
  
  // Actions - Settings
  updateSettings: (updates: Partial<Settings>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const today = () => new Date().toISOString().split('T')[0];

// Calculate XP needed for next level (exponential growth)
const xpForLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Data
      tasks: [
        { id: '1', title: 'Revisar relatório de vendas', completed: true, priority: 'alta', status: 'done', createdAt: today(), completedAt: today() },
        { id: '2', title: 'Reunião com equipe - 14h', completed: false, priority: 'média', status: 'todo', createdAt: today() },
        { id: '3', title: 'Estudar React avançado', completed: false, priority: 'baixa', status: 'todo', createdAt: today() },
        { id: '4', title: 'Ir ao mercado', completed: false, priority: 'média', status: 'todo', createdAt: today() },
        { id: '5', title: 'Gravar vídeo para YouTube', completed: false, priority: 'alta', status: 'todo', createdAt: today() },
      ],
      habits: [
        { id: '1', name: 'Beber 2L de água', frequency: 'daily', category: 'saúde', streak: 5, bestStreak: 12, completedDates: [], createdAt: today() },
        { id: '2', name: 'Exercitar 30min', frequency: 'daily', category: 'saúde', streak: 3, bestStreak: 7, completedDates: [], createdAt: today() },
        { id: '3', name: 'Ler 20 páginas', frequency: 'daily', category: 'aprendizado', streak: 2, bestStreak: 15, completedDates: [], createdAt: today() },
        { id: '4', name: 'Meditar 10min', frequency: 'daily', category: 'bem-estar', streak: 1, bestStreak: 5, completedDates: [], createdAt: today() },
        { id: '5', name: 'Revisar finanças', frequency: 'weekly', category: 'finanças', streak: 4, bestStreak: 8, completedDates: [], createdAt: today() },
      ],
      goals: [
        { id: '1', title: 'Economizar R$ 10.000', type: 'médio', pillar: 'Finanças', progress: 45, targetValue: 10000, currentValue: 4500, status: 'ativo', createdAt: today() },
        { id: '2', title: 'Correr 5km em 25 minutos', type: 'curto', pillar: 'Saúde', progress: 60, status: 'ativo', createdAt: today() },
        { id: '3', title: 'Aprender TypeScript avançado', type: 'curto', pillar: 'Carreira', progress: 30, status: 'ativo', createdAt: today() },
      ],
      projects: [
        { id: '1', name: 'Lançamento do Produto X', status: 'em_andamento', priority: 'alta', progress: 65, taskIds: ['1'], createdAt: today() },
        { id: '2', name: 'Redesign do Site', status: 'planejado', priority: 'média', progress: 0, taskIds: [], createdAt: today() },
      ],
      transactions: [
        { id: '1', type: 'receita', amount: 5000, description: 'Salário', category: 'Renda', date: today() },
        { id: '2', type: 'despesa', amount: 1200, description: 'Aluguel', category: 'Moradia', date: today() },
        { id: '3', type: 'despesa', amount: 450, description: 'Mercado', category: 'Alimentação', date: today() },
        { id: '4', type: 'despesa', amount: 89.90, description: 'Netflix + Spotify', category: 'Assinaturas', date: today() },
      ],
      journalEntries: [],
      
      userStats: {
        level: 5,
        xp: 320,
        xpToNextLevel: 500,
        totalPoints: 2450,
        currentStreak: 5,
        bestStreak: 12,
        tasksCompleted: 47,
        habitsCompleted: 156,
        goalsAchieved: 3,
        badges: ['early-adopter', 'first-task', '7-day-streak'],
      },
      
      settings: {
        theme: 'dark',
        accentColor: 'cyan',
        notifications: true,
        soundEnabled: true,
        language: 'pt-BR',
      },
      
      // Task Actions
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { ...task, id: generateId(), createdAt: today() }]
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      
      toggleTask: (id) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;
        
        const completed = !task.completed;
        set((state) => ({
          tasks: state.tasks.map(t => t.id === id ? { 
            ...t, 
            completed, 
            status: completed ? 'done' : 'todo',
            completedAt: completed ? today() : undefined 
          } : t)
        }));
        
        if (completed) {
          get().addXP(10);
        }
      },
      
      // Habit Actions
      addHabit: (habit) => set((state) => ({
        habits: [...state.habits, { ...habit, id: generateId(), createdAt: today(), streak: 0, bestStreak: 0, completedDates: [] }]
      })),
      
      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map(h => h.id === id ? { ...h, ...updates } : h)
      })),
      
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter(h => h.id !== id)
      })),
      
      toggleHabitToday: (id) => {
        const habit = get().habits.find(h => h.id === id);
        if (!habit) return;
        
        const todayDate = today();
        const completedToday = habit.completedDates.includes(todayDate);
        
        let newDates = completedToday 
          ? habit.completedDates.filter(d => d !== todayDate)
          : [...habit.completedDates, todayDate];
        
        let newStreak = habit.streak;
        if (!completedToday) {
          newStreak += 1;
        } else {
          newStreak = Math.max(0, newStreak - 1);
        }
        
        const newBestStreak = Math.max(habit.bestStreak, newStreak);
        
        set((state) => ({
          habits: state.habits.map(h => h.id === id ? { 
            ...h, 
            completedDates: newDates,
            streak: newStreak,
            bestStreak: newBestStreak
          } : h)
        }));
        
        if (!completedToday) {
          get().addXP(5);
        }
      },
      
      // Goal Actions
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: generateId(), createdAt: today() }]
      })),
      
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      })),
      
      // Project Actions
      addProject: (project) => set((state) => ({
        projects: [...state.projects, { ...project, id: generateId(), createdAt: today() }]
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      })),
      
      // Transaction Actions
      addTransaction: (transaction) => set((state) => ({
        transactions: [...state.transactions, { ...transaction, id: generateId() }]
      })),
      
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      
      // Journal Actions
      addJournalEntry: (entry) => set((state) => ({
        journalEntries: [...state.journalEntries, { ...entry, id: generateId() }]
      })),
      
      updateJournalEntry: (id, updates) => set((state) => ({
        journalEntries: state.journalEntries.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      
      // Gamification Actions
      addXP: (amount) => set((state) => {
        let newXP = state.userStats.xp + amount;
        let newLevel = state.userStats.level;
        let xpToNext = state.userStats.xpToNextLevel;
        
        // Level up logic
        while (newXP >= xpToNext) {
          newXP -= xpToNext;
          newLevel += 1;
          xpToNext = xpForLevel(newLevel);
        }
        
        return {
          userStats: {
            ...state.userStats,
            xp: newXP,
            level: newLevel,
            xpToNextLevel: xpToNext,
            totalPoints: state.userStats.totalPoints + amount,
          }
        };
      }),
      
      awardBadge: (badge) => set((state) => ({
        userStats: {
          ...state.userStats,
          badges: state.userStats.badges.includes(badge) 
            ? state.userStats.badges 
            : [...state.userStats.badges, badge]
        }
      })),
      
      // Settings Actions
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
    }),
    {
      name: 'alta-per4mance-storage',
      partialize: (state) => ({
        tasks: state.tasks,
        habits: state.habits,
        goals: state.goals,
        projects: state.projects,
        transactions: state.transactions,
        journalEntries: state.journalEntries,
        userStats: state.userStats,
        settings: state.settings,
      }),
    }
  )
);
