import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Coins, Info, User, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Coin presets for quick selection (matching the reference image)
const COIN_PRESETS = [0, 500, 900, 1500, 3000, 5000, 10000, 15000, 25000];
const MIN_COINS = 100;
const MAX_COINS = 25000;
const COINS_PER_EURO = 100; // 100 coins = 1€

export default function Donate() {
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

  const price = coins / COINS_PER_EURO; // Calculate price in euros

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
    // Validate character first
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
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Απαιτείται σύνδεση",
          description: "Πρέπει να συνδεθείς ή να δημιουργήσεις λογαριασμό για να αγοράσεις coins.",
          variant: "destructive",
        });
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        setIsLoading(false);
        return;
      }

      // Call the checkout edge function with character name
      const { data, error } = await supabase.functions.invoke('create-coin-checkout', {
        body: { 
          coins, 
          amount: Math.round(price * 100), // amount in cents
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
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Donate Coins</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Επίλεξε πόσα coins θέλεις να αγοράσεις. 100 Coins = 1€
            </p>
          </motion.div>

          {/* Main Coin Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="gaming-card rounded-2xl p-8 md:p-12">
              {/* Character Name Input */}
              <div className="mb-8">
                <Label htmlFor="characterName" className="text-lg font-semibold text-foreground mb-2 block">
                  <User className="w-5 h-5 inline mr-2" />
                  Character Name
                </Label>
                <div className="relative">
                  <Input
                    id="characterName"
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="Βάλε το όνομα του χαρακτήρα σου..."
                    className={`h-14 text-lg pr-12 ${
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
                  <p className="text-sm text-emerald-500 mt-2">
                    ✓ Ο χαρακτήρας βρέθηκε!
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Τα coins θα πιστωθούν στον χαρακτήρα που θα επιλέξεις.
                </p>
              </div>

              {/* Coin Display */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center gap-3 mb-2">
                  <Coins className="w-10 h-10 text-primary" />
                  <Input
                    type="number"
                    value={coins}
                    onChange={handleInputChange}
                    min={MIN_COINS}
                    max={MAX_COINS}
                    className="w-40 text-center text-4xl font-bold bg-transparent border-none text-primary focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <p className="text-lg text-muted-foreground">Donation Coins</p>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {COIN_PRESETS.filter(p => p >= MIN_COINS).map((preset) => (
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
              <div className="mb-8 px-4">
                <div className="relative">
                  {/* Slider Labels */}
                  <div className="flex justify-between text-xs text-muted-foreground mb-3">
                    {COIN_PRESETS.map((preset) => (
                      <span 
                        key={preset} 
                        className={`${coins >= preset ? 'text-primary' : ''} transition-colors`}
                      >
                        {preset >= 1000 ? `${preset/1000}k` : preset}
                      </span>
                    ))}
                  </div>
                  
                  <Slider
                    value={[coins]}
                    onValueChange={handleSliderChange}
                    min={0}
                    max={MAX_COINS}
                    step={100}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Price Display */}
              <div className="text-center mb-8">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gradient-gold">
                    €{price.toFixed(2)}
                  </span>
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
                className="w-full h-14 text-lg font-semibold btn-glow"
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
                    Αγορά {coins.toLocaleString()} Coins για €{price.toFixed(2)}
                  </span>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto mt-8"
          >
            <div className="gaming-card rounded-xl p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Τα coins πιστώνονται αμέσως μετά την επιβεβαίωση πληρωμής. 
                Όλες οι συναλλαγές είναι ασφαλείς μέσω Stripe. 
                Τα donations δεν επιστρέφονται.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
