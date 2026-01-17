import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useState } from 'react';

// Import gateway logos
import efiBank from '@/assets/gateways/efi-bank.png';
import mercadoPago from '@/assets/gateways/mercado-pago.png';
import pushinpay from '@/assets/gateways/pushinpay.png';
import nubank from '@/assets/gateways/nubank.png';
import stripe from '@/assets/gateways/stripe.png';
import suipay from '@/assets/gateways/suipay.png';

const gateways = [
  { logo: efiBank, name: "Efí Bank" },
  { logo: mercadoPago, name: "Mercado Pago" },
  { logo: pushinpay, name: "PushinPay" },
  { logo: nubank, name: "Nubank" },
  { logo: stripe, name: "Stripe" },
  { logo: suipay, name: "SuiPay" },
];

const IntegrationsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // 8 positions evenly distributed (45 degrees apart), starting from top
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <section id="integrações" className="py-24 px-6 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Integrações
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conecte seus <span className="text-primary">gateways favoritos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Integração perfeita com os principais processadores de pagamento do mercado brasileiro e internacional.
          </p>
        </motion.div>

        {/* Hub and Gateways visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-[500px] mx-auto aspect-square"
        >
          {/* Concentric rings */}
          <div className="absolute inset-0">
            <div className="absolute inset-[8%] rounded-full border border-primary/10" />
            <div className="absolute inset-[20%] rounded-full border border-primary/15" />
            <div className="absolute inset-[32%] rounded-full border border-primary/20" />
          </div>

          {/* Straight connecting lines from center to gateways */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="lineGradHover" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0.6" />
              </linearGradient>
              <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Lines for each gateway */}
            {gateways.map((_, index) => {
              const angle = angles[index];
              const angleRad = (angle - 90) * Math.PI / 180;
              const radius = 40;
              const endX = 50 + radius * Math.cos(angleRad);
              const endY = 50 + radius * Math.sin(angleRad);
              const isHovered = hoveredIndex === index;
              
              return (
                <motion.line
                  key={index}
                  x1="50"
                  y1="50"
                  x2={endX}
                  y2={endY}
                  stroke={isHovered ? "url(#lineGradHover)" : "url(#lineGrad)"}
                  strokeWidth={isHovered ? 0.6 : 0.4}
                  strokeLinecap="round"
                  filter={isHovered ? "url(#lineGlow)" : undefined}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                />
              );
            })}
          </svg>

          {/* Central hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-20 h-20 rounded-full bg-background border-2 border-primary/60 flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <Zap className="w-8 h-8 text-primary" />
            </motion.div>
          </div>

          {/* Gateway logos positioned around the circle */}
          {gateways.map((gateway, index) => {
            const angle = angles[index];
            const angleRad = (angle - 90) * Math.PI / 180;
            const radius = 40; // percentage from center
            const x = 50 + radius * Math.cos(angleRad);
            const y = 50 + radius * Math.sin(angleRad);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5 + index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-card border flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer ${
                  hoveredIndex === index 
                    ? 'border-primary scale-110 shadow-primary/30 shadow-xl' 
                    : 'border-border/50 hover:border-primary/50 hover:scale-105'
                }`}
              >
                <img 
                  src={gateway.logo} 
                  alt={gateway.name}
                  className="w-9 h-9 md:w-10 md:h-10 object-contain"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Gateway names list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          {gateways.map((gateway, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                hoveredIndex === index
                  ? 'bg-primary/30 text-primary border-primary'
                  : 'bg-card/50 text-muted-foreground border-border/50 hover:bg-primary/10 hover:text-primary'
              } border`}
            >
              {gateway.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
