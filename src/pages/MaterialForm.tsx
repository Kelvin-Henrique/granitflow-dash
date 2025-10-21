import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function MaterialForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;
  const isAddStock = window.location.pathname.includes("add-stock");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isAddStock ? "Estoque atualizado!" : isEdit ? "Material atualizado!" : "Material cadastrado!",
      description: isAddStock 
        ? "O estoque foi adicionado com sucesso." 
        : isEdit 
          ? "As informações foram atualizadas com sucesso." 
          : "O novo material foi cadastrado com sucesso.",
    });
    navigate(isAddStock ? `/materials/${id}` : "/materials");
  };

  if (isAddStock) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/materials/${id}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Adicionar Estoque</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade (m²) *</Label>
                  <Input id="quantity" type="number" step="0.01" placeholder="30.00" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitCost">Custo Unitário (R$/m²)</Label>
                  <Input id="unitCost" type="number" step="0.01" placeholder="500.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Input id="supplier" placeholder="Nome do fornecedor" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Data da Compra</Label>
                  <Input id="purchaseDate" type="date" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Informações adicionais sobre a compra..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary-hover">
                Adicionar ao Estoque
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(`/materials/${id}`)}>
                Cancelar
              </Button>
            </div>
          </Card>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/materials")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? "Editar Material" : "Novo Material"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Material *</Label>
                <Input id="name" placeholder="Ex: Granito Branco Dallas" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="granito">Granito</SelectItem>
                    <SelectItem value="marmore">Mármore</SelectItem>
                    <SelectItem value="quartzito">Quartzito</SelectItem>
                    <SelectItem value="sintetico">Sintético</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialStock">Estoque Inicial (m²)</Label>
                <Input id="initialStock" type="number" step="0.01" placeholder="50.00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Estoque Mínimo (m²) *</Label>
                <Input id="minStock" type="number" step="0.01" placeholder="20.00" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitCost">Custo por m² (R$) *</Label>
                <Input id="unitCost" type="number" step="0.01" placeholder="500.00" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Preço de Venda por m² (R$) *</Label>
                <Input id="unitPrice" type="number" step="0.01" placeholder="850.00" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor Principal</Label>
                <Input id="supplier" placeholder="Nome do fornecedor" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="colors">Cores Disponíveis</Label>
                <Input id="colors" placeholder="Ex: Branco, Cinza Claro (separar por vírgula)" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Observações</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionais</Label>
              <Textarea 
                id="notes" 
                placeholder="Informações relevantes sobre o material..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary-hover">
              {isEdit ? "Salvar Alterações" : "Cadastrar Material"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/materials")}>
              Cancelar
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
