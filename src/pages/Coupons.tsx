import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Ticket,
  MoreVertical,
  Calendar,
  Percent,
  DollarSign,
  Filter,
  Loader2
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from "@/hooks/useCoupons";
import { Coupon } from "@/lib/types";

const Coupons = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteCouponId, setDeleteCouponId] = useState<string | null>(null);

  const { data: coupons = [], isLoading } = useCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();
  
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 0,
    expires_at: "",
    max_uses: 0,
    min_order_value: 0,
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: 0,
      expires_at: "",
      max_uses: 0,
      min_order_value: 0,
      is_active: true
    });
    setEditingCoupon(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type as "percentage" | "fixed",
      discount_value: coupon.discount_value,
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : "",
      max_uses: coupon.max_uses || 0,
      min_order_value: coupon.min_order_value || 0,
      is_active: coupon.is_active
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const couponData = {
      code: formData.code,
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      expires_at: formData.expires_at || undefined,
      max_uses: formData.max_uses > 0 ? formData.max_uses : undefined,
      min_order_value: formData.min_order_value > 0 ? formData.min_order_value : undefined,
      is_active: formData.is_active
    };

    if (editingCoupon) {
      await updateCoupon.mutateAsync({ id: editingCoupon.id, ...couponData });
    } else {
      await createCoupon.mutateAsync(couponData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteCouponId) {
      deleteCoupon.mutate(deleteCouponId);
      setDeleteCouponId(null);
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && coupon.is_active) ||
      (statusFilter === "inactive" && !coupon.is_active);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isSaving = createCoupon.isPending || updateCoupon.isPending;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Cupons</h1>
          <p className="text-muted-foreground">Gerencie seus cupons de desconto</p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Cupom
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Coupons List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredCoupons.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Ticket className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum cupom encontrado</h3>
          <p className="text-muted-foreground mb-6">Crie cupons para oferecer descontos</p>
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="w-4 h-4" />
            Criar Cupom
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredCoupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-card rounded-xl border overflow-hidden ${
                  isExpired(coupon.expires_at) || !coupon.is_active
                    ? "border-border opacity-70"
                    : "border-primary/20 hover:border-primary/40"
                } transition-all`}
              >
                <div className={`h-2 ${
                  coupon.is_active && !isExpired(coupon.expires_at)
                    ? "bg-gradient-primary"
                    : "bg-muted"
                }`} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        coupon.discount_type === "percentage" ? "bg-primary/10" : "bg-accent/10"
                      }`}>
                        {coupon.discount_type === "percentage" ? (
                          <Percent className="w-5 h-5 text-primary" />
                        ) : (
                          <DollarSign className="w-5 h-5 text-accent" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground font-mono">{coupon.code}</p>
                        <p className="text-sm text-muted-foreground">
                          {coupon.discount_type === "percentage" 
                            ? `${coupon.discount_value}% off` 
                            : `R$ ${(coupon.discount_value / 100).toFixed(2)} off`}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem onClick={() => openEditModal(coupon)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteCouponId(coupon.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 text-sm">
                    {coupon.expires_at && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Expira em: {formatDate(coupon.expires_at)}</span>
                      </div>
                    )}
                    
                    {coupon.max_uses && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Uso:</span>
                        <span className="font-medium text-foreground">
                          {coupon.uses_count} / {coupon.max_uses}
                        </span>
                      </div>
                    )}

                    {coupon.max_uses && (
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${Math.min((coupon.uses_count / coupon.max_uses) * 100, 100)}%` }}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        {coupon.min_order_value ? `Mín: R$ ${(coupon.min_order_value / 100).toFixed(2)}` : "Sem mínimo"}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.is_active && !isExpired(coupon.expires_at)
                          ? "bg-success/10 text-success" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {isExpired(coupon.expires_at) ? "Expirado" : 
                         coupon.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Editar Cupom" : "Novo Cupom"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="code">Código do Cupom *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="Ex: DESCONTO20"
                className="font-mono uppercase"
              />
            </div>

            <div>
              <Label>Tipo de Desconto</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  onClick={() => setFormData({ ...formData, discount_type: "percentage" })}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.discount_type === "percentage" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Percent className="w-5 h-5 text-primary mb-1" />
                  <p className="font-medium text-foreground text-sm">Porcentagem</p>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, discount_type: "fixed" })}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.discount_type === "fixed" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <DollarSign className="w-5 h-5 text-primary mb-1" />
                  <p className="font-medium text-foreground text-sm">Valor Fixo</p>
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="value">
                Valor {formData.discount_type === "percentage" ? "(%)" : "(R$)"}
              </Label>
              <Input
                id="value"
                type="number"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                min="0"
                max={formData.discount_type === "percentage" ? 100 : undefined}
              />
            </div>

            <div>
              <Label htmlFor="expires_at">Data de Expiração (opcional)</Label>
              <Input
                id="expires_at"
                type="date"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="max_uses">Limite de Uso (0 = ilimitado)</Label>
              <Input
                id="max_uses"
                type="number"
                value={formData.max_uses}
                onChange={(e) => setFormData({ ...formData, max_uses: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="min_order_value">Valor Mínimo do Pedido (centavos)</Label>
              <Input
                id="min_order_value"
                type="number"
                value={formData.min_order_value}
                onChange={(e) => setFormData({ ...formData, min_order_value: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Status</Label>
                <p className="text-sm text-muted-foreground">Cupom ativo e disponível</p>
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
            <Button onClick={handleSave} disabled={!formData.code || isSaving}>
              {isSaving ? "Salvando..." : editingCoupon ? "Salvar" : "Criar Cupom"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCouponId} onOpenChange={() => setDeleteCouponId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cupom?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cupom será removido permanentemente.
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

export default Coupons;
