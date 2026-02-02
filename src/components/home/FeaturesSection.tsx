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
              className="gaming-card rounded-xl p-6 group hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 group-hover:scale-110 transition-all">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
