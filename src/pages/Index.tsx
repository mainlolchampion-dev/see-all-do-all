import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServerRates } from "@/components/home/ServerRates";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { NewsSection } from "@/components/home/NewsSection";
import { CTASection } from "@/components/home/CTASection";
import { DiscordWidget } from "@/components/home/DiscordWidget";
import { ServerLaunchTimer } from "@/components/home/ServerLaunchTimer";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      
      {/* Discord & Siege Timer Section */}
      <section className="py-12 bg-surface-overlay">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <ServerLaunchTimer />
            <DiscordWidget />
          </div>
        </div>
      </section>
      
      <ServerRates />
      <FeaturesSection />
      <NewsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
