import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTasks } from '@/hooks/useTasks';
import { useTransactions } from '@/hooks/useTransactions';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  ListFilter,
  Grid3X3,
  List,
  CheckSquare,
  DollarSign,
  Target,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Circle
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ViewMode = 'month' | 'week' | 'list';
type FilterType = 'tasks' | 'income' | 'expense' | 'habits' | 'goals';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: FilterType;
  status?: string;
  amount?: number;
  priority?: string;
}

const IntegratedCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['tasks', 'income', 'expense']);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { tasks } = useTasks();
  const { transactions } = useTransactions();
  const { habits, isHabitCompletedOnDate } = useHabits();
  const { goals } = useGoals();

  // Combine all events
  const events = useMemo(() => {
    const allEvents: CalendarEvent[] = [];

    // Add tasks with due dates
    if (activeFilters.includes('tasks')) {
      tasks.forEach(task => {
        if (task.due_date) {
          allEvents.push({
            id: task.id,
            title: task.title,
            date: task.due_date,
            type: 'tasks',
            status: task.status,
            priority: task.priority
          });
        }
      });
    }

    // Add transactions
    transactions.forEach(t => {
      if (t.type === 'receita' && activeFilters.includes('income')) {
        allEvents.push({
          id: t.id,
          title: t.description || t.category,
          date: t.date,
          type: 'income',
          amount: t.amount
        });
      }
      if (t.type === 'despesa' && activeFilters.includes('expense')) {
        allEvents.push({
          id: t.id,
          title: t.description || t.category,
          date: t.date,
          type: 'expense',
          amount: t.amount
        });
      }
    });

    // Add goals with target dates
    if (activeFilters.includes('goals')) {
      goals.forEach(goal => {
        if (goal.target_date) {
          allEvents.push({
            id: goal.id,
            title: goal.title,
            date: goal.target_date,
            type: 'goals',
            status: goal.status
          });
        }
      });
    }

    return allEvents;
  }, [tasks, transactions, goals, activeFilters]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(e => e.date === dateStr);
  };

  // Get days for calendar view
  const calendarDays = useMemo(() => {
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    }
    
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate, viewMode]);

  const toggleFilter = (filter: FilterType) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const filterOptions: { id: FilterType; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare, color: 'text-accent' },
    { id: 'income', label: 'Receitas', icon: ArrowUpRight, color: 'text-success' },
    { id: 'expense', label: 'Despesas', icon: ArrowDownRight, color: 'text-destructive' },
    { id: 'goals', label: 'Metas', icon: Target, color: 'text-warning' },
  ];

  const getEventColor = (type: FilterType) => {
    switch (type) {
      case 'tasks': return 'bg-accent/20 text-accent border-accent/30';
      case 'income': return 'bg-success/20 text-success border-success/30';
      case 'expense': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'goals': return 'bg-warning/20 text-warning border-warning/30';
      case 'habits': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEventDot = (type: FilterType) => {
    switch (type) {
      case 'tasks': return 'bg-accent';
      case 'income': return 'bg-success';
      case 'expense': return 'bg-destructive';
      case 'goals': return 'bg-warning';
      case 'habits': return 'bg-purple-500';
      default: return 'bg-muted-foreground';
    }
  };

  // List view grouped by date
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const nextMonth = addDays(today, 30);
    
    return events
      .filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= today && eventDate <= nextMonth;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 20);
  }, [events]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Calendário</h2>
            <p className="text-sm text-muted-foreground">
              {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border/50">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 text-xs",
                viewMode === 'month' && "bg-background shadow-sm"
              )}
              onClick={() => setViewMode('month')}
            >
              <Grid3X3 className="h-3.5 w-3.5 mr-1.5" />
              Mês
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 text-xs",
                viewMode === 'week' && "bg-background shadow-sm"
              )}
              onClick={() => setViewMode('week')}
            >
              <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
              Semana
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3 text-xs",
                viewMode === 'list' && "bg-background shadow-sm"
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-3.5 w-3.5 mr-1.5" />
              Lista
            </Button>
          </div>

          {/* Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <ListFilter className="h-4 w-4 mr-2" />
                Filtros
                {activeFilters.length < 4 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-3">
              <p className="text-sm font-medium mb-3">Mostrar no calendário</p>
              <div className="space-y-2">
                {filterOptions.map(option => (
                  <label 
                    key={option.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={activeFilters.includes(option.id)}
                      onCheckedChange={() => toggleFilter(option.id)}
                    />
                    <option.icon className={cn("h-4 w-4", option.color)} />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-medium"
          onClick={() => setCurrentDate(new Date())}
        >
          Hoje
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      {(viewMode === 'month' || viewMode === 'week') && (
        <Card className="p-4 bg-card border-border/50">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const today = isToday(day);

              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative aspect-square p-1 rounded-xl transition-all",
                    "flex flex-col items-center justify-start",
                    "hover:bg-muted/50",
                    !isCurrentMonth && "opacity-30",
                    isSelected && "bg-accent/10 ring-2 ring-accent/50",
                    today && !isSelected && "bg-accent/5"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    today && "bg-accent text-accent-foreground"
                  )}>
                    {format(day, 'd')}
                  </span>

                  {/* Event Dots */}
                  {dayEvents.length > 0 && (
                    <div className="flex items-center gap-0.5 mt-1 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <div 
                          key={i} 
                          className={cn("w-1.5 h-1.5 rounded-full", getEventDot(event.type))}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </Card>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card className="p-4 bg-card border-border/50">
          <ScrollArea className="h-[400px]">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event, idx) => {
                  const eventDate = new Date(event.date);
                  const showDateHeader = idx === 0 || 
                    format(eventDate, 'yyyy-MM-dd') !== format(new Date(upcomingEvents[idx - 1].date), 'yyyy-MM-dd');

                  return (
                    <div key={event.id}>
                      {showDateHeader && (
                        <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
                          <div className={cn(
                            "text-xs font-medium px-2 py-1 rounded-md",
                            isToday(eventDate) 
                              ? "bg-accent/20 text-accent" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {isToday(eventDate) 
                              ? 'Hoje'
                              : format(eventDate, "EEEE, d 'de' MMMM", { locale: ptBR })
                            }
                          </div>
                        </div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border",
                          getEventColor(event.type)
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full", getEventDot(event.type))} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{event.title}</p>
                          {event.amount && (
                            <p className={cn(
                              "text-xs font-medium",
                              event.type === 'income' ? 'text-success' : 'text-destructive'
                            )}>
                              {event.type === 'income' ? '+' : '-'}{formatCurrency(event.amount)}
                            </p>
                          )}
                          {event.priority && (
                            <Badge variant="outline" className="text-[10px] h-4 mt-1">
                              {event.priority}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(eventDate, 'HH:mm') !== '00:00' 
                            ? format(eventDate, 'HH:mm')
                            : ''
                          }
                        </span>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">Nenhum evento encontrado</p>
                <p className="text-sm mt-1">Ajuste os filtros para ver mais itens</p>
              </div>
            )}
          </ScrollArea>
        </Card>
      )}

      {/* Selected Day Details */}
      <AnimatePresence>
        {selectedDate && (viewMode === 'month' || viewMode === 'week') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-4 bg-card border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    isToday(selectedDate) ? "bg-accent text-accent-foreground" : "bg-muted"
                  )}>
                    <span className="text-sm font-bold">{format(selectedDate, 'd')}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {format(selectedDate, "EEEE", { locale: ptBR })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate(null)}
                >
                  Fechar
                </Button>
              </div>

              <div className="space-y-2">
                {getEventsForDate(selectedDate).map(event => (
                  <div
                    key={event.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border",
                      getEventColor(event.type)
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full shrink-0", getEventDot(event.type))} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                    </div>
                    {event.amount && (
                      <span className="text-sm font-semibold">
                        {formatCurrency(event.amount)}
                      </span>
                    )}
                  </div>
                ))}

                {getEventsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Circle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhum evento neste dia</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegratedCalendar;
