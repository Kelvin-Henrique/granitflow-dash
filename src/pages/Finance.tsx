import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Calendar, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { StatCard } from "@/components/StatCard";

export default function Finance() {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>

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

      {/* Resumo Mensal */}
      <BentoGrid>
        <BentoCard span={3}>
          <StatCard
            title="Faturado (Mês)"
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
