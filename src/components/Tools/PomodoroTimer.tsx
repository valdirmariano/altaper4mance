import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { toast } from 'sonner';
import { 
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Volume2,
  VolumeX,
  Brain,
  Coffee
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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const modes = {
    'focus': { label: 'Foco', duration: 25 * 60, icon: Brain },
    'short-break': { label: 'Pausa Curta', duration: 5 * 60, icon: Coffee },
    'long-break': { label: 'Pausa Longa', duration: 15 * 60, icon: Coffee },
  };

  // Sync local sessions with database
  const totalSessions = user ? sessionsCount : localSessions;
  const totalFocusMinutes = user ? focusMinutes : localSessions * 25;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer completed
      setIsRunning(false);
      
      if (soundEnabled) {
        playNotificationSound();
      }
      
      if (mode === 'focus') {
        // Save session
        if (user) {
          incrementSession(25);
        } else {
          setLocalSessions(prev => prev + 1);
        }
        
        toast.success('🎉 Sessão de foco concluída!');
        
        // Auto switch to break
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
      // Use Web Audio API for notification sound
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pomodoro</h1>
          <p className="text-muted-foreground text-sm">
            Técnica de gestão de tempo para foco máximo
          </p>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Timer */}
      <div className="flex justify-center">
        <Card className="p-8 bg-card border-border max-w-md w-full">
          {/* Mode Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {(Object.entries(modes) as [keyof typeof modes, typeof modes[keyof typeof modes]][]).map(([key, value]) => (
              <Button
                key={key}
                variant={mode === key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange(key)}
                className="text-xs"
              >
                {value.label}
              </Button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className="stroke-muted fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className={`fill-none transition-all duration-300 ${
                    mode === 'focus' ? 'stroke-foreground' : 'stroke-success'
                  }`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-light tracking-tight font-mono">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-sm text-muted-foreground mt-2">
                  {modes[mode].label}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleReset}>
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              className="min-w-32"
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
            <Button variant="ghost" size="icon" onClick={handleSkip}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Sound Toggle */}
          <div className="flex justify-center mt-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-muted-foreground"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 mr-2" />
              ) : (
                <VolumeX className="h-4 w-4 mr-2" />
              )}
              Som {soundEnabled ? 'ativado' : 'desativado'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-xs text-muted-foreground mb-1">Sessões Hoje</p>
          <p className="text-2xl font-semibold">{totalSessions}</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-xs text-muted-foreground mb-1">Tempo Focado</p>
          <p className="text-2xl font-semibold">{totalFocusMinutes}min</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-xs text-muted-foreground mb-1">Meta Diária</p>
          <p className="text-2xl font-semibold">{totalSessions}/{dailyGoal}</p>
        </Card>
      </div>

      {!user && (
        <p className="text-center text-muted-foreground text-sm">
          Faça login para salvar suas sessões permanentemente
        </p>
      )}
    </div>
  );
};

export default PomodoroTimer;
