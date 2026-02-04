import { useState, useEffect } from "react";
import { User, CheckCircle, XCircle, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  priceAmount: number; // in cents
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
    priceAmount: 999,
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
      { icon: "💥", name: "PvE Damage +15%", value: "7 Days", valueColor: "text-emerald-500" },
      { icon: "🐾", name: "Agathion Helper", value: "7 Days", valueColor: "text-emerald-500" },
      { icon: "📜", name: "Generosity Rune", value: "10 Pcs.", valueColor: "text-crimson" },
    ],
    originalPrice: "€30.00",
    salePrice: "€14.99",
    priceAmount: 1499,
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
      { icon: "💥", name: "PvE Damage +15%", value: "7 Days", valueColor: "text-emerald-500" },
      { icon: "🐾", name: "Agathion Helper", value: "7 Days", valueColor: "text-emerald-500" },
      { icon: "👑", name: "Premium Account 100%", value: "7 Days", valueColor: "text-emerald-500" },
      { icon: "✨", name: "Enchant Bonus +10%", value: "7 Days", valueColor: "text-emerald-500" },
      { icon: "📜", name: "Generosity Rune", value: "15 Pcs.", valueColor: "text-crimson" },
    ],
    originalPrice: "€40.00",
    salePrice: "€19.99",
    priceAmount: 1999,
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
      { icon: "💥", name: "PvE Damage +15%", value: "21 Days", valueColor: "text-emerald-500" },
      { icon: "🐾", name: "Agathion Helper", value: "21 Days", valueColor: "text-emerald-500" },
      { icon: "👑", name: "Premium Account 100%", value: "21 Days", valueColor: "text-emerald-500" },
      { icon: "✨", name: "Enchant Bonus +10%", value: "21 Days", valueColor: "text-emerald-500" },
      { icon: "❤️", name: "Love Potions", value: "100 Pcs.", valueColor: "text-crimson" },
      { icon: "📜", name: "Generosity Rune", value: "25 Pcs.", valueColor: "text-crimson" },
    ],
    originalPrice: "€50.00",
    salePrice: "€24.99",
    priceAmount: 2499,
    promoDate: "11.01 23:59",
  },
];

const tierBadgeStyles: Record<string, string> = {
  basic: "from-zinc-400 via-zinc-300 to-zinc-500",
  improved: "from-amber-600 via-amber-500 to-amber-700",
  premium: "from-red-500 via-red-400 to-red-600",
  elite: "from-yellow-400 via-amber-300 to-yellow-500",
};

interface StarterPacksTabProps {
  linkedLogin: string | null;
  characters?: Array<{ name: string; class: string; level: number }>;
}

