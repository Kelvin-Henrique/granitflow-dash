import { useState, useEffect } from "react";
import { Users, Briefcase, CheckCircle2, FileText, DollarSign, Calendar, AlertCircle, TrendingUp, ClipboardList } from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/BentoGrid";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { DashboardStats, Order } from "@/types";
import dashboardService from "@/services/dashboardService";
import orderService from "@/services/orderService";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [statsResponse, ordersResponse] = await Promise.all([
          dashboardService.getStats(),
          orderService.getOrders()
        ]);

        if (statsResponse.error) {
          toast({
            title: "Erro",
            description: statsResponse.error,
            variant: "destructive",
          });
        } else if (statsResponse.data) {
          setStats(statsResponse.data);
        }

        if (ordersResponse.error) {
          toast({
            title: "Erro",
            description: ordersResponse.error,
            variant: "destructive",
          });
        } else if (ordersResponse.data) {
          // Pegar apenas os últimos 5 pedidos
          setOrders(ordersResponse.data.slice(0, 5));
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do dashboard",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

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
            title="Receita Mensal"
            value={stats ? formatCurrency(stats.monthlyRevenue) : "R$ 0,00"}
            icon={TrendingUp}
            trend={{ value: "15%", positive: true }}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard title="Receita Total" value={stats ? formatCurrency(stats.totalRevenue) : "R$ 0,00"} icon={DollarSign} />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard title="Orçamentos" value={stats ? stats.quotesCount.toString() : "0"} icon={FileText} />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Pedidos Pendentes"
            value={stats ? stats.pendingOrdersCount.toString() : "0"}
            icon={AlertCircle}
          />
        </BentoCard>
      </BentoGrid>

      {/* KPIs */}
      <BentoGrid>
        <BentoCard span={3}>
          <StatCard
            title="Total de Clientes"
            value={stats ? stats.customersCount.toString() : "0"}
            icon={Users}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Projetos Ativos"
            value={stats ? stats.activeProjectsCount.toString() : "0"}
            icon={Briefcase}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Total de Projetos"
            value={stats ? stats.projectsCount.toString() : "0"}
            icon={CheckCircle2}
          />
        </BentoCard>
        <BentoCard span={3}>
          <StatCard
            title="Materiais em Estoque Baixo"
            value={stats ? stats.lowStockMaterialsCount.toString() : "0"}
            icon={AlertCircle}
            trend={stats && stats.lowStockMaterialsCount > 0 ? { value: "Atenção", positive: false } : undefined}
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
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{order.customerName}</h3>
                      <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.projectName || "Sem projeto"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{formatCurrency(order.value)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
