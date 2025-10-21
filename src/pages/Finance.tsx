import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Calendar, FileText, Download, Plus, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Finance() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState("10");
  // Mock data
  const cashflow = {
    today: {
      income: 15800.0,
      expenses: 8200.0,
      balance: 7600.0,
    },
    month: {
      billed: 45280.0,
      toReceive: 23150.0,
      overdue: 8900.0,
      defaultRate: 2340.0,
    },
  };

  const transactions = [
    {
      id: 1,
      type: "receita",
      description: "Pagamento OS #0123 - João Silva",
      value: 8500.0,
      date: "2025-10-17",
      status: "confirmado",
      category: "vendas",
    },
    {
      id: 2,
      type: "despesa",
      description: "Compra Material - Granito 45m²",
      value: 12500.0,
      date: "2025-10-16",
      status: "confirmado",
      category: "materiais",
    },
    {
      id: 3,
      type: "receita",
      description: "Pagamento OS #0115 - Maria Santos",
      value: 6150.0,
      date: "2025-10-15",
      status: "pendente",
      category: "vendas",
    },
    {
      id: 4,
      type: "despesa",
      description: "Frete - Entrega Campinas",
      value: 450.0,
      date: "2025-10-15",
      status: "confirmado",
      category: "logistica",
    },
    {
      id: 5,
      type: "despesa",
      description: "Salários - Equipe Produção",
      value: 18200.0,
      date: "2025-10-05",
      status: "confirmado",
      category: "folha",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmado: "bg-success/10 text-success",
      pendente: "bg-warning/10 text-warning",
      atrasado: "bg-destructive/10 text-destructive",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      confirmado: "Confirmado",
      pendente: "Pendente",
      atrasado: "Atrasado",
    };
    return labels[status] || status;
  };

  const handleExport = () => {
    toast({
      title: "Exportando relatório...",
      description: "O arquivo será baixado em instantes.",
    });
    
    // Simula exportação
    setTimeout(() => {
      toast({
        title: "Relatório exportado!",
        description: "O arquivo foi salvo com sucesso.",
      });
    }, 1500);
  };

  const getPeriodLabel = () => {
    const labels: Record<string, string> = {
      month: "Mês Atual",
      quarter: "Trimestre",
      semester: "Semestre",
      year: "Ano",
    };
    return labels[selectedPeriod] || "Período";
  };

  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
          <Button onClick={() => navigate("/finance/transaction/new")} className="bg-accent hover:bg-accent-hover">
            <Plus className="mr-2 h-4 w-4" />
            Nova Movimentação
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Período:</span>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mensal</SelectItem>
              <SelectItem value="quarter">Trimestral</SelectItem>
              <SelectItem value="semester">Semestral</SelectItem>
              <SelectItem value="year">Anual</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedPeriod === "month" && (
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Badge variant="outline" className="ml-auto">
            Visualizando: {getPeriodLabel()}
          </Badge>
        </div>
      </Card>

      {/* Fluxo do Dia */}
      <BentoGrid>
        <BentoCard span={4}>
          <StatCard
            title="Entradas Hoje"
            value={formatCurrency(cashflow.today.income)}
            icon={TrendingUp}
            trend={{ value: "12%", positive: true }}
          />
        </BentoCard>
        <BentoCard span={4}>
          <StatCard
            title="Saídas Hoje"
            value={formatCurrency(cashflow.today.expenses)}
            icon={TrendingDown}
            trend={{ value: "8%", positive: false }}
          />
        </BentoCard>
        <BentoCard span={4}>
          <StatCard
            title="Saldo do Dia"
            value={formatCurrency(cashflow.today.balance)}
            icon={DollarSign}
            trend={{ value: "15%", positive: true }}
          />
        </BentoCard>
      </BentoGrid>

      {/* Resumo do Período */}
      <BentoGrid>
        <BentoCard span={3}>
          <StatCard
            title="Faturado"
            value={formatCurrency(cashflow.month.billed)}
            icon={TrendingUp}
            trend={{ value: "15%", positive: true }}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="A Receber"
            value={formatCurrency(cashflow.month.toReceive)}
            icon={Calendar}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Em Aberto"
            value={formatCurrency(cashflow.month.overdue)}
            icon={FileText}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Inadimplência"
            value={formatCurrency(cashflow.month.defaultRate)}
            icon={AlertCircle}
            trend={{ value: "3%", positive: false }}
          />
        </BentoCard>
      </BentoGrid>

      {/* Movimentações Recentes */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Movimentações Recentes</h2>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <Badge variant={transaction.type === "receita" ? "default" : "secondary"}>
                    {transaction.type === "receita" ? "Receita" : "Despesa"}
                  </Badge>
                  <Badge className={getStatusColor(transaction.status)} variant="outline">
                    {getStatusLabel(transaction.status)}
                  </Badge>
                </div>
                <h3 className="font-medium text-foreground">{transaction.description}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {transaction.category} • {transaction.date}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-xl font-bold ${
                    transaction.type === "receita" ? "text-success" : "text-destructive"
                  }`}
                >
                  {transaction.type === "receita" ? "+" : "-"} {formatCurrency(transaction.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
