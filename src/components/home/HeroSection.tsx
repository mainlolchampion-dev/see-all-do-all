import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroTitle from "@/assets/hero-title.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >

          {/* Main Title Image */}
          <img 
            src={heroTitle} 
            alt="L2 All Stars" 
            className="h-40 md:h-56 lg:h-72 xl:h-80 w-auto mx-auto mb-6 drop-shadow-[0_0_40px_rgba(200,200,200,0.6)]"
          />
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-4 font-display tracking-wide">
            LINEAGE <span className="tracking-tight">II</span> HIGH FIVE
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Experience the ultimate Lineage 2 adventure. Epic PvP battles, legendary raids, 
            and a thriving community await you.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="btn-glow text-lg px-8 py-6" asChild>
              <Link to="/register">
                <Users className="w-5 h-5 mr-2" />
                Start Playing
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10" asChild>
              <Link to="/download">
                <Download className="w-5 h-5 mr-2" />
                Download Client
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto"
          >
            {[
              { label: "Players", value: "5,000+" },
              { label: "Clans", value: "200+" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gradient-gold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
