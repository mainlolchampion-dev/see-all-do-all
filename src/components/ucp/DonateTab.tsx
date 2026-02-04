import { useState, useEffect } from "react";
import { CreditCard, Coins, Info, User, CheckCircle, XCircle, Loader2, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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

// Coin presets for quick selection
const COIN_PRESETS = [500, 900, 1500, 3000, 5000, 10000, 15000, 25000];
const MIN_COINS = 100;
const MAX_COINS = 25000;
const COINS_PER_EURO = 100; // 100 coins = 1 EUR
const BONUS_PERCENTAGE = 0.10; // 10% bonus

interface DonateTabProps {
  linkedLogin: string | null;
  characters?: Array<{ name: string; class: string; level: number }>;
}

export function DonateTab({ linkedLogin, characters }: DonateTabProps) {
  const [coins, setCoins] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [isValidatingChar, setIsValidatingChar] = useState(false);
  const [charValidation, setCharValidation] = useState<{
    valid: boolean | null;
    error?: string;
    accountName?: string;
  }>({ valid: null });
  const { toast } = useToast();

  const price = coins / COINS_PER_EURO;

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

  const handleSliderChange = (value: number[]) => {
    setCoins(Math.max(MIN_COINS, value[0]));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= MIN_COINS && value <= MAX_COINS) {
      setCoins(value);
    } else if (value < MIN_COINS) {
      setCoins(MIN_COINS);
    } else {
      setCoins(MAX_COINS);
    }
  };

  const handlePresetClick = (preset: number) => {
    if (preset >= MIN_COINS) {
      setCoins(preset);
    }
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

    if (coins < MIN_COINS) {
      toast({
        title: "Minimum amount",
        description: `The minimum is ${MIN_COINS} coins.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-coin-checkout', {
        body: { 
          coins, 
          amount: Math.round(price * 100),
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

  // Calculate bonus coins (10%)
  const bonusCoins = Math.floor(coins * BONUS_PERCENTAGE);
  const totalCoins = coins + bonusCoins;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gradient-gold">Buy Donation Coins</h1>

      {/* Coin Packages Card */}
      <div className="gaming-card rounded-2xl p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Coin Packages</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              All packages include +10% bonus coins!
            </p>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COIN_PACKAGES.map((pkg) => (
            <button
              key={pkg.coins}
              onClick={() => handlePresetClick(pkg.coins)}
              className={`relative p-4 rounded-xl border transition-all duration-300 group ${
                coins === pkg.coins
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {/* +10% Badge */}
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                +10%
              </div>
              
              {/* Coin Amount */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className={`font-bold text-lg ${coins === pkg.coins ? "text-primary" : "text-foreground"}`}>
                    {pkg.coins.toLocaleString()}
                  </span>
                </div>
                
                {/* Total with bonus */}
                <div className="text-emerald-500 text-xs font-semibold mb-2">
                  = {pkg.total.toLocaleString()} coins
                </div>
                
                {/* Price */}
                <div className={`text-sm font-semibold ${coins === pkg.coins ? "text-primary" : "text-muted-foreground"}`}>
                  €{pkg.price}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Info className="w-3 h-3" />
          <span>Bonus coins (ID: 100108) are automatically added to your purchase</span>
        </div>
      </div>

      <div className="gaming-card rounded-2xl p-6 md:p-8">
        {/* Character Selection */}
        <div className="mb-6">
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

        {/* Coin Display */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3 mb-2">
            <Coins className="w-8 h-8 text-primary" />
            <Input
              type="number"
              value={coins}
              onChange={handleInputChange}
              min={MIN_COINS}
              max={MAX_COINS}
              className="w-32 text-center text-3xl font-bold bg-transparent border-none text-primary focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <p className="text-muted-foreground">Donation Coins</p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {COIN_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                coins === preset
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              {preset.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="mb-6 px-2">
          <Slider
            value={[coins]}
            onValueChange={handleSliderChange}
            min={0}
            max={MAX_COINS}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>100</span>
            <span>25,000</span>
          </div>
        </div>

        {/* Price Display */}
        <div className="text-center mb-6">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gradient-gold">EUR {price.toFixed(2)}</span>
          </div>
          
          {/* Bonus Display */}
          {bonusCoins > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">
                +{bonusCoins.toLocaleString()} bonus = {totalCoins.toLocaleString()} total
              </span>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <Info className="w-4 h-4" />
            100 coins = EUR 1.00 (+10% bonus)
          </p>
        </div>

        {/* Purchase Button */}
        <Button
          onClick={handlePurchase}
          disabled={isLoading || coins < MIN_COINS || charValidation.valid !== true || isValidatingChar}
          className="w-full h-12 text-lg font-semibold btn-glow"
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
              Buy {coins.toLocaleString()} Coins (+{bonusCoins.toLocaleString()} bonus)
            </span>
          )}
        </Button>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Coins are credited instantly. Secure payment via Stripe.
        </p>
      </div>
    </div>
  );
}
