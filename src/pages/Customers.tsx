import { useState, useEffect } from "react";
import { Plus, Search, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Customer } from "@/types";
import customerService from "@/services/customerService";
import { useToast } from "@/hooks/use-toast";

export default function Customers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialCustomers = async () => {
      setLoading(true);
      try {
        const { data, error } = await customerService.getCustomers();
        if (error) {
          toast({
            title: "Erro",
            description: error,
            variant: "destructive",
          });
        } else if (data) {
          setCustomers(data);
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar clientes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialCustomers();
  }, [toast]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await customerService.getCustomers();
      if (error) {
        toast({
          title: "Erro",
          description: error,
          variant: "destructive",
        });
      } else if (data) {
        setCustomers(data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar clientes",
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
        const { data, error } = await customerService.getCustomers(searchTerm);
        if (error) {
          toast({
            title: "Erro",
            description: error,
            variant: "destructive",
          });
        } else if (data) {
          setCustomers(data);
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao buscar clientes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      loadCustomers();
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ativo: "bg-success/10 text-success",
      pendente: "bg-warning/10 text-warning",
      cancelado: "bg-destructive/10 text-destructive",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ativo: "Ativo",
      pendente: "Pendente",
      cancelado: "Cancelado",
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <Button onClick={() => navigate("/customers/new")} className="bg-accent hover:bg-accent-hover">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <Button onClick={() => navigate("/customers/new")} className="bg-accent hover:bg-accent-hover">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
      </Card>

      {customers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <Card
              key={customer.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
              onClick={() => navigate(`/customers/${customer.id}`)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{customer.name}</h3>
                    <Badge className={getStatusColor(customer.status)}>
                      {getStatusLabel(customer.status)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{customer.city}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{customer.projectsCount} projetos</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(customer.lastContact)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
