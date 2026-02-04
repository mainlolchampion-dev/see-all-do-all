import { motion } from "framer-motion";
import { Zap, Shield, Swords, Sparkles, Target, Crown } from "lucide-react";
import { useServerSettings } from "@/hooks/useServerSettings";

const boolLabel = (value: boolean) => (value ? "Enabled" : "Disabled");

export function FeaturesSection() {
  const { data: settings, isLoading } = useServerSettings();

  const features = [
    {
      icon: Crown,
      title: "Max Enchant",
      description: settings ? settings.features.max_enchant : "-",
    },
    {
      icon: Shield,
      title: "Safe Enchant",
      description: settings ? settings.features.safe_enchant : "-",
    },
    {
      icon: Target,
      title: "Max Level",
      description: settings ? `${settings.features.max_level}` : "-",
    },
    {
      icon: Zap,
      title: "Auto Learn Skills",
      description: settings ? boolLabel(settings.features.auto_learn_skills) : "-",
    },
    {
      icon: Sparkles,
      title: "Global Gatekeeper",
      description: settings ? boolLabel(settings.features.global_gk) : "-",
    },
    {
      icon: Swords,
      title: "Subclass Without Quest",
      description: settings ? boolLabel(settings.features.subclass_without_quest) : "-",
    },
  ];

  return (
    <section className="py-20 bg-surface-overlay">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-gold">Why Choose Us</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isLoading
              ? "Loading server features..."
              : "Live server configuration pulled from admin settings"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -3 }}
              className="rounded-xl p-6 group transition-all duration-500 relative overflow-hidden border-2 border-red-500/50 hover:border-red-400 bg-gradient-to-b from-red-900/30 to-zinc-900/80 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_50px_rgba(239,68,68,0.6)]"
            >
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Animated corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-500 opacity-50 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-500 opacity-50 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-500 opacity-50 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-500 opacity-50 rounded-br-lg" />

              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-red-400/50"
                    style={{
                      left: `${15 + i * 20}%`,
                      top: `${25 + (i % 2) * 35}%`,
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

              <div className="relative z-10 w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center mb-4 group-hover:bg-red-500/30 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <feature.icon className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="relative z-10 font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="relative z-10 text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
