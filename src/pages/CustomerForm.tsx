import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isEdit ? "Cliente atualizado!" : "Cliente cadastrado!",
      description: isEdit ? "As informações foram atualizadas com sucesso." : "O novo cliente foi cadastrado com sucesso.",
    });
    navigate("/customers");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/customers")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? "Editar Cliente" : "Novo Cliente"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input id="name" placeholder="Ex: João Silva" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                <Input id="cpfCnpj" placeholder="000.000.000-00" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input id="phone" placeholder="(00) 00000-0000" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="ativo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Endereço</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" placeholder="Rua, número, complemento" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" placeholder="São Paulo" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input id="state" placeholder="SP" maxLength={2} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input id="zipCode" placeholder="00000-000" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Observações</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionais</Label>
              <Textarea 
                id="notes" 
                placeholder="Informações relevantes sobre o cliente..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              {isEdit ? "Salvar Alterações" : "Cadastrar Cliente"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/customers")}>
              Cancelar
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
