import { motion } from "framer-motion";
import { Swords, Castle, Users, Trophy, Shield, Sparkles, Zap, Target, Clock, Gift } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

const features = [
  { icon: Swords, title: "Balanced PvP", description: "All classes carefully balanced for fair competitive gameplay." },
  { icon: Castle, title: "Castle Sieges", description: "Epic weekend siege battles for territory control and glory." },
  { icon: Trophy, title: "Olympiad", description: "Monthly Olympiad competitions with exclusive Hero rewards." },
  { icon: Users, title: "Active GMs", description: "24/7 Game Master support for all player needs." },
  { icon: Shield, title: "Anti-Cheat", description: "Advanced protection against bots and cheaters." },
  { icon: Sparkles, title: "Custom Events", description: "Daily and weekly events with unique prizes." },
  { icon: Zap, title: "Low Latency", description: "High-performance servers for smooth gameplay." },
  { icon: Target, title: "Raid Bosses", description: "Challenging boss encounters with epic loot." },
  { icon: Clock, title: "99.9% Uptime", description: "Reliable server infrastructure." },
  { icon: Gift, title: "Daily Rewards", description: "Login rewards and achievements system." },
];

export default function Features() {
  return (
    <Layout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide mb-2">
              <span className="text-gradient-gold">About Our Server</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for the ultimate L2 experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="gaming-card rounded-lg p-5 group hover:border-primary/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold mb-1 text-foreground uppercase tracking-wide">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="ornament-divider" />
    </Layout>
  );
}
