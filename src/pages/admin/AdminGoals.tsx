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
import { Target, Plus, Edit, Trophy, Gift } from "lucide-react";

const goals = [
  {
    id: 1,
    name: "Primeira Venda",
    target: "R$ 1,00",
    reward: "Badge Iniciante",
    rewardType: "badge",
    participants: 1247,
    achieved: 890,
    status: "active",
  },
  {
    id: 2,
    name: "Vendedor Bronze",
    target: "R$ 1.000,00",
    reward: "R$ 50 em créditos",
    rewardType: "credit",
    participants: 890,
    achieved: 456,
    status: "active",
  },
  {
    id: 3,
    name: "Vendedor Prata",
    target: "R$ 5.000,00",
    reward: "1 mês Pro grátis",
    rewardType: "plan",
    participants: 456,
    achieved: 123,
    status: "active",
  },
  {
    id: 4,
    name: "Vendedor Ouro",
    target: "R$ 10.000,00",
    reward: "Desconto de 20% na taxa",
    rewardType: "discount",
    participants: 123,
    achieved: 45,
    status: "active",
  },
  {
    id: 5,
    name: "Vendedor Platina",
    target: "R$ 50.000,00",
    reward: "R$ 500 + Badge Exclusivo",
    rewardType: "money",
    participants: 45,
    achieved: 12,
    status: "active",
  },
];

export default function AdminGoals() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<typeof goals[0] | null>(null);

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Metas Globais</h1>
            <p className="text-muted-foreground mt-1">Configure as metas e premiações da plataforma</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
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
                  <p className="text-2xl font-bold text-foreground">{goals.length}</p>
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
                  <p className="text-2xl font-bold text-foreground">1.526</p>
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
                  <p className="text-sm text-muted-foreground">Prêmios Distribuídos</p>
                  <p className="text-2xl font-bold text-foreground">R$ 12.500</p>
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
                {goals.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="font-medium">{goal.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{goal.target}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRewardIcon(goal.rewardType)}
                        <span>{goal.reward}</span>
                      </div>
                    </TableCell>
                    <TableCell>{goal.participants}</TableCell>
                    <TableCell>{goal.achieved}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500/10 text-emerald-500">
                        {Math.round((goal.achieved / goal.participants) * 100)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingGoal(goal)}
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

        {/* Create/Edit Goal Dialog */}
        <Dialog open={showCreateDialog || !!editingGoal} onOpenChange={() => { setShowCreateDialog(false); setEditingGoal(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingGoal ? "Editar Meta" : "Criar Nova Meta"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Meta</Label>
                <Input placeholder="Ex: Vendedor Diamond" defaultValue={editingGoal?.name} />
              </div>
              <div className="space-y-2">
                <Label>Valor Objetivo</Label>
                <Input placeholder="Ex: 100000" defaultValue={editingGoal?.target.replace("R$ ", "").replace(",00", "")} />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Recompensa</Label>
                <Select defaultValue={editingGoal?.rewardType || "badge"}>
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
                  defaultValue={editingGoal?.reward}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setShowCreateDialog(false); setEditingGoal(null); }}>
                  Cancelar
                </Button>
                <Button>
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
