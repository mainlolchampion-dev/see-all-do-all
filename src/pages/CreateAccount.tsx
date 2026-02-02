import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/lin2web-bg.jpg";

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
    if (username.length < 4) return "Username must be at least 4 characters";
    if (username.length > 14) return "Username cannot exceed 14 characters";
    if (!/^[a-zA-Z0-9]+$/.test(username)) return "Username can only contain letters and numbers";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      toast({
        title: "Invalid username",
        description: usernameError,
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
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
          title: "Account creation failed",
          description: l2Data.error,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

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
        console.warn("Web signup failed:", signUpError.message);
        toast({
          title: "Game account created!",
          description: "You can play now. For UCP access, log in with your email.",
        });
        navigate("/login");
        return;
      }

      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
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
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-background/70" />
      
      {/* Navbar spacer */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-background/95 border-b border-border" />

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4 mt-16"
      >
        <div className="gaming-card rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
              Create a new account
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your login"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="lin2web-input w-full rounded-lg"
              required
              maxLength={14}
            />

            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="lin2web-input w-full rounded-lg"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password 6 to 14 symbols"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="lin2web-input w-full rounded-lg pr-10"
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

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="lin2web-input w-full rounded-lg pr-10"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-glow py-6 text-lg font-display uppercase tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm btn-outline-gold px-4 py-2 rounded-lg inline-block border border-border"
            >
              Already registered?
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
