import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Info, Download, BarChart3, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/features", icon: Info },
  { name: "Files", path: "/download", icon: Download },
  { name: "Statistics", path: "/rankings", icon: BarChart3 },
  { name: "Donate", path: "/donate", icon: Gift },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Gold accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "active" : ""}`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Right Side - Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <Button size="sm" className="btn-glow font-display uppercase tracking-wide" asChild>
                <Link to="/ucp">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="text-muted-foreground hover:text-foreground font-display uppercase tracking-wide text-sm transition-colors"
                >
                  Register
                </Link>
                <Button size="sm" className="btn-glow font-display uppercase tracking-wide" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background/98 backdrop-blur-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-display uppercase tracking-wide text-sm transition-all ${
                    isActive(link.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border space-y-2">
                {isLoggedIn ? (
                  <Button className="w-full btn-glow font-display uppercase" asChild>
                    <Link to="/ucp" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="w-full btn-outline-gold font-display uppercase" asChild>
                      <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
                    </Button>
                    <Button className="w-full btn-glow font-display uppercase" asChild>
                      <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
