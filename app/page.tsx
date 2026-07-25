import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import FeaturedCollections from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PremiumPackages from "@/components/home/PremiumPackages";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxella — Premium Artificial Jewelry | Pakistan",
  description:
    "Discover Luxella's luxury artificial jewelry collection. Handcrafted bridal sets, necklaces, earrings, rings, and bracelets. Free delivery across Pakistan.",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <FeaturedCollections />
        <FeaturedProducts />
        <PremiumPackages />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}