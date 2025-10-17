import { useState } from "react";
import { Plus, Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
      duration: "2h",
      address: "Rua das Flores, 123 - São Paulo",
      team: "Equipe A",
      status: "confirmado",
    },
    {
      id: 2,
      type: "instalacao",
      customer: "Maria Santos",
      project: "Banheiro Mármore",
      time: "14:00",
      duration: "4h",
      address: "Av. Paulista, 456 - São Paulo",
      team: "Equipe B",
      status: "confirmado",
    },
    {
      id: 3,
      type: "entrega",
      customer: "Pedro Costa",
      project: "Bancada Quartzito",
      time: "10:30",
      duration: "1h",
      address: "Rua Santos, 789 - Campinas",
      team: "Equipe C",
      status: "pendente",
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmado: "bg-success/10 text-success",
      pendente: "bg-warning/10 text-warning",
      cancelado: "bg-destructive/10 text-destructive",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      confirmado: "Confirmado",
      pendente: "Pendente",
      cancelado: "Cancelado",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
        <Button onClick={() => navigate("/schedule/new")} className="bg-accent hover:bg-accent-hover">
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Hoje - {new Date(selectedDate).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </h2>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <Card
              key={event.id}
              className="p-5 cursor-pointer hover:shadow-lg transition-all border-l-4"
              style={{ borderLeftColor: event.type === "medicao" ? "hsl(217, 91%, 60%)" : event.type === "instalacao" ? "hsl(220, 70%, 13%)" : "hsl(38, 92%, 50%)" }}
              onClick={() => navigate(`/schedule/${event.id}`)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(event.type)}>
                        {getTypeLabel(event.type)}
                      </Badge>
                      <Badge className={getStatusColor(event.status)} variant="outline">
                        {getStatusLabel(event.status)}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">{event.customer}</h3>
                    <p className="text-sm text-muted-foreground">{event.project}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{event.duration}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{event.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{event.team}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Capacidade das Equipes</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Equipe A</span>
              <span className="font-medium text-foreground">2 / 3 agendamentos</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: "66%" }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Equipe B</span>
              <span className="font-medium text-foreground">3 / 3 agendamentos</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-warning h-2 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Equipe C</span>
              <span className="font-medium text-foreground">1 / 3 agendamentos</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "33%" }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
