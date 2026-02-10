import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AuthModal from '../Auth/AuthModal';
import heroImage from '@/assets/hero-productivity.jpg';
import { motion } from 'framer-motion';
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
  Play,
  Sparkles,
  BarChart3,
  Heart
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

  const stats = [
    { value: '10K+', label: 'Usuários ativos' },
    { value: '500K+', label: 'Tarefas concluídas' },
    { value: '4.9', label: 'Avaliação média' },
    { value: '98%', label: 'Satisfação' },
  ];

  const testimonials = [
    { name: 'Ana Silva', role: 'Empreendedora', content: 'Revolucionou minha rotina. Nunca fui tão produtiva!', avatar: '👩‍💼' },
    { name: 'Carlos Santos', role: 'Desenvolvedor', content: 'O AI Coach é incrível. Me ajuda a manter o foco no que importa.', avatar: '👨‍💻' },
    { name: 'Marina Costa', role: 'Estudante', content: 'Consegui organizar meus estudos e criar hábitos saudáveis.', avatar: '👩‍🎓' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Navigation */}
        <nav className="bg-card/60 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Alta Per4mance <span className="text-accent">⬏</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setAuthModalOpen(true)} className="text-muted-foreground hover:text-foreground">
                  Entrar
                </Button>
                <Button size="sm" onClick={() => setAuthModalOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Começar Grátis
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-accent/3 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="space-y-6">
                  <Badge variant="outline" className="border-accent/30 bg-accent/5 text-accent px-4 py-1.5">
                    <Sparkles className="h-3 w-3 mr-2" />
                    Sistema Completo de Produtividade com IA
                  </Badge>
                  <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                    Organize{' '}
                    <span className="text-accent">toda sua vida</span>
                    {' '}em um só lugar
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                    Tarefas, hábitos, treinos, finanças e estudos integrados com 
                    AI Coach personalizado para máxima produtividade.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    size="lg" 
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 h-12"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Gerar Meu Plano
                  </Button>
                  <Button variant="outline" size="lg" className="border-border/50 text-base px-8 h-12">
                    Ver Demo
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  {['Grátis para sempre', 'Sem cartão de crédito', '2min para começar'].map((text) => (
                    <div key={text} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      {text}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-accent/10 rounded-3xl blur-3xl scale-90" />
                <img 
                  src={heroImage} 
                  alt="Dashboard de produtividade Alta Per4mance"
                  className="relative w-full rounded-2xl border border-border/30 shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={itemVariants} className="text-center">
                  <p className="text-3xl font-bold text-accent">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">
                Tudo que você precisa para ser mais <span className="text-accent">produtivo</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Uma plataforma completa que cresce com você
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/30 transition-all duration-300 group h-full">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <feature.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.desc}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 bg-card/20">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Milhares já transformaram sua produtividade
              </h2>
              <p className="text-muted-foreground">4.9/5 baseado em 2.847 avaliações</p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {testimonials.map((t, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 h-full">
                    <div className="space-y-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                        ))}
                      </div>
                      <p className="text-muted-foreground text-sm italic leading-relaxed">"{t.content}"</p>
                      <div className="flex items-center gap-3 pt-2">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-lg">
                          {t.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="p-12 bg-card/50 backdrop-blur-sm border-accent/20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
                <div className="space-y-6 relative z-10">
                  <h2 className="text-4xl font-bold">
                    Pronto para transformar sua <span className="text-accent">produtividade</span>?
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                    Junte-se a milhares de pessoas que já descobriram o poder da organização inteligente
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Button 
                      size="lg" 
                      onClick={() => setAuthModalOpen(true)}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 h-12"
                    >
                      Gerar Plano Gratuito
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Teste grátis por 14 dias • Sem compromisso • Cancele quando quiser
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-card/30 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-lg font-bold">Alta Per4mance</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sistema completo de produtividade para pessoas que querem mais resultados.
                </p>
              </div>
              {[
                { title: 'Produto', items: ['Funcionalidades', 'Preços', 'Integrações', 'API'] },
                { title: 'Recursos', items: ['Blog', 'Guias', 'Webinars', 'Comunidade'] },
                { title: 'Suporte', items: ['Central de Ajuda', 'Contato', 'Status', 'Privacidade'] },
              ].map((section) => (
                <div key={section.title} className="space-y-4">
                  <h4 className="font-semibold text-sm">{section.title}</h4>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <p key={item} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border/50 mt-10 pt-8 text-center text-xs text-muted-foreground">
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
