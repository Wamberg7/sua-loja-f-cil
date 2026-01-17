import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Info, Package, Upload, Image as ImageIcon } from "lucide-react";
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
import { useCreateProduct, useProduct, useUpdateProduct } from "@/hooks/useProducts";

const CreateNormalProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const { data: categories = [] } = useCategories();
  const { data: existingProduct } = useProduct(editId || '');
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    name: existingProduct?.name || "",
    description: existingProduct?.description || "",
    category_id: existingProduct?.category_id || "",
    price: existingProduct?.price ? existingProduct.price / 100 : 0,
    imageUrl: existingProduct?.images?.[0] || "",
    stock: existingProduct?.stock || 0,
    stockType: existingProduct?.stock === null ? "unlimited" : "limited",
  });

  // Update form when existing product loads
  useState(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        description: existingProduct.description || "",
        category_id: existingProduct.category_id || "",
        price: existingProduct.price / 100,
        imageUrl: existingProduct.images?.[0] || "",
        stock: existingProduct.stock || 0,
        stockType: existingProduct.stock === null ? "unlimited" : "limited",
      });
    }
  });

  const handleSubmit = async () => {
    const productData = {
      name: formData.name,
      description: formData.description,
      category_id: formData.category_id || undefined,
      price: Math.round(formData.price * 100), // Convert to cents
      images: formData.imageUrl ? [formData.imageUrl] : [],
      stock: formData.stockType === "unlimited" ? null : formData.stock,
      is_active: true,
    };

    if (editId) {
      await updateProduct.mutateAsync({ id: editId, ...productData });
    } else {
      await createProduct.mutateAsync(productData);
    }
    
    navigate('/dashboard/products');
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;

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
          {editId ? "Editar produto" : "Criar produto"}
        </h1>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="info" className="gap-2">
            <Info className="w-4 h-4" />
            Informações Básicas
          </TabsTrigger>
          <TabsTrigger value="stock" className="gap-2">
            <Package className="w-4 h-4" />
            Estoque
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

                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="bg-secondary/50"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stock" className="mt-0 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">Estoque</h2>
                <p className="text-sm text-muted-foreground">
                  Configure o tipo de estoque do seu produto.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, stockType: "unlimited" })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.stockType === "unlimited" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <p className="font-medium text-foreground">Estoque Ilimitado</p>
                    <p className="text-sm text-muted-foreground">Sem controle de quantidade</p>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, stockType: "limited" })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.stockType === "limited" 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <p className="font-medium text-foreground">Estoque Limitado</p>
                    <p className="text-sm text-muted-foreground">Quantidade controlada</p>
                  </button>
                </div>

                {formData.stockType === "limited" && (
                  <div className="space-y-2">
                    <Label htmlFor="stock">Quantidade em estoque</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      min="0"
                      className="bg-secondary/50"
                    />
                  </div>
                )}
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
          {isLoading ? "Salvando..." : editId ? "Salvar Alterações" : "Criar Produto"}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default CreateNormalProduct;
