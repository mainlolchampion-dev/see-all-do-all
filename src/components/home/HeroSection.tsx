import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/lin2web-bg.jpg";
import character from "@/assets/l2-character.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left - Character (hidden on mobile, visible on larger screens) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex justify-center"
          >
            <img 
              src={character} 
              alt="L2 Character" 
              className="max-h-[500px] object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Right - Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            {/* Logo */}
            <div className="mb-6">
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <span className="text-gradient-gold">L2</span>
                <span className="text-foreground ml-2">All Stars</span>
              </h1>
            </div>
            
            {/* Tagline */}
            <h2 className="text-2xl md:text-3xl text-primary font-display uppercase tracking-wide mb-3">
              High Five x7 Server
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Experience the ultimate Lineage 2 adventure with balanced gameplay and an active community.
            </p>

            {/* CTA Button */}
            <Button 
              size="lg" 
              className="btn-glow text-lg px-10 py-6 font-display uppercase tracking-wide"
              asChild
            >
              <Link to="/register">Start to Play</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Ornament */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="ornament-divider" />
      </div>
    </section>
  );
}
