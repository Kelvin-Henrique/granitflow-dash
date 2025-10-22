import { Users, Briefcase, CheckCircle2, FileText, DollarSign, Calendar, AlertCircle, TrendingUp, ClipboardList } from "lucide-react";
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const revenueNumbers = {
    billed: 45280,
    toReceive: 23150,
    overdue: 8900,
    defaultRate: 2340,
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Ações Rápidas */}
      <BentoGrid>
        <BentoCard span={3}>
          <div className="h-full p-4 cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg" onClick={() => navigate("/quotes/new")}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Novo</p>
                <p className="text-base font-bold text-foreground">Orçamento</p>
              </div>
            </div>
          </div>
        </BentoCard>
        <BentoCard span={3}>
          <div className="h-full p-4 cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-lg" onClick={() => navigate("/orders/new")}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <ClipboardList className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nova</p>
                <p className="text-base font-bold text-foreground">OS</p>
              </div>
            </div>
          </div>
        </BentoCard>
        <BentoCard span={3}>
          <div className="h-full p-4 cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-info/5 to-info/10 border border-info/20 rounded-lg" onClick={() => navigate("/schedule/new")}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <Calendar className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Agendar</p>
                <p className="text-base font-bold text-foreground">Medição</p>
              </div>
            </div>
          </div>
        </BentoCard>
        <BentoCard span={3}>
          <div className="h-full p-4 cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-success/5 to-success/10 border border-success/20 rounded-lg" onClick={() => navigate("/finance/transaction/new")}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Registrar</p>
                <p className="text-base font-bold text-foreground">Pagamento</p>
              </div>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>

      {/* Financeiro */}
      <BentoGrid>
        <BentoCard span={3}>
          <StatCard
            title="Faturado (Mês)"
            value={formatCurrency(revenueNumbers.billed)}
            icon={TrendingUp}
            trend={{ value: "15%", positive: true }}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard title="A Receber" value={formatCurrency(revenueNumbers.toReceive)} icon={Calendar} />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard title="Em Aberto" value={formatCurrency(revenueNumbers.overdue)} icon={FileText} />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Inadimplência"
            value={formatCurrency(revenueNumbers.defaultRate)}
            icon={AlertCircle}
            trend={{ value: "3%", positive: false }}
          />
        </BentoCard>
      </BentoGrid>

      {/* KPIs */}
      <BentoGrid>
        <BentoCard span={3}>
          <StatCard
            title="Clientes Novos (Mês)"
            value={stats.newCustomers.toString()}
            icon={Users}
            trend={{ value: "+8%", positive: true }}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Projetos Ativos"
            value={stats.activeProjects.toString()}
            icon={Briefcase}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Projetos Finalizados (Mês)"
            value={stats.completedProjects.toString()}
            icon={CheckCircle2}
            trend={{ value: "+12%", positive: true }}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Orçamentos Abertos"
            value={stats.openQuotes.toString()}
            icon={FileText}
          />
        </BentoCard>
      </BentoGrid>

      {/* Pipeline de Ordens de Serviço */}
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
    </div>
  );
}
