import { useState } from "react";
import { Calculator as CalcIcon, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CalculatorItem {
  id: number;
  material: string;
  area: number;
  costPerM2: number;
}

export default function Calculator() {
  const [items, setItems] = useState<CalculatorItem[]>([
    { id: 1, material: "granito", area: 0, costPerM2: 280 }
  ]);
  const [laborCost, setLaborCost] = useState(0);
  const [profitMargin, setProfitMargin] = useState(30);

  const materials = [
    { value: "granito", label: "Granito Branco Itaúnas", cost: 280 },
    { value: "marmore", label: "Mármore Carrara", cost: 450 },
    { value: "quartzito", label: "Quartzito Taj Mahal", cost: 520 },
    { value: "corium", label: "Corium Preto Absoluto", cost: 380 },
    { value: "sinterizado", label: "Sinterizado Calacatta", cost: 680 },
  ];

  const addItem = () => {
    setItems([...items, { id: Date.now(), material: "granito", area: 0, costPerM2: 280 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof CalculatorItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (field === "material") {
          const mat = materials.find(m => m.value === value);
          return { ...item, material: value, costPerM2: mat?.cost || 0 };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const materialCost = items.reduce((sum, item) => sum + (item.area * item.costPerM2), 0);
  const subtotal = materialCost + laborCost;
  const profitValue = subtotal * (profitMargin / 100);
  const total = subtotal + profitValue;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calculadora de Projetos</h1>
          <p className="text-sm text-muted-foreground">Calcule rapidamente o valor de um projeto</p>
        </div>
        <CalcIcon className="h-8 w-8 text-primary" />
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Materiais</h3>
              <Button onClick={addItem} size="sm" className="bg-primary hover:bg-primary-hover">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-muted/30 rounded-lg">
                  <div className="col-span-5">
                    <Label>Material</Label>
                    <Select value={item.material} onValueChange={(value) => updateItem(item.id, "material", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((mat) => (
                          <SelectItem key={mat.value} value={mat.value}>
                            {mat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Área (m²)</Label>
                    <Input
                      type="number"
                      value={item.area || ""}
                      onChange={(e) => updateItem(item.id, "area", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Custo/m²</Label>
                    <Input
                      type="number"
                      value={item.costPerM2}
                      onChange={(e) => updateItem(item.id, "costPerM2", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Subtotal</Label>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(item.area * item.costPerM2)}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Mão de Obra (R$)</Label>
                <Input
                  type="number"
                  value={laborCost || ""}
                  onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Margem de Lucro (%)</Label>
                <Input
                  type="number"
                  value={profitMargin || ""}
                  onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Custo dos Materiais:</span>
              <span className="text-lg font-semibold text-foreground">{formatCurrency(materialCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mão de Obra:</span>
              <span className="text-lg font-semibold text-foreground">{formatCurrency(laborCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Lucro ({profitMargin}%):</span>
              <span className="text-lg font-semibold text-success">{formatCurrency(profitValue)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-xl font-bold text-foreground">Total do Projeto:</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
