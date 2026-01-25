import { useState, useEffect } from "react";
import { CreditCard, Coins, Info, User, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Coin presets for quick selection
const COIN_PRESETS = [500, 900, 1500, 3000, 5000, 10000, 15000, 25000];
const MIN_COINS = 100;
const MAX_COINS = 25000;
const COINS_PER_EURO = 100; // 100 coins = 1€

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
          error: "Σφάλμα επικοινωνίας με τον server"
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
        title: "Απαιτείται Character Name",
        description: "Πρέπει να βάλεις το όνομα του χαρακτήρα που θα λάβει τα coins.",
        variant: "destructive",
      });
      return;
    }

    if (charValidation.valid !== true) {
      toast({
        title: "Μη έγκυρος χαρακτήρας",
        description: charValidation.error || "Ο χαρακτήρας δεν βρέθηκε στον server.",
        variant: "destructive",
      });
      return;
    }

    if (coins < MIN_COINS) {
      toast({
        title: "Ελάχιστη ποσότητα",
        description: `Το ελάχιστο είναι ${MIN_COINS} coins.`,
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
        title: "Σφάλμα",
        description: error.message || "Κάτι πήγε στραβά. Δοκίμασε ξανά.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gradient-gold">Buy Donation Coins</h1>

      <div className="gaming-card rounded-2xl p-6 md:p-8">
        {/* Character Selection */}
        <div className="mb-6">
          <Label htmlFor="characterName" className="text-base font-semibold text-foreground mb-2 block">
            <User className="w-4 h-4 inline mr-2" />
            Επίλεξε Χαρακτήρα
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
              placeholder="Ή πληκτρολόγησε το όνομα..."
              className={`h-12 pr-12 ${
                charValidation.valid === true 
                  ? 'border-emerald-500 focus-visible:ring-emerald-500' 
                  : charValidation.valid === false 
                    ? 'border-destructive focus-visible:ring-destructive' 
                    : ''
              }`}
              maxLength={16}
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
            <p className="text-sm text-emerald-500 mt-2">✓ Ο χαρακτήρας βρέθηκε!</p>
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
            <span className="text-4xl font-bold text-gradient-gold">€{price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <Info className="w-4 h-4" />
            100 coins = €1.00
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
              Επεξεργασία...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Αγορά {coins.toLocaleString()} Coins
            </span>
          )}
        </Button>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Τα coins πιστώνονται αμέσως. Ασφαλής πληρωμή μέσω Stripe.
        </p>
      </div>
    </div>
  );
}
