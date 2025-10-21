import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - será substituído por dados reais do Supabase
  const customer = {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 98765-4321",
    cpfCnpj: "123.456.789-00",
    status: "ativo",
    address: "Rua das Flores, 123 - Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    createdAt: "2025-01-15",
    lastContact: "2025-10-15",
    notes: "Cliente preferencial, sempre pontual nos pagamentos",
  };

  const projects = [
    { id: 1, name: "Cozinha Granito", status: "concluído", value: 8500, date: "2025-09-20" },
    { id: 2, name: "Banheiro Mármore", status: "em_andamento", value: 12300, date: "2025-10-10" },
    { id: 3, name: "Bancada Quartzito", status: "orcamento", value: 15800, date: "2025-10-15" },
  ];

  const quotes = [
    { id: 1, project: "Lavabo Premium", value: 6200, status: "enviado", date: "2025-10-12" },
    { id: 2, project: "Sala Sinterizado", value: 22400, status: "aprovado", date: "2025-09-28" },
  ];

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
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="quotes">Orçamentos</TabsTrigger>
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

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace("_", " ")}
                    </Badge>
                    <p className="font-bold text-foreground mt-1">{formatCurrency(project.value)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {quotes.map((quote) => (
              <Card
                key={quote.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/quotes/${quote.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{quote.project}</h3>
                    <p className="text-sm text-muted-foreground">{quote.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
                    <p className="font-bold text-foreground mt-1">{formatCurrency(quote.value)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

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
              <div className="flex items-start gap-4 pb-4 border-b border-border">
                <div className="p-2 bg-success/10 rounded-lg">
                  <FileText className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Orçamento aprovado - Sala Sinterizado</p>
                  <p className="text-sm text-muted-foreground">2025-09-28</p>
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
