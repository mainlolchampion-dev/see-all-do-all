import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PackItem {
  icon: string;
  name: string;
  value: string;
  valueColor?: string;
}

interface StarterPack {
  id: string;
  tier: string;
  name: string;
  badge: string;
  bgClass: string;
  items: PackItem[];
  originalPrice: string;
  salePrice: string;
  promoDate: string;
}

const starterPacks: StarterPack[] = [
  {
    id: "basic",
    tier: "Beginner's Kit",
    name: "BASIC",
    badge: "🛡️",
    bgClass: "bg-gradient-to-b from-zinc-800/50 to-zinc-900/80",
    items: [
      { icon: "⚔️", name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
      { icon: "🛡️", name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
      { icon: "💎", name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
      { icon: "📜", name: "Generosity Rune", value: "5 Pcs.", valueColor: "text-crimson" },
    ],
    originalPrice: "€20.00",
    salePrice: "€9.99",
    promoDate: "11.01 23:59",
  },
  {
    id: "improved",
    tier: "Beginner's Kit",
    name: "IMPROVED",
    badge: "🛡️",
    bgClass: "bg-gradient-to-b from-amber-900/30 to-zinc-900/80",
    items: [
      { icon: "⚔️", name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
      { icon: "🛡️", name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
      { icon: "💎", name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
      { icon: "💥", name: "PvE Damage +15%", value: "7 Days", valueColor: "text-emerald" },
      { icon: "🐾", name: "Agathion Helper", value: "7 Days", valueColor: "text-emerald" },
      { icon: "📜", name: "Generosity Rune", value: "10 Pcs.", valueColor: "text-crimson" },
    ],
    originalPrice: "€30.00",
    salePrice: "€14.99",
    promoDate: "11.01 23:59",
  },
  {
    id: "premium",
    tier: "Beginner's Kit",
    name: "PREMIUM",
    badge: "🛡️",
    bgClass: "bg-gradient-to-b from-red-900/30 to-zinc-900/80",
    items: [
      { icon: "⚔️", name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
      { icon: "🛡️", name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
      { icon: "💎", name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
      { icon: "💥", name: "PvE Damage +15%", value: "7 Days", valueColor: "text-emerald" },
      { icon: "🐾", name: "Agathion Helper", value: "7 Days", valueColor: "text-emerald" },
      { icon: "👑", name: "Premium Account 100%", value: "7 Days", valueColor: "text-emerald" },
      { icon: "✨", name: "Enchant Bonus +10%", value: "7 Days", valueColor: "text-emerald" },
      { icon: "📜", name: "Generosity Rune", value: "15 Pcs.", valueColor: "text-crimson" },
    ],
    originalPrice: "€40.00",
    salePrice: "€19.99",
    promoDate: "11.01 23:59",
  },
  {
    id: "elite",
    tier: "Beginner's Kit",
    name: "ELITE",
    badge: "👑",
    bgClass: "bg-gradient-to-b from-purple-900/50 to-purple-950/80 relative overflow-hidden",
    items: [
      { icon: "⚔️", name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
      { icon: "🛡️", name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
      { icon: "💎", name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
      { icon: "💥", name: "PvE Damage +15%", value: "21 Days", valueColor: "text-emerald" },
      { icon: "🐾", name: "Agathion Helper", value: "21 Days", valueColor: "text-emerald" },
      { icon: "👑", name: "Premium Account 100%", value: "21 Days", valueColor: "text-emerald" },
      { icon: "✨", name: "Enchant Bonus +10%", value: "21 Days", valueColor: "text-emerald" },
      { icon: "❤️", name: "Love Potions", value: "100 Pcs.", valueColor: "text-crimson" },
      { icon: "📜", name: "Generosity Rune", value: "25 Pcs.", valueColor: "text-crimson" },
    ],
    originalPrice: "€50.00",
    salePrice: "€24.99",
    promoDate: "11.01 23:59",
  },
];

const tierBadgeStyles: Record<string, string> = {
  basic: "from-zinc-400 via-zinc-300 to-zinc-500",
  improved: "from-amber-600 via-amber-500 to-amber-700",
  premium: "from-red-500 via-red-400 to-red-600",
  elite: "from-yellow-400 via-amber-300 to-yellow-500",
};

export function StarterPacksSection() {
  return (
    <section className="py-16 bg-surface-overlay">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl text-gradient-gold mb-4">
            STARTER PACKS
          </h2>
          <div className="ornament-divider max-w-md mx-auto" />
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Begin your journey with powerful gear and exclusive bonuses
          </p>
        </motion.div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {starterPacks.map((pack, index) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg border border-border ${pack.bgClass} flex flex-col`}
            >
              {/* Elite sparkle effect */}
              {pack.id === "elite" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
                  <div className="absolute top-8 right-8 w-1 h-1 bg-accent/60 rounded-full animate-pulse" style={{ animationDelay: "100ms" }} />
                  <div className="absolute top-16 right-6 w-1.5 h-1.5 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
                  <div className="absolute bottom-20 right-4 w-1 h-1 bg-accent/50 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
              )}

              {/* Badge */}
              <div className="flex flex-col items-center pt-6 pb-4">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${tierBadgeStyles[pack.id]} flex items-center justify-center shadow-lg mb-3`}>
                  <span className="text-3xl">{pack.badge}</span>
                </div>
                <span className="text-xs text-muted-foreground tracking-wider uppercase">{pack.tier}</span>
                <h3 className="text-xl font-bold text-foreground mt-1">{pack.name}</h3>
              </div>

              {/* Items List */}
              <div className="flex-1 px-4 pb-4">
                <ul className="space-y-2">
                  {pack.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm">
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className={`ml-auto font-semibold ${item.valueColor || "text-foreground"}`}>
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & CTA */}
              <div className="p-4 border-t border-border/50 bg-black/20">
                <div className="text-center mb-3">
                  <span className="text-lg line-through text-muted-foreground">{pack.originalPrice}</span>
                  <p className="text-xs text-muted-foreground">PROMOTION UNTIL {pack.promoDate}</p>
                </div>
                <Button 
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3"
                >
                  <Link to="/donate">
                    BUY FOR {pack.salePrice}
                  </Link>
                </Button>
                <button className="w-full mt-2 text-xs text-muted-foreground underline hover:text-foreground transition-colors">
                  LEARN MORE
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
