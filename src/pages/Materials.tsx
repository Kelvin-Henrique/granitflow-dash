import { useState, useEffect } from "react";
import { Plus, Package, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Material } from "@/types";
import materialService from "@/services/materialService";
import { useToast } from "@/hooks/use-toast";

export default function Materials() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const { data, error } = await materialService.getMaterials();
      if (error) {
        toast({
          title: "Erro",
          description: error,
          variant: "destructive",
        });
      } else if (data) {
        setMaterials(data);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar materiais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isLowStock = (current: number, min: number) => current < min;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const totalStock = materials.reduce((sum, m) => sum + m.currentStock, 0);
  const lowStockCount = materials.filter(m => isLowStock(m.currentStock, m.minStock)).length;
  const totalValue = materials.reduce((sum, m) => sum + (m.currentStock * m.unitCost), 0);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Materiais & Estoque</h1>
          <Button onClick={() => navigate("/materials/new")} className="bg-accent hover:bg-accent-hover">
            <Plus className="mr-2 h-4 w-4" />
            Novo Material
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando materiais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Materiais & Estoque</h1>
        <Button onClick={() => navigate("/materials/new")} className="bg-accent hover:bg-accent-hover">
          <Plus className="mr-2 h-4 w-4" />
          Novo Material
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total em Estoque</p>
              <p className="text-2xl font-bold text-foreground">{totalStock.toFixed(1)} m²</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning/10 rounded-lg">
              <TrendingDown className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Abaixo do Mínimo</p>
              <p className="text-2xl font-bold text-foreground">{lowStockCount} itens</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </Card>
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum material encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {materials.map((material) => (
            <Card
              key={material.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]"
              onClick={() => navigate(`/materials/${material.id}`)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">{material.name}</h3>
                    <Badge variant="outline">{material.type}</Badge>
                  </div>
                  {isLowStock(material.currentStock, material.minStock) && (
                    <Badge className="bg-destructive/10 text-destructive">Estoque Baixo</Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Estoque</p>
                    <p className="text-lg font-bold text-foreground">{material.currentStock} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Custo/m²</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(material.unitCost)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(material.currentStock * material.unitCost)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Cores disponíveis:</p>
                  <div className="flex flex-wrap gap-2">
                    {material.colors.map((color, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estoque mínimo: {material.minStock} m²</span>
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/materials/${material.id}/add-stock`);
                    }}>
                      Adicionar Estoque
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
