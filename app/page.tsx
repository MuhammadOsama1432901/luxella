import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PremiumPackages from "@/components/home/PremiumPackages";
import Testimonials from "@/components/home/Testimonials";
import Features from "@/components/home/Features";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedCollections />
      <FeaturedProducts />
      <PremiumPackages />
      <Testimonials />
      <Features />
      <Newsletter />
      <Footer />
    </>
  );
}