export function StarterPacksTab({ linkedLogin, characters }: StarterPacksTabProps) {
  const [characterName, setCharacterName] = useState("");
  const [isValidatingChar, setIsValidatingChar] = useState(false);
  const [charValidation, setCharValidation] = useState<{
    valid: boolean | null;
    error?: string;
    accountName?: string;
  }>({ valid: null });
  const [purchasingPack, setPurchasingPack] = useState<string | null>(null);
  const { toast } = useToast();

  // Auto-select first character if available
  useEffect(() => {
    if (characters && characters.length > 0 && !characterName) {
      setCharacterName(characters[0].name);
    }
  }, [characters]);

  // Debounced character validation
  useEffect(() => {
    if (!characterName.trim()) {
      setCharValidation({ valid: null });
      return;
    }

    const timer = setTimeout(async () => {
      setIsValidatingChar(true);
      try {
        const { data, error } = await supabase.functions.invoke('validate-character', {
          body: { characterName: characterName.trim() }
        });

        if (error) throw error;

        setCharValidation({
          valid: data.valid,
          error: data.error,
          accountName: data.accountName
        });
      } catch (error: any) {
        setCharValidation({
          valid: false,
          error: "Failed to communicate with the server"
        });
      } finally {
        setIsValidatingChar(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [characterName]);

  const handlePurchase = async (pack: StarterPack) => {
    if (!characterName.trim()) {
      toast({
        title: "Character name required",
        description: "Enter the character name that will receive the pack.",
        variant: "destructive",
      });
      return;
    }

    if (charValidation.valid !== true) {
      toast({
        title: "Invalid character",
        description: charValidation.error || "Character not found on the server.",
        variant: "destructive",
      });
      return;
    }

    setPurchasingPack(pack.id);

    try {
      // TODO: Create a dedicated edge function for starter pack checkout
      // For now, we'll show a placeholder message
      toast({
        title: "Coming Soon",
        description: `Starter Pack checkout for "${pack.name}" will be available soon!`,
      });
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPurchasingPack(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gradient-gold">Starter Packs</h1>

      {/* Character Selection */}
      <div className="gaming-card rounded-2xl p-6">
        <Label htmlFor="characterName" className="text-base font-semibold text-foreground mb-2 block">
          <User className="w-4 h-4 inline mr-2" />
          Select Character
        </Label>
        
        {/* Character Quick Select */}
        {characters && characters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {characters.map((char) => (
              <button
                key={char.name}
                onClick={() => setCharacterName(char.name)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  characterName === char.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {char.name} (Lv.{char.level})
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <Input
            id="characterName"
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Or type the name..."
            className={`h-12 pr-12 ${
              charValidation.valid === true 
                ? 'border-emerald-500 focus-visible:ring-emerald-500' 
                : charValidation.valid === false 
                  ? 'border-destructive focus-visible:ring-destructive' 
                  : ''
            }`}
            maxLength={35}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isValidatingChar ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : charValidation.valid === true ? (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : charValidation.valid === false ? (
              <XCircle className="w-5 h-5 text-destructive" />
            ) : null}
          </div>
        </div>
        {charValidation.valid === false && charValidation.error && (
          <p className="text-sm text-destructive mt-2">{charValidation.error}</p>
        )}
        {charValidation.valid === true && (
          <p className="text-sm text-emerald-500 mt-2">Character found!</p>
        )}
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {starterPacks.map((pack) => (
          <div
            key={pack.id}
            className={`rounded-xl border border-border ${pack.bgClass} flex flex-col`}
          >
            {/* Elite sparkle effect */}
            {pack.id === "elite" && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
                <div className="absolute top-8 right-8 w-1 h-1 bg-accent/60 rounded-full animate-pulse" style={{ animationDelay: "100ms" }} />
                <div className="absolute top-16 right-6 w-1.5 h-1.5 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: "200ms" }} />
              </div>
            )}

            {/* Badge */}
            <div className="flex flex-col items-center pt-6 pb-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${tierBadgeStyles[pack.id]} flex items-center justify-center shadow-lg mb-3`}>
                <span className="text-2xl">{pack.badge}</span>
              </div>
              <span className="text-xs text-muted-foreground tracking-wider uppercase">{pack.tier}</span>
              <h3 className="text-lg font-bold text-foreground mt-1">{pack.name}</h3>
            </div>

            {/* Items List */}
            <div className="flex-1 px-4 pb-4">
              <ul className="space-y-1.5">
                {pack.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm">
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <span className="text-muted-foreground text-xs">{item.name}</span>
                    <span className={`ml-auto font-semibold text-xs ${item.valueColor || "text-foreground"}`}>
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & CTA */}
            <div className="p-4 border-t border-border/50 bg-black/20">
              <div className="text-center mb-3">
                <span className="text-base line-through text-muted-foreground">{pack.originalPrice}</span>
                <p className="text-xs text-muted-foreground">PROMOTION UNTIL {pack.promoDate}</p>
              </div>
              <Button 
                onClick={() => handlePurchase(pack)}
                disabled={purchasingPack === pack.id || charValidation.valid !== true || isValidatingChar}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                {purchasingPack === pack.id ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    BUY FOR {pack.salePrice}
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground text-center">
        Items are credited instantly after payment. Secure payment via Stripe.
      </p>
    </div>
  );
}
