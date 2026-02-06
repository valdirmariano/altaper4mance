import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Brain,
  Coffee,
  Timer,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

const PomodoroTimer = () => {
  const { user } = useAuth();
  const { rewardPomodoroSession } = useGamification();
  
  const handlePomodoroReward = () => {
    rewardPomodoroSession();
  };
  
  const { sessionsCount, focusMinutes, dailyGoal, incrementSession } = usePomodoro(handlePomodoroReward);
  
  const [mode, setMode] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [localSessions, setLocalSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const modes = {
    'focus': { label: 'Foco', duration: 25 * 60, icon: Brain },
    'short-break': { label: 'Pausa Curta', duration: 5 * 60, icon: Coffee },
    'long-break': { label: 'Pausa Longa', duration: 15 * 60, icon: Coffee },
  };

  const totalSessions = user ? sessionsCount : localSessions;
  const totalFocusMinutes = user ? focusMinutes : localSessions * 25;
  const goalProgress = dailyGoal > 0 ? Math.min((totalSessions / dailyGoal) * 100, 100) : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      
      if (soundEnabled) {
        playNotificationSound();
      }
      
      if (mode === 'focus') {
        if (user) {
          incrementSession(25);
        } else {
          setLocalSessions(prev => prev + 1);
        }
        
        toast.success('🎉 Sessão de foco concluída!');
        
        const newSessionCount = totalSessions + 1;
        if (newSessionCount % 4 === 0) {
          setMode('long-break');
          setTimeLeft(15 * 60);
        } else {
          setMode('short-break');
          setTimeLeft(5 * 60);
        }
      } else {
        toast.success('Pausa concluída! Hora de focar 💪');
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, user, incrementSession, totalSessions, soundEnabled]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      console.log('Audio not available');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleModeChange = (newMode: 'focus' | 'short-break' | 'long-break') => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(modes[mode].duration);
    setIsRunning(false);
  };

  const handleSkip = () => {
    if (mode === 'focus') {
      if (totalSessions % 4 === 3) {
        handleModeChange('long-break');
      } else {
        handleModeChange('short-break');
      }
    } else {
      handleModeChange('focus');
    }
  };

  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;
  const circumference = 2 * Math.PI * 100;

  const statCards = [
    { icon: Zap, label: 'Sessões Hoje', value: totalSessions.toString(), sub: `de ${dailyGoal}` },
    { icon: Timer, label: 'Tempo Focado', value: `${totalFocusMinutes}`, sub: 'minutos' },
    { icon: Target, label: 'Meta Diária', value: `${Math.round(goalProgress)}%`, sub: goalProgress >= 100 ? 'Concluída!' : 'em progresso' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pomodoro</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Técnica de gestão de tempo para foco máximo
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-muted-foreground"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted/50">
                  <stat.icon className="h-4 w-4 text-foreground/70" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.sub}</span>
                  </div>
                </div>
              </div>
              {stat.label === 'Meta Diária' && (
                <div className="mt-3 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Timer Central */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm border-border/50 max-w-lg w-full">
          {/* Mode Tabs */}
          <div className="flex justify-center gap-1 mb-10 p-1 bg-muted/30 rounded-xl">
            {(Object.entries(modes) as [keyof typeof modes, typeof modes[keyof typeof modes]][]).map(([key, value]) => {
              const Icon = value.icon;
              return (
                <button
                  key={key}
                  onClick={() => handleModeChange(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    mode === key
                      ? 'bg-foreground text-background shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {value.label}
                </button>
              );
            })}
          </div>

          {/* Circular Timer */}
          <div className="text-center mb-10">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-56 h-56 md:w-64 md:h-64 transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="100"
                  className="fill-none stroke-muted/30"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="100"
                  className="fill-none stroke-foreground"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={timeLeft}
                    initial={{ opacity: 0.8, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl md:text-7xl font-light tracking-tight font-mono"
                  >
                    {formatTime(timeLeft)}
                  </motion.span>
                </AnimatePresence>
                <span className="text-sm text-muted-foreground mt-2 uppercase tracking-wider">
                  {modes[mode].label}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleReset}
              className="h-12 w-12 rounded-full"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="min-w-40 h-14 rounded-full text-base font-medium"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
            </motion.div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSkip}
              className="h-12 w-12 rounded-full"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Session Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i < (totalSessions % 4) ? 'bg-foreground' : 'bg-muted/50'
                }`}
                animate={{ scale: i < (totalSessions % 4) ? 1.2 : 1 }}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              {4 - (totalSessions % 4)} até pausa longa
            </span>
          </div>
        </Card>
      </motion.div>

      {!user && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground text-sm"
        >
          Faça login para salvar suas sessões permanentemente
        </motion.p>
      )}
    </div>
  );
};

export default PomodoroTimer;
