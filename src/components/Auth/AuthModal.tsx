import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
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
        if (error) {
          toast({
            title: 'Erro',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Email enviado!',
            description: 'Verifique sua caixa de entrada para redefinir sua senha.',
          });
          setAuthMode('login');
        }
      } else if (authMode === 'register') {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast({
            title: 'Erro ao criar conta',
            description: error.message === 'User already registered' 
              ? 'Este email já está cadastrado. Tente fazer login.'
              : error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Conta criada com sucesso! 🎉',
            description: 'Bem-vindo(a) à Alta Per4mance!',
          });
          onClose();
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Erro ao entrar',
            description: error.message === 'Invalid login credentials'
              ? 'Email ou senha incorretos.'
              : error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Bem-vindo(a) de volta! 👋',
            description: 'Você está conectado.',
          });
          onClose();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); resetForm(); } }}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          {authMode === 'forgot' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute left-4 top-4 h-8 w-8 p-0"
              onClick={() => setAuthMode('login')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle className="text-2xl font-bold text-center">
            {authMode === 'register' && 'Crie sua conta'}
            {authMode === 'login' && 'Entre na sua conta'}
            {authMode === 'forgot' && 'Recuperar senha'}
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2 text-sm">
            {authMode === 'register' && 'Comece sua jornada de alta performance'}
            {authMode === 'login' && 'Acesse seu dashboard personalizado'}
            {authMode === 'forgot' && 'Enviaremos um link para redefinir sua senha'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {authMode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 bg-muted/50"
                  placeholder="Seu nome"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 bg-muted/50"
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-xs text-accent hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 bg-muted/50"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
              {authMode === 'register' && (
                <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
              )}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                {authMode === 'register' && 'Criar conta'}
                {authMode === 'login' && 'Entrar'}
                {authMode === 'forgot' && 'Enviar link'}
              </>
            )}
          </Button>
        </form>

        {authMode !== 'forgot' && (
          <>
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {authMode === 'register' ? 'Já tem uma conta?' : 'Não tem conta ainda?'}{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode(authMode === 'register' ? 'login' : 'register'); resetForm(); }}
                  className="text-accent hover:underline font-medium"
                >
                  {authMode === 'register' ? 'Faça login' : 'Cadastre-se'}
                </button>
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
