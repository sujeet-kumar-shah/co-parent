import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { VendorCTASection } from "@/components/home/VendorCTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <TestimonialsSection />

        {/* <VendorCTASection /> */}

      </main>
      <Footer />
    </div>
  );
};

export default Index;
