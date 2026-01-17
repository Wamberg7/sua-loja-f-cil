import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Layers, Upload, Image as ImageIcon, Plus, X } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";
import { toast } from "sonner";

interface Variation {
  id: string;
  name: string;
  price: number;
  stock: number | null;
}

const CreateVariationProduct = () => {
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();

  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    imageUrl: "",
  });

  const [variations, setVariations] = useState<Variation[]>([
    { id: "1", name: "", price: 0, stock: null }
  ]);

  const addVariation = () => {
    setVariations([
      ...variations,
      { id: Date.now().toString(), name: "", price: 0, stock: null }
    ]);
  };

  const updateVariation = (id: string, field: keyof Variation, value: string | number | null) => {
    setVariations(variations.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const removeVariation = (id: string) => {
    if (variations.length > 1) {
      setVariations(variations.filter(v => v.id !== id));
    }
  };

  const handleSubmit = async () => {
    if (variations.length === 0 || variations.every(v => !v.name)) {
      toast.error("Adicione pelo menos uma variação com nome");
      return;
    }

    // For now, create a product with the base price of the first variation
    // In the future, we can create a product_variations table
    const minPrice = Math.min(...variations.filter(v => v.name).map(v => v.price));
    
    const productData = {
      name: formData.name,
      description: formData.description,
      category_id: formData.category_id || undefined,
      price: Math.round(minPrice * 100), // Convert to cents
      images: formData.imageUrl ? [formData.imageUrl] : [],
      stock: null, // Variation products don't have a single stock
      is_active: true,
    };

    await createProduct.mutateAsync(productData);
    navigate('/dashboard/products');
  };

  const isLoading = createProduct.isPending;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard/products')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Criar produto
        </h1>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="info" className="gap-2">
            <Info className="w-4 h-4" />
            Informações Básicas
          </TabsTrigger>
          <TabsTrigger value="variations" className="gap-2">
            <Layers className="w-4 h-4" />
            Variações
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            <TabsContent value="info" className="mt-0 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">Informações Básicas</h2>
                <p className="text-sm text-muted-foreground">
                  Defina as informações essenciais do seu produto.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do produto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Conta Streaming | Licença keys"
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Escolha uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <div className="bg-secondary/50 rounded-lg border border-border">
                    <div className="flex items-center gap-1 p-2 border-b border-border">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 font-bold">B</Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 italic">I</Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 underline">U</Button>
                      <div className="w-px h-4 bg-border mx-1" />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">📋</Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">📋</Button>
                    </div>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Digite a descrição do seu produto..."
                      rows={8}
                      className="border-0 bg-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="variations" className="mt-0 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">Variações</h2>
                <p className="text-sm text-muted-foreground">
                  Configure as variações do seu produto com diferentes preços.
                </p>
              </div>

              <div className="space-y-4">
                {variations.map((variation, index) => (
                  <div 
                    key={variation.id} 
                    className="p-4 bg-secondary/30 rounded-xl border border-border space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Variação {index + 1}
                      </span>
                      {variations.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeVariation(variation.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome da variação</Label>
                        <Input
                          value={variation.name}
                          onChange={(e) => updateVariation(variation.id, "name", e.target.value)}
                          placeholder="Ex: Básico, Pro, Premium"
                          className="bg-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          value={variation.price}
                          onChange={(e) => updateVariation(variation.id, "price", parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="bg-secondary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Estoque (deixe vazio para ilimitado)</Label>
                      <Input
                        type="number"
                        value={variation.stock ?? ""}
                        onChange={(e) => updateVariation(
                          variation.id, 
                          "stock", 
                          e.target.value === "" ? null : parseInt(e.target.value) || 0
                        )}
                        min="0"
                        placeholder="Ilimitado"
                        className="bg-secondary/50"
                      />
                    </div>
                  </div>
                ))}

                <Button 
                  variant="outline" 
                  onClick={addVariation} 
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Variação
                </Button>
              </div>
            </TabsContent>
          </div>

          {/* Right Column - Image */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Imagem principal</h2>
            </div>

            <div 
              className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Escolha sua imagem</p>
                  <p className="text-sm text-muted-foreground">
                    Clique aqui ou arraste e solte um arquivo aqui.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="Ou cole a URL aqui..."
                className="bg-secondary/50"
              />
              <p className="text-xs text-muted-foreground">
                Resolução recomendada: 1280x720. Também recomendamos que mantenha a proporção 16:9, 
                pois caso contrário, sua imagem pode ficar achatada em seu site.
              </p>
            </div>

            {formData.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-border">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </Tabs>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/products')}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!formData.name || isLoading}
        >
          {isLoading ? "Salvando..." : "Criar Produto"}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default CreateVariationProduct;
