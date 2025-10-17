import { Plus, User, Mail, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function Team() {
  const navigate = useNavigate();

  const team = [
    {
      id: 1,
      name: "Carlos Silva",
      email: "carlos@marmoesp.com.br",
      phone: "(11) 98765-4321",
      role: "admin",
      department: "Administração",
      status: "ativo",
    },
    {
      id: 2,
      name: "Ana Santos",
      email: "ana@marmoraria.com.br",
      phone: "(11) 98765-4322",
      role: "showroom",
      department: "Vendas",
      status: "ativo",
    },
    {
      id: 3,
      name: "João Oliveira",
      email: "joao@marmoraria.com.br",
      phone: "(11) 98765-4323",
      role: "producao",
      department: "Produção",
      status: "ativo",
    },
    {
      id: 4,
      name: "Maria Costa",
      email: "maria@marmoraria.com.br",
      phone: "(11) 98765-4324",
      role: "financeiro",
      department: "Financeiro",
      status: "ativo",
    },
    {
      id: 5,
      name: "Pedro Lima",
      email: "pedro@marmoraria.com.br",
      phone: "(11) 98765-4325",
      role: "instalador",
      department: "Instalação",
      status: "inativo",
    },
  ];

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-destructive/10 text-destructive",
      showroom: "bg-primary/10 text-primary",
      producao: "bg-warning/10 text-warning",
      financeiro: "bg-success/10 text-success",
      instalador: "bg-info/10 text-info",
    };
    return colors[role] || "bg-muted text-muted-foreground";
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Administrador",
      showroom: "Showroom",
      producao: "Produção",
      financeiro: "Financeiro",
      instalador: "Instalador",
    };
    return labels[role] || role;
  };

  const getStatusColor = (status: string) => {
    return status === "ativo" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipe</h1>
          <p className="text-sm text-muted-foreground">Gerencie funcionários e permissões</p>
        </div>
        <Button onClick={() => navigate("/team/new")} className="bg-accent hover:bg-accent-hover">
          <Plus className="mr-2 h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {team.map((member) => (
          <Card
            key={member.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]"
            onClick={() => navigate(`/team/${member.id}`)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.department}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getRoleColor(member.role)}>
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleLabel(member.role)}
                  </Badge>
                  <Badge className={getStatusColor(member.status)} variant="outline">
                    {member.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
