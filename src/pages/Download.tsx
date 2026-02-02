import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/lin2web-bg.jpg";

export default function Download() {
  return (
    <Layout>
      {/* Hero Section with Background */}
      <section className="relative py-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary uppercase tracking-wide mb-2">
              Start the game in just a few clicks
            </h1>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Step 1 - Account Registration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-4">
                <span className="text-muted-foreground text-sm">Step 1</span>
                <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-wide">
                  Account Registration
                </h2>
              </div>
              
              <p className="text-muted-foreground mb-6">
                The first step to start playing is to create a master account. This account will be used to log into the game and access your personal dashboard.
              </p>

              <Button className="btn-glow font-display uppercase tracking-wide mb-6" asChild>
                <Link to="/register">Create Account</Link>
              </Button>

              <p className="text-muted-foreground mb-4">
                After registering your account, you can log into your personal dashboard. There, you'll be able to manage your account settings, purchase in-game currency, control your characters, and access other features.
              </p>

              <Button variant="outline" className="btn-outline-gold font-display uppercase tracking-wide mb-8" asChild>
                <Link to="/login">Log In to Dashboard</Link>
              </Button>

              {/* Project Rules */}
              <div className="gaming-card rounded-lg p-4">
                <h3 className="font-display text-lg font-semibold text-foreground uppercase tracking-wide mb-2">
                  Project Rules
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We recommend that you read the rules of our project. Ignorance of the rules does not exempt you from responsibility!
                </p>
                <div className="flex gap-3">
                  <Link to="/terms" className="text-primary hover:underline text-sm">Terms of Agreement</Link>
                  <Link to="/privacy" className="text-primary hover:underline text-sm">Privacy Policy</Link>
                </div>
              </div>
            </motion.div>

            {/* Step 2 - File Download */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-4">
                <span className="text-muted-foreground text-sm">Step 2</span>
                <h2 className="font-display text-2xl font-bold text-foreground uppercase tracking-wide">
                  File Download
                </h2>
              </div>
              
              <p className="text-muted-foreground mb-6">
                To connect to our servers, you need to download and install the Lineage 2 High Five client files, the patch, or the updater.
              </p>

              {/* Download Cards */}
              <div className="space-y-4">
                {/* Client */}
                <div className="gaming-card rounded-lg p-4">
                  <h3 className="font-display text-lg font-semibold text-foreground uppercase tracking-wide mb-2">
                    Lineage 2 Client
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    You need the game client. We recommend using our client for the best experience.
                  </p>
                  <Button className="btn-glow font-display uppercase tracking-wide text-sm">
                    Download Client
                  </Button>
                </div>

                {/* Patch */}
                <div className="gaming-card rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Files required to play on our servers. Extract them into the root folder of the game.
                  </p>
                  <Button className="btn-glow font-display uppercase tracking-wide text-sm">
                    Download Patch
                  </Button>
                </div>

                {/* Updater */}
                <div className="gaming-card rounded-lg p-4">
                  <h3 className="font-display text-lg font-semibold text-foreground uppercase tracking-wide mb-2">
                    Updater
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automatic file check and download. Keeps your game files up to date.
                  </p>
                  <Button variant="outline" className="btn-outline-gold font-display uppercase tracking-wide text-sm">
                    Download Updater
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom ornament */}
      <div className="ornament-divider" />
    </Layout>
  );
}
