import { useState } from "react";
import { Plus, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export default function Schedule() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("2025-10-17");

  // Mock data
  const events = [
    {
      id: 1,
      type: "medicao",
      customer: "João Silva",
      project: "Cozinha Granito",
      time: "09:00",
      location: "Rua das Flores, 123",
      team: "Equipe A",
      status: "agendado",
    },
    {
      id: 2,
      type: "instalacao",
      customer: "Maria Santos",
      project: "Banheiro Mármore",
      time: "14:00",
      location: "Av. Paulista, 456",
      team: "Equipe B",
      status: "em_andamento",
    },
    {
      id: 3,
      type: "entrega",
      customer: "Pedro Costa",
      project: "Bancada Quartzito",
      time: "10:30",
      location: "Rua Santos, 789",
      team: "Equipe C",
      status: "concluido",
    },
  ];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      medicao: "bg-info/10 text-info",
      instalacao: "bg-primary/10 text-primary",
      entrega: "bg-warning/10 text-warning",
      manutencao: "bg-success/10 text-success",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      medicao: "Medição",
      instalacao: "Instalação",
      entrega: "Entrega",
      manutencao: "Manutenção",
    };
    return labels[type] || type;
  };

  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.status]) {
      acc[event.status] = [];
    }
    acc[event.status].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  const statusColumns = [
    { key: "agendado", label: "Agendados", color: "border-info" },
    { key: "em_andamento", label: "Em Andamento", color: "border-warning" },
    { key: "concluido", label: "Concluídos", color: "border-success" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
        <Button onClick={() => navigate("/schedule/new")} className="bg-accent hover:bg-accent-hover">
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statusColumns.map((column) => (
          <Card key={column.key} className={`p-4 border-t-4 ${column.color}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">{column.label}</h2>
              <Badge variant="outline">{groupedEvents[column.key]?.length || 0}</Badge>
            </div>
            <div className="space-y-3">
              {(groupedEvents[column.key] || []).map((event) => (
                <Card
                  key={event.id}
                  className="p-4 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => navigate(`/schedule/${event.id}`)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getTypeColor(event.type)} variant="outline">
                        {getTypeLabel(event.type)}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground">{event.customer}</h3>
                      <p className="text-sm text-muted-foreground">{event.project}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{selectedDate}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="text-xs">{event.location}</span>
                        </div>
                      )}
                    </div>

                    {event.team && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{event.team}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Capacidade da Equipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Equipe A</span>
              <span className="text-sm font-medium text-foreground">3/4 agendamentos</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Equipe B</span>
              <span className="text-sm font-medium text-foreground">2/4 agendamentos</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}
