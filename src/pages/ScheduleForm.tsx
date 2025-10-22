import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ScheduleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isEdit ? "Agendamento atualizado!" : "Agendamento criado!",
      description: isEdit ? "As informações foram atualizadas com sucesso." : "O novo agendamento foi criado com sucesso.",
    });
    navigate("/schedule");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/schedule")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? "Editar Agendamento" : "Novo Agendamento"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Informações do Agendamento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicao">Medição</SelectItem>
                    <SelectItem value="instalacao">Instalação</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">João Silva</SelectItem>
                    <SelectItem value="2">Maria Santos</SelectItem>
                    <SelectItem value="3">Pedro Costa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Projeto</Label>
                <Input id="project" placeholder="Nome do projeto" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Equipe *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Equipe A</SelectItem>
                    <SelectItem value="b">Equipe B</SelectItem>
                    <SelectItem value="c">Equipe C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input id="date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Horário *</Label>
                <Input id="time" type="time" required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Local</Label>
                <Input id="location" placeholder="Endereço completo" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Observações</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionais</Label>
              <Textarea 
                id="notes" 
                placeholder="Informações relevantes sobre o agendamento..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              {isEdit ? "Salvar Alterações" : "Criar Agendamento"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/schedule")}>
              Cancelar
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
