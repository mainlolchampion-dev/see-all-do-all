import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, Mail, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateUsername = (username: string): string | null => {
    if (username.length < 4) return "Το username πρέπει να έχει τουλάχιστον 4 χαρακτήρες";
    if (username.length > 14) return "Το username δεν μπορεί να υπερβαίνει τους 14 χαρακτήρες";
    if (!/^[a-zA-Z0-9]+$/.test(username)) return "Το username μπορεί να περιέχει μόνο γράμματα και αριθμούς (χωρίς ελληνικά)";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      toast({
        title: "Μη έγκυρο username",
        description: usernameError,
        variant: "destructive",
      });
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast({
        title: "Μη έγκυρο password",
        description: "Το password πρέπει να έχει τουλάχιστον 6 χαρακτήρες",
        variant: "destructive",
      });
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Τα passwords δεν ταιριάζουν",
        description: "Βεβαιώσου ότι έχεις πληκτρολογήσει το ίδιο password και στα δύο πεδία",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create L2 game account via edge function
      const { data: l2Data, error: l2Error } = await supabase.functions.invoke('create-l2-account', {
        body: {
          login: formData.username,
          password: formData.password,
          email: formData.email
        }
      });

      if (l2Error) throw l2Error;
      
      if (l2Data?.error) {
        toast({
          title: "Σφάλμα δημιουργίας λογαριασμού",
          description: l2Data.error,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Step 2: Create Supabase web account for UCP access
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            l2_login: formData.username
          }
        }
      });

      if (signUpError) {
        // L2 account was created, but web signup failed
        // This is okay - they can still play, just won't have UCP access until they create web account
        console.warn("Web signup failed:", signUpError.message);
        toast({
          title: "Ο λογαριασμός παιχνιδιού δημιουργήθηκε!",
          description: "Μπορείς να παίξεις τώρα. Για πρόσβαση στο UCP, κάνε login με το email σου.",
        });
        navigate("/login");
        return;
      }

      toast({
        title: "Επιτυχής δημιουργία!",
        description: "Ο λογαριασμός σου δημιουργήθηκε. Μπορείς τώρα να συνδεθείς.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4"
        >
          <div className="gaming-card rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold mb-2">
                <span className="text-gradient-gold">Create Account</span>
              </h1>
              <p className="text-muted-foreground">
                Δημιούργησε τον λογαριασμό σου για να ξεκινήσεις
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Game Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Το username για το παιχνίδι"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-10 h-12"
                    required
                    maxLength={14}
                  />
                </div>
                <p className="text-xs text-muted-foreground">4-14 χαρακτήρες, μόνο λατινικοί</p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Το email σου"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Τουλάχιστον 6 χαρακτήρες"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Επανάλαβε το password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold btn-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Δημιουργία...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Έχεις ήδη λογαριασμό;{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Σύνδεση
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
