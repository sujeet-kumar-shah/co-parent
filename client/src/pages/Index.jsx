import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { VendorCTASection } from "@/components/home/VendorCTASection";
import { CarouselCustomNavigation } from "../components/home/CarouselSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="space-y-20 md:space-y-32 pb-20">
        <HeroSection />
        {/* Offers Section */}
        <section className="space-y-8">
          <div className="container text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Student Specials ⚡
            </h2>
            <p className="text-muted-foreground text-lg">
              Grab the best discounts on Hostels, Coaching, and more.
            </p>
          </div>
          <CarouselCustomNavigation />
        </section>
        <CategorySection />
        <TestimonialsSection />

        {/* <VendorCTASection /> */}

      </main>
      <Footer />
    </div>
  );
};

export default Index;
