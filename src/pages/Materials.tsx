import { Plus, Package, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function Materials() {
  const navigate = useNavigate();

  // Mock data
  const materials = [
    {
      id: 1,
      name: "Granito Branco Itaúnas",
      type: "Granito",
      stock: 45.8,
      costPerM2: 280.0,
      totalValue: 12824.0,
      minStock: 20.0,
      colors: ["Branco", "Cinza Claro"],
    },
    {
      id: 2,
      name: "Mármore Carrara",
      type: "Mármore",
      stock: 18.5,
      costPerM2: 450.0,
      totalValue: 8325.0,
      minStock: 15.0,
      colors: ["Branco", "Cinza"],
    },
    {
      id: 3,
      name: "Quartzito Taj Mahal",
      type: "Quartzito",
      stock: 32.3,
      costPerM2: 520.0,
      totalValue: 16796.0,
      minStock: 25.0,
      colors: ["Bege", "Dourado"],
    },
    {
      id: 4,
      name: "Corium Preto Absoluto",
      type: "Corium",
      stock: 12.7,
      costPerM2: 380.0,
      totalValue: 4826.0,
      minStock: 15.0,
      colors: ["Preto"],
    },
    {
      id: 5,
      name: "Sinterizado Calacatta",
      type: "Sinterizado",
      stock: 8.2,
      costPerM2: 680.0,
      totalValue: 5576.0,
      minStock: 10.0,
      colors: ["Branco", "Dourado"],
    },
  ];

  const isLowStock = (current: number, min: number) => current < min;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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
              <p className="text-2xl font-bold text-foreground">117.5 m²</p>
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
              <p className="text-2xl font-bold text-foreground">2 itens</p>
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
              <p className="text-2xl font-bold text-foreground">R$ 48.347</p>
            </div>
          </div>
        </Card>
      </div>

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
                {isLowStock(material.stock, material.minStock) && (
                  <Badge className="bg-destructive/10 text-destructive">Estoque Baixo</Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estoque</p>
                  <p className="text-lg font-bold text-foreground">{material.stock} m²</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Custo/m²</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(material.costPerM2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(material.totalValue)}</p>
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
    </div>
  );
}
