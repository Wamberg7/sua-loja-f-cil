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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, Plus, Edit, Trophy, Gift, Loader2 } from "lucide-react";
import { useAllGoals, Goal } from "@/hooks/useGoals";

export default function AdminGoals() {
  const { goals, isLoading, createGoal, updateGoal, totalAchieved } = useAllGoals();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formRewardType, setFormRewardType] = useState("badge");
  const [formRewardDescription, setFormRewardDescription] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "badge":
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case "credit":
      case "money":
        return <Gift className="w-4 h-4 text-emerald-500" />;
      case "plan":
        return <Trophy className="w-4 h-4 text-primary" />;
      case "discount":
        return <Gift className="w-4 h-4 text-blue-500" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  const openCreateDialog = () => {
    setFormName("");
    setFormTarget("");
    setFormRewardType("badge");
    setFormRewardDescription("");
    setShowCreateDialog(true);
  };

  const openEditDialog = (goal: Goal) => {
    setFormName(goal.name);
    setFormTarget((goal.target_amount / 100).toString());
    setFormRewardType(goal.reward_type);
    setFormRewardDescription(goal.reward_description);
    setEditingGoal(goal);
  };

  const closeDialog = () => {
    setShowCreateDialog(false);
    setEditingGoal(null);
  };

  const handleSave = async () => {
    const goalData = {
      name: formName,
      target_amount: Math.round(parseFloat(formTarget || "0") * 100),
      reward_type: formRewardType,
      reward_description: formRewardDescription,
      is_active: true,
    };

    if (editingGoal) {
      await updateGoal.mutateAsync({ id: editingGoal.id, ...goalData });
    } else {
      await createGoal.mutateAsync(goalData);
    }
    closeDialog();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Metas Globais</h1>
            <p className="text-muted-foreground mt-1">Configure as metas e premiações da plataforma</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Metas Ativas</p>
                  <p className="text-2xl font-bold text-foreground">
                    {goals.filter(g => g.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Metas Concluídas</p>
                  <p className="text-2xl font-bold text-foreground">{totalAchieved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Participantes</p>
                  <p className="text-2xl font-bold text-foreground">
                    {goals.reduce((acc, g) => acc + (g.participants_count || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Todas as Metas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : goals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma meta cadastrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meta</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead>Recompensa</TableHead>
                    <TableHead>Participantes</TableHead>
                    <TableHead>Concluídas</TableHead>
                    <TableHead>Taxa</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goals.map((goal) => {
                    const rate = goal.participants_count && goal.participants_count > 0
                      ? Math.round(((goal.achieved_count || 0) / goal.participants_count) * 100)
                      : 0;

                    return (
                      <TableRow key={goal.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            <span className="font-medium">{goal.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(goal.target_amount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRewardIcon(goal.reward_type)}
                            <span>{goal.reward_description}</span>
                          </div>
                        </TableCell>
                        <TableCell>{goal.participants_count || 0}</TableCell>
                        <TableCell>{goal.achieved_count || 0}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-500">
                            {rate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(goal)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Goal Dialog */}
        <Dialog open={showCreateDialog || !!editingGoal} onOpenChange={closeDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingGoal ? "Editar Meta" : "Criar Nova Meta"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Meta</Label>
                <Input 
                  placeholder="Ex: Vendedor Diamond" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor Objetivo (R$)</Label>
                <Input 
                  type="number"
                  placeholder="Ex: 100000" 
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Recompensa</Label>
                <Select value={formRewardType} onValueChange={setFormRewardType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="badge">Badge/Medalha</SelectItem>
                    <SelectItem value="credit">Créditos na Plataforma</SelectItem>
                    <SelectItem value="money">Dinheiro</SelectItem>
                    <SelectItem value="plan">Upgrade de Plano</SelectItem>
                    <SelectItem value="discount">Desconto em Taxas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descrição da Recompensa</Label>
                <Textarea
                  placeholder="Descreva a recompensa..."
                  value={formRewardDescription}
                  onChange={(e) => setFormRewardDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={!formName || !formRewardDescription}>
                  {editingGoal ? "Salvar Alterações" : "Criar Meta"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
