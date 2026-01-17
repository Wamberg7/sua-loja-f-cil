import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StorePreview from "@/components/StorePreview";
import DiscordSection from "@/components/DiscordSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StorePreview />
      <DiscordSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
