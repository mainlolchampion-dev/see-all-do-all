import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Shield, Swords, Crown, Clock, Trophy, Skull, Gem, Gift, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const ICON_MAP: Record<string, React.ElementType> = {
  Shield, Swords, Crown, Clock, Trophy, Skull, Gem, Gift,
};

interface TreasureReward {
  item: string;
  chance: string;
}

interface CardItem {
  title: string;
  items: string[];
}

interface DescriptionSection {
  id: string;
  type: "table" | "cards" | "treasure";
  title: string;
  highlight: string;
  icon: string;
  headers?: string[];
  rows?: string[][];
  row_icons?: string[];
  cards?: CardItem[];
  footer_notes?: string[];
  description?: string;
  chest_name?: string;
  rewards?: TreasureReward[];
}

interface DescriptionContent {
  hero_title: string;
  hero_highlight: string;
  sections: DescriptionSection[];
  bottom_note: string;
}

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
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/60 rounded-tl-xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/60 rounded-tr-xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/60 rounded-bl-xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/60 rounded-br-xl" />
      {children}
    </div>
  );
}

function InfoTable({ headers, rows, rowIcons }: { headers: string[]; rows: string[][]; rowIcons?: string[] }) {
  return (
    <GoldCard>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary/10 border-b border-yellow-500/30">
              {rowIcons && rowIcons.length > 0 && (
                <th className="px-3 py-3 w-10" />
              )}
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
                {rowIcons && rowIcons.length > 0 && (
                  <td className="px-3 py-3 w-10">
                    {rowIcons[i] && (
                      <img
                        src={`/images/description-icons/${rowIcons[i]}`}
                        alt=""
                        className="w-6 h-6 object-contain"
                        loading="lazy"
                      />
                    )}
                  </td>
                )}
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

function ThreeColumnCards({ cards }: { cards: CardItem[] }) {
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

function TreasureSection({ section }: { section: DescriptionSection }) {
  const chanceColor = (chance: string) => {
    if (chance.includes("Low")) return "text-red-400";
    if (chance.includes("Average")) return "text-yellow-400";
    return "text-emerald";
  };

  return (
    <GoldCard>
      <div className="p-6 md:p-8 text-center space-y-4">
        <p className="text-foreground/80 font-sans text-sm">
          {section.description?.split(/(\d[\d,.]+\s+or\s+more\s+\w+)/g).map((part, i) =>
            /\d/.test(part) ? <span key={i} className="text-primary font-bold">{part}</span> : part
          ) || section.description}
        </p>
        <h3 className="text-xl font-bold text-gradient-gold">{section.chest_name}</h3>
        <p className="text-foreground/60 font-sans text-sm">A mysterious chest with these possible rewards:</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {section.rewards?.map((reward, i) => (
            <div key={i} className="bg-background/50 rounded-lg p-3 border border-border/50">
              <p className="text-foreground/90 font-sans text-sm font-medium">{reward.item}</p>
              <p className={`font-sans text-xs mt-1 ${chanceColor(reward.chance)}`}>{reward.chance}</p>
            </div>
          ))}
        </div>
      </div>
    </GoldCard>
  );
}

export default function Description() {
  const [content, setContent] = useState<DescriptionContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("server_settings")
          .select("value")
          .eq("key", "description_content")
          .single();
        if (error) throw error;
        if (data?.value) {
          setContent(data.value as unknown as DescriptionContent);
        }
      } catch (error) {
        console.error("Error fetching description content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 space-y-8">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </Layout>
    );
  }

  if (!content) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Description content not available.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <motion.div {...fadeInUp} className="relative text-center z-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-widest">
            {content.hero_title} <span className="text-gradient-gold">{content.hero_highlight}</span>
          </h1>
          <div className="ornament-divider w-60 mt-4 mx-auto" />
        </motion.div>
      </section>

      <div className="container mx-auto px-4 space-y-16 pb-20">
        {content.sections.map((section) => {
          const IconComp = ICON_MAP[section.icon] || Shield;
          return (
            <section key={section.id}>
              <SectionTitle icon={IconComp} title={section.title} highlight={section.highlight} />

              {section.type === "table" && section.headers && section.rows && (
                <motion.div {...fadeInUp}>
                  <InfoTable headers={section.headers} rows={section.rows} rowIcons={section.row_icons} />
                </motion.div>
              )}

              {section.type === "cards" && section.cards && (
                <ThreeColumnCards cards={section.cards} />
              )}

              {section.type === "treasure" && (
                <motion.div {...fadeInUp}>
                  <TreasureSection section={section} />
                </motion.div>
              )}

              {section.footer_notes && section.footer_notes.length > 0 && (
                <motion.div {...fadeInUp} className="mt-4 text-center space-y-1 text-foreground/60 font-sans text-sm">
                  {section.footer_notes.map((note, i) => (
                    <p key={i}>{note}</p>
                  ))}
                </motion.div>
              )}
            </section>
          );
        })}

        {content.bottom_note && (
          <motion.div {...fadeInUp} className="text-center text-foreground/40 font-sans text-xs pt-8">
            <p>{content.bottom_note}</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
