import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { accentThemes, getThemesByCategory, ThemeColors } from '@/lib/themes';
import { motion } from 'framer-motion';
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
      <motion.button
        key={theme.id}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleAccentChange(theme.id)}
        className={cn(
          "group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
          "hover:bg-muted/30",
          isSelected && "bg-accent/5 ring-2 ring-accent/30 ring-offset-2 ring-offset-background"
        )}
      >
        <div 
          className={cn(
            "w-10 h-10 rounded-full transition-transform duration-200 shadow-lg",
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
      </motion.button>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const settingsItems = [
    { id: 'notifications', icon: Bell, label: 'Notificações', desc: 'Receba lembretes de tarefas e hábitos', checked: settings.notifications, key: 'notifications' as const },
    { id: 'sound', icon: Volume2, label: 'Sons', desc: 'Efeitos sonoros ao completar ações', checked: settings.soundEnabled, key: 'soundEnabled' as const },
    { id: 'animations', icon: Sparkles, label: 'Animações', desc: 'Transições e efeitos visuais', checked: settings.animationsEnabled, key: 'animationsEnabled' as const },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <motion.div 
        className="max-w-4xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-3">
            <Palette className="h-7 w-7 text-accent" />
            Configurações
          </h1>
          <p className="text-muted-foreground text-sm">
            Personalize sua experiência no Alta Per4mance ⬏
          </p>
        </motion.div>

        {/* Theme Mode */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="text-lg font-medium">Modo de Exibição</h2>
                <p className="text-sm text-muted-foreground">Escolha entre modo escuro ou claro</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { mode: 'dark' as const, icon: Moon, label: 'Modo Escuro', desc: 'Fundo preto absoluto' },
                { mode: 'light' as const, icon: Sun, label: 'Modo Claro', desc: 'Fundo branco absoluto' },
              ].map(({ mode, icon: Icon, label, desc }) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleThemeChange(mode)}
                  className={cn(
                    "relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300",
                    settings.theme === mode 
                      ? "border-accent/50 bg-accent/5" 
                      : "border-border/50 hover:border-muted-foreground/30 hover:bg-muted/10"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                    settings.theme === mode ? "bg-accent/10" : "bg-muted/30"
                  )}>
                    <Icon className={cn(
                      "h-7 w-7",
                      settings.theme === mode ? "text-accent" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  {settings.theme === mode && (
                    <Badge className="absolute top-3 right-3 bg-accent/10 text-accent border-accent/20 text-[10px]">
                      Ativo
                    </Badge>
                  )}
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Accent Colors */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
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
                    <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1">
                      {themes.map(renderColorButton)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="text-lg font-medium">Preferências</h2>
                <p className="text-sm text-muted-foreground">Ajuste o comportamento do sistema</p>
              </div>
            </div>
            
            <div className="space-y-1">
              {settingsItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-muted/30 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <Label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                          {item.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={(checked) => updateSettings({ [item.key]: checked })}
                    />
                  </div>
                  {index < settingsItems.length - 1 && <Separator className="bg-border/30" />}
                </React.Fragment>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Preview */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Pré-visualização</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Botão Principal
                </Button>
                <Button variant="outline" className="w-full border-accent/30 text-accent hover:bg-accent/10">
                  Botão Secundário
                </Button>
                <Button variant="ghost" className="w-full text-accent hover:bg-accent/5">
                  Botão Ghost
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progresso XP</span>
                    <span className="text-xs text-accent">750/1000</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                    Tag Accent
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Sucesso
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Aviso
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThemeSettings;
