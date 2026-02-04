import { motion } from "framer-motion";
import { useServerSettings } from "@/hooks/useServerSettings";

// Import rate icons
import expIcon from "@/assets/rates/exp-icon.png";
import spIcon from "@/assets/rates/sp-icon.png";
import adenaIcon from "@/assets/rates/adena-icon.png";
import questIcon from "@/assets/rates/quest-icon.png";
import spoilIcon from "@/assets/rates/spoil-icon.png";
import partyIcon from "@/assets/rates/party-icon.png";

const rateIcons = [
  { key: "xp", label: "EXP", icon: expIcon },
  { key: "sp", label: "SP", icon: spIcon },
  { key: "adena", label: "Adena", icon: adenaIcon },
  { key: "drop", label: "Drop", icon: partyIcon },
  { key: "spoil", label: "Spoil", icon: spoilIcon },
  { key: "quest_drop", label: "Quest", icon: questIcon },
];

export function ServerRates() {
  const { data: settings, isLoading } = useServerSettings();

  const rates = rateIcons.map((rate) => ({
    ...rate,
    value: settings ? `x${(settings.rates as any)[rate.key]}` : "x-",
  }));

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
          <p className="text-muted-foreground">
            {isLoading ? "Loading rates..." : "Balanced rates for the perfect gaming experience"}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {rates.map((rate, index) => (
            <motion.div
              key={rate.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="gaming-card rounded-xl p-6 text-center group hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon */}
              <div className="relative z-10 mb-3">
                <motion.img 
                  src={rate.icon} 
                  alt={rate.label}
                  className="w-20 h-20 mx-auto object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              {/* Value */}
              <div className="relative z-10 text-2xl font-bold text-gradient-gold mb-1">{rate.value}</div>
              
              {/* Label */}
              <div className="relative z-10 text-sm text-muted-foreground">{rate.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
