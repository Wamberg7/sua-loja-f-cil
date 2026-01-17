import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Layers, Image as ImageIcon, Plus, X, AlignJustify, Package } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";
import { toast } from "sonner";

interface Variation {
  id: string;
  title: string;
  price: number;
  stockType: "lines" | "ghost";
  stockItems: string; // For line-based stock, each line is an item
  productLink: string; // For ghost stock
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

  const [variations, setVariations] = useState<Variation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVariation, setCurrentVariation] = useState<Variation>({
    id: "",
    title: "",
    price: 0,
    stockType: "lines",
    stockItems: "",
    productLink: "",
  });

  const openCreateModal = () => {
    setCurrentVariation({
      id: Date.now().toString(),
      title: "",
      price: 0,
      stockType: "lines",
      stockItems: "",
      productLink: "",
    });
    setIsModalOpen(true);
  };

  const handleCreateVariation = () => {
    if (!currentVariation.title) {
      toast.error("Digite um título para a variação");
      return;
    }

    if (currentVariation.stockType === "lines" && !currentVariation.stockItems.trim()) {
      toast.error("Adicione pelo menos um item de estoque");
      return;
    }

    if (currentVariation.stockType === "ghost" && !currentVariation.productLink.trim()) {
      toast.error("Digite o link do produto");
      return;
    }

    setVariations([...variations, currentVariation]);
    setIsModalOpen(false);
  };

  const removeVariation = (id: string) => {
    setVariations(variations.filter(v => v.id !== id));
  };

  const clearStockItems = () => {
    setCurrentVariation({ ...currentVariation, stockItems: "" });
  };

  const getStockCount = (variation: Variation) => {
    if (variation.stockType === "ghost") return "∞";
    return variation.stockItems.split("\n").filter(line => line.trim()).length;
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Digite o nome do produto");
      return;
    }

    if (variations.length === 0) {
      toast.error("Adicione pelo menos uma variação");
      return;
    }

    // Get minimum price from variations
    const minPrice = Math.min(...variations.map(v => v.price));
    
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
    navigate('/dashboard/produtos');
  };

  const isLoading = createProduct.isPending;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard/produtos')}
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
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">Variações do Produto</h2>
                  <p className="text-sm text-muted-foreground">
                    Crie variações para produtos com diferentes tamanhos, cores ou outras características.
                  </p>
                </div>
                <Button onClick={openCreateModal} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Criar variação
                </Button>
              </div>

              {variations.length === 0 ? (
                <div className="border border-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground mb-4">Nenhuma variação criada ainda</p>
                  <Button variant="outline" onClick={openCreateModal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Criar primeira variação
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {variations.map((variation) => (
                    <div 
                      key={variation.id}
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{variation.title}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>
                            R$ {variation.price.toFixed(2).replace('.', ',')}
                          </span>
                          <span>•</span>
                          <span>
                            Estoque: {getStockCount(variation)}
                          </span>
                          <span>•</span>
                          <span>
                            {variation.stockType === "ghost" ? "Estoque fantasma" : "Por linhas"}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeVariation(variation.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
          onClick={() => navigate('/dashboard/produtos')}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!formData.name || variations.length === 0 || isLoading}
        >
          {isLoading ? "Salvando..." : "Criar Produto"}
        </Button>
      </div>

      {/* Create Variation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar nova variação</DialogTitle>
            <DialogDescription>
              Crie uma variação de produto para separar entre tipos de itens diferentes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="variation-title">Título</Label>
              <Input
                id="variation-title"
                value={currentVariation.title}
                onChange={(e) => setCurrentVariation({ ...currentVariation, title: e.target.value })}
                placeholder="Ex: Plano Mensal"
                className="bg-secondary/50"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="variation-price">Preço</Label>
              <Input
                id="variation-price"
                type="number"
                value={currentVariation.price}
                onChange={(e) => setCurrentVariation({ ...currentVariation, price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                placeholder="0"
                className="bg-secondary/50"
              />
            </div>

            {/* Stock Type */}
            <div className="space-y-2">
              <Label>Tipo de estoque</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCurrentVariation({ ...currentVariation, stockType: "lines" })}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    currentVariation.stockType === "lines" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <AlignJustify className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium text-foreground">Linhas</p>
                </button>
                <button
                  onClick={() => setCurrentVariation({ ...currentVariation, stockType: "ghost" })}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    currentVariation.stockType === "ghost" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Package className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium text-foreground">Estoque fantasma</p>
                </button>
              </div>
            </div>

            {/* Stock Items (for lines type) */}
            {currentVariation.stockType === "lines" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Estoque</Label>
                  <Button 
                    variant="link" 
                    className="text-primary p-0 h-auto"
                    onClick={clearStockItems}
                  >
                    Remover tudo
                  </Button>
                </div>
                <div className="relative bg-secondary/50 rounded-lg border border-border overflow-hidden">
                  <div className="flex">
                    <div className="w-8 bg-secondary/80 border-r border-border py-2 text-center text-xs text-muted-foreground font-mono">
                      {currentVariation.stockItems.split("\n").map((_, i) => (
                        <div key={i} className="h-6 leading-6">{i + 1}</div>
                      ))}
                      {!currentVariation.stockItems && <div className="h-6 leading-6">1</div>}
                    </div>
                    <Textarea
                      value={currentVariation.stockItems}
                      onChange={(e) => setCurrentVariation({ ...currentVariation, stockItems: e.target.value })}
                      placeholder="Digite cada item em uma linha..."
                      rows={5}
                      className="border-0 bg-transparent resize-none font-mono text-sm leading-6"
                    />
                  </div>
                </div>
                <p className="text-sm text-warning">
                  <span className="font-medium">(Importante)</span> Cada linha é representada um estoque.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="product-link">Link do Produto</Label>
                <Input
                  id="product-link"
                  value={currentVariation.productLink}
                  onChange={(e) => setCurrentVariation({ ...currentVariation, productLink: e.target.value })}
                  placeholder="https://exemplo.com/produto"
                  className="bg-secondary/50"
                />
                <p className="text-sm text-muted-foreground">
                  Este produto será entregue ilimitadamente para todos os usuários.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateVariation}>
              Criar variação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CreateVariationProduct;
