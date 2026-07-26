import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PremiumPackages from "@/components/home/PremiumPackages";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Hero />
        <FeaturedCollections />
        <FeaturedProducts />
        <PremiumPackages />
      </main>
      <Footer />
    </>
  );
}