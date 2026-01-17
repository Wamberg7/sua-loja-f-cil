import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Crown, Plus, Edit, Users, Loader2 } from "lucide-react";
import { useAllPlans, Plan } from "@/hooks/usePlans";

export default function AdminPlans() {
  const { plans, isLoading, createPlan, updatePlan } = useAllPlans();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  // Form state
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formMaxProducts, setFormMaxProducts] = useState("");
  const [formMaxViews, setFormMaxViews] = useState("");

  const formatCurrency = (value: number) => {
    if (value === 0) return "Grátis";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100) + "/mês";
  };

  const openCreateDialog = () => {
    setFormName("");
    setFormPrice("");
    setFormFeatures("");
    setFormMaxProducts("");
    setFormMaxViews("");
    setShowCreateDialog(true);
  };

  const openEditDialog = (plan: Plan) => {
    setFormName(plan.name);
    setFormPrice((plan.price / 100).toString());
    setFormFeatures(plan.features.join("\n"));
    setFormMaxProducts(plan.max_products?.toString() || "");
    setFormMaxViews(plan.max_monthly_views?.toString() || "");
    setEditingPlan(plan);
  };

  const closeDialog = () => {
    setShowCreateDialog(false);
    setEditingPlan(null);
  };

  const handleSave = async () => {
    const planData = {
      name: formName,
      price: Math.round(parseFloat(formPrice || "0") * 100),
      features: formFeatures.split("\n").filter(f => f.trim()),
      max_products: formMaxProducts ? parseInt(formMaxProducts) : null,
      max_monthly_views: formMaxViews ? parseInt(formMaxViews) : null,
      is_active: true,
    };

    if (editingPlan) {
      await updatePlan.mutateAsync({ id: editingPlan.id, ...planData });
    } else {
      await createPlan.mutateAsync(planData);
    }
    closeDialog();
  };

  // Calculate distribution
  const totalSubscribers = plans.reduce((acc, p) => acc + (p.subscribers_count || 0), 0);
  const planStats = plans.map(plan => ({
    name: plan.name,
    count: plan.subscribers_count || 0,
    percentage: totalSubscribers > 0 
      ? Math.round(((plan.subscribers_count || 0) / totalSubscribers) * 100) 
      : 0,
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Planos</h1>
            <p className="text-muted-foreground mt-1">Gerencie os planos da plataforma</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        </div>

        {/* Plan Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Distribuição de Assinantes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : planStats.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nenhum plano cadastrado</p>
            ) : (
              <div className="space-y-4">
                {planStats.map((plan) => (
                  <div key={plan.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{plan.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {plan.count} assinantes ({plan.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${plan.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plans Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Todos os Planos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : plans.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhum plano cadastrado</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plano</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Limite Produtos</TableHead>
                    <TableHead>Limite Acessos</TableHead>
                    <TableHead>Recursos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-primary" />
                          <span className="font-medium">{plan.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(plan.price)}</TableCell>
                      <TableCell>{plan.max_products || "Ilimitado"}</TableCell>
                      <TableCell>
                        {plan.max_monthly_views 
                          ? plan.max_monthly_views.toLocaleString() 
                          : "Ilimitado"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {plan.features.slice(0, 2).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {plan.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{plan.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={plan.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}>
                          {plan.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(plan)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Plan Dialog */}
        <Dialog open={showCreateDialog || !!editingPlan} onOpenChange={closeDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Editar Plano" : "Criar Novo Plano"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Plano</Label>
                <Input 
                  placeholder="Ex: Premium" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Preço Mensal (R$)</Label>
                <Input 
                  type="number"
                  placeholder="Ex: 99.00" 
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Limite de Produtos</Label>
                  <Input 
                    type="number"
                    placeholder="Deixe vazio para ilimitado" 
                    value={formMaxProducts}
                    onChange={(e) => setFormMaxProducts(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Limite de Acessos/mês</Label>
                  <Input 
                    type="number"
                    placeholder="Deixe vazio para ilimitado" 
                    value={formMaxViews}
                    onChange={(e) => setFormMaxViews(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Recursos (um por linha)</Label>
                <Textarea
                  placeholder="Produtos ilimitados&#10;Suporte prioritário&#10;API de integração"
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={!formName}>
                  {editingPlan ? "Salvar Alterações" : "Criar Plano"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
