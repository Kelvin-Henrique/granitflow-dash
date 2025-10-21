import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, TrendingDown, TrendingUp, DollarSign, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const material = {
    id: 1,
    name: "Granito Branco Dallas",
    type: "Granito",
    currentStock: 45.5,
    minStock: 20,
    unitCost: 500,
    unitPrice: 850,
    totalValue: 22750,
    colors: ["Branco", "Cinza Claro"],
    supplier: "Mármores São Paulo LTDA",
    lastPurchase: "2025-09-15",
  };

  const stockHistory = [
    { date: "2025-10-15", type: "saida", quantity: 12.5, project: "Cozinha João Silva", balance: 45.5 },
    { date: "2025-10-10", type: "entrada", quantity: 30, supplier: "Mármores SP", balance: 58 },
    { date: "2025-10-05", type: "saida", quantity: 8.3, project: "Banheiro Maria Santos", balance: 28 },
    { date: "2025-09-28", type: "saida", quantity: 15.2, project: "Bancada Pedro Costa", balance: 36.3 },
  ];

  const projects = [
    { id: 1, name: "Cozinha João Silva", quantity: 12.5, status: "concluido", date: "2025-10-15" },
    { id: 2, name: "Banheiro Maria Santos", quantity: 8.3, status: "em_andamento", date: "2025-10-05" },
    { id: 3, name: "Bancada Pedro Costa", quantity: 15.2, status: "concluido", date: "2025-09-28" },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      concluido: "bg-success/10 text-success",
      em_andamento: "bg-primary/10 text-primary",
      pendente: "bg-warning/10 text-warning",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const isLowStock = material.currentStock < material.minStock;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/materials")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{material.name}</h1>
          <p className="text-sm text-muted-foreground">{material.type}</p>
        </div>
        {isLowStock && (
          <Badge variant="destructive">Estoque Baixo</Badge>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={() => navigate(`/materials/${id}/add-stock`)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Estoque
        </Button>
        <Button variant="outline" onClick={() => navigate(`/materials/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-5 w-5 text-primary" />
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Estoque Atual</p>
          <p className="text-2xl font-bold text-foreground">{material.currentStock}m²</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="h-5 w-5 text-warning" />
          </div>
          <p className="text-sm text-muted-foreground">Estoque Mínimo</p>
          <p className="text-2xl font-bold text-foreground">{material.minStock}m²</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-success" />
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <p className="text-sm text-muted-foreground">Preço de Venda</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(material.unitPrice)}/m²</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-accent" />
          </div>
          <p className="text-sm text-muted-foreground">Valor Total</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(material.totalValue)}</p>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="history">Histórico de Estoque</TabsTrigger>
          <TabsTrigger value="projects">Projetos Utilizados</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Informações do Material</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium text-foreground">{material.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fornecedor</p>
                <p className="font-medium text-foreground">{material.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Custo por m²</p>
                <p className="font-medium text-foreground">{formatCurrency(material.unitCost)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preço de Venda por m²</p>
                <p className="font-medium text-foreground">{formatCurrency(material.unitPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margem de Lucro</p>
                <p className="font-medium text-success">
                  {((material.unitPrice - material.unitCost) / material.unitCost * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Última Compra</p>
                <p className="font-medium text-foreground">{material.lastPurchase}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Cores Disponíveis</p>
                <div className="flex gap-2 mt-1">
                  {material.colors.map((color, index) => (
                    <Badge key={index} variant="outline">{color}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Movimentações de Estoque</h2>
            <div className="space-y-3">
              {stockHistory.map((movement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Badge variant={movement.type === "entrada" ? "default" : "secondary"}>
                        {movement.type === "entrada" ? "Entrada" : "Saída"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{movement.date}</span>
                    </div>
                    <p className="text-sm text-foreground">
                      {movement.type === "entrada" ? `Compra: ${movement.supplier}` : `Projeto: ${movement.project}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${movement.type === "entrada" ? "text-success" : "text-destructive"}`}>
                      {movement.type === "entrada" ? "+" : "-"}{movement.quantity}m²
                    </p>
                    <p className="text-xs text-muted-foreground">Saldo: {movement.balance}m²</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Projetos que Utilizaram este Material</h2>
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{project.quantity}m²</p>
                    <Badge className={getStatusColor(project.status)} variant="outline">
                      {project.status === "concluido" ? "Concluído" : "Em Andamento"}
                    </Badge>
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
