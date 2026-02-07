import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { User, CheckCircle, XCircle, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useStarterPacks } from "@/hooks/useStarterPacks";
import { getItemIconSrc, getBadgeSrc } from "@/lib/starterPackIcons";
import type { StarterPackConfig } from "@/lib/serverSettings";

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

const tierBgStyles: Record<string, string> = {
  basic: "bg-gradient-to-b from-zinc-800/50 to-zinc-900/80",
  improved: "bg-gradient-to-b from-amber-900/30 to-zinc-900/80",
  premium: "bg-gradient-to-b from-red-900/30 to-zinc-900/80",
  elite: "bg-gradient-to-b from-purple-900/50 to-purple-950/80 relative overflow-hidden",
};

const PACK_NAMES: Record<string, string> = {
  basic: "BASIC",
  improved: "IMPROVED",
  premium: "PREMIUM",
  elite: "ELITE",
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
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const { packs } = useStarterPacks();

  // Auto-select first character if available
  useEffect(() => {
    if (characters && characters.length > 0 && !characterName) {
      setCharacterName(characters[0].name);
    }
  }, [characters]);

  // Handle PayPal return - capture the order
  useEffect(() => {
    const paypalSuccess = searchParams.get("paypal_success");
    const paypalToken = searchParams.get("token");

    if (paypalSuccess === "true" && paypalToken && !isCapturing) {
      setIsCapturing(true);
      capturePayPalOrder(paypalToken);
    }
  }, [searchParams]);

  const capturePayPalOrder = async (orderId: string) => {
    try {
      toast({
        title: "Processing payment...",
        description: "Please wait while we confirm your payment.",
      });

      const { data, error } = await supabase.functions.invoke("capture-paypal-order", {
        body: { orderId },
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Payment Successful! 🎉",
          description: "Your starter pack has been delivered. Relog to see items in-game.",
        });
      } else {
        throw new Error(data?.error || "Payment capture failed");
      }
    } catch (error: any) {
      console.error("PayPal capture error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("paypal_success");
      newParams.delete("token");
      newParams.delete("PayerID");
      setSearchParams(newParams, { replace: true });
    }
  };

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

  const handlePurchase = async (pack: StarterPackConfig) => {
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to purchase a starter pack.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: {
          type: "starter_pack",
          packId: pack.id,
          characterName: characterName.trim(),
          accountName: charValidation.accountName || "",
        }
      });

      if (error) throw error;

      if (data?.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        throw new Error("No PayPal approval URL received");
      }
    } catch (error: any) {
      console.error('PayPal order error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPurchasingPack(null);
    }
  };

  if (isCapturing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <h2 className="font-display text-xl font-bold">Processing your payment...</h2>
        <p className="text-muted-foreground">Please wait while we deliver your starter pack.</p>
      </div>
    );
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {packs.map((pack, index) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -3 }}
            className={`rounded-lg border-2 ${tierBorderStyles[pack.id] || ""} ${tierBgStyles[pack.id] || ""} ${tierGlowStyles[pack.id] || ""} flex flex-col transition-all duration-500 relative overflow-hidden group`}
          >
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            {/* Animated corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 opacity-50 rounded-tl-lg" style={{ borderColor: pack.id === 'premium' ? '#fbbf24' : pack.id === 'elite' ? '#ef4444' : pack.id === 'improved' ? '#d97706' : '#a1a1aa' }} />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 opacity-50 rounded-tr-lg" style={{ borderColor: pack.id === 'premium' ? '#fbbf24' : pack.id === 'elite' ? '#ef4444' : pack.id === 'improved' ? '#d97706' : '#a1a1aa' }} />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 opacity-50 rounded-bl-lg" style={{ borderColor: pack.id === 'premium' ? '#fbbf24' : pack.id === 'elite' ? '#ef4444' : pack.id === 'improved' ? '#d97706' : '#a1a1aa' }} />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-50 rounded-br-lg" style={{ borderColor: pack.id === 'premium' ? '#fbbf24' : pack.id === 'elite' ? '#ef4444' : pack.id === 'improved' ? '#d97706' : '#a1a1aa' }} />

            {/* Floating particles for all tiers */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 rounded-full ${
                    pack.id === 'premium' ? 'bg-yellow-400/60' :
                    pack.id === 'elite' ? 'bg-red-400/50' :
                    pack.id === 'improved' ? 'bg-amber-400/50' :
                    'bg-zinc-400/40'
                  }`}
                  style={{
                    left: `${15 + i * 18}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [-8, 8, -8],
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

            {/* Badge with image */}
            <div className="flex flex-col items-center pt-4 pb-2 relative z-10">
              <motion.div 
                className="w-16 h-16 flex items-center justify-center mb-2 relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={getBadgeSrc(pack.id)} 
                  alt={`${PACK_NAMES[pack.id] || pack.id} badge`} 
                  className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                />
              </motion.div>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Beginner's Kit</span>
              <h3 className="text-sm font-bold text-foreground mt-0.5">{PACK_NAMES[pack.id] || pack.id.toUpperCase()}</h3>
            </div>

            {/* Items List */}
            <div className="flex-1 px-3 pb-3 relative z-10">
              <ul className="space-y-1">
                {pack.items.map((item, itemIndex) => (
                  <motion.li 
                    key={itemIndex} 
                    className="flex items-start gap-1.5 text-xs"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + itemIndex * 0.03 }}
                  >
                    <img src={getItemIconSrc(item.iconKey)} alt="" className="w-4 h-4 object-contain flex-shrink-0 drop-shadow-[0_0_3px_rgba(234,179,8,0.4)]" />
                    <span className="text-muted-foreground text-[10px]">{item.name}</span>
                    <span className={`ml-auto font-semibold text-[10px] ${item.valueColor || "text-foreground"}`}>
                      {item.value}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Price & CTA */}
            <div className="p-3 border-t border-border/50 bg-black/30 relative z-10 backdrop-blur-sm">
              <div className="text-center mb-2">
                <span className="text-sm line-through text-muted-foreground">{pack.originalPrice}</span>
              </div>
              <Button 
                onClick={() => handlePurchase(pack)}
                disabled={purchasingPack === pack.id || charValidation.valid !== true || isValidatingChar}
                size="sm"
                className={`w-full text-xs font-bold transition-all duration-300 ${
                  pack.id === 'premium' 
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]' 
                    : pack.id === 'elite'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                    : pack.id === 'improved'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400'
                    : 'bg-primary hover:bg-primary/90'
                } text-primary-foreground`}
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
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <p className="text-xs text-muted-foreground text-center">
        Items are credited instantly after payment. Secure payment via PayPal.
      </p>
    </div>
  );
}
