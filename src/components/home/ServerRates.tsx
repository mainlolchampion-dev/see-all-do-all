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
  { key: "xp", label: "EXP", icon: expIcon, color: "amber" },
  { key: "sp", label: "SP", icon: spIcon, color: "blue" },
  { key: "adena", label: "Adena", icon: adenaIcon, color: "yellow" },
  { key: "drop", label: "Drop", icon: partyIcon, color: "purple" },
  { key: "spoil", label: "Spoil", icon: spoilIcon, color: "red" },
  { key: "quest_drop", label: "Quest", icon: questIcon, color: "cyan" },
];

const colorStyles: Record<string, { border: string; bg: string; shadow: string; shadowHover: string; accent: string; particle: string }> = {
  amber: {
    border: "border-amber-500/50 hover:border-amber-400",
    bg: "bg-gradient-to-b from-amber-900/30 to-zinc-900/80",
    shadow: "shadow-[0_0_30px_rgba(217,119,6,0.4)]",
    shadowHover: "hover:shadow-[0_0_50px_rgba(217,119,6,0.6)]",
    accent: "border-amber-500",
    particle: "bg-amber-400/50",
  },
  blue: {
    border: "border-blue-500/50 hover:border-blue-400",
    bg: "bg-gradient-to-b from-blue-900/30 to-zinc-900/80",
    shadow: "shadow-[0_0_30px_rgba(59,130,246,0.4)]",
    shadowHover: "hover:shadow-[0_0_50px_rgba(59,130,246,0.6)]",
    accent: "border-blue-500",
    particle: "bg-blue-400/50",
  },
  yellow: {
    border: "border-yellow-500/50 hover:border-yellow-400",
    bg: "bg-gradient-to-b from-yellow-900/30 to-zinc-900/80",
    shadow: "shadow-[0_0_30px_rgba(234,179,8,0.4)]",
    shadowHover: "hover:shadow-[0_0_50px_rgba(234,179,8,0.6)]",
    accent: "border-yellow-500",
    particle: "bg-yellow-400/50",
  },
  purple: {
    border: "border-purple-500/50 hover:border-purple-400",
    bg: "bg-gradient-to-b from-purple-900/30 to-zinc-900/80",
    shadow: "shadow-[0_0_30px_rgba(168,85,247,0.4)]",
    shadowHover: "hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]",
    accent: "border-purple-500",
    particle: "bg-purple-400/50",
  },
  red: {
    border: "border-red-500/50 hover:border-red-400",
    bg: "bg-gradient-to-b from-red-900/30 to-zinc-900/80",
    shadow: "shadow-[0_0_30px_rgba(239,68,68,0.4)]",
    shadowHover: "hover:shadow-[0_0_50px_rgba(239,68,68,0.6)]",
    accent: "border-red-500",
    particle: "bg-red-400/50",
  },
  cyan: {
    border: "border-cyan-500/50 hover:border-cyan-400",
    bg: "bg-gradient-to-b from-cyan-900/30 to-zinc-900/80",
    shadow: "shadow-[0_0_30px_rgba(6,182,212,0.4)]",
    shadowHover: "hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]",
    accent: "border-cyan-500",
    particle: "bg-cyan-400/50",
  },
};

export function ServerRates() {
  const { data: settings, isLoading } = useServerSettings();

  const rates = rateIcons.map((rate) => ({
    ...rate,
    value: settings ? `x${(settings.rates as any)[rate.key]}` : "x-",
    styles: colorStyles[rate.color],
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
              className={`rounded-xl p-6 text-center group transition-all duration-500 relative overflow-hidden border-2 ${rate.styles.border} ${rate.styles.bg} ${rate.styles.shadow} ${rate.styles.shadowHover}`}
            >
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Animated corner accents */}
              <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${rate.styles.accent} opacity-50 rounded-tl-lg`} />
              <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 ${rate.styles.accent} opacity-50 rounded-tr-lg`} />
              <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 ${rate.styles.accent} opacity-50 rounded-bl-lg`} />
              <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${rate.styles.accent} opacity-50 rounded-br-lg`} />

              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full ${rate.styles.particle}`}
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + (i % 2) * 30}%`,
                    }}
                    animate={{
                      y: [-5, 5, -5],
                      opacity: [0.3, 0.7, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              
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
