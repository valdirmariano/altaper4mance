import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Mail, Lock, User, Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'register';
}

const AuthModal = ({ isOpen, onClose, mode = 'register' }: AuthModalProps) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - replace with real auth logic
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: authMode === 'register' ? 'Conta criada com sucesso!' : 'Bem-vindo(a) de volta!',
        description: authMode === 'register' 
          ? 'Sua conta foi criada. Você já pode acessar seu painel.'
          : `Bem-vindo(a), ${name || email.split('@')[0]}!`,
      });
      onClose();
    }, 1500);
  };

  const handleSocialAuth = (provider: 'google' | 'apple') => {
    toast({
      title: 'Em breve!',
      description: `Login com ${provider === 'google' ? 'Google' : 'Apple'} será disponibilizado em breve.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md gradient-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {authMode === 'register' ? 'Crie sua conta para salvar seu plano' : 'Entre na sua conta'}
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            {authMode === 'register' 
              ? 'Em menos de 1 minuto você recebe um plano prático e acessa no seu painel.'
              : 'Acesse seu dashboard de produtividade personalizado.'
            }
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Social Auth Buttons */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-12 text-base" 
              onClick={() => handleSocialAuth('google')}
            >
              <Chrome className="h-5 w-5 mr-3" />
              Continuar com Google
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 text-base" 
              onClick={() => handleSocialAuth('apple')}
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continuar com Apple
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou continue com email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12"
                    placeholder="Seu nome completo"
                    required
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
                  className="pl-10 h-12"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  placeholder="Sua senha segura"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="premium" 
              className="w-full h-12 text-base" 
              disabled={isLoading}
            >
              {isLoading ? 'Processando...' : (authMode === 'register' ? 'Criar conta' : 'Entrar')}
            </Button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {authMode === 'register' ? 'Já tem uma conta?' : 'Não tem conta ainda?'}{' '}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
                className="text-primary hover:text-primary-light font-medium transition-colors"
              >
                {authMode === 'register' ? 'Faça login' : 'Cadastre-se'}
              </button>
            </p>
          </div>

          {authMode === 'register' && (
            <p className="text-xs text-muted-foreground text-center">
              Ao criar uma conta, você concorda com nossos{' '}
              <a href="/termos" className="text-primary hover:text-primary-light">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="/privacidade" className="text-primary hover:text-primary-light">
                Política de Privacidade
              </a>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;