import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QuoteDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data
  const quote = {
    id: id || "1",
    number: "ORC-2025-001",
    client: "João Silva",
    project: "Cozinha Granito Premium",
    status: "enviada",
    value: 8500.0,
    createdDate: "2025-10-12",
    validUntil: "2025-11-12",
    materials: [
      { name: "Granito Branco Dallas", quantity: "8m²", unit: 850, total: 6800 },
      { name: "Cola Especial", quantity: "5 kg", unit: 120, total: 600 },
      { name: "Mão de obra", quantity: "1", unit: 1100, total: 1100 },
    ],
    notes: "Inclui medição, corte, instalação e acabamento. Prazo de entrega: 15 dias úteis após aprovação.",
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      rascunho: "bg-muted text-muted-foreground",
      enviada: "bg-info/10 text-info",
      aprovada: "bg-success/10 text-success",
      rejeitada: "bg-destructive/10 text-destructive",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      rascunho: "Rascunho",
      enviada: "Enviada",
      aprovada: "Aprovada",
      rejeitada: "Rejeitada",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/quotes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{quote.number}</h1>
            <p className="text-sm text-muted-foreground">{quote.project}</p>
          </div>
          <Badge className={getStatusColor(quote.status)}>{getStatusLabel(quote.status)}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          {quote.status === "rascunho" && (
            <Button variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={() => navigate(`/quotes/${id}/edit`)}>
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
          <TabsTrigger value="items">Itens</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Dados do Orçamento</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium text-foreground">{quote.client}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projeto</p>
                <p className="font-medium text-foreground">{quote.project}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Criação</p>
                <p className="font-medium text-foreground">{quote.createdDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Válido Até</p>
                <p className="font-medium text-foreground">{quote.validUntil}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(quote.value)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Observações</p>
                <p className="text-foreground">{quote.notes}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Itens do Orçamento</h2>
            <div className="space-y-3">
              {quote.materials.map((material, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{material.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {material.quantity} × {formatCurrency(material.unit)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{formatCurrency(material.total)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(quote.value)}</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
