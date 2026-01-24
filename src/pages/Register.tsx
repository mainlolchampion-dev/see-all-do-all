import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Register() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateUsername = (username: string): string | null => {
    if (username.length < 4 || username.length > 14) {
      return "Το username πρέπει να είναι 4-14 χαρακτήρες";
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return "Το username πρέπει να περιέχει μόνο γράμματα και αριθμούς";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      toast({
        title: "Σφάλμα",
        description: usernameError,
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Σφάλμα",
        description: "Οι κωδικοί δεν ταιριάζουν.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6 || formData.password.length > 16) {
      toast({
        title: "Σφάλμα",
        description: "Ο κωδικός πρέπει να είναι 6-16 χαρακτήρες.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Step 1: Create L2 game account first
      const l2Response = await supabase.functions.invoke('create-l2-account', {
        body: {
          login: formData.username,
          password: formData.password,
          email: formData.email,
        }
      });

      if (l2Response.error || !l2Response.data?.success) {
        const errorMsg = l2Response.data?.error || l2Response.error?.message || "Σφάλμα δημιουργίας game account";
        throw new Error(errorMsg);
      }

      // Step 2: Create Supabase web account
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            l2_login: formData.username.toLowerCase(),
          }
        }
      });

      if (error) {
        // Note: L2 account was already created - inform user
        console.error("Supabase signup error:", error);
        toast({
          title: "Προσοχή",
          description: "Ο game account δημιουργήθηκε, αλλά υπήρξε σφάλμα με το web account. Μπορείς να συνδεθείς στο game με username: " + formData.username.toLowerCase(),
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      toast({
        title: "Ο λογαριασμός δημιουργήθηκε! 🎮",
        description: `Username για το game: ${formData.username.toLowerCase()}`,
      });
      
      navigate("/login");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Κάτι πήγε στραβά.";
      toast({
        title: "Σφάλμα εγγραφής",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                <span className="text-gradient-gold">Create Account</span>
              </h1>
              <p className="text-muted-foreground">
                Join thousands of players in the ultimate L2 experience
              </p>
            </div>

            <div className="gaming-card rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username - for L2 game login */}
                <div className="space-y-2">
                  <Label htmlFor="username">Game Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Username για το game (4-14 χαρακτήρες)"
                      className="pl-10 bg-muted/50 border-border"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      minLength={4}
                      maxLength={14}
                      pattern="[a-zA-Z0-9]+"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Αυτό θα είναι το login σου στο game client
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email"
                      className="pl-10 bg-muted/50 border-border"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      placeholder="Enter password (6-16 χαρακτήρες)"
                      className="pl-10 pr-10 bg-muted/50 border-border"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                      maxLength={16}
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
                      placeholder="Confirm password"
                      className="pl-10 bg-muted/50 border-border"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full btn-glow" size="lg" disabled={isLoading}>
                  {isLoading ? "Δημιουργία..." : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
