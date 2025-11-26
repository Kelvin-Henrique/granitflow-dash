import { useState, useEffect } from "react";
import { Plus, Search, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Project } from "@/types";
import projectService from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";

export default function Projects() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await projectService.getProjects();
      if (error) {
        toast({
          title: "Erro",
          description: error,
          variant: "destructive",
        });
      } else if (data) {
        setProjects(data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar projetos",
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
        const { data, error } = await projectService.getProjects(searchTerm);
        if (error) {
          toast({
            title: "Erro",
            description: error,
            variant: "destructive",
          });
        } else if (data) {
          setProjects(data);
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao buscar projetos",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      loadProjects();
    }
  };

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

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sem prazo";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
          <Button onClick={() => navigate("/projects/new")} className="bg-accent hover:bg-accent-hover">
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando projetos...</p>
        </div>
      </div>
    );
  }

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
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
      </Card>

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum projeto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.customerName}</p>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Local:</span>
                    <p className="font-medium text-foreground">{project.location}</p>
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
                    <span>Custo: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(project.cost)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOverdue(project.deadline) && project.status !== "concluido" && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className={isOverdue(project.deadline) && project.status !== "concluido" ? "text-destructive" : "text-muted-foreground"}>
                      {formatDate(project.deadline)}
                    </span>
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
