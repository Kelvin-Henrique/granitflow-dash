import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ScheduleEvent } from "@/types";
import scheduleService from "@/services/scheduleService";
import { useToast } from "@/hooks/use-toast";

export default function Schedule() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await scheduleService.getEvents();
      if (error) {
        toast({
          title: "Erro",
          description: error,
          variant: "destructive",
        });
      } else if (data) {
        setEvents(data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar eventos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.status]) {
      acc[event.status] = [];
    }
    acc[event.status].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);

  const statusColumns = [
    { key: "agendado", label: "Agendados", color: "border-info" },
    { key: "em_andamento", label: "Em Andamento", color: "border-warning" },
    { key: "concluido", label: "Concluídos", color: "border-success" },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
          <Button onClick={() => navigate("/schedule/new")} className="bg-accent hover:bg-accent-hover">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      </div>
    );
  }

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
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.customerName}</p>
                      {event.projectName && (
                        <p className="text-xs text-muted-foreground">{event.projectName}</p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(event.startDateTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(event.startDateTime)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="text-xs">{event.location}</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
