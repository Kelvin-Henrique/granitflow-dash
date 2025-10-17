import { useState } from "react";
import { Plus, Search, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const orders = [
    { 
      id: 1, 
      client: "João Silva", 
      project: "Cozinha Granito", 
      status: "orcamento", 
      value: 8500.00, 
      date: "2025-10-12",
      deadline: "2025-10-25"
    },
    { 
      id: 2, 
      client: "Maria Santos", 
      project: "Banheiro Mármore", 
      status: "aprovada", 
      value: 12300.00, 
      date: "2025-10-10",
      deadline: "2025-10-28"
    },
    { 
      id: 3, 
      client: "Pedro Costa", 
      project: "Bancada Quartzito", 
      status: "producao_interna", 
      value: 15800.00, 
      date: "2025-10-08",
      deadline: "2025-10-22"
    },
    { 
      id: 4, 
      client: "Ana Lima", 
      project: "Lavabo Corium", 
      status: "aguardando_frete", 
      value: 6200.00, 
      date: "2025-10-05",
      deadline: "2025-10-20"
    },
    { 
      id: 5, 
      client: "Carlos Souza", 
      project: "Sala Sinterizado", 
      status: "instalacao", 
      value: 22400.00, 
      date: "2025-10-03",
      deadline: "2025-10-18"
    },
    { 
      id: 6, 
      client: "Juliana Ribeiro", 
      project: "Banheira Mármore", 
      status: "concluida", 
      value: 18900.00, 
      date: "2025-09-28",
      deadline: "2025-10-15"
    },
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

  const filteredOrders = orders.filter(order =>
    order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            className="pl-10"
          />
        </div>
      </Card>

      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg text-foreground">{order.client}</h3>
                  <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{order.project}</p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>OS #{order.id.toString().padStart(4, '0')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Prazo: {order.deadline}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{formatCurrency(order.value)}</p>
                <p className="text-xs text-muted-foreground mt-1">Criado em {order.date}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
