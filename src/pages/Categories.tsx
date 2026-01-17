import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderTree,
  MoreVertical,
  Loader2
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { Category } from "@/lib/types";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  
  const { data: categories = [], isLoading } = useCategories();
  const { data: products = [] } = useProducts();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", is_active: true });
    setEditingCategory(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      is_active: category.is_active
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editingCategory) {
      await updateCategory.mutateAsync({
        id: editingCategory.id,
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active
      });
    } else {
      await createCategory.mutateAsync({
        name: formData.name,
        description: formData.description,
        is_active: formData.is_active
      });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteCategoryId) {
      deleteCategory.mutate(deleteCategoryId);
      setDeleteCategoryId(null);
    }
  };

  const getProductCount = (categoryId: string) => {
    return products.filter(p => p.category_id === categoryId).length;
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSaving = createCategory.isPending || updateCategory.isPending;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground">Organize seus produtos em categorias</p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar categorias..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <FolderTree className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma categoria encontrada</h3>
          <p className="text-muted-foreground mb-6">Crie categorias para organizar seus produtos</p>
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="w-4 h-4" />
            Criar Categoria
          </Button>
        </motion.div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Nome</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Descrição</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Produtos</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredCategories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FolderTree className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground hidden md:table-cell">
                      {category.description || "-"}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-foreground">{getProductCount(category.id)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.is_active 
                          ? "bg-success/10 text-success" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {category.is_active ? "Ativa" : "Inativa"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem onClick={() => openEditModal(category)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteCategoryId(category.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Cursos Online"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva esta categoria..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Status</Label>
                <p className="text-sm text-muted-foreground">Categoria visível na loja</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || isSaving}>
              {isSaving ? "Salvando..." : editingCategory ? "Salvar" : "Criar Categoria"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A categoria será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Categories;
