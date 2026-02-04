import { useState, useEffect } from "react";
import { CreditCard, Coins, Info, User, CheckCircle, XCircle, Loader2, Gift, Sparkles, Package } from "lucide-react";
import randomSkinBoxIcon from "@/assets/donate/random-skin-box.gif";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Coin packages with +10% bonus
const COIN_PACKAGES = [
  { coins: 500, bonus: 50, total: 550, price: 5 },
  { coins: 900, bonus: 90, total: 990, price: 9 },
  { coins: 1500, bonus: 150, total: 1650, price: 15 },
  { coins: 3000, bonus: 300, total: 3300, price: 30 },
  { coins: 5000, bonus: 500, total: 5500, price: 50 },
  { coins: 10000, bonus: 1000, total: 11000, price: 100 },
  { coins: 15000, bonus: 1500, total: 16500, price: 150 },
  { coins: 25000, bonus: 2500, total: 27500, price: 250 },
];

const MIN_COINS = 100;
const COINS_PER_EURO = 100; // 100 coins = 1 EUR
const BONUS_PERCENTAGE = 0.10; // 10% bonus

interface DonateTabProps {
  linkedLogin: string | null;
  characters?: Array<{ name: string; class: string; level: number }>;
}

export function DonateTab({ linkedLogin, characters }: DonateTabProps) {
  const [selectedPackage, setSelectedPackage] = useState(COIN_PACKAGES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [isValidatingChar, setIsValidatingChar] = useState(false);
  const [charValidation, setCharValidation] = useState<{
    valid: boolean | null;
    error?: string;
    accountName?: string;
  }>({ valid: null });
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

  const handlePackageSelect = (pkg: typeof COIN_PACKAGES[0]) => {
    setSelectedPackage(pkg);
  };

  const handlePurchase = async () => {
    if (!characterName.trim()) {
      toast({
        title: "Character name required",
        description: "Enter the character name that will receive the coins.",
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

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-coin-checkout', {
        body: { 
          coins: selectedPackage.coins, 
          amount: Math.round(selectedPackage.price * 100),
          characterName: characterName.trim(),
          accountName: charValidation.accountName
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gradient-gold">Buy Donation Coins</h1>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: Purchase Form (2 columns wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Character Selection Card */}
          <div className="gaming-card rounded-2xl p-6">
            <Label htmlFor="characterName" className="text-base font-semibold text-foreground mb-3 block">
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

          {/* Coin Packages Selection */}
          <div className="gaming-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Choose Package</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  All packages include +10% bonus!
                </p>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {COIN_PACKAGES.map((pkg) => (
                <button
                  key={pkg.coins}
                  onClick={() => handlePackageSelect(pkg)}
                  className={`relative p-3 rounded-xl border transition-all duration-300 ${
                    selectedPackage.coins === pkg.coins
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <div className="text-center">
                    <span className={`font-bold text-sm ${selectedPackage.coins === pkg.coins ? "text-primary" : "text-foreground"}`}>
                      {pkg.coins >= 1000 ? `${(pkg.coins / 1000).toFixed(pkg.coins % 1000 === 0 ? 0 : 1)}k` : pkg.coins}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            disabled={isLoading || charValidation.valid !== true || isValidatingChar}
            className="w-full h-14 text-lg font-semibold btn-glow"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Buy Now - €{selectedPackage.price}
              </span>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Coins are credited instantly. Secure payment via Stripe.
          </p>
        </div>

        {/* RIGHT: Selected Package Details Card */}
        <div className="lg:col-span-1">
          <div className="gaming-card rounded-2xl p-6 sticky top-6 border-primary/30">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                <Coins className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">Selected Package</h3>
            </div>

            {/* Package Details */}
            <div className="space-y-4">
              {/* Base Coins */}
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-muted-foreground">Base Coins</span>
                <span className="font-bold text-foreground text-lg">
                  {selectedPackage.coins.toLocaleString()}
                </span>
              </div>

              {/* Bonus */}
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Bonus (+10%)
                </span>
                <span className="font-bold text-emerald-500 text-lg">
                  +{selectedPackage.bonus.toLocaleString()}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-foreground font-semibold">Total Coins</span>
                <span className="font-bold text-primary text-xl">
                  {selectedPackage.total.toLocaleString()}
                </span>
              </div>

              {/* Price */}
              <div className="text-center pt-4">
                <div className="text-4xl font-bold text-gradient-gold">
                  €{selectedPackage.price}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {(selectedPackage.total / selectedPackage.price).toFixed(0)} coins per €1
                </p>
              </div>
            </div>

            {/* Bonus Item */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                <img 
                  src={randomSkinBoxIcon} 
                  alt="Random Skin Box" 
                  className="w-12 h-12 object-contain"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground text-sm">Random Skin Box</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">x1 included with every purchase!</p>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Items will be credited to your selected character after purchase.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
