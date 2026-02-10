import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, Loader2, ArrowLeft, Sparkles, Zap, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, mode = 'register' }: AuthModalProps) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp, signIn, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (authMode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) { toast({ title: 'Erro', description: error.message, variant: 'destructive' }); }
        else { toast({ title: 'Email enviado!', description: 'Verifique sua caixa de entrada para redefinir sua senha.' }); setAuthMode('login'); }
      } else if (authMode === 'register') {
        const { error } = await signUp(email, password, name);
        if (error) { toast({ title: 'Erro ao criar conta', description: error.message === 'User already registered' ? 'Este email já está cadastrado. Tente fazer login.' : error.message, variant: 'destructive' }); }
        else { toast({ title: 'Conta criada com sucesso! 🎉', description: 'Bem-vindo(a) à Alta Per4mance!' }); onClose(); }
      } else {
        const { error } = await signIn(email, password);
        if (error) { toast({ title: 'Erro ao entrar', description: error.message === 'Invalid login credentials' ? 'Email ou senha incorretos.' : error.message, variant: 'destructive' }); }
        else { toast({ title: 'Bem-vindo(a) de volta! 👋', description: 'Você está conectado.' }); onClose(); }
      }
    } finally { setIsLoading(false); }
  };

  const resetForm = () => { setEmail(''); setPassword(''); setName(''); };

  const features = [
    { icon: Sparkles, label: 'IA Integrada' },
    { icon: Zap, label: 'Gamificação' },
    { icon: Shield, label: 'Dados Seguros' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); resetForm(); } }}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50 p-0 overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
        <div className="absolute top-4 right-12 w-20 h-20 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative p-6 pt-8">
          <DialogHeader>
            {authMode === 'forgot' && (
              <Button variant="ghost" size="sm" className="absolute left-4 top-4 h-8 w-8 p-0 rounded-xl hover:bg-accent/10" onClick={() => setAuthMode('login')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}

            <motion.div
              key={authMode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30 flex items-center justify-center">
                {authMode === 'forgot' ? <Mail className="h-6 w-6 text-accent" /> : <Sparkles className="h-6 w-6 text-accent" />}
              </div>

              <DialogTitle className="text-2xl font-bold tracking-tight">
                {authMode === 'register' && 'Crie sua conta'}
                {authMode === 'login' && 'Bem-vindo de volta'}
                {authMode === 'forgot' && 'Recuperar senha'}
              </DialogTitle>
              <p className="text-muted-foreground mt-1.5 text-sm">
                {authMode === 'register' && 'Comece sua jornada de alta performance'}
                {authMode === 'login' && 'Acesse seu dashboard personalizado'}
                {authMode === 'forgot' && 'Enviaremos um link para redefinir sua senha'}
              </p>
            </motion.div>
          </DialogHeader>

          {/* Feature badges (only on register) */}
          {authMode === 'register' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex justify-center gap-2 mt-4">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent">
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              ))}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <AnimatePresence mode="wait">
              {authMode === 'register' && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
                    <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-11 bg-card/50 border-border/50 rounded-xl focus:border-accent/50 transition-colors" placeholder="Seu nome" required disabled={isLoading} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-card/50 border-border/50 rounded-xl focus:border-accent/50 transition-colors" placeholder="seu@email.com" required disabled={isLoading} />
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Senha</Label>
                  {authMode === 'login' && (
                    <button type="button" onClick={() => setAuthMode('forgot')} className="text-xs text-accent hover:text-accent/80 transition-colors">
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-card/50 border-border/50 rounded-xl focus:border-accent/50 transition-colors" placeholder="••••••••" required minLength={6} disabled={isLoading} />
                </div>
                {authMode === 'register' && (
                  <p className="text-[11px] text-muted-foreground/60">Mínimo de 6 caracteres</p>
                )}
              </div>
            )}

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button type="submit" className="w-full h-11 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/20" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processando...</>
                ) : (
                  <>{authMode === 'register' && 'Criar conta'}{authMode === 'login' && 'Entrar'}{authMode === 'forgot' && 'Enviar link'}</>
                )}
              </Button>
            </motion.div>
          </form>

          {authMode !== 'forgot' && (
            <>
              <Separator className="my-5 bg-border/30" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {authMode === 'register' ? 'Já tem uma conta?' : 'Não tem conta ainda?'}{' '}
                  <button type="button" onClick={() => { setAuthMode(authMode === 'register' ? 'login' : 'register'); resetForm(); }}
                    className="text-accent hover:text-accent/80 font-semibold transition-colors">
                    {authMode === 'register' ? 'Faça login' : 'Cadastre-se'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
