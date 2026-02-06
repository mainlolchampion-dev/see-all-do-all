import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Shield, Swords, Crown, Clock, Trophy, Skull, Gem, Gift, Sparkles } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function SectionTitle({ icon: Icon, title, highlight }: { icon: React.ElementType; title: string; highlight: string }) {
  return (
    <motion.div {...fadeInUp} className="flex flex-col items-center mb-8">
      <Icon className="w-8 h-8 text-primary mb-3" />
      <h2 className="text-2xl md:text-3xl font-bold tracking-wider">
        {title} <span className="text-gradient-gold">{highlight}</span>
      </h2>
      <div className="ornament-divider w-40 mt-3" />
    </motion.div>
  );
}

function GoldCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative gaming-card rounded-xl border border-yellow-500/50 shadow-[0_0_30px_hsl(38_90%_50%/0.15)] overflow-hidden ${className}`}>
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/60 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/60 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/60 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/60 rounded-br-xl" />
      {children}
    </div>
  );
}

function InfoTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <GoldCard>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary/10 border-b border-yellow-500/30">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-left text-primary font-bold uppercase tracking-wider text-xs">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-foreground/80 font-sans">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GoldCard>
  );
}

function ThreeColumnCards({ cards }: { cards: { title: string; items: string[] }[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <motion.div key={i} {...fadeInUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
          <GoldCard className="h-full">
            <div className="p-5">
              <h3 className="text-primary font-bold text-base mb-4 tracking-wide">{card.title}</h3>
              <ul className="space-y-2 text-foreground/80 font-sans text-sm">
                {card.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Sparkles className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GoldCard>
        </motion.div>
      ))}
    </div>
  );
}

export default function Description() {
  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <motion.div {...fadeInUp} className="relative text-center z-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-widest">
            DESCRIPTION <span className="text-gradient-gold">L2 ALLSTARS</span>
          </h1>
          <div className="ornament-divider w-60 mt-4 mx-auto" />
        </motion.div>
      </section>

      <div className="container mx-auto px-4 space-y-16 pb-20">

        {/* Server Rates */}
        <section>
          <SectionTitle icon={Shield} title="SERVER" highlight="RATES" />
          <motion.div {...fadeInUp}>
            <InfoTable
              headers={["", "Normal Account", "Premium Account"]}
              rows={[
                ["Exp / Sp", "x1000", "x2000"],
                ["Adena", "x100", "x200"],
                ["Drop", "x25", "x50"],
                ["Spoil", "x25", "x50"],
                ["Knight's Epaulette", "x15", "x30"],
                ["Quest", "x15", "x30"],
                ["Bosses", "x15", "x30"],
                ["Enchant Chance Bonus", "N/A", "+10%"],
                ["Compound Chance Bonus", "N/A", "+2%"],
              ]}
            />
          </motion.div>
          <motion.div {...fadeInUp} className="mt-4 text-center space-y-1 text-foreground/60 font-sans text-sm">
            <p>Benefit of Premium Account is x2 for all rates, except of no-stackable items.</p>
            <p>Premium Account bound to the whole Account that purchases it, not affect party members.</p>
            <p>Premium Account cannot be transferred.</p>
          </motion.div>
        </section>

        {/* General Information */}
        <section>
          <SectionTitle icon={Swords} title="GENERAL" highlight="INFORMATION" />
          <motion.div {...fadeInUp}>
            <InfoTable
              headers={["Feature", "Details"]}
              rows={[
                ["Chronicles", "High Five"],
                ["Bosses and Events", "Bosses and Events in time Latin and Europe"],
                ["Max Clients per HWID", "3"],
                ["Anti Cheat", "Active Anti Cheat Bot Protection"],
                ["Interface", "Modernized Somik v1.5"],
                ["Equipment", "Up to S in ALT+B for Adena"],
                ["S84 Equipment", "Available in Olympiad Shop for affordable price"],
                ["Epic Jewelry", "Available in Epic Boss or Olympiad Shop for affordable price"],
                ["Buffs", "28 (+4) / 14"],
                ["Enchant", "18 / 14 / 14 (on Olympiad – 6 / 6 / 6)"],
                ["Mana Potions", "Restore 1000 MP / 10 seconds"],
                ["Certificate", "Available in Subclass"],
                ["Noblesse Blessing", "Quest or at an affordable price at ALT+B"],
                ["Soul Crystals", "Enabled upgrade in 7rb at stage 15"],
                ["Soul Crystals (Special)", "Enabled upgrade in special bosses at stage 16"],
                ["Songs & Dances", "Same class Sword Muse / Spectral Dancer"],
                ["Buffs After Cancel", "Return 60 seconds after cancel"],
                ["Rune of Generosity", "Increases EXP, SP, Adena, Drop, Spoil by 20%"],
              ]}
            />
          </motion.div>
        </section>

        {/* Item Enchant */}
        <section>
          <SectionTitle icon={Gem} title="ITEM" highlight="ENCHANT" />
          <motion.div {...fadeInUp}>
            <InfoTable
              headers={["Scroll Type", "Effect", "Max"]}
              rows={[
                ["Scroll: Enchant Weapon", "If fails, the item is crystallized", "+18"],
                ["Scroll: Enchant Armor", "If fails, the item is crystallized", "+14"],
                ["Blessed Scroll: Enchant Weapon", "If fails, not crystallized but reset to 0", "+18"],
                ["Blessed Scroll: Enchant Armor", "If fails, not crystallized but reset to 0", "+14"],
                ["Scroll: Enchant Weapon of Destruction", "If fails, keep the current enchant value", "+16"],
                ["Scroll: Enchant Armor of Destruction", "If fails, keep the current enchant value", "+12"],
                ["Olf's T-Shirt Enchant Scroll", "If fails, the item is crystallized", "+10"],
                ["Blessed Olf's T-Shirt Enchant Scroll", "If fails, not crystallized but reset to 0", "+10"],
                ["Destruction Olf's T-Shirt Enchant Scroll", "If fails, keep the current enchant value", "+9"],
              ]}
            />
          </motion.div>
        </section>

        {/* Daily Events */}
        <section>
          <SectionTitle icon={Swords} title="DAILY" highlight="EVENTS" />
          <motion.div {...fadeInUp}>
            <InfoTable
              headers={["Event Name", "Rewards (Win / Loss)", "Type"]}
              rows={[
                ["Team vs Team", "Apiga = 50 / 25, Event Medal = 30 / 15, Giant's Codex = 3 / 1, Fame Certificate = 3 / 1. Additional reward per Kill = 1 Apiga", "Team"],
                ["Domination", "Apiga = 50 / 25, Event Medal = 30 / 15, Giant's Codex = 3 / 1, Fame Certificate = 3 / 1. Additional reward per Kill = 1 Apiga", "Team"],
                ["Hunting Grounds", "Apiga = 50 / 25, Event Medal = 30 / 15, Giant's Codex = 3 / 1, Fame Certificate = 3 / 1. Additional reward per Kill = 1 Apiga", "Team"],
                ["Capture the Flag", "Apiga = 50 / 25, Event Medal = 30 / 15, Giant's Codex = 3 / 1. +10 Apiga per captured flag", "Team"],
                ["Death Match", "1st = 50 Coins, 2nd = 25, 3rd = 10, 4-10th = 5 Coins. +3 Apiga per Kill", "Top 10"],
              ]}
            />
          </motion.div>
        </section>

        {/* Reward for Being Online */}
        <section>
          <SectionTitle icon={Clock} title="REWARD FOR" highlight="BEING ONLINE" />
          <motion.div {...fadeInUp}>
            <InfoTable
              headers={["Time Online", "Reward"]}
              rows={[
                ["5 Minutes", "Rune of Generosity"],
                ["15 Minutes", "Lucky Box"],
                ["35 Minutes", "Event - Glittering Medal"],
                ["50 Minutes", "Nemeziz Coin"],
                ["70 Minutes", "Lucky Box"],
                ["105 Minutes", "Rune of Generosity (2 pcs.)"],
                ["165 Minutes", "Lucky Box (2 pcs.)"],
                ["255 Minutes", "Event - Glittering Medal (2 pcs.)"],
              ]}
            />
          </motion.div>
        </section>

        {/* Olympiad Games */}
        <section>
          <SectionTitle icon={Trophy} title="OLYMPIAD" highlight="GAMES" />
          <ThreeColumnCards
            cards={[
              {
                title: "About Olympiad",
                items: [
                  "Weekly Cycle, Start all Monday",
                  "Enchant Limits +6/6/6",
                  "1000 Olympiad Tokens for each Win",
                  "250 Olympiad Tokens for a Loss",
                  "Minimum 5 participants to start to avoid feed",
                ],
              },
              {
                title: "Reward for Period, Hero & Place",
                items: [
                  "+10.000 Olympiad Tokens for 1-99 Points",
                  "+15.000 Olympiad Tokens for 100-299 Points",
                  "+30.000 Olympiad Tokens for 300+ Points",
                  "Hero Reward: 100.000 Olympiad Tokens",
                  "2nd Place: 50.000 Olympiad Tokens",
                  "3rd Place: 30.000 Olympiad Tokens",
                ],
              },
              {
                title: "Great Olympiad Event",
                items: [
                  "Wednesday 18:30–19:30, Event 1 vs 1",
                  "Friday 18:00–19:30, Event 3 vs 3",
                  "Win = Gift of the Winner (30% chance Certificate of Hero)",
                  "Exchange 1 Certificate → 20 Coins",
                  "Exchange 2 Certificates → 50 Coins",
                  "Exchange 3 Certificates → 100 Coins",
                  "Exchange 4 Certificates → 220 Coins",
                  "Exchange 6 Certificates → 330 Coins",
                ],
              },
            ]}
          />
        </section>

        {/* Bosses and Instances */}
        <section>
          <SectionTitle icon={Skull} title="BOSSES AND" highlight="INSTANCES" />
          <ThreeColumnCards
            cards={[
              {
                title: "Special Bosses",
                items: [
                  "Van Etina, King Wind and Miss Orfen",
                  "Each player that deals damage receives:",
                  "50 Epic Fragment",
                  "25 Apiga, 15 Event Medal",
                  "1 Fame Certificate, 1 Giant's Codex",
                  "6 Life Stone Lv86, 3 Brooch Life Stone",
                  "Respawn visible in ALT+B → Bosses",
                ],
              },
              {
                title: "Epic Bosses",
                items: [
                  "Daily 1 Epic Boss at prime time",
                  "South America or Europe schedule",
                  "Each participant receives:",
                  "250 Epic Fragment",
                  "Respawn visible in ALT+B → Bosses",
                ],
              },
              {
                title: "Instances",
                items: [
                  "Twins: Every Day at 6:30",
                  "Kamaloka: Every Day at 6:30",
                  "Zaken: Mon, Wed, Fri at 6:30",
                  "Freya: Wed, Sat at 6:30",
                  "Freya Extreme: Wed, Sat at 6:30",
                  "Frintezza: Wed, Sat at 6:30",
                  "Zaken/Freya/Frintezza reward: 25 Epic Fragment",
                ],
              },
            ]}
          />
        </section>

        {/* Life Stones & Brooch */}
        <section>
          <SectionTitle icon={Gem} title="LIFE STONES &" highlight="BROOCH" />
          <motion.div {...fadeInUp}>
            <InfoTable
              headers={["Item", "Effect"]}
              rows={[
                ["Top-Grade Life Stone Lv86", "High chance of unique and dual item skills"],
                ["Brooch's Life Stone", "STR+1, INT+1, CON+1, MEN+1 and other useful characteristics"],
                ["Adamantite Brooch", "Activates 6 slots for Precious Stones"],
                ["Golden Brooch", "Activates 5 slots for Precious Stones"],
                ["Mithrill Brooch", "Activates 4 slots for Precious Stones"],
                ["P. Stone - Wisdom Lv1", "Increases resistance to mental attacks by 5"],
                ["P. Stone - Fortitude Lv1", "Increases resistance to stun attacks by 5"],
                ["P. Stone - Health Lv1", "Increases max HP/CP/MP by 200"],
                ["P. Stone - Magic Force Lv1", "Increases Critical Mage attacks by 1%"],
                ["P. Stone - Wind Storm Lv1", "Resistance to bow/crossbow attacks by 1%"],
                ["P. Stone - Deflect Magic Lv1", "Increases resistance to magic by 1%"],
                ["P. Stone - Champion Lv1", "Reduces cooldown of physical skills by 1%"],
                ["P. Stone - Renewal Lv1", "Reduces cooldown of magic skills by 1%"],
                ["P. Stone - Death Whisper Lv1", "Increases Critical Atk. by 1%"],
                ["P. Stone - Stone Skin Lv1", "Reduces physical melee damage by 1%"],
                ["P. Stone - Haste Lv1", "Increases attack speed by 1%"],
                ["P. Stone - Acumen Lv1", "Increases casting speed by 1%"],
                ["P. Stone - Mental Attack Lv1", "Increases power of mental attacks by 5"],
                ["P. Stone - Stun Attack Lv1", "Increases power of stun attacks by 5"],
              ]}
            />
          </motion.div>
          <motion.div {...fadeInUp} className="mt-4 text-center text-foreground/60 font-sans text-sm">
            <p>Precious Stones are inserted into amulets. Upgrade from Lv1 to Lv2/3 by participating in Special Bosses (25% chance).</p>
          </motion.div>
        </section>

        {/* New Dolls */}
        <section>
          <SectionTitle icon={Crown} title="NEW" highlight="DOLLS" />
          <motion.div {...fadeInUp}>
            <InfoTable
              headers={["Doll", "Effect"]}
              rows={[
                ["Antharas Doll Lv1", "P. Atk. +2%, Boosts stats in inventory. Can be upgraded via compounding."],
                ["Baium Doll Lv1", "M. Atk. +2%, Boosts stats in inventory. Can be upgraded via compounding."],
                ["Orfen Doll Lv1", "P. Def. +2%, Boosts stats in inventory. Can be upgraded via compounding."],
                ["Core Doll Lv1", "M. Def. +2%, Boosts stats in inventory. Can be upgraded via compounding."],
                ["Frintezza Doll Lv1", "Atk. Spd. +15 and Casting Spd. +15. Can be upgraded via compounding."],
                ["Zaken Doll Lv1", "Max. HP +150 and Speed +1. Can be upgraded via compounding."],
              ]}
            />
          </motion.div>
          <motion.div {...fadeInUp} className="mt-4 text-center text-foreground/60 font-sans text-sm">
            <p>Dolls apply buffs when in inventory. Max level 5 via compounding. Obtainable from GM Shop or Olympiad Shop.</p>
          </motion.div>
        </section>

        {/* Treasure of Antharas */}
        <section>
          <SectionTitle icon={Gift} title="TREASURE OF" highlight="ANTHARAS" />
          <motion.div {...fadeInUp}>
            <GoldCard>
              <div className="p-6 md:p-8 text-center space-y-4">
                <p className="text-foreground/80 font-sans text-sm">
                  With a one-time purchase of <span className="text-primary font-bold">5,000 or more Coins</span>, you will receive an extra bonus:
                </p>
                <h3 className="text-xl font-bold text-gradient-gold">Treasure of Antharas</h3>
                <p className="text-foreground/60 font-sans text-sm">A mysterious chest with these possible rewards:</p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {[
                    { item: "Earring of Antharas", chance: "Low chance", color: "text-red-400" },
                    { item: "10,000 Coins", chance: "Low chance", color: "text-red-400" },
                    { item: "Premium Account (21 Days)", chance: "Average chance", color: "text-yellow-400" },
                    { item: "Premium Buff Certificate (60 Days)", chance: "Average chance", color: "text-yellow-400" },
                    { item: "Love Potion", chance: "High chance", color: "text-emerald" },
                    { item: "20 Coins", chance: "High chance", color: "text-emerald" },
                  ].map((reward, i) => (
                    <div key={i} className="bg-background/50 rounded-lg p-3 border border-border/50">
                      <p className="text-foreground/90 font-sans text-sm font-medium">{reward.item}</p>
                      <p className={`font-sans text-xs mt-1 ${reward.color}`}>{reward.chance}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GoldCard>
          </motion.div>
        </section>

        <motion.div {...fadeInUp} className="text-center text-foreground/40 font-sans text-xs pt-8">
          <p>Until and after the server opening some changes can be made. Stay tuned.</p>
        </motion.div>
      </div>
    </Layout>
  );
}
