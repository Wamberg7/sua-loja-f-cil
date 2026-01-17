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
  Filter
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

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  application: "all" | "product" | "category";
  applicationId?: string;
  minValue?: number;
  status: "active" | "inactive";
}

const mockCoupons: Coupon[] = [
  { 
    id: "1", 
    code: "DESCONTO10", 
    type: "percentage", 
    value: 10, 
    startDate: "2024-01-01", 
    endDate: "2024-12-31", 
    usageLimit: 100, 
    usageCount: 45, 
    application: "all",
    status: "active" 
  },
  { 
    id: "2", 
    code: "PROMO50", 
    type: "fixed", 
    value: 50, 
    startDate: "2024-01-01", 
    endDate: "2024-06-30", 
    usageLimit: 50, 
    usageCount: 50, 
    application: "product",
    applicationId: "1",
    minValue: 100,
    status: "inactive" 
  },
  { 
    id: "3", 
    code: "CURSOS20", 
    type: "percentage", 
    value: 20, 
    startDate: "2024-02-01", 
    endDate: "2024-03-31", 
    usageLimit: 200, 
    usageCount: 78, 
    application: "category",
    applicationId: "1",
    status: "active" 
  },
];

const Coupons = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
    application: "all" as "all" | "product" | "category",
    applicationId: "",
    minValue: 0,
    status: true
  });

  const resetForm = () => {
    setFormData({
      code: "",
      type: "percentage",
      value: 0,
      startDate: "",
      endDate: "",
      usageLimit: 0,
      application: "all",
      applicationId: "",
      minValue: 0,
      status: true
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
      type: coupon.type,
      value: coupon.value,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      usageLimit: coupon.usageLimit,
      application: coupon.application,
      applicationId: coupon.applicationId || "",
      minValue: coupon.minValue || 0,
      status: coupon.status === "active"
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Check for duplicate code
    const isDuplicate = coupons.some(c => 
      c.code.toUpperCase() === formData.code.toUpperCase() && 
      c.id !== editingCoupon?.id
    );
    
    if (isDuplicate) {
      alert("Este código de cupom já existe!");
      return;
    }

    if (editingCoupon) {
      setCoupons(coupons.map(c => 
        c.id === editingCoupon.id 
          ? { 
              ...c, 
              ...formData, 
              code: formData.code.toUpperCase(),
              status: formData.status ? "active" : "inactive" 
            }
          : c
      ));
    } else {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: formData.value,
        startDate: formData.startDate,
        endDate: formData.endDate,
        usageLimit: formData.usageLimit,
        usageCount: 0,
        application: formData.application,
        applicationId: formData.application !== "all" ? formData.applicationId : undefined,
        minValue: formData.minValue > 0 ? formData.minValue : undefined,
        status: formData.status ? "active" : "inactive"
      };
      setCoupons([newCoupon, ...coupons]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || coupon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

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
      {filteredCoupons.length === 0 ? (
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
                  isExpired(coupon.endDate) || coupon.status === "inactive"
                    ? "border-border opacity-70"
                    : "border-primary/20 hover:border-primary/40"
                } transition-all`}
              >
                <div className={`h-2 ${
                  coupon.status === "active" && !isExpired(coupon.endDate)
                    ? "bg-gradient-primary"
                    : "bg-muted"
                }`} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        coupon.type === "percentage" ? "bg-primary/10" : "bg-accent/10"
                      }`}>
                        {coupon.type === "percentage" ? (
                          <Percent className="w-5 h-5 text-primary" />
                        ) : (
                          <DollarSign className="w-5 h-5 text-accent" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground font-mono">{coupon.code}</p>
                        <p className="text-sm text-muted-foreground">
                          {coupon.type === "percentage" ? `${coupon.value}% off` : `R$ ${coupon.value} off`}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(coupon)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(coupon.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Uso:</span>
                      <span className="font-medium text-foreground">
                        {coupon.usageCount} / {coupon.usageLimit}
                      </span>
                    </div>

                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        {coupon.application === "all" ? "Todos os produtos" : 
                         coupon.application === "product" ? "Produto específico" : "Categoria"}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.status === "active" && !isExpired(coupon.endDate)
                          ? "bg-success/10 text-success" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {isExpired(coupon.endDate) ? "Expirado" : 
                         coupon.status === "active" ? "Ativo" : "Inativo"}
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
                  onClick={() => setFormData({ ...formData, type: "percentage" })}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.type === "percentage" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Percent className="w-5 h-5 text-primary mb-1" />
                  <p className="font-medium text-foreground text-sm">Porcentagem</p>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, type: "fixed" })}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.type === "fixed" 
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
                Valor {formData.type === "percentage" ? "(%)" : "(R$)"}
              </Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                min="0"
                max={formData.type === "percentage" ? 100 : undefined}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="usageLimit">Limite de Uso</Label>
              <Input
                id="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>

            <div>
              <Label>Aplicação</Label>
              <Select 
                value={formData.application} 
                onValueChange={(value: "all" | "product" | "category") => 
                  setFormData({ ...formData, application: value })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os produtos</SelectItem>
                  <SelectItem value="product">Produto específico</SelectItem>
                  <SelectItem value="category">Categoria específica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="minValue">Valor Mínimo (opcional)</Label>
              <Input
                id="minValue"
                type="number"
                value={formData.minValue}
                onChange={(e) => setFormData({ ...formData, minValue: parseFloat(e.target.value) || 0 })}
                placeholder="R$ 0,00"
                min="0"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Status</Label>
                <p className="text-sm text-muted-foreground">Cupom ativo</p>
              </div>
              <Switch
                checked={formData.status}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.code || formData.value <= 0}>
              {editingCoupon ? "Salvar" : "Criar Cupom"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Coupons;
