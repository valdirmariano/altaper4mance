import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Volume2,
  VolumeX,
  Timer,
  Coffee,
  Brain
} from 'lucide-react';

const PomodoroTimer = () => {
  const [mode, setMode] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const modes = {
    'focus': { label: 'Foco', duration: 25 * 60, icon: Brain },
    'short-break': { label: 'Pausa Curta', duration: 5 * 60, icon: Coffee },
    'long-break': { label: 'Pausa Longa', duration: 15 * 60, icon: Coffee },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer completed
      if (mode === 'focus') {
        setSessions((prev) => prev + 1);
        // Auto switch to break
        if ((sessions + 1) % 4 === 0) {
          setMode('long-break');
          setTimeLeft(15 * 60);
        } else {
          setMode('short-break');
          setTimeLeft(5 * 60);
        }
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, sessions]);

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
      if (sessions % 4 === 3) {
        handleModeChange('long-break');
      } else {
        handleModeChange('short-break');
      }
      setSessions((prev) => prev + 1);
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
          <p className="text-2xl font-semibold">{sessions}</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-xs text-muted-foreground mb-1">Tempo Focado</p>
          <p className="text-2xl font-semibold">{sessions * 25}min</p>
        </Card>
        <Card className="p-4 bg-card border-border text-center">
          <p className="text-xs text-muted-foreground mb-1">Meta Diária</p>
          <p className="text-2xl font-semibold">{sessions}/8</p>
        </Card>
      </div>
    </div>
  );
};

export default PomodoroTimer;
