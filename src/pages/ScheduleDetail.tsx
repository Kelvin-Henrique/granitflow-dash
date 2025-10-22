import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ScheduleDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data
  const event = {
    id: id || "1",
    type: "medicao",
    title: "Medição - Cozinha Granito",
    client: "João Silva",
    project: "Cozinha Granito Premium",
    date: "2025-10-15",
    time: "09:00",
    duration: "2 horas",
    status: "agendado",
    location: "Rua das Flores, 123 - São Paulo/SP",
    team: "Equipe A",
    notes: "Cliente solicitou medição precisa. Levar trena a laser e tablet para anotações.",
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      medicao: "bg-info/10 text-info",
      instalacao: "bg-primary/10 text-primary",
      manutencao: "bg-warning/10 text-warning",
      reuniao: "bg-purple-100 text-purple-700",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      medicao: "Medição",
      instalacao: "Instalação",
      manutencao: "Manutenção",
      reuniao: "Reunião",
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      agendado: "bg-info/10 text-info",
      em_andamento: "bg-warning/10 text-warning",
      concluido: "bg-success/10 text-success",
      cancelado: "bg-destructive/10 text-destructive",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      agendado: "Agendado",
      em_andamento: "Em Andamento",
      concluido: "Concluído",
      cancelado: "Cancelado",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/schedule")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
            <p className="text-sm text-muted-foreground">{event.client}</p>
          </div>
          <Badge className={getTypeColor(event.type)}>{getTypeLabel(event.type)}</Badge>
          <Badge className={getStatusColor(event.status)}>{getStatusLabel(event.status)}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(`/schedule/${id}/edit`)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Detalhes do Agendamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium text-foreground">{event.client}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Projeto</p>
              <p className="font-medium text-foreground">{event.project}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium text-foreground">{event.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Horário</p>
              <p className="font-medium text-foreground">{event.time}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duração Estimada</p>
              <p className="font-medium text-foreground">{event.duration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Equipe</p>
              <p className="font-medium text-foreground">{event.team}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Local</p>
              <p className="text-sm text-muted-foreground">{event.location}</p>
            </div>
          </div>

          {event.notes && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Observações</p>
              <p className="text-sm text-muted-foreground">{event.notes}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          {event.status === "agendado" && (
            <Button className="bg-primary hover:bg-primary-hover">
              <Clock className="mr-2 h-4 w-4" />
              Iniciar Atendimento
            </Button>
          )}
          {event.status === "em_andamento" && (
            <Button className="bg-success hover:bg-success/90">
              Concluir Atendimento
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
