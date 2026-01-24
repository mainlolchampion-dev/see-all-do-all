import { motion } from "framer-motion";
import { CreditCard, Gift, Coins, Crown, Star, CheckCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const packages = [
  {
    name: "Starter",
    price: 5,
    coins: 500,
    bonus: 0,
    popular: false,
    features: ["500 Donation Coins", "Basic cosmetic items", "Forum badge"],
  },
  {
    name: "Hunter",
    price: 15,
    coins: 1600,
    bonus: 100,
    popular: false,
    features: ["1,600 Donation Coins", "+100 Bonus Coins", "Exclusive title", "Premium cosmetics"],
  },
  {
    name: "Champion",
    price: 30,
    coins: 3500,
    bonus: 500,
    popular: true,
    features: ["3,500 Donation Coins", "+500 Bonus Coins", "Exclusive mount", "VIP status", "Priority support"],
  },
  {
    name: "Legend",
    price: 50,
    coins: 6000,
    bonus: 1000,
    popular: false,
    features: ["6,000 Donation Coins", "+1,000 Bonus Coins", "Legendary cosmetics", "Lifetime VIP", "Custom title"],
  },
];

const paymentMethods = [
  { name: "PayPal", icon: "💳" },
  { name: "Credit Card", icon: "💳" },
  { name: "Crypto", icon: "₿" },
  { name: "Paysafecard", icon: "🎫" },
];

export default function Donate() {
  return (
    <Layout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Support the Server</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Help us maintain and improve the server. Get exclusive rewards and cosmetic items.
            </p>
          </motion.div>

          {/* Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`gaming-card rounded-xl p-6 relative ${
                  pkg.popular ? "border-primary ring-2 ring-primary/20" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    {pkg.popular ? (
                      <Crown className="w-7 h-7 text-primary" />
                    ) : (
                      <Coins className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-1">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-gradient-gold">${pkg.price}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {pkg.coins.toLocaleString()} Coins
                    {pkg.bonus > 0 && (
                      <span className="text-primary"> +{pkg.bonus} Bonus</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${pkg.popular ? "btn-glow" : ""}`}
                  variant={pkg.popular ? "default" : "outline"}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="gaming-card rounded-xl p-8 text-center">
              <h2 className="font-display text-2xl font-bold mb-6">
                <span className="text-gradient-gold">Payment Methods</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-muted/50"
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                All donations are non-refundable. Coins are delivered instantly after payment confirmation.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
