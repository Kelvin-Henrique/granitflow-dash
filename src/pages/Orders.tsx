import { useState, useEffect } from "react";
import { Plus, Search, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Order } from "@/types";
import orderService from "@/services/orderService";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await orderService.getOrders();
      if (error) {
        toast({
          title: "Erro",
          description: error,
          variant: "destructive",
        });
      } else if (data) {
        setOrders(data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar pedidos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        const { data, error } = await orderService.getOrders(searchTerm);
        if (error) {
          toast({
            title: "Erro",
            description: error,
            variant: "destructive",
          });
        } else if (data) {
          setOrders(data);
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao buscar pedidos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      loadOrders();
    }
  };

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sem prazo";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = [];
    }
    acc[order.status].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const statusColumns = [
    { key: "orcamento", label: "Orçamento", color: "border-muted" },
    { key: "aprovada", label: "Aprovada", color: "border-info" },
    { key: "producao_interna", label: "Em Produção", color: "border-warning" },
    { key: "aguardando_frete", label: "Aguardando Frete", color: "border-purple-500" },
    { key: "instalacao", label: "Instalação", color: "border-primary" },
    { key: "concluida", label: "Concluída", color: "border-success" },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Ordens de Serviço</h1>
          <Button onClick={() => navigate("/orders/new")} className="bg-accent hover:bg-accent-hover">
            <Plus className="mr-2 h-4 w-4" />
            Nova OS
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Ordens de Serviço</h1>
        <Button onClick={() => navigate("/orders/new")} className="bg-accent hover:bg-accent-hover">
          <Plus className="mr-2 h-4 w-4" />
          Nova OS
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou projeto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Pipeline de OS */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 overflow-x-auto pb-4">
        {statusColumns.map((column) => (
          <Card key={column.key} className={`p-4 border-t-4 ${column.color} min-w-[280px]`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">{column.label}</h2>
              <Badge variant="outline" className="text-xs">{groupedOrders[column.key]?.length || 0}</Badge>
            </div>
            <div className="space-y-4">
              {(groupedOrders[column.key] || []).map((order) => (
                <Card
                  key={order.id}
                  className="p-4 cursor-pointer hover:shadow-lg transition-all bg-card"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">{order.number}</p>
                      <h3 className="font-semibold text-sm text-foreground">{order.customerName}</h3>
                      <p className="text-xs text-muted-foreground">{order.projectName || "Sem projeto"}</p>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(order.deadline)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-success" />
                        <span className="font-semibold text-foreground">{formatCurrency(order.value)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
