import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Download, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroTitle from "@/assets/hero-title.png";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-20 md:-mt-24">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay - heavier at bottom for content readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/90" />
      <div className="absolute inset-0 bg-background/20" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-4"
        >
          {/* Main Title Image - Large & Prominent */}
          <img 
            src={heroTitle} 
            alt="L2 All Stars" 
            className="h-44 sm:h-56 md:h-72 lg:h-80 xl:h-96 w-auto mx-auto drop-shadow-[0_0_60px_rgba(200,170,50,0.7)] drop-shadow-[0_0_120px_rgba(200,170,50,0.3)]"
          />
        </motion.div>

        {/* Ornamental Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-64 md:w-96 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mb-6"
        />

        {/* Chronicle Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.2em] text-gradient-gold mb-2">
            HIGH FIVE
          </h1>
          <p className="text-sm sm:text-base md:text-lg tracking-[0.3em] text-foreground/50 uppercase mb-8">
            x1000 PvP Server
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Ultimate PvP experience with enhanced rates and balanced gameplay.
          Epic battles, legendary raids, and a thriving community await.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button size="lg" className="btn-glow text-base sm:text-lg px-10 py-6 tracking-wider" asChild>
            <Link to="/register">
              <Users className="w-5 h-5 mr-2" />
              Start Playing
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-base sm:text-lg px-10 py-6 border-primary/30 hover:bg-primary/10 hover:border-primary/60 tracking-wider transition-all duration-300" 
            asChild
          >
            <Link to="/download">
              <Download className="w-5 h-5 mr-2" />
              Download Client
            </Link>
          </Button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16"
        >
          {[
            { label: "Players", value: "5,000+" },
            { label: "Clans", value: "200+" },
            { label: "Uptime", value: "99.9%" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center flex items-center gap-8 sm:gap-12 md:gap-16">
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient-gold tracking-wide">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground tracking-[0.2em] uppercase mt-1">
                  {stat.label}
                </div>
              </div>
              {i < 2 && (
                <div className="h-8 w-px bg-primary/20 hidden sm:block" />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-foreground">Scroll</span>
          <ChevronDown className="w-5 h-5 text-primary/60" />
        </motion.div>
      </motion.div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
