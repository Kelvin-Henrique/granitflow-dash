import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function OrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isEdit ? "OS atualizada!" : "OS criada!",
      description: isEdit ? "As informações foram atualizadas com sucesso." : "A nova ordem de serviço foi criada com sucesso.",
    });
    navigate("/orders");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/orders")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Informações da OS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="project">Projeto *</Label>
                <Input id="project" placeholder="Nome do projeto" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo de Entrega *</Label>
                <Input id="deadline" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Valor Total (R$) *</Label>
                <Input id="value" type="number" placeholder="0.00" step="0.01" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="orcamento">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orcamento">Em Orçamento</SelectItem>
                    <SelectItem value="aprovada">Aprovada</SelectItem>
                    <SelectItem value="producao_interna">Produção Interna</SelectItem>
                    <SelectItem value="aguardando_frete">Aguardando Frete</SelectItem>
                    <SelectItem value="instalacao">Em Instalação</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Materiais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Granito Branco Dallas</SelectItem>
                    <SelectItem value="2">Mármore Carrara</SelectItem>
                    <SelectItem value="3">Quartzo Branco</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input id="quantity" type="number" placeholder="0" step="0.01" />
              </div>

              <div className="space-y-2 flex items-end">
                <Button type="button" variant="outline" className="w-full">
                  + Adicionar
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Observações</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionais</Label>
              <Textarea 
                id="notes" 
                placeholder="Informações relevantes sobre a OS..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              {isEdit ? "Salvar Alterações" : "Criar OS"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/orders")}>
              Cancelar
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
