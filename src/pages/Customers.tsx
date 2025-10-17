import { useState } from "react";
import { Plus, Search, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Customers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const customers = [
    { 
      id: 1, 
      name: "João Silva", 
      email: "joao@email.com", 
      phone: "(11) 98765-4321",
      status: "ativo",
      projects: 3,
      lastContact: "2025-10-15",
      city: "São Paulo"
    },
    { 
      id: 2, 
      name: "Maria Santos", 
      email: "maria@email.com", 
      phone: "(11) 97654-3210",
      status: "ativo",
      projects: 1,
      lastContact: "2025-10-12",
      city: "Campinas"
    },
    { 
      id: 3, 
      name: "Pedro Costa", 
      email: "pedro@email.com", 
      phone: "(11) 96543-2109",
      status: "pendente",
      projects: 0,
      lastContact: "2025-10-08",
      city: "Santos"
    },
    { 
      id: 4, 
      name: "Ana Lima", 
      email: "ana@email.com", 
      phone: "(11) 95432-1098",
      status: "ativo",
      projects: 2,
      lastContact: "2025-10-10",
      city: "São Paulo"
    },
  ];

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

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

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
            className="pl-10"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
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
                  <span>{customer.projects} projetos</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{customer.lastContact}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
