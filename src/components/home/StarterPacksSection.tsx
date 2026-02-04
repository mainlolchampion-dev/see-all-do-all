import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Starter Pack Badge Icons
import basicBadge from "@/assets/starter-packs/basic-badge.png";
import improvedBadge from "@/assets/starter-packs/improved-badge.png";
import premiumBadge from "@/assets/starter-packs/premium-badge.png";
import eliteBadge from "@/assets/starter-packs/elite-badge.png";

// Item Icons
import weaponIcon from "@/assets/starter-packs/items/weapon-icon.png";
import armorIcon from "@/assets/starter-packs/items/armor-icon.png";
import jewelIcon from "@/assets/starter-packs/items/jewel-icon.png";
import pveIcon from "@/assets/starter-packs/items/pve-icon.png";
import agathionIcon from "@/assets/starter-packs/items/agathion-icon.png";
import premiumAccountIcon from "@/assets/starter-packs/items/premium-icon.png";
import enchantIcon from "@/assets/starter-packs/items/enchant-icon.png";
import lovePotionIcon from "@/assets/starter-packs/items/love-potion-icon.png";
import generosityRuneIcon from "@/assets/starter-packs/items/generosity-rune-icon.png";

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
  badgeImage: string;
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
    badgeImage: eliteBadge,
    bgClass: "bg-gradient-to-b from-zinc-800/50 to-zinc-900/80",
    items: [
      { icon: weaponIcon, name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
      { icon: armorIcon, name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
      { icon: jewelIcon, name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
      { icon: generosityRuneIcon, name: "Generosity Rune", value: "5 Pcs.", valueColor: "text-crimson" },
    ],
    originalPrice: "€20.00",
    salePrice: "€9.99",
    promoDate: "11.01 23:59",
  },
  {
    id: "improved",
    tier: "Beginner's Kit",
    name: "IMPROVED",
    badgeImage: improvedBadge,
    bgClass: "bg-gradient-to-b from-amber-900/30 to-zinc-900/80",
    items: [
      { icon: weaponIcon, name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
      { icon: armorIcon, name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
      { icon: jewelIcon, name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
      { icon: pveIcon, name: "PvE Damage +15%", value: "7 Days", valueColor: "text-emerald" },
      { icon: agathionIcon, name: "Agathion Helper", value: "7 Days", valueColor: "text-emerald" },
      { icon: generosityRuneIcon, name: "Generosity Rune", value: "10 Pcs.", valueColor: "text-crimson" },
    ],
    originalPrice: "€30.00",
    salePrice: "€14.99",
    promoDate: "11.01 23:59",
  },
  {
    id: "premium",
    tier: "Beginner's Kit",
    name: "PREMIUM",
    badgeImage: premiumBadge,
    bgClass: "bg-gradient-to-b from-red-900/30 to-zinc-900/80",
    items: [
      { icon: weaponIcon, name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
      { icon: armorIcon, name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
      { icon: jewelIcon, name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
      { icon: pveIcon, name: "PvE Damage +15%", value: "7 Days", valueColor: "text-emerald" },
      { icon: agathionIcon, name: "Agathion Helper", value: "7 Days", valueColor: "text-emerald" },
      { icon: premiumAccountIcon, name: "Premium Account 100%", value: "7 Days", valueColor: "text-emerald" },
      { icon: enchantIcon, name: "Enchant Bonus +10%", value: "7 Days", valueColor: "text-emerald" },
      { icon: generosityRuneIcon, name: "Generosity Rune", value: "15 Pcs.", valueColor: "text-crimson" },
    ],
    originalPrice: "€40.00",
    salePrice: "€19.99",
    promoDate: "11.01 23:59",
  },
  {
    id: "elite",
    tier: "Beginner's Kit",
    name: "ELITE",
    badgeImage: basicBadge,
    bgClass: "bg-gradient-to-b from-purple-900/50 to-purple-950/80",
    items: [
      { icon: weaponIcon, name: "Top S84 Weapon {PvP}", value: "+16", valueColor: "text-primary" },
      { icon: armorIcon, name: "Set Top S84 Armor {PvP}", value: "+14", valueColor: "text-primary" },
      { icon: jewelIcon, name: "Epic Jewel Pack", value: "+14", valueColor: "text-primary" },
      { icon: pveIcon, name: "PvE Damage +15%", value: "21 Days", valueColor: "text-emerald" },
      { icon: agathionIcon, name: "Agathion Helper", value: "21 Days", valueColor: "text-emerald" },
      { icon: premiumAccountIcon, name: "Premium Account 100%", value: "21 Days", valueColor: "text-emerald" },
      { icon: enchantIcon, name: "Enchant Bonus +10%", value: "21 Days", valueColor: "text-emerald" },
      { icon: lovePotionIcon, name: "Love Potions", value: "100 Pcs.", valueColor: "text-crimson" },
      { icon: generosityRuneIcon, name: "Generosity Rune", value: "25 Pcs.", valueColor: "text-crimson" },
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

const tierGlowStyles: Record<string, string> = {
  basic: "shadow-[0_0_30px_rgba(161,161,170,0.3)] hover:shadow-[0_0_50px_rgba(161,161,170,0.5)]",
  improved: "shadow-[0_0_30px_rgba(217,119,6,0.4)] hover:shadow-[0_0_50px_rgba(217,119,6,0.6)]",
  premium: "shadow-[0_0_40px_rgba(250,204,21,0.5)] hover:shadow-[0_0_60px_rgba(250,204,21,0.7)]",
  elite: "shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_50px_rgba(239,68,68,0.6)]",
};

const tierBorderStyles: Record<string, string> = {
  basic: "border-zinc-500/50 hover:border-zinc-400",
  improved: "border-amber-600/50 hover:border-amber-500",
  premium: "border-yellow-500/50 hover:border-yellow-400",
  elite: "border-red-500/50 hover:border-red-400",
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
              whileHover={{ scale: 1.02, y: -5 }}
              className={`rounded-lg border-2 ${tierBorderStyles[pack.id]} ${pack.bgClass} ${tierGlowStyles[pack.id]} flex flex-col transition-all duration-500 relative overflow-hidden group`}
            >
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Animated corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-current opacity-50 rounded-tl-lg" style={{ borderColor: pack.id === 'premium' ? '#fbbf24' : pack.id === 'elite' ? '#ef4444' : pack.id === 'improved' ? '#d97706' : '#a1a1aa' }} />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-current opacity-50 rounded-tr-lg" style={{ borderColor: pack.id === 'premium' ? '#fbbf24' : pack.id === 'elite' ? '#ef4444' : pack.id === 'improved' ? '#d97706' : '#a1a1aa' }} />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-current opacity-50 rounded-bl-lg" style={{ borderColor: pack.id === 'premium' ? '#fbbf24' : pack.id === 'elite' ? '#ef4444' : pack.id === 'improved' ? '#d97706' : '#a1a1aa' }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-current opacity-50 rounded-br-lg" style={{ borderColor: pack.id === 'premium' ? '#fbbf24' : pack.id === 'elite' ? '#ef4444' : pack.id === 'improved' ? '#d97706' : '#a1a1aa' }} />

              {/* Floating particles for all tiers */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full ${
                      pack.id === 'premium' ? 'bg-yellow-400/60' :
                      pack.id === 'elite' ? 'bg-red-400/50' :
                      pack.id === 'improved' ? 'bg-amber-400/50' :
                      'bg-zinc-400/40'
                    }`}
                    style={{
                      left: `${15 + i * 15}%`,
                      top: `${20 + (i % 3) * 25}%`,
                    }}
                    animate={{
                      y: [-10, 10, -10],
                      opacity: [0.3, 0.8, 0.3],
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

              {/* Badge with glow */}
              <div className="flex flex-col items-center pt-6 pb-4 relative z-10">
                <motion.div 
                  className="w-28 h-28 flex items-center justify-center mb-3 relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={pack.badgeImage} 
                    alt={`${pack.name} badge`} 
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                  />
                </motion.div>
                <span className="text-xs text-muted-foreground tracking-wider uppercase">{pack.tier}</span>
                <h3 className="text-xl font-bold text-foreground mt-1">{pack.name}</h3>
              </div>

              {/* Items List */}
              <div className="flex-1 px-4 pb-4 relative z-10">
                <ul className="space-y-2">
                  {pack.items.map((item, itemIndex) => (
                    <motion.li 
                      key={itemIndex} 
                      className="flex items-start gap-2 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                    >
                      <img src={item.icon} alt="" className="w-5 h-5 object-contain flex-shrink-0 drop-shadow-[0_0_4px_rgba(234,179,8,0.4)]" />
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className={`ml-auto font-semibold ${item.valueColor || "text-foreground"}`}>
                        {item.value}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Price & CTA */}
              <div className="p-4 border-t border-border/50 bg-black/30 relative z-10 backdrop-blur-sm">
                <div className="text-center mb-3">
                  <span className="text-lg line-through text-muted-foreground">{pack.originalPrice}</span>
                </div>
                <Button 
                  asChild
                  className={`w-full font-bold py-3 transition-all duration-300 ${
                    pack.id === 'premium' 
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]' 
                      : pack.id === 'elite'
                      ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                      : pack.id === 'improved'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400'
                      : 'bg-primary hover:bg-primary/90'
                  } text-primary-foreground`}
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
