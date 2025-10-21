import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Package, Calendar, MapPin, Image, Edit, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const project = {
    id: 1,
    name: "Cozinha Granito Premium",
    customer: "João Silva",
    customerId: 1,
    material: "Granito Branco Dallas",
    area: "12.5m²",
    status: "em_producao",
    progress: 65,
    deadline: "2025-11-15",
    createdAt: "2025-10-01",
    location: "Rua das Flores, 123 - São Paulo/SP",
    imageCount: 8,
    cost: 8500,
    description: "Bancada de cozinha em granito branco com acabamento polido e borda reta.",
  };

  const timeline = [
    { phase: "Medição", status: "concluido", date: "2025-10-01", color: "bg-success" },
    { phase: "Orçamento Aprovado", status: "concluido", date: "2025-10-03", color: "bg-success" },
    { phase: "Produção Interna", status: "em_andamento", date: "2025-10-08", color: "bg-warning" },
    { phase: "Instalação", status: "pendente", date: "2025-11-12", color: "bg-muted" },
    { phase: "Conclusão", status: "pendente", date: "2025-11-15", color: "bg-muted" },
  ];

  const materials = [
    { name: "Granito Branco Dallas", quantity: "12.5m²", cost: 6250 },
    { name: "Cola para granito", quantity: "2 baldes", cost: 180 },
    { name: "Acabamento borda", quantity: "4.5m", cost: 450 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      medicao: "bg-info/10 text-info",
      orcamento: "bg-warning/10 text-warning",
      em_producao: "bg-primary/10 text-primary",
      instalacao: "bg-accent/10 text-accent",
      concluido: "bg-success/10 text-success",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      medicao: "Em Medição",
      orcamento: "Em Orçamento",
      em_producao: "Em Produção",
      instalacao: "Em Instalação",
      concluido: "Concluído",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
          <p className="text-sm text-muted-foreground">Projeto #{id}</p>
        </div>
        <Badge className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</Badge>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => navigate(`/projects/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p 
                className="font-medium text-foreground cursor-pointer hover:underline"
                onClick={() => navigate(`/customers/${project.customerId}`)}
              >
                {project.customer}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Prazo</p>
              <p className="font-medium text-foreground">{project.deadline}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="font-medium text-foreground">{formatCurrency(project.cost)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Progresso do Projeto</h3>
            <span className="text-sm font-medium text-primary">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Status atual: {getStatusLabel(project.status)}
          </p>
        </div>
      </Card>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="images">Imagens ({project.imageCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Informações do Projeto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Material</p>
                <p className="font-medium text-foreground">{project.material}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Área</p>
                <p className="font-medium text-foreground">{project.area}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Local de Instalação</p>
                <p className="font-medium text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {project.location}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="font-medium text-foreground">{project.description}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${item.color}/10`}>
                    {item.status === "concluido" ? (
                      <CheckCircle className={`h-5 w-5 ${item.color.replace("bg-", "text-")}`} />
                    ) : (
                      <div className={`h-5 w-5 rounded-full border-2 ${item.color.replace("bg-", "border-")}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.phase}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <Badge variant="outline" className={item.color.replace("bg-", "bg-") + "/10"}>
                    {item.status === "concluido" ? "Concluído" : item.status === "em_andamento" ? "Em Andamento" : "Pendente"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Materiais Utilizados</h2>
            <div className="space-y-3">
              {materials.map((material, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{material.name}</p>
                    <p className="text-sm text-muted-foreground">{material.quantity}</p>
                  </div>
                  <p className="font-semibold text-foreground">{formatCurrency(material.cost)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <p className="font-semibold text-foreground">Total em Materiais</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(materials.reduce((sum, m) => sum + m.cost, 0))}
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: project.imageCount }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors"
                >
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Image className="mr-2 h-4 w-4" />
              Adicionar Imagens
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
