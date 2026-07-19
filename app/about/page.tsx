import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import AboutTeam from "@/components/about/AboutTeam";
import AboutStats from "@/components/about/AboutStats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Luxella – Our Story & Values",
  description:
    "Discover the story behind Luxella – premium artificial jewelry crafted with passion, elegance, and timeless design.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <AboutStats />
        <AboutStory />
        <AboutValues />
        <AboutTeam />
      </main>
      <Footer />
    </>
  );
}
