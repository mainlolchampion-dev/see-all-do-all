import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ContentTabs } from "@/components/home/ContentTabs";
import { ServerCards } from "@/components/home/ServerCards";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      
      {/* Main Content Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Left - Content Tabs (News, Rankings, etc.) */}
            <div className="lg:col-span-2">
              <ContentTabs />
            </div>
            
            {/* Right - Server Cards & Social */}
            <div className="lg:col-span-1">
              <ServerCards />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom ornament */}
      <div className="ornament-divider" />
    </Layout>
  );
};

export default Index;
