import { useState, useEffect } from "react";
import { CreditCard, Coins, Info, User, CheckCircle, XCircle, Loader2, Gift, Sparkles } from "lucide-react";
import randomSkinBoxIcon from "@/assets/donate/random-skin-box.gif";
import coinBagIcon from "@/assets/donate/coin-bag.png";
import treasureChestIcon from "@/assets/donate/treasure-chest.png";
import premiumAcc1 from "@/assets/donate/premium-acc-1.png";
import premiumAcc2 from "@/assets/donate/premium-acc-2.png";
import premiumAcc3 from "@/assets/donate/premium-acc-3.png";
import premiumAcc5 from "@/assets/donate/premium-acc-5.png";
import premiumAcc7 from "@/assets/donate/premium-acc-7.png";
import premiumAcc21 from "@/assets/donate/premium-acc-21.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Premium bonuses per package (only for packages 1500+)
const PREMIUM_BONUSES: Record<number, { days: number; itemId: string; icon: string }> = {
  1500: { days: 1, itemId: "600639", icon: premiumAcc1 },
  3000: { days: 2, itemId: "600638", icon: premiumAcc2 },
  5000: { days: 3, itemId: "600637", icon: premiumAcc3 },
  10000: { days: 5, itemId: "600636", icon: premiumAcc5 },
  15000: { days: 7, itemId: "600634", icon: premiumAcc7 },
  25000: { days: 21, itemId: "600628", icon: premiumAcc21 },
};

// Treasures Antharas bonuses (only for packages 10000+)
const TREASURE_BONUSES: Record<number, { count: number; itemId: string }> = {
  10000: { count: 6, itemId: "600642" },
  15000: { count: 9, itemId: "600642" },
  25000: { count: 15, itemId: "600642" },
};

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
const MAX_COINS = 25000;
const COINS_PER_EURO = 100; // 100 coins = 1 EUR
const BONUS_PERCENTAGE = 0.10; // 10% bonus

// Package coin values for matching
const PACKAGE_COIN_VALUES = COIN_PACKAGES.map(p => p.coins);

interface DonateTabProps {
  linkedLogin: string | null;
  characters?: Array<{ name: string; class: string; level: number }>;
}

