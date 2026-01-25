import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gamepad2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to Begin Your
            <br />
            <span className="text-gradient-gold">Adventure?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join thousands of players in the ultimate Lineage 2 experience. 
            Create your account now and start your journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="btn-glow text-lg px-10 py-6" asChild>
              <Link to="/create-account">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Create Free Account
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-lg" asChild>
              <Link to="/download">
                <Download className="w-5 h-5 mr-2" />
                Download Client
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
