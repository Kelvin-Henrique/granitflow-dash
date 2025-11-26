import { useState, useEffect } from "react";
import { Plus, Search, Mail, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Quote } from "@/types";
import quoteService from "@/services/quoteService";
import { useToast } from "@/hooks/use-toast";

export default function Quotes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await quoteService.getQuotes();
      if (error) {
        toast({
          title: "Erro",
          description: error,
          variant: "destructive",
        });
      } else if (data) {
        setQuotes(data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar orçamentos",
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
        const { data, error } = await quoteService.getQuotes(searchTerm);
        if (error) {
          toast({
            title: "Erro",
            description: error,
            variant: "destructive",
          });
        } else if (data) {
          setQuotes(data);
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao buscar orçamentos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      loadQuotes();
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Orçamentos</h1>
          <Button onClick={() => navigate("/quotes/new")} className="bg-accent hover:bg-accent-hover">
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando orçamentos...</p>
        </div>
      </div>
    );
  }

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
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
      </Card>

      {quotes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum orçamento encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {quotes.map((quote) => (
            <Card
              key={quote.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]"
              onClick={() => navigate(`/quotes/${quote.id}`)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">{quote.customerName}</h3>
                    <p className="text-sm text-muted-foreground">{quote.projectName}</p>
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
                    <span className="text-foreground">{quote.items?.length || 0}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Criado em</span>
                    <span className="text-foreground">{formatDate(quote.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Válido até</span>
                    <span className="text-foreground">{formatDate(quote.validUntil)}</span>
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
      )}
    </div>
  );
}
