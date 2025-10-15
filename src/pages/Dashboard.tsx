import { Users, FolderKanban, CheckCircle, FileText, DollarSign, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // Mock data - será substituído por dados reais do Supabase
  const stats = {
    newCustomers: 12,
    activeProjects: 8,
    completedProjects: 15,
    openQuotes: 5,
  };

  const revenue = {
    billed: "R$ 45.280,00",
    toReceive: "R$ 23.150,00",
    overdue: "R$ 8.900,00",
    defaultRate: "R$ 2.340,00",
  };

  const orders = [
    { id: 1, client: "João Silva", project: "Cozinha Granito", status: "orcamento", value: "R$ 8.500,00", date: "2025-10-12" },
    { id: 2, client: "Maria Santos", project: "Banheiro Mármore", status: "aprovada", value: "R$ 12.300,00", date: "2025-10-10" },
    { id: 3, client: "Pedro Costa", project: "Bancada Quartzito", status: "producao_interna", value: "R$ 15.800,00", date: "2025-10-08" },
    { id: 4, client: "Ana Lima", project: "Lavabo Corium", status: "aguardando_frete", value: "R$ 6.200,00", date: "2025-10-05" },
    { id: 5, client: "Carlos Souza", project: "Sala Sinterizado", status: "instalacao", value: "R$ 22.400,00", date: "2025-10-03" },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      orcamento: "bg-muted text-muted-foreground",
      aprovada: "bg-info/10 text-info",
      producao_interna: "bg-warning/10 text-warning",
      producao_terceiro: "bg-warning/10 text-warning",
      aguardando_frete: "bg-purple-100 text-purple-700",
      instalacao: "bg-primary/10 text-primary",
      concluida: "bg-success/10 text-success",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      orcamento: "Em Orçamento",
      aprovada: "Aprovada",
      producao_interna: "Produção Interna",
      producao_terceiro: "Produção Terceiro",
      aguardando_frete: "Aguardando Frete",
      instalacao: "Em Instalação",
      concluida: "Concluída",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Linha 1 - KPIs */}
      <BentoGrid>
        <BentoCard span={3}>
          <StatCard
            title="Clientes Novos (Mês)"
            value={stats.newCustomers}
            icon={Users}
            trend={{ value: "8%", positive: true }}
            onClick={() => navigate("/customers")}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Projetos Ativos"
            value={stats.activeProjects}
            icon={FolderKanban}
            onClick={() => navigate("/projects")}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Projetos Finalizados (Mês)"
            value={stats.completedProjects}
            icon={CheckCircle}
            trend={{ value: "12%", positive: true }}
            onClick={() => navigate("/projects")}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Orçamentos Abertos"
            value={stats.openQuotes}
            icon={FileText}
            onClick={() => navigate("/quotes")}
          />
        </BentoCard>
      </BentoGrid>

      {/* Linha 2 - Kanban OS */}
      <BentoGrid>
        <BentoCard span={12} className="min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Pipeline de Ordens de Serviço</h2>
            <Button onClick={() => navigate("/orders")}>Ver Todas</Button>
          </div>
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-foreground">{order.client}</h3>
                    <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.project}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{order.value}</p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>
      </BentoGrid>

      {/* Linha 3 - Faturamento */}
      <BentoGrid>
        <BentoCard span={3}>
          <StatCard
            title="Faturado (Mês)"
            value={revenue.billed}
            icon={TrendingUp}
            trend={{ value: "15%", positive: true }}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="A Receber"
            value={revenue.toReceive}
            icon={Clock}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Em Aberto"
            value={revenue.overdue}
            icon={DollarSign}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Inadimplência"
            value={revenue.defaultRate}
            icon={AlertCircle}
            trend={{ value: "3%", positive: false }}
          />
        </BentoCard>
      </BentoGrid>

      {/* Ações Rápidas */}
      <BentoCard span={12}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/quotes/new")} className="bg-primary hover:bg-primary-hover">
            Novo Orçamento
          </Button>
          <Button onClick={() => navigate("/orders/new")} variant="outline">
            Nova OS
          </Button>
          <Button onClick={() => navigate("/schedule")} variant="outline">
            Agendar Medição
          </Button>
          <Button onClick={() => navigate("/finance")} variant="outline">
            Registrar Pagamento
          </Button>
        </div>
      </BentoCard>
    </div>
  );
}
