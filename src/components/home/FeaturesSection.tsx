import { motion } from "framer-motion";
import { Swords, Castle, Users, Trophy, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Swords,
    title: "Epic PvP Battles",
    description: "Engage in intense player-vs-player combat with balanced classes and fair gameplay.",
  },
  {
    icon: Castle,
    title: "Castle Sieges",
    description: "Conquer castles with your clan in massive weekend siege battles for glory and rewards.",
  },
  {
    icon: Users,
    title: "Active Community",
    description: "Join thousands of active players in a thriving, friendly community with active GMs.",
  },
  {
    icon: Trophy,
    title: "Olympiad Games",
    description: "Compete in the Olympiad arena to become a Hero and earn exclusive rewards.",
  },
  {
    icon: Shield,
    title: "Anti-Cheat System",
    description: "Play fair with our advanced anti-cheat protection ensuring a clean environment.",
  },
  {
    icon: Sparkles,
    title: "Custom Events",
    description: "Participate in unique daily and weekly events with exclusive prizes and rewards.",
  },
];

export function FeaturesSection() {
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
            Experience Lineage 2 the way it was meant to be played with our premium features
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
