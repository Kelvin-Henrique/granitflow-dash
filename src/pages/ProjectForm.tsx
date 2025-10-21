import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isEdit ? "Projeto atualizado!" : "Projeto criado!",
      description: isEdit ? "As informações foram atualizadas com sucesso." : "O novo projeto foi criado com sucesso.",
    });
    navigate("/projects");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? "Editar Projeto" : "Novo Projeto"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input id="name" placeholder="Ex: Cozinha Granito Premium" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer">Cliente *</Label>
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
                <Label htmlFor="material">Material *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="granito-branco">Granito Branco Dallas</SelectItem>
                    <SelectItem value="marmore-carrara">Mármore Carrara</SelectItem>
                    <SelectItem value="quartzito">Quartzito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área (m²) *</Label>
                <Input id="area" type="number" step="0.01" placeholder="12.50" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="medicao">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicao">Em Medição</SelectItem>
                    <SelectItem value="orcamento">Em Orçamento</SelectItem>
                    <SelectItem value="em_producao">Em Produção</SelectItem>
                    <SelectItem value="instalacao">Em Instalação</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo de Entrega</Label>
                <Input id="deadline" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Valor Total (R$)</Label>
                <Input id="cost" type="number" step="0.01" placeholder="8500.00" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Local de Instalação</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Endereço Completo</Label>
                <Input id="location" placeholder="Rua, número, bairro, cidade/estado" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Descrição</h2>
            <div className="space-y-2">
              <Label htmlFor="description">Detalhes do Projeto</Label>
              <Textarea 
                id="description" 
                placeholder="Descreva os detalhes do projeto, acabamento, observações importantes..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              {isEdit ? "Salvar Alterações" : "Criar Projeto"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/projects")}>
              Cancelar
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
