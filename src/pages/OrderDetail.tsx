import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data
  const order = {
    id: id || "1",
    number: "OS-2025-0001",
    client: "João Silva",
    project: "Cozinha Granito Premium",
    status: "producao_interna",
    value: 8500.0,
    createdDate: "2025-10-12",
    deadline: "2025-10-25",
    progress: 45,
    materials: [
      { name: "Granito Branco Dallas", quantity: "8m²" },
      { name: "Cola Especial", quantity: "5 kg" },
    ],
    timeline: [
      { date: "2025-10-12", event: "OS Criada", status: "concluido" },
      { date: "2025-10-13", event: "Medição Realizada", status: "concluido" },
      { date: "2025-10-15", event: "Em Produção", status: "em_andamento" },
      { date: "2025-10-20", event: "Instalação Prevista", status: "pendente" },
    ],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      orcamento: "bg-muted text-muted-foreground",
      aprovada: "bg-info/10 text-info",
      producao_interna: "bg-warning/10 text-warning",
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
      aguardando_frete: "Aguardando Frete",
      instalacao: "Em Instalação",
      concluida: "Concluída",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/orders")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{order.number}</h1>
            <p className="text-sm text-muted-foreground">{order.project}</p>
          </div>
          <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigate(`/orders/${id}/edit`)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Dados da Ordem de Serviço</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium text-foreground">{order.client}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projeto</p>
                <p className="font-medium text-foreground">{order.project}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Criação</p>
                <p className="font-medium text-foreground">{order.createdDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prazo de Entrega</p>
                <p className="font-medium text-foreground">{order.deadline}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-2">Progresso</p>
                <Progress value={order.progress} className="h-3" />
                <p className="text-sm text-muted-foreground mt-1">{order.progress}% concluído</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(order.value)}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Linha do Tempo</h2>
            <div className="space-y-4">
              {order.timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`mt-1 h-3 w-3 rounded-full ${
                    item.status === "concluido" ? "bg-success" :
                    item.status === "em_andamento" ? "bg-warning" : "bg-muted"
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.event}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Materiais Utilizados</h2>
            <div className="space-y-3">
              {order.materials.map((material, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{material.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantidade: {material.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
