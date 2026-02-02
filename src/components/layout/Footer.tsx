import { Link } from "react-router-dom";
import { Discord, Youtube } from "@/components/icons/SocialIcons";

export function Footer() {
  return (
    <footer className="bg-surface-overlay border-t border-border">
      {/* Ornamental divider */}
      <div className="ornament-divider" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Copyright */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground text-sm font-display uppercase tracking-wider">
            Copyright © {new Date().getFullYear()}
          </p>
          <p className="text-muted-foreground text-sm">
            Made with love <span className="text-primary">L2 All Stars</span>
          </p>
        </div>

        {/* Legal Links */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <Link
            to="/terms"
            className="text-muted-foreground hover:text-primary transition-colors font-display uppercase tracking-wide"
          >
            Terms of Service
          </Link>
          <Link
            to="/privacy"
            className="text-muted-foreground hover:text-primary transition-colors font-display uppercase tracking-wide"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