export function DonateTab({ linkedLogin, characters }: DonateTabProps) {
  const [selectedCoins, setSelectedCoins] = useState(500); // Start with first package
  const [isLoading, setIsLoading] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [isValidatingChar, setIsValidatingChar] = useState(false);
  const [charValidation, setCharValidation] = useState<{
    valid: boolean | null;
    error?: string;
    accountName?: string;
  }>({ valid: null });
  const { toast } = useToast();

  // Check if current value matches a package exactly
  const matchedPackage = COIN_PACKAGES.find(p => p.coins === selectedCoins);
  
  // Find the closest lower tier for rewards (e.g., 11000 -> 10000 tier rewards)
  const getClosestLowerTier = (coins: number): number | undefined => {
    const tiers = [...PACKAGE_COIN_VALUES].sort((a, b) => b - a); // Sort descending
    return tiers.find(tier => coins >= tier);
  };
  
  const closestTier = getClosestLowerTier(selectedCoins);
  
  // Calculate values - use package values if matched, otherwise calculate
  const activeCoins = selectedCoins;
  const activeBonus = matchedPackage ? matchedPackage.bonus : Math.floor(selectedCoins * BONUS_PERCENTAGE);
  const activeTotal = matchedPackage ? matchedPackage.total : selectedCoins + activeBonus;
  const activePrice = matchedPackage ? matchedPackage.price : selectedCoins / COINS_PER_EURO;
  
  // Get bonuses based on closest lower tier (not just exact match)
  const premiumBonus = closestTier ? PREMIUM_BONUSES[closestTier] : undefined;
  const treasureBonus = closestTier ? TREASURE_BONUSES[closestTier] : undefined;

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
    setSelectedCoins(pkg.coins);
  };

  const handleSliderChange = (value: number[]) => {
    setSelectedCoins(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || MIN_COINS;
    const clampedValue = Math.min(Math.max(value, MIN_COINS), MAX_COINS);
    setSelectedCoins(clampedValue);
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
          coins: activeCoins, 
          amount: Math.round(activePrice * 100),
          characterName: characterName.trim(),
          accountName: charValidation.accountName,
          premiumItemId: premiumBonus?.itemId,
          premiumDays: premiumBonus?.days,
          treasureItemId: treasureBonus?.itemId,
          treasureCount: treasureBonus?.count
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

          {/* Coin Selection - Slider + Packages Combined */}
          <div className="gaming-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">Choose Amount</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  1€ = 100 coins + 10% bonus
                </p>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-4 mb-6">
              <Slider
                value={[selectedCoins]}
                onValueChange={handleSliderChange}
                min={MIN_COINS}
                max={MAX_COINS}
                step={100}
                className="w-full"
              />
              
              {/* Input + Price Display */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={selectedCoins}
                    onChange={handleInputChange}
                    min={MIN_COINS}
                    max={MAX_COINS}
                    step={100}
                    className="w-28 h-10 text-center font-bold"
                  />
                  <span className="text-muted-foreground text-sm">coins</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gradient-gold">€{activePrice.toFixed(2)}</span>
                  <p className="text-xs text-emerald-500">+{activeBonus.toLocaleString()} bonus</p>
                </div>
              </div>
            </div>

            {/* Quick Select Packages */}
            <div className="border-t border-border/50 pt-4">
              <p className="text-xs text-muted-foreground mb-3">Quick select package:</p>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {COIN_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.coins}
                    onClick={() => handlePackageSelect(pkg)}
                    className={`relative p-3 rounded-xl border transition-all duration-300 ${
                      selectedCoins === pkg.coins
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <div className="text-center">
                      <span className={`font-bold text-sm ${selectedCoins === pkg.coins ? "text-primary" : "text-foreground"}`}>
                        {pkg.coins >= 1000 ? `${(pkg.coins / 1000).toFixed(pkg.coins % 1000 === 0 ? 0 : 1)}k` : pkg.coins}
                      </span>
                    </div>
                    {/* Indicator for packages with extra bonuses */}
                    {(PREMIUM_BONUSES[pkg.coins] || TREASURE_BONUSES[pkg.coins]) && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full inline-block" />
                Packages with extra bonuses (Premium, Treasures)
              </p>
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
                Buy Now - €{activePrice.toFixed(2)}
              </span>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Coins are credited instantly.
          </p>
        </div>

        {/* RIGHT: Selected Package Details Card */}
        <div className="lg:col-span-1">
          <div className="gaming-card rounded-2xl p-6 sticky top-6 border-primary/30">
            {/* Header */}
            <div className="text-center mb-4">
              <img 
                src={coinBagIcon} 
                alt="Donation Coins" 
                className="w-14 h-14 mx-auto mb-3"
              />
              <h3 className="font-display text-lg font-bold text-foreground">Selected Package</h3>
            </div>

            {/* Package Details */}
            <div className="space-y-2">
              {/* Mode indicator */}
              {!matchedPackage && closestTier && (
                <div className="text-center py-2 px-3 bg-primary/10 rounded-lg border border-primary/30">
                  <span className="text-xs font-medium text-primary">
                    Custom Amount • {closestTier >= 1000 ? `${closestTier / 1000}k` : closestTier} tier rewards
                  </span>
                </div>
              )}
              {!matchedPackage && !closestTier && (
                <div className="text-center py-2 px-3 bg-muted/50 rounded-lg border border-border/50">
                  <span className="text-xs font-medium text-muted-foreground">Custom Amount</span>
                </div>
              )}

              {/* Base Coins */}
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground text-sm">Base Coins</span>
                <span className="font-bold text-foreground">
                  {activeCoins.toLocaleString()}
                </span>
              </div>

              {/* Bonus */}
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  Bonus (+10%)
                </span>
                <span className="font-bold text-emerald-500">
                  +{activeBonus.toLocaleString()}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-2">
                <span className="text-foreground font-semibold text-sm">Total Coins</span>
                <span className="font-bold text-primary text-lg">
                  {activeTotal.toLocaleString()}
                </span>
              </div>

              {/* Price */}
              <div className="text-center pt-2">
                <div className="text-3xl font-bold text-gradient-gold">
                  €{activePrice.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Bonus Items */}
            <div className="mt-4 pt-3 border-t border-border/50 space-y-2">
              {/* Random Skin Box - included with all packages */}
              <div className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                <img 
                  src={randomSkinBoxIcon} 
                  alt="Random Skin Box" 
                  className="w-10 h-10 object-contain"
                />
                <div className="flex-1">
                  <span className="font-semibold text-foreground text-sm">Random Skin Box</span>
                  <p className="text-xs text-muted-foreground">x1 included with every purchase!</p>
                </div>
              </div>

              {/* Premium Account - only for matched packages 1500+ */}
              {premiumBonus && (
                <div className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-xl border border-amber-500/20">
                  <img 
                    src={premiumBonus.icon} 
                    alt={`Premium Account ${premiumBonus.days} days`} 
                    className="w-10 h-10 object-contain"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-foreground text-sm">Premium Account 100%</span>
                    <p className="text-xs text-amber-500/80">
                      {premiumBonus.days} day{premiumBonus.days > 1 ? 's' : ''} included!
                    </p>
                  </div>
                </div>
              )}

              {/* Treasures Antharas - only for matched packages 10000+ */}
              {treasureBonus && (
                <div className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 rounded-xl border border-emerald-500/20">
                  <img 
                    src={treasureChestIcon} 
                    alt="Treasures Antharas" 
                    className="w-10 h-10 object-contain"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-foreground text-sm">Treasures Antharas</span>
                    <p className="text-xs text-emerald-500/80">
                      x{treasureBonus.count} included!
                    </p>
                  </div>
                </div>
              )}

              {/* Note for custom amounts */}
              {!matchedPackage && (
                <p className="text-xs text-muted-foreground text-center italic">
                  Custom amounts include only coins + 10% bonus + Random Skin Box
                </p>
              )}
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
