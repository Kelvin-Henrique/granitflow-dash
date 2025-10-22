import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TeamDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data
  const member = {
    id: id || "1",
    name: "Carlos Eduardo",
    role: "Instalador Sênior",
    email: "carlos@marmoemp.com",
    phone: "(11) 98765-4321",
    department: "Produção",
    status: "ativo",
    address: "São Paulo, SP",
    joinDate: "2023-01-15",
    projects: [
      { id: 1, name: "Cozinha Granito", status: "em_andamento" },
      { id: 2, name: "Banheiro Mármore", status: "concluido" },
    ],
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ativo: "bg-success/10 text-success",
      inativo: "bg-destructive/10 text-destructive",
      ferias: "bg-warning/10 text-warning",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ativo: "Ativo",
      inativo: "Inativo",
      ferias: "Férias",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/team")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
          <Badge className={getStatusColor(member.status)}>{getStatusLabel(member.status)}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(`/team/${id}/edit`)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Informações de Contato</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium text-foreground">{member.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Localização</p>
                  <p className="font-medium text-foreground">{member.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Departamento</p>
                  <p className="font-medium text-foreground">{member.department}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Informações Adicionais</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Data de Entrada</p>
                <p className="font-medium text-foreground">{member.joinDate}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Projetos Atuais</h2>
            <div className="space-y-3">
              {member.projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                    </div>
                    <Badge variant={project.status === "concluido" ? "default" : "secondary"}>
                      {project.status === "em_andamento" ? "Em Andamento" : "Concluído"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
