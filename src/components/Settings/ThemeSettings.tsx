import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { accentThemes, getThemesByCategory, ThemeColors } from '@/lib/themes';
import { Sun, Moon, Check, Palette, Monitor, Sparkles, Volume2, Bell, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const ThemeSettings = () => {
  const { settings, updateSettings } = useAppStore();

  const categories = [
    { id: 'neutral', name: 'Neutros' },
    { id: 'cool', name: 'Tons Frios' },
    { id: 'warm', name: 'Tons Quentes' },
    { id: 'vibrant', name: 'Vibrantes' },
  ] as const;

  const handleAccentChange = (themeId: string) => {
    updateSettings({ accentColor: themeId });
  };

  const handleThemeChange = (theme: 'dark' | 'light') => {
    updateSettings({ theme });
  };

  const renderColorButton = (theme: ThemeColors) => {
    const isSelected = settings.accentColor === theme.id;
    
    return (
      <button
        key={theme.id}
        onClick={() => handleAccentChange(theme.id)}
        className={cn(
          "group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
          "hover:bg-muted/50",
          isSelected && "bg-muted ring-2 ring-accent ring-offset-2 ring-offset-background"
        )}
      >
        <div 
          className={cn(
            "w-10 h-10 rounded-full transition-transform duration-200",
            "group-hover:scale-110",
            "shadow-lg",
            isSelected && "ring-2 ring-white/20"
          )}
          style={{ 
            backgroundColor: theme.preview,
            boxShadow: isSelected ? `0 0 20px ${theme.preview}40` : undefined
          }}
        >
          {isSelected && (
            <div className="w-full h-full flex items-center justify-center">
              <Check 
                className="w-5 h-5" 
                style={{ 
                  color: ['white', 'yellow', 'lime', 'neon', 'mint', 'electric', 'lavender', 'rosegold'].includes(theme.id) 
                    ? '#000000' 
                    : '#FFFFFF' 
                }} 
              />
            </div>
          )}
        </div>
        <span className={cn(
          "text-xs font-medium transition-colors",
          isSelected ? "text-foreground" : "text-muted-foreground"
        )}>
          {theme.name}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-3">
            <Palette className="h-7 w-7 text-accent" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Personalize sua experiência no Alta Per4mance ⬏
          </p>
        </div>

        {/* Theme Mode */}
        <Card className="p-6 bg-card border-border animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-medium">Modo de Exibição</h2>
              <p className="text-sm text-muted-foreground">Escolha entre modo escuro ou claro</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleThemeChange('dark')}
              className={cn(
                "relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300",
                settings.theme === 'dark' 
                  ? "border-accent bg-accent/5" 
                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                settings.theme === 'dark' ? "bg-foreground" : "bg-muted"
              )}>
                <Moon className={cn(
                  "h-8 w-8",
                  settings.theme === 'dark' ? "text-background" : "text-muted-foreground"
                )} />
              </div>
              <div className="text-center">
                <p className="font-medium">Modo Escuro</p>
                <p className="text-xs text-muted-foreground">Fundo preto absoluto</p>
              </div>
              {settings.theme === 'dark' && (
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                  Ativo
                </Badge>
              )}
            </button>
            
            <button
              onClick={() => handleThemeChange('light')}
              className={cn(
                "relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300",
                settings.theme === 'light' 
                  ? "border-accent bg-accent/5" 
                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                settings.theme === 'light' ? "bg-foreground" : "bg-muted"
              )}>
                <Sun className={cn(
                  "h-8 w-8",
                  settings.theme === 'light' ? "text-background" : "text-muted-foreground"
                )} />
              </div>
              <div className="text-center">
                <p className="font-medium">Modo Claro</p>
                <p className="text-xs text-muted-foreground">Fundo branco absoluto</p>
              </div>
              {settings.theme === 'light' && (
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                  Ativo
                </Badge>
              )}
            </button>
          </div>
        </Card>

        {/* Accent Colors */}
        <Card className="p-6 bg-card border-border animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-medium">Cor de Destaque</h2>
              <p className="text-sm text-muted-foreground">Escolha a cor que aparece em botões, ícones e gráficos</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {categories.map((category) => {
              const themes = getThemesByCategory(category.id);
              if (themes.length === 0) return null;
              
              return (
                <div key={category.id}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {themes.map(renderColorButton)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Other Settings */}
        <Card className="p-6 bg-card border-border animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-medium">Preferências</h2>
              <p className="text-sm text-muted-foreground">Ajuste o comportamento do sistema</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="notifications" className="text-base font-medium cursor-pointer">
                    Notificações
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes de tarefas e hábitos
                  </p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSettings({ notifications: checked })}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="sound" className="text-base font-medium cursor-pointer">
                    Sons
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Efeitos sonoros ao completar ações
                  </p>
                </div>
              </div>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="animations" className="text-base font-medium cursor-pointer">
                    Animações
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Transições e efeitos visuais
                  </p>
                </div>
              </div>
              <Switch
                id="animations"
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => updateSettings({ animationsEnabled: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Preview Card */}
        <Card className="p-6 bg-card border-border overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-medium">Pré-visualização</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Botão Principal
              </Button>
              <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                Botão Secundário
              </Button>
              <Button variant="ghost" className="w-full text-accent hover:bg-accent/10">
                Botão Ghost
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progresso XP</span>
                  <span className="text-xs text-accent">750/1000</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  Tag Accent
                </Badge>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  Sucesso
                </Badge>
                <Badge variant="secondary" className="bg-warning/10 text-warning">
                  Aviso
                </Badge>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default ThemeSettings;
