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
              <motion.div 
                key={feature.title} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.05 }}
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

                <div className="relative z-10 w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  <feature.icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="relative z-10 font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="relative z-10 text-sm text-muted-foreground">{feature.description}</p>
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
              {configFeatures.map((item, index) => (
                <motion.div 
                  key={item.label} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="rounded-xl p-5 group transition-all duration-500 relative overflow-hidden border-2 border-red-500/50 hover:border-red-400 bg-gradient-to-b from-red-900/30 to-zinc-900/80 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_50px_rgba(239,68,68,0.6)]"
                >
                  {/* Shimmer effect overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Animated corner accents */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-red-500 opacity-50 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-red-500 opacity-50 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-red-500 opacity-50 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-red-500 opacity-50 rounded-br-lg" />

                  <div className="relative z-10 text-sm text-muted-foreground mb-1">{item.label}</div>
                  <div className="relative z-10 text-lg font-semibold text-gradient-gold">{item.value}</div>
                </motion.div>
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
