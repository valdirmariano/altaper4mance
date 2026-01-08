import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Filter,
  Trash2
} from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const FinanceManager = () => {
  const { transactions, loading, addTransaction, deleteTransaction, getTotals } = useTransactions();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'receita' | 'despesa'>('despesa');
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: 'Outros',
    date: new Date().toISOString().split('T')[0]
  });

  const { totalIncome, totalExpenses, balance } = getTotals();
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  const categories = {
    receita: ['Salário', 'Freelance', 'Investimentos', 'Renda Extra', 'Outros'],
    despesa: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Assinaturas', 'Educação', 'Outros']
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.description.trim() || !newTransaction.amount) return;
    
    await addTransaction({
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      type: transactionType,
      category: newTransaction.category,
      date: newTransaction.date,
      notes: null,
      receipt_url: null
    });
    
    setNewTransaction({
      description: '',
      amount: '',
      category: 'Outros',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddOpen(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Calculate budgets from expenses
  const expensesByCategory = transactions
    .filter(t => t.type === 'despesa')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const budgets = Object.entries(expensesByCategory)
    .map(([category, spent]) => ({
      category,
      spent,
      limit: spent * 1.2 // For demo, set limit as 20% more than spent
    }))
    .slice(0, 4);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando finanças...</p>
      </div>
    );
  }

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
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setTransactionType('receita')}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Receita
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setTransactionType('despesa')}>
                <TrendingDown className="h-4 w-4 mr-2" />
                Despesa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Nova {transactionType === 'receita' ? 'Receita' : 'Despesa'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Descrição"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Valor (R$)"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                />
                <Select
                  value={newTransaction.category}
                  onValueChange={(value) => setNewTransaction(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[transactionType].map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                />
                <Button onClick={handleAddTransaction} className="w-full">
                  Adicionar {transactionType === 'receita' ? 'Receita' : 'Despesa'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Saldo</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(balance)}
          </p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Receitas</p>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-semibold text-green-500">{formatCurrency(totalIncome)}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Despesas</p>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-2xl font-semibold text-red-500">{formatCurrency(totalExpenses)}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">Economia</p>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold">{savingsRate}%</p>
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
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Nenhuma transação registrada
              </p>
            ) : (
              transactions.slice(0, 10).map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-muted-foreground/30 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'receita' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {transaction.type === 'receita' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{transaction.description || 'Sem descrição'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${
                    transaction.type === 'receita' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {transactions.length > 10 && (
            <Button variant="ghost" className="w-full mt-3 h-9 text-muted-foreground">
              Ver todas as transações
            </Button>
          )}
        </Card>

        {/* Budgets */}
        <Card className="p-5 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Gastos por Categoria</h3>
          </div>

          <div className="space-y-4">
            {budgets.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                Sem despesas registradas
              </p>
            ) : (
              budgets.map((budget, index) => {
                const percentage = (budget.spent / budget.limit) * 100;
                const isOver = percentage > 100;
                const isWarning = percentage > 80;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{budget.category}</span>
                      <span className={`font-medium ${isOver ? 'text-red-500' : isWarning ? 'text-yellow-500' : ''}`}>
                        {formatCurrency(budget.spent)}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${isOver ? 'bg-red-500/20' : isWarning ? 'bg-yellow-500/20' : ''}`}
                    />
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinanceManager;
