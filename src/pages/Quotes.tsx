import { useState } from "react";
import { Plus, Search, FileText, Mail, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Quotes() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const quotes = [
    {
      id: 1,
      customer: "João Silva",
      project: "Cozinha Granito",
      value: 8500.0,
      status: "enviado",
      date: "2025-10-12",
      validUntil: "2025-10-26",
      items: 5,
    },
    {
      id: 2,
      customer: "Maria Santos",
      project: "Banheiro Mármore",
      value: 12300.0,
      status: "aprovado",
      date: "2025-10-10",
      validUntil: "2025-10-24",
      items: 8,
    },
    {
      id: 3,
      customer: "Pedro Costa",
      project: "Bancada Quartzito",
      value: 15800.0,
      status: "rascunho",
      date: "2025-10-08",
      validUntil: "2025-10-22",
      items: 3,
    },
    {
      id: 4,
      customer: "Ana Lima",
      project: "Lavabo Corium",
      value: 6200.0,
      status: "enviado",
      date: "2025-10-05",
      validUntil: "2025-10-19",
      items: 4,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      rascunho: "bg-muted text-muted-foreground",
      enviado: "bg-info/10 text-info",
      aprovado: "bg-success/10 text-success",
      rejeitado: "bg-destructive/10 text-destructive",
      expirado: "bg-warning/10 text-warning",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      rascunho: "Rascunho",
      enviado: "Enviado",
      aprovado: "Aprovado",
      rejeitado: "Rejeitado",
      expirado: "Expirado",
    };
    return labels[status] || status;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const filteredQuotes = quotes.filter(quote =>
    quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Orçamentos</h1>
        <Button onClick={() => navigate("/quotes/new")} className="bg-accent hover:bg-accent-hover">
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredQuotes.map((quote) => (
          <Card
            key={quote.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]"
            onClick={() => navigate(`/quotes/${quote.id}`)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-1">{quote.customer}</h3>
                  <p className="text-sm text-muted-foreground">{quote.project}</p>
                </div>
                <Badge className={getStatusColor(quote.status)}>
                  {getStatusLabel(quote.status)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Valor Total</span>
                  <span className="text-xl font-bold text-foreground">{formatCurrency(quote.value)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Itens</span>
                  <span className="text-foreground">{quote.items}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Criado em</span>
                  <span className="text-foreground">{quote.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Válido até</span>
                  <span className="text-foreground">{quote.validUntil}</span>
                </div>
              </div>

              {quote.status === "enviado" && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Enviar email
                    }}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Enviar WhatsApp
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                </div>
              )}

              {quote.status === "aprovado" && (
                <Button 
                  size="sm" 
                  className="w-full bg-success hover:bg-success/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Converter para OS
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Converter em OS
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
