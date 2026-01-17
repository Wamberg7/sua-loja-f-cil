import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MoreVertical,
  Edit,
  Trash2,
  Package,
  X,
  Upload,
  Link as LinkIcon
} from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

interface Variation {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  stockType: "line" | "ghost";
  stockQuantity?: number;
  price: number;
  variations: Variation[];
  deliveryType: "link" | "file";
  deliveryContent: string;
  status: "active" | "inactive";
  createdAt: string;
}

const mockCategories = [
  { id: "1", name: "Cursos Online" },
  { id: "2", name: "E-books" },
  { id: "3", name: "Templates" },
  { id: "4", name: "Software" },
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Curso Completo de Marketing Digital",
    description: "Aprenda tudo sobre marketing digital do zero ao avançado",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    category: "1",
    stockType: "ghost",
    price: 297,
    variations: [],
    deliveryType: "link",
    deliveryContent: "https://curso.exemplo.com/acesso",
    status: "active",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "E-book: Guia de Vendas Online",
    description: "O guia definitivo para começar a vender online",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    category: "2",
    stockType: "line",
    stockQuantity: 100,
    price: 47,
    variations: [],
    deliveryType: "file",
    deliveryContent: "ebook-vendas.pdf",
    status: "active",
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    name: "Template Premium para Landing Page",
    description: "Template profissional e responsivo para alta conversão",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400",
    category: "3",
    stockType: "ghost",
    price: 0,
    variations: [
      { id: "v1", name: "Básico", price: 79 },
      { id: "v2", name: "Pro", price: 149 },
      { id: "v3", name: "Enterprise", price: 299 }
    ],
    deliveryType: "link",
    deliveryContent: "https://templates.exemplo.com/download",
    status: "active",
    createdAt: "2024-01-05"
  },
];

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    stockType: "ghost" as "line" | "ghost",
    stockQuantity: 0,
    hasVariations: false,
    price: 0,
    variations: [] as Variation[],
    deliveryType: "link" as "link" | "file",
    deliveryContent: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      category: "",
      stockType: "ghost",
      stockQuantity: 0,
      hasVariations: false,
      price: 0,
      variations: [],
      deliveryType: "link",
      deliveryContent: ""
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      image: product.image,
      category: product.category,
      stockType: product.stockType,
      stockQuantity: product.stockQuantity || 0,
      hasVariations: product.variations.length > 0,
      price: product.price,
      variations: product.variations,
      deliveryType: product.deliveryType,
      deliveryContent: product.deliveryContent
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, variations: formData.hasVariations ? formData.variations : [] }
          : p
      ));
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        image: formData.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
        category: formData.category,
        stockType: formData.stockType,
        stockQuantity: formData.stockType === "line" ? formData.stockQuantity : undefined,
        price: formData.hasVariations ? 0 : formData.price,
        variations: formData.hasVariations ? formData.variations : [],
        deliveryType: formData.deliveryType,
        deliveryContent: formData.deliveryContent,
        status: "active",
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addVariation = () => {
    setFormData({
      ...formData,
      variations: [...formData.variations, { id: Date.now().toString(), name: "", price: 0 }]
    });
  };

  const updateVariation = (id: string, field: "name" | "price", value: string | number) => {
    setFormData({
      ...formData,
      variations: formData.variations.map(v => 
        v.id === id ? { ...v, [field]: value } : v
      )
    });
  };

  const removeVariation = (id: string) => {
    setFormData({
      ...formData,
      variations: formData.variations.filter(v => v.id !== id)
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (id: string) => {
    return mockCategories.find(c => c.id === id)?.name || "Sem categoria";
  };

  const getProductPrice = (product: Product) => {
    if (product.variations.length > 0) {
      const minPrice = Math.min(...product.variations.map(v => v.price));
      const maxPrice = Math.max(...product.variations.map(v => v.price));
      return `R$ ${minPrice} - R$ ${maxPrice}`;
    }
    return `R$ ${product.price}`;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seus produtos digitais</p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {mockCategories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground mb-6">Comece criando seu primeiro produto digital</p>
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="w-4 h-4" />
            Criar Produto
          </Button>
        </motion.div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === "active" 
                        ? "bg-success/20 text-success" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {product.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(product)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{getCategoryName(product.category)}</span>
                    <span className="font-bold text-primary">{getProductPrice(product)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Produto</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Categoria</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Estoque</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Preço</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground hidden md:table-cell">
                    {getCategoryName(product.category)}
                  </td>
                  <td className="py-4 px-4 text-sm hidden sm:table-cell">
                    {product.stockType === "ghost" ? (
                      <span className="text-muted-foreground">Ilimitado</span>
                    ) : (
                      <span className="text-foreground">{product.stockQuantity} un.</span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-semibold text-primary">{getProductPrice(product)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === "active" 
                        ? "bg-success/10 text-success" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {product.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(product)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Curso de Marketing Digital"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva seu produto..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Stock Type */}
            <div className="space-y-4">
              <Label>Tipo de Estoque</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormData({ ...formData, stockType: "ghost" })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.stockType === "ghost" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <p className="font-medium text-foreground">Estoque Fantasma</p>
                  <p className="text-sm text-muted-foreground">Ilimitado, sem controle</p>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, stockType: "line" })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.stockType === "line" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <p className="font-medium text-foreground">Estoque por Linha</p>
                  <p className="text-sm text-muted-foreground">Quantidade limitada</p>
                </button>
              </div>
              
              {formData.stockType === "line" && (
                <div>
                  <Label htmlFor="stockQuantity">Quantidade em Estoque</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Preço com Variações</Label>
                <Switch
                  checked={formData.hasVariations}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasVariations: checked })}
                />
              </div>

              {!formData.hasVariations ? (
                <div>
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Label>Variações</Label>
                  {formData.variations.map((variation, index) => (
                    <div key={variation.id} className="flex gap-2">
                      <Input
                        placeholder="Nome da variação"
                        value={variation.name}
                        onChange={(e) => updateVariation(variation.id, "name", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Preço"
                        value={variation.price}
                        onChange={(e) => updateVariation(variation.id, "price", parseFloat(e.target.value) || 0)}
                        className="w-32"
                        min="0"
                        step="0.01"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariation(variation.id)}
                        className="text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addVariation} className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar Variação
                  </Button>
                </div>
              )}
            </div>

            {/* Digital Delivery */}
            <div className="space-y-4">
              <Label>Entrega Digital</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormData({ ...formData, deliveryType: "link" })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.deliveryType === "link" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <LinkIcon className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">Link de Acesso</p>
                  <p className="text-sm text-muted-foreground">URL externa</p>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, deliveryType: "file" })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.deliveryType === "file" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Upload className="w-5 h-5 text-primary mb-2" />
                  <p className="font-medium text-foreground">Arquivo</p>
                  <p className="text-sm text-muted-foreground">Upload de arquivo</p>
                </button>
              </div>

              <div>
                <Label htmlFor="deliveryContent">
                  {formData.deliveryType === "link" ? "URL de Acesso" : "Arquivo"}
                </Label>
                {formData.deliveryType === "link" ? (
                  <Input
                    id="deliveryContent"
                    value={formData.deliveryContent}
                    onChange={(e) => setFormData({ ...formData, deliveryContent: e.target.value })}
                    placeholder="https://seusite.com/acesso"
                  />
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="deliveryContent"
                      value={formData.deliveryContent}
                      onChange={(e) => setFormData({ ...formData, deliveryContent: e.target.value })}
                      placeholder="arquivo.pdf"
                      readOnly
                    />
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.category}>
              {editingProduct ? "Salvar Alterações" : "Criar Produto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Products;
