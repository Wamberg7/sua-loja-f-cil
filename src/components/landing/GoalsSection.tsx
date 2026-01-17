import { motion } from "framer-motion";
import { Trophy, Gift, Percent, Crown } from "lucide-react";

const rewards = [
  {
    icon: Trophy,
    level: "Bronze",
    target: "R$10.000",
    reward: "Badge exclusiva + Desconto de 0,5% nas taxas",
    color: "from-amber-600 to-amber-800"
  },
  {
    icon: Gift,
    level: "Prata",
    target: "R$50.000",
    reward: "R$500 em créditos + Suporte prioritário",
    color: "from-slate-400 to-slate-600"
  },
  {
    icon: Percent,
    level: "Ouro",
    target: "R$150.000",
    reward: "Taxa reduzida para 2% + Upgrade para Business",
    color: "from-yellow-500 to-yellow-700"
  },
  {
    icon: Crown,
    level: "Diamante",
    target: "R$500.000",
    reward: "Gerente dedicado + Taxa especial de 1,5%",
    color: "from-cyan-400 to-blue-600"
  }
];

const GoalsSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
            Programa de Premiações
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Metas & <span className="text-gradient-accent">Recompensas</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quanto mais você vende, mais você ganha. Desbloqueie benefícios exclusivos!
          </p>
        </motion.div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.level}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-gradient-card border border-border hover:border-warning/30 transition-all duration-300 text-center">
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${reward.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <reward.icon className="w-8 h-8 text-foreground" />
                </div>

                {/* Level */}
                <h3 className="text-xl font-bold mb-2 text-foreground">{reward.level}</h3>
                
                {/* Target */}
                <p className="text-2xl font-bold text-gradient mb-4">{reward.target}</p>
                
                {/* Reward */}
                <p className="text-sm text-muted-foreground">{reward.reward}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-muted-foreground">Seu progresso</span>
              <span className="text-sm font-semibold text-primary">R$8.500 / R$10.000</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "85%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-primary rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Faltam R$1.500 para desbloquear o nível Bronze!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GoalsSection;
