import { motion } from "framer-motion";
import { Zap, Gem, Coins, Star, Shield, Sword } from "lucide-react";

const rates = [
  { label: "EXP", value: "x50", icon: Zap, color: "text-yellow-500" },
  { label: "SP", value: "x50", icon: Star, color: "text-blue-500" },
  { label: "Adena", value: "x50", icon: Coins, color: "text-amber-500" },
  { label: "Drop", value: "x10", icon: Gem, color: "text-purple-500" },
  { label: "Spoil", value: "x10", icon: Shield, color: "text-green-500" },
  { label: "Quest", value: "x5", icon: Sword, color: "text-red-500" },
];

export function ServerRates() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-gold">Server Rates</span>
          </h2>
          <p className="text-muted-foreground">Balanced rates for the perfect gaming experience</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {rates.map((rate, index) => (
            <motion.div
              key={rate.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="gaming-card rounded-xl p-6 text-center group hover:border-primary/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 mx-auto rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${rate.color}`}>
                <rate.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gradient-gold mb-1">{rate.value}</div>
              <div className="text-sm text-muted-foreground">{rate.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
