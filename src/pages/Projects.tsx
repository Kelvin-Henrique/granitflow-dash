import { useState } from "react";
import { Plus, Search, Image as ImageIcon, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const projects = [
    {
      id: 1,
      name: "Cozinha Granito Branco",
      customer: "João Silva",
      material: "Granito",
      area: 8.5,
      status: "em_medicao",
      deadline: "2025-10-25",
      progress: 20,
      images: 3,
    },
    {
      id: 2,
      name: "Banheiro Mármore Carrara",
      customer: "Maria Santos",
      material: "Mármore",
      area: 12.3,
      status: "em_producao",
      deadline: "2025-10-20",
      progress: 60,
      images: 5,
    },
    {
      id: 3,
      name: "Bancada Quartzito",
      customer: "Pedro Costa",
      material: "Quartzito",
      area: 5.2,
      status: "instalacao",
      deadline: "2025-10-18",
      progress: 85,
      images: 8,
    },
    {
      id: 4,
      name: "Lavabo Corium",
      customer: "Ana Lima",
      material: "Corium",
      area: 3.8,
      status: "concluido",
      deadline: "2025-10-15",
      progress: 100,
      images: 12,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      em_medicao: "bg-info/10 text-info",
      em_producao: "bg-warning/10 text-warning",
      instalacao: "bg-primary/10 text-primary",
      concluido: "bg-success/10 text-success",
      atrasado: "bg-destructive/10 text-destructive",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      em_medicao: "Em Medição",
      em_producao: "Em Produção",
      instalacao: "Em Instalação",
      concluido: "Concluído",
      atrasado: "Atrasado",
    };
    return labels[status] || status;
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
        <Button onClick={() => navigate("/projects/new")} className="bg-accent hover:bg-accent-hover">
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-1">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.customer}</p>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Material:</span>
                  <p className="font-medium text-foreground">{project.material}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Área:</span>
                  <p className="font-medium text-foreground">{project.area} m²</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium text-foreground">{project.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  <span>{project.images} imagens</span>
                </div>
                <div className="flex items-center gap-2">
                  {isOverdue(project.deadline) && project.status !== "concluido" && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className={isOverdue(project.deadline) && project.status !== "concluido" ? "text-destructive" : "text-muted-foreground"}>
                    {project.deadline}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
