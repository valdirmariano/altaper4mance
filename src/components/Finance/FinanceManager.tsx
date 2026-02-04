import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Wallet,
  CreditCard,
  Receipt,
  Trash2,
  Target,
  Sparkles
} from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { ModuleInsight } from '@/components/Accountability/AccountabilityPartner';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

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

  // Calculate expenses by category for charts
  const expensesByCategory = transactions
    .filter(t => t.type === 'despesa')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['hsl(var(--accent))', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#6b7280'];

  // Get motivational message based on finances
  const getFinanceInsight = () => {
    if (savingsRate >= 30) return "🎉 Excelente! Você está economizando mais de 30% da sua renda. Continue assim!";
    if (savingsRate >= 15) return "💪 Bom trabalho! Sua taxa de economia está saudável.";
    if (savingsRate >= 0) return "💡 Tente aumentar sua economia para pelo menos 20% da renda.";
    return "⚠️ Atenção! Seus gastos estão maiores que sua renda. Vamos revisar juntos?";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Carregando finanças...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/20">
              <Wallet className="h-6 w-6 text-accent" />
            </div>
            Finanças
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle inteligente de receitas e despesas
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 border-green-500/30 hover:bg-green-500/10 text-green-500"
                onClick={() => setTransactionType('receita')}
              >
                <TrendingUp className="h-4 w-4" />
                Receita
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button 
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => setTransactionType('despesa')}
              >
                <TrendingDown className="h-4 w-4" />
                Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {transactionType === 'receita' ? (
                    <ArrowUpRight className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-500" />
                  )}
                  Nova {transactionType === 'receita' ? 'Receita' : 'Despesa'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Descrição"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-muted/50"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Valor (R$)"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-muted/50"
                />
                <Select
                  value={newTransaction.category}
                  onValueChange={(value) => setNewTransaction(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-muted/50">
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
                  className="bg-muted/50"
                />
                <Button 
                  onClick={handleAddTransaction} 
                  className={`w-full ${transactionType === 'receita' ? 'bg-green-500 hover:bg-green-600' : 'bg-accent hover:bg-accent/90'}`}
                >
                  Adicionar {transactionType === 'receita' ? 'Receita' : 'Despesa'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Accountability Partner Insight */}
      <ModuleInsight 
        module="finance" 
        customMessage={getFinanceInsight()}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-5 bg-card/50 backdrop-blur-xl border-border/50 hover:border-accent/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Saldo</span>
              <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <DollarSign className="h-4 w-4 text-accent" />
              </div>
            </div>
            <p className={`text-2xl lg:text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(balance)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {balance >= 0 ? 'Positivo' : 'Negativo'}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-5 bg-card/50 backdrop-blur-xl border-border/50 hover:border-green-500/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Receitas</span>
              <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-green-500">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Este período</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-5 bg-card/50 backdrop-blur-xl border-border/50 hover:border-red-500/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Despesas</span>
              <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-red-500">
              {formatCurrency(totalExpenses)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Este período</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 bg-card/50 backdrop-blur-xl border-border/50 hover:border-accent/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Economia</span>
              <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <PiggyBank className="h-4 w-4 text-accent" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-bold">
              {savingsRate}%
            </p>
            <Progress value={Math.max(0, savingsRate)} className="h-1.5 mt-2" />
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/50">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold flex items-center gap-2">
                <Receipt className="h-5 w-5 text-accent" />
                Transações Recentes
              </h3>
              <span className="text-xs text-muted-foreground">
                {transactions.length} transações
              </span>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              <AnimatePresence>
                {transactions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <CreditCard className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Nenhuma transação registrada</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Adicione receitas e despesas para começar
                    </p>
                  </motion.div>
                ) : (
                  transactions.slice(0, 15).map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        transaction.type === 'receita' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {transaction.type === 'receita' ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {transaction.description || 'Sem descrição'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="px-2 py-0.5 rounded-full bg-muted/50">{transaction.category}</span>
                          <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <p className={`text-sm font-semibold whitespace-nowrap ${
                        transaction.type === 'receita' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Charts Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Pie Chart - Expenses by Category */}
          <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Gastos por Categoria
            </h3>
            
            {pieData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">Sem despesas para exibir</p>
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Legend */}
            <div className="mt-4 space-y-2">
              {pieData.slice(0, 4).map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(entry.value)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Dica do Parceiro</h3>
                <p className="text-xs text-muted-foreground">Baseado nos seus dados</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {savingsRate < 20 
                ? "Tente a regra 50-30-20: 50% necessidades, 30% desejos, 20% poupança."
                : "Você está no caminho certo! Considere investir o excedente."
              }
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FinanceManager;
