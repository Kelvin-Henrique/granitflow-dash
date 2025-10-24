import { Bell, Check, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Prazo de OS se aproximando",
      description: "OS #0003 - Bancada Quartzito vence em 2 dias",
      time: "2 horas atrás",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "Novo orçamento aprovado",
      description: "Cliente Maria Santos aprovou orçamento de R$ 12.300,00",
      time: "5 horas atrás",
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "Pagamento recebido",
      description: "Recebido R$ 8.500,00 de João Silva - OS #0001",
      time: "1 dia atrás",
      read: true,
    },
    {
      id: 4,
      type: "alert",
      title: "Material em estoque mínimo",
      description: "Granito Preto São Gabriel atingiu estoque mínimo",
      time: "1 dia atrás",
      read: false,
    },
    {
      id: 5,
      type: "info",
      title: "Nova OS criada",
      description: "OS #0007 - Cozinha Mármore criada por Admin",
      time: "2 dias atrás",
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "success":
        return <Check className="h-5 w-5 text-success" />;
      default:
        return <Bell className="h-5 w-5 text-info" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
        <Button variant="outline" size="sm">
          <Check className="mr-2 h-4 w-4" />
          Marcar todas como lidas
        </Button>
      </div>

      <Card className="divide-y divide-border">
        {notifications.map((notification, index) => (
          <div key={notification.id}>
            <div
              className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                !notification.read ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-foreground">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <Badge variant="default" className="bg-primary text-xs">
                        Nova
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{notification.time}</span>
                  </div>
                </div>
              </div>
            </div>
            {index < notifications.length - 1 && <Separator />}
          </div>
        ))}
      </Card>
    </div>
  );
}
