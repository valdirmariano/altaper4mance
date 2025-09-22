import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthModal from '../Auth/AuthModal';
import heroImage from '@/assets/hero-productivity.jpg';
import { 
  Zap, 
  Brain, 
  Target, 
  Timer, 
  TrendingUp, 
  Shield, 
  Smartphone,
  CheckCircle2,
  Star,
  ArrowRight,
  Play
} from 'lucide-react';

const Hero = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const features = [
    { icon: Brain, title: 'AI Coach Personalizado', desc: 'Recomendações inteligentes baseadas no seu comportamento' },
    { icon: Target, title: 'Gestão Completa', desc: 'Tarefas, hábitos, notas e metas em um só lugar' },
    { icon: Timer, title: 'Pomodoro Integrado', desc: 'Timer de foco com soundscapes adaptativos' },
    { icon: TrendingUp, title: 'Analytics Avançado', desc: 'Relatórios detalhados do seu progresso' },
    { icon: Shield, title: 'Privacidade Total', desc: 'Seus dados ficam seguros e privados' },
    { icon: Smartphone, title: 'Mobile & Offline', desc: 'PWA com sincronização offline' },
  ];

  const testimonials = [
    { name: 'Ana Silva', role: 'Empreendedora', content: 'Revolucionou minha rotina. Nunca fui tão produtiva!' },
    { name: 'Carlos Santos', role: 'Desenvolvedor', content: 'O AI Coach é incrível. Me ajuda a manter o foco no que importa.' },
    { name: 'Marina Costa', role: 'Estudante', content: 'Consegui organizar meus estudos e criar hábitos saudáveis.' },
  ];

  return (
    <>
      <div className="min-h-screen gradient-background">
        {/* Navigation */}
        <nav className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Alta Per4mance ⬏
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setAuthModalOpen(true)}>
                  Entrar
                </Button>
                <Button variant="premium" onClick={() => setAuthModalOpen(true)}>
                  Começar Grátis
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-slide-up">
                <div className="space-y-4">
                  <Badge variant="secondary" className="mb-4">
                    🚀 Sistema Completo de Produtividade
                  </Badge>
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    Organize <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">toda sua vida</span> em um só lugar
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Plataforma completa que integra tarefas, hábitos, treinos, dietas, finanças e estudos. 
                    Com AI Coach personalizado para máxima produtividade.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="premium" 
                    size="xl" 
                    onClick={() => setAuthModalOpen(true)}
                    className="text-lg px-8"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Gerar Meu Plano
                  </Button>
                  <Button variant="outline" size="xl" className="text-lg px-8">
                    <Play className="h-5 w-5 mr-2" />
                    Ver Demo
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Grátis para sempre
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Sem cartão de crédito
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    2min para começar
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
                <img 
                  src={heroImage} 
                  alt="Dashboard de produtividade Alta Per4mance"
                  className="relative w-full rounded-2xl shadow-2xl border border-border/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tudo que você precisa para ser mais produtivo
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Uma plataforma completa que cresce com você, desde organização pessoal até gestão empresarial
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 gradient-card border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-glow">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 px-6 bg-card/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl font-bold mb-4">
                Mais de 10.000 pessoas já transformaram sua produtividade
              </h2>
              <div className="flex justify-center items-center gap-2 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
                <span className="text-muted-foreground ml-2">4.9/5 (2.847 avaliações)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 gradient-card">
                  <div className="space-y-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <Card className="p-12 gradient-card border-primary/20">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Pronto para transformar sua produtividade?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Junte-se a milhares de pessoas que já descobriram o poder da organização inteligente
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button 
                    variant="premium" 
                    size="xl" 
                    onClick={() => setAuthModalOpen(true)}
                    className="text-lg px-8"
                  >
                    Gerar Plano Gratuito
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  <Button variant="outline" size="xl" className="text-lg px-8">
                    Falar com Especialista
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Teste grátis por 14 dias • Sem compromisso • Cancele quando quiser
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Alta Per4mance
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Sistema completo de produtividade para pessoas que querem mais resultados.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Produto</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Funcionalidades</p>
                  <p>Preços</p>
                  <p>Integrações</p>
                  <p>API</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Recursos</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Blog</p>
                  <p>Guias</p>
                  <p>Webinars</p>
                  <p>Comunidade</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Suporte</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Central de Ajuda</p>
                  <p>Contato</p>
                  <p>Status</p>
                  <p>Privacidade</p>
                </div>
              </div>
            </div>
            <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2025 Alta Per4mance. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};

export default Hero;