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
import { Crown, Plus, Edit, Users } from "lucide-react";

const plans = [
  {
    id: 1,
    name: "Starter",
    price: "Grátis",
    subscribers: 856,
    features: ["5 produtos", "1.000 acessos/mês", "Suporte por email"],
    status: "active",
  },
  {
    id: 2,
    name: "Pro",
    price: "R$ 49/mês",
    subscribers: 324,
    features: ["50 produtos", "10.000 acessos/mês", "Cupons ilimitados", "Suporte prioritário"],
    status: "active",
  },
  {
    id: 3,
    name: "Business",
    price: "R$ 99/mês",
    subscribers: 67,
    features: ["Produtos ilimitados", "Acessos ilimitados", "API de integração", "Gerente dedicado"],
    status: "active",
  },
];

const planStats = [
  { name: "Starter", count: 856, percentage: 69 },
  { name: "Pro", count: 324, percentage: 26 },
  { name: "Business", count: 67, percentage: 5 },
];

export default function AdminPlans() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<typeof plans[0] | null>(null);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Planos</h1>
            <p className="text-muted-foreground mt-1">Gerencie os planos da plataforma</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
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
            <div className="space-y-4">
              {planStats.map((plan) => (
                <div key={plan.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{plan.name}</span>
                    <span className="text-sm text-muted-foreground">{plan.count} assinantes ({plan.percentage}%)</span>
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
          </CardContent>
        </Card>

        {/* Plans Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Todos os Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plano</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Assinantes</TableHead>
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
                    <TableCell className="font-semibold">{plan.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {plan.subscribers}
                      </div>
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
                      <Badge className="bg-emerald-500/10 text-emerald-500">Ativo</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPlan(plan)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create/Edit Plan Dialog */}
        <Dialog open={showCreateDialog || !!editingPlan} onOpenChange={() => { setShowCreateDialog(false); setEditingPlan(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Editar Plano" : "Criar Novo Plano"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Plano</Label>
                <Input placeholder="Ex: Premium" defaultValue={editingPlan?.name} />
              </div>
              <div className="space-y-2">
                <Label>Preço Mensal</Label>
                <Input placeholder="Ex: 99.00" defaultValue={editingPlan?.price.replace("R$ ", "").replace("/mês", "")} />
              </div>
              <div className="space-y-2">
                <Label>Recursos (um por linha)</Label>
                <Textarea
                  placeholder="Produtos ilimitados&#10;Suporte prioritário&#10;API de integração"
                  defaultValue={editingPlan?.features.join("\n")}
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setShowCreateDialog(false); setEditingPlan(null); }}>
                  Cancelar
                </Button>
                <Button>
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
