import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import customerService from "@/services/customerService";
import { CustomerFormData } from "@/types";

export default function CustomerForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    cpfCnpj: "",
    status: "ativo",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });

  useEffect(() => {
    const loadCustomer = async (customerId: number) => {
      setLoading(true);
      try {
        const { data, error } = await customerService.getCustomer(customerId);
        if (error) {
          toast({
            title: "Erro",
            description: error,
            variant: "destructive",
          });
          navigate("/customers");
        } else if (data) {
          setFormData({
            name: data.name,
            email: data.email,
            phone: data.phone,
            cpfCnpj: data.cpfCnpj,
            status: data.status,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            notes: data.notes,
          });
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar cliente",
          variant: "destructive",
        });
        navigate("/customers");
      } finally {
        setLoading(false);
      }
    };

    if (isEdit && id) {
      loadCustomer(parseInt(id));
    }
  }, [isEdit, id, toast, navigate]);

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEdit && id) {
        const { error } = await customerService.updateCustomer(parseInt(id), formData);
        if (error) {
          toast({
            title: "Erro",
            description: error,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Cliente atualizado!",
          description: "As informações foram atualizadas com sucesso.",
        });
      } else {
        const { error } = await customerService.createCustomer(formData);
        if (error) {
          toast({
            title: "Erro",
            description: error,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Cliente cadastrado!",
          description: "O novo cliente foi cadastrado com sucesso.",
        });
      }
      navigate("/customers");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar cliente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/customers")} disabled={loading}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {loading ? "Carregando..." : (isEdit ? "Editar Cliente" : "Novo Cliente")}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: João Silva" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                <Input 
                  id="cpfCnpj" 
                  placeholder="000.000.000-00" 
                  value={formData.cpfCnpj}
                  onChange={(e) => handleInputChange('cpfCnpj', e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@exemplo.com" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input 
                  id="phone" 
                  placeholder="(00) 00000-0000" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required 
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                  disabled={loading}
                >
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
                <Input 
                  id="address" 
                  placeholder="Rua, número, complemento" 
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input 
                  id="city" 
                  placeholder="São Paulo" 
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input 
                  id="state" 
                  placeholder="SP" 
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  maxLength={2} 
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input 
                  id="zipCode" 
                  placeholder="00000-000" 
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  disabled={loading}
                />
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
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-primary hover:bg-primary-hover" disabled={loading}>
              {loading ? "Salvando..." : (isEdit ? "Salvar Alterações" : "Cadastrar Cliente")}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/customers")} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
