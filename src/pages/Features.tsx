import { motion } from "framer-motion";
import { Swords, Castle, Users, Trophy, Shield, Sparkles, Zap, Target, Clock, Gift } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useServerSettings } from "@/hooks/useServerSettings";

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
  const { data: settings, isLoading } = useServerSettings();

  const configFeatures = settings
    ? [
        { label: "Max Enchant", value: settings.features.max_enchant },
        { label: "Safe Enchant", value: settings.features.safe_enchant },
        { label: "Max Level", value: settings.features.max_level },
        { label: "Subclass Without Quest", value: settings.features.subclass_without_quest ? "Enabled" : "Disabled" },
        { label: "Free Teleport", value: settings.features.free_teleport ? "Enabled" : "Disabled" },
        { label: "Global Gatekeeper", value: settings.features.global_gk ? "Enabled" : "Disabled" },
        { label: "Auto Learn Skills", value: settings.features.auto_learn_skills ? "Enabled" : "Disabled" },
        { label: "Custom Weapons", value: settings.features.custom_weapons ? "Enabled" : "Disabled" },
        { label: "Custom Armors", value: settings.features.custom_armors ? "Enabled" : "Disabled" },
      ]
    : [];

  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Server Features</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need for the ultimate L2 experience</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="gaming-card rounded-xl p-6 group hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                <span className="text-gradient-gold">Server Configuration</span>
              </h2>
              <p className="text-muted-foreground">
                {isLoading ? "Loading configuration..." : "Live settings from the admin panel"}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {configFeatures.map((item) => (
                <div key={item.label} className="gaming-card rounded-xl p-5">
                  <div className="text-sm text-muted-foreground mb-1">{item.label}</div>
                  <div className="text-lg font-semibold text-gradient-gold">{item.value}</div>
                </div>
              ))}
            </div>
            {!isLoading && configFeatures.length === 0 && (
              <div className="text-center text-muted-foreground mt-6">
                Configuration is not available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
