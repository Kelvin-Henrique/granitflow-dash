import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function QuoteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isEdit ? "Orçamento atualizado!" : "Orçamento criado!",
      description: isEdit ? "As informações foram atualizadas com sucesso." : "O novo orçamento foi criado com sucesso.",
    });
    navigate("/quotes");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/quotes")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? "Editar Orçamento" : "Novo Orçamento"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Informações do Orçamento</h2>
            
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
                <Label htmlFor="project">Projeto</Label>
                <Input id="project" placeholder="Nome do projeto" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Válido Até *</Label>
                <Input id="validUntil" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="rascunho">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="enviada">Enviada</SelectItem>
                    <SelectItem value="aprovada">Aprovada</SelectItem>
                    <SelectItem value="rejeitada">Rejeitada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Itens</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2 md:col-span-2">
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

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Valor Unit. (R$)</Label>
                <Input id="unitPrice" type="number" placeholder="0.00" step="0.01" />
              </div>
            </div>

            <Button type="button" variant="outline">
              + Adicionar Item
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Observações</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionais</Label>
              <Textarea 
                id="notes" 
                placeholder="Informações relevantes sobre o orçamento..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              {isEdit ? "Salvar Alterações" : "Criar Orçamento"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/quotes")}>
              Cancelar
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
