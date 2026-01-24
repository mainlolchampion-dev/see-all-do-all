import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServerStatus } from "@/components/home/ServerStatus";
import { ServerRates } from "@/components/home/ServerRates";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { NewsSection } from "@/components/home/NewsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServerStatus />
      <ServerRates />
      <FeaturesSection />
      <NewsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
