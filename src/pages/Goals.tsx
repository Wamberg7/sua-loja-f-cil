import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy,
  Target,
  Gift,
  Star,
  Zap,
  Award,
  TrendingUp,
  CheckCircle,
  Lock,
  Clock
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: {
    type: "money" | "discount" | "upgrade";
    value: string;
  };
  status: "active" | "completed" | "locked";
  deadline?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
  earnedDate?: string;
}

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Primeira Venda",
    description: "Realize sua primeira venda na plataforma",
    target: 1,
    current: 1,
    reward: { type: "money", value: "R$ 50" },
    status: "completed"
  },
  {
    id: "2",
    title: "Faturamento Bronze",
    description: "Fature R$ 1.000 em vendas",
    target: 1000,
    current: 850,
    reward: { type: "discount", value: "10% off na taxa" },
    status: "active"
  },
  {
    id: "3",
    title: "Faturamento Prata",
    description: "Fature R$ 5.000 em vendas",
    target: 5000,
    current: 850,
    reward: { type: "money", value: "R$ 200" },
    status: "active"
  },
  {
    id: "4",
    title: "Faturamento Ouro",
    description: "Fature R$ 10.000 em vendas",
    target: 10000,
    current: 850,
    reward: { type: "upgrade", value: "1 mês Pro grátis" },
    status: "locked"
  },
  {
    id: "5",
    title: "Faturamento Diamante",
    description: "Fature R$ 50.000 em vendas",
    target: 50000,
    current: 850,
    reward: { type: "money", value: "R$ 1.000" },
    status: "locked"
  },
];

const mockBadges: Badge[] = [
  { id: "1", name: "Novato", description: "Criou a primeira loja", icon: Star, earned: true, earnedDate: "2024-01-01" },
  { id: "2", name: "Vendedor", description: "Realizou a primeira venda", icon: Zap, earned: true, earnedDate: "2024-01-15" },
  { id: "3", name: "Popular", description: "10+ clientes únicos", icon: TrendingUp, earned: false },
  { id: "4", name: "Expert", description: "50+ vendas realizadas", icon: Award, earned: false },
  { id: "5", name: "Lenda", description: "100+ vendas realizadas", icon: Trophy, earned: false },
];

const Goals = () => {
  const [goals] = useState<Goal[]>(mockGoals);
  const [badges] = useState<Badge[]>(mockBadges);

  const activeGoals = goals.filter(g => g.status === "active");
  const completedGoals = goals.filter(g => g.status === "completed");
  const lockedGoals = goals.filter(g => g.status === "locked");
  const earnedBadges = badges.filter(b => b.earned);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "money": return "💰";
      case "discount": return "🏷️";
      case "upgrade": return "⚡";
      default: return "🎁";
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Metas & Premiações</h1>
        <p className="text-muted-foreground">Alcance metas e ganhe recompensas incríveis</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-primary rounded-xl p-6 text-center"
        >
          <Trophy className="w-8 h-8 mx-auto mb-2 text-primary-foreground" />
          <p className="text-3xl font-bold text-primary-foreground">{completedGoals.length}</p>
          <p className="text-sm text-primary-foreground/80">Metas Concluídas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 text-center border border-border"
        >
          <Target className="w-8 h-8 mx-auto mb-2 text-warning" />
          <p className="text-3xl font-bold text-foreground">{activeGoals.length}</p>
          <p className="text-sm text-muted-foreground">Metas Ativas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 text-center border border-border"
        >
          <Award className="w-8 h-8 mx-auto mb-2 text-accent" />
          <p className="text-3xl font-bold text-foreground">{earnedBadges.length}</p>
          <p className="text-sm text-muted-foreground">Badges Conquistados</p>
        </motion.div>
      </div>

      {/* Active Goals */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-warning" />
          Metas Ativas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl">{getRewardIcon(goal.reward.type)}</span>
                  <p className="text-sm font-medium text-primary">{goal.reward.value}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                  </span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground text-right">
                  {Math.round((goal.current / goal.target) * 100)}% concluído
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Metas Concluídas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-success/5 rounded-xl p-4 border border-success/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{goal.title}</h3>
                    <p className="text-xs text-muted-foreground">Prêmio: {goal.reward.value}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-success border-success/30">
                    <Gift className="w-4 h-4 mr-1" />
                    Resgatar
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Goals */}
      {lockedGoals.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-muted-foreground" />
            Próximas Metas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-4 border border-border opacity-60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{goal.title}</h3>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                    <p className="text-xs text-primary mt-1">🎁 {goal.reward.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-accent" />
          Badges
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`text-center p-4 rounded-xl border transition-all ${
                  badge.earned 
                    ? "bg-gradient-to-b from-accent/10 to-accent/5 border-accent/30" 
                    : "bg-card border-border opacity-50"
                }`}
              >
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                  badge.earned 
                    ? "bg-gradient-accent" 
                    : "bg-muted"
                }`}>
                  <Icon className={`w-8 h-8 ${badge.earned ? "text-accent-foreground" : "text-muted-foreground"}`} />
                </div>
                <h4 className="font-medium text-foreground text-sm">{badge.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                {badge.earnedDate && (
                  <p className="text-xs text-primary mt-2">
                    ✓ {new Date(badge.earnedDate).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Goals;
