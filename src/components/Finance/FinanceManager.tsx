import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  PiggyBank,
  MoreHorizontal,
  Filter
} from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

const FinanceManager = () => {
  const [transactions] = useState<Transaction[]>([
    { id: '1', description: 'Salário', amount: 8500, type: 'income', category: 'Renda', date: '2026-01-01' },
    { id: '2', description: 'Aluguel', amount: 2000, type: 'expense', category: 'Moradia', date: '2026-01-05' },
    { id: '3', description: 'Mercado', amount: 850, type: 'expense', category: 'Alimentação', date: '2026-01-03' },
    { id: '4', description: 'Netflix', amount: 55.90, type: 'expense', category: 'Assinaturas', date: '2026-01-01' },
    { id: '5', description: 'Freelance', amount: 1500, type: 'income', category: 'Renda Extra', date: '2026-01-02' },
    { id: '6', description: 'Gasolina', amount: 250, type: 'expense', category: 'Transporte', date: '2026-01-03' },
    { id: '7', description: 'Academia', amount: 150, type: 'expense', category: 'Saúde', date: '2026-01-01' },
  ]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const budgets = [
    { category: 'Alimentação', spent: 850, limit: 1200 },
    { category: 'Transporte', spent: 250, limit: 500 },
    { category: 'Lazer', spent: 300, limit: 400 },
    { category: 'Assinaturas', spent: 55.90, limit: 200 },
  ];

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Finanças</h1>
          <p className="text-muted-foreground text-sm">
            Controle suas receitas, despesas e orçamentos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Receita
          </Button>
          <Button size="sm">
            <TrendingDown className="h-4 w-4 mr-2" />
            Despesa
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Saldo</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(balance)}
          </p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Receitas</p>
            <ArrowUpRight className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-semibold text-success">{formatCurrency(totalIncome)}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Despesas</p>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </div>
          <p className="text-2xl font-semibold text-destructive">{formatCurrency(totalExpense)}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Economia</p>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold">{Math.round((balance / totalIncome) * 100)}%</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <Card className="p-5 bg-card border-border lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Transações Recentes</h3>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>

          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-muted-foreground/30 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-success/20' : 'bg-destructive/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <p className={`text-sm font-medium ${
                  transaction.type === 'income' ? 'text-success' : 'text-destructive'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>

          <Button variant="ghost" className="w-full mt-3 h-9 text-muted-foreground">
            Ver todas as transações
          </Button>
        </Card>

        {/* Budgets */}
        <Card className="p-5 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Orçamentos</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {budgets.map((budget, index) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const isOver = percentage > 100;
              const isWarning = percentage > 80;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{budget.category}</span>
                    <span className={`font-medium ${isOver ? 'text-destructive' : isWarning ? 'text-warning' : ''}`}>
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-2 ${isOver ? 'bg-destructive/20' : isWarning ? 'bg-warning/20' : ''}`}
                  />
                </div>
              );
            })}
          </div>

          <Button variant="ghost" className="w-full mt-4 h-9 text-muted-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar orçamento
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default FinanceManager;
