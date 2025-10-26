
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import customerService from "@/services/customerService";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/types";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      if (!id) {
        setError("ID do cliente não informado.");
        setLoading(false);
        return;
      }
      const { data, error } = await customerService.getCustomer(Number(id));
      if (error || !data) {
        setError(error || "Cliente não encontrado.");
        setLoading(false);
        toast({
          title: "Erro",
          description: error || "Cliente não encontrado.",
          variant: "destructive",
        });
        return;
      }
      setCustomer(data);
      setLoading(false);
    };
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ativo: "bg-success/10 text-success",
      pendente: "bg-warning/10 text-warning",
      inativo: "bg-destructive/10 text-destructive",
      concluído: "bg-success/10 text-success",
      em_andamento: "bg-primary/10 text-primary",
      orcamento: "bg-warning/10 text-warning",
      enviado: "bg-info/10 text-info",
      aprovado: "bg-success/10 text-success",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="text-muted-foreground">Carregando dados do cliente...</span>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <span className="text-destructive font-medium">{error || "Cliente não encontrado."}</span>
        <Button onClick={() => navigate("/customers")}>Voltar para lista</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/customers")}> 
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{customer.name}</h1>
        <Badge className={getStatusColor(customer.status)}>
          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
        </Badge>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => navigate(`/customers/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          {/* <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="quotes">Orçamentos</TabsTrigger> */}
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Dados de Contato</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium text-foreground">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
                  <p className="font-medium text-foreground">{customer.cpfCnpj}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Último Contato</p>
                  <p className="font-medium text-foreground">{customer.lastContact}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Endereço</h2>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-medium text-foreground">{customer.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.city} - {customer.state}, CEP: {customer.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Observações</h2>
            <p className="text-muted-foreground">{customer.notes}</p>
          </Card>
        </TabsContent>

        {/* Projetos e Orçamentos reais podem ser implementados aqui futuramente */}

        <TabsContent value="history" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-border">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Cadastro realizado</p>
                  <p className="text-sm text-muted-foreground">{customer.createdAt}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Phone className="h-4 w-4 text-info" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Último contato telefônico</p>
                  <p className="text-sm text-muted-foreground">{customer.lastContact}</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
