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
  Loader2
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGoals, useUserGoals } from "@/hooks/useGoals";
import { useStoreStats } from "@/hooks/useStats";

const Goals = () => {
  const { data: goals = [], isLoading: goalsLoading } = useGoals();
  const { data: userGoals = [], isLoading: userGoalsLoading } = useUserGoals();
  const { data: stats } = useStoreStats();

  const isLoading = goalsLoading || userGoalsLoading;

  // Calculate progress for each goal based on stats
  const getProgress = (goal: typeof goals[0]) => {
    const userGoal = userGoals.find(ug => ug.goal_id === goal.id);
    return userGoal?.current_amount || 0;
  };

  const isCompleted = (goal: typeof goals[0]) => {
    const userGoal = userGoals.find(ug => ug.goal_id === goal.id);
    return userGoal?.achieved_at !== null && userGoal?.achieved_at !== undefined;
  };

  const isLocked = (goal: typeof goals[0], index: number) => {
    if (index === 0) return false;
    const previousGoal = goals[index - 1];
    return !isCompleted(previousGoal);
  };

  const activeGoals = goals.filter((g, i) => !isCompleted(g) && !isLocked(g, i));
  const completedGoals = goals.filter(g => isCompleted(g));
  const lockedGoals = goals.filter((g, i) => isLocked(g, i) && !isCompleted(g));

  const formatCurrency = (value: number) => {
    return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "money": return "💰";
      case "discount": return "🏷️";
      case "upgrade": return "⚡";
      default: return "🎁";
    }
  };

  // Mock badges based on progress
  const badges = [
    { id: "1", name: "Novato", description: "Criou a primeira loja", icon: Star, earned: true },
    { id: "2", name: "Vendedor", description: "Realizou a primeira venda", icon: Zap, earned: (stats?.orders_count || 0) > 0 },
    { id: "3", name: "Popular", description: "10+ clientes únicos", icon: TrendingUp, earned: (stats?.customers_count || 0) >= 10 },
    { id: "4", name: "Expert", description: "50+ vendas realizadas", icon: Award, earned: (stats?.orders_count || 0) >= 50 },
    { id: "5", name: "Lenda", description: "100+ vendas realizadas", icon: Trophy, earned: (stats?.orders_count || 0) >= 100 },
  ];

  const earnedBadges = badges.filter(b => b.earned);

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

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-warning" />
                Metas Ativas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGoals.map((goal, index) => {
                  const progress = getProgress(goal);
                  const progressPercent = Math.min((progress / goal.target_amount) * 100, 100);
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{goal.name}</h3>
                          <p className="text-sm text-muted-foreground">Fature {formatCurrency(goal.target_amount)}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl">{getRewardIcon(goal.reward_type)}</span>
                          <p className="text-sm font-medium text-primary">{goal.reward_description}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(progress)} / {formatCurrency(goal.target_amount)}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-3" />
                        <p className="text-xs text-muted-foreground text-right">
                          {Math.round(progressPercent)}% concluído
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

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
                        <h3 className="font-medium text-foreground">{goal.name}</h3>
                        <p className="text-xs text-muted-foreground">Prêmio: {goal.reward_description}</p>
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
                        <h3 className="font-medium text-foreground">{goal.name}</h3>
                        <p className="text-xs text-muted-foreground">Fature {formatCurrency(goal.target_amount)}</p>
                        <p className="text-xs text-primary mt-1">🎁 {goal.reward_description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {goals.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma meta disponível</h3>
              <p className="text-muted-foreground">As metas aparecerão aqui quando forem configuradas pelo administrador.</p>
            </div>
          )}
        </>
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
                {badge.earned && (
                  <p className="text-xs text-primary mt-2">✓ Conquistado</p>
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
