"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  FileText, Shield, User, Info, DollarSign, Gift, Clock,
  ArrowUpRight, Scale, ChevronRight, CheckCircle, Sparkles
} from "lucide-react";

interface LegalSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const termsSections: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    icon: <Info size={16} />,
    content: [
      "Welcome to Luxella. By accessing our platform or purchasing our jewelry, you agree to these Terms & Conditions. If you disagree, please do not use our services."
    ]
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    icon: <Scale size={16} />,
    content: [
      "You must be at least 18 years old (or the age of majority in your region) to register accounts, use our studio features, or place transactions."
    ]
  },
  {
    id: "accounts",
    title: "3. Account Security",
    icon: <User size={16} />,
    content: [
      "You are responsible for keeping your login credentials confidential. All transactions made under your account are your sole responsibility."
    ]
  },
  {
    id: "responsibilities",
    title: "4. Code of Conduct",
    icon: <Shield size={16} />,
    content: [
      "You agree not to scrape data, upload malicious files, attempt unauthorized server access, or interfere with transaction databases."
    ]
  },
  {
    id: "products",
    title: "5. Catalog Details",
    icon: <FileText size={16} />,
    content: [
      "We display jewelry colors and dimensions as accurately as possible. Slight variations may occur due to device screen settings."
    ]
  },
  {
    id: "pricing",
    title: "6. Pricing & Currency",
    icon: <DollarSign size={16} />,
    content: [
      "All prices are in PKR and subject to update. In the event of a pricing listing error, we reserve the right to cancel the transaction."
    ]
  },
  {
    id: "orders",
    title: "7. Order Acceptance",
    icon: <CheckCircle size={16} />,
    content: [
      "Receipt of confirmation does not mean order acceptance. We reserve the right to decline orders due to stock shortages or fraud checks."
    ]
  },
  {
    id: "shipping",
    title: "8. Shipping Policy",
    icon: <ArrowUpRight size={16} />,
    content: [
      "Delivery timelines are courier estimates. Liability for package transit risk passes to the customer upon delivery to the shipping partner."
    ]
  },
  {
    id: "tryon",
    title: "9. AI Try-On Disclaimer",
    icon: <Sparkles size={16} />,
    content: [
      "The AI Try-On feature provides simulated overlays of jewelry for representation. Scale, metal shine, and gemstone reflections may vary."
    ]
  },
  {
    id: "ip",
    title: "10. Intellectual Property",
    icon: <Scale size={16} />,
    content: [
      "All designs, catalog photos, custom logo crests, and scripts are copyrighted property of Luxella. Unauthorized copy/use is prohibited."
    ]
  },
  {
    id: "liability",
    title: "11. Limitation of Liability",
    icon: <Shield size={16} />,
    content: [
      "Luxella is not liable for indirect damages. Our maximum liability is strictly capped at the total PKR value paid for the respective order."
    ]
  },
  {
    id: "governing",
    title: "12. Governing Law",
    icon: <Scale size={16} />,
    content: [
      "These terms are governed by the laws of Pakistan. Any legal proceedings shall be handled exclusively in the courts of Lahore."
    ]
  }
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of termsSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 120,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#080808] text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
             style={{ background: "radial-gradient(circle, #C8A96A, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            <Link href="/" className="hover:text-[#C8A96A] transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-[#C8A96A]">Terms & Conditions</span>
          </div>

          {/* Hero Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold tracking-wider" style={{ fontFamily: "var(--font-playfair)" }}>
              Terms & Conditions
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
              <Clock size={12} className="text-[#C8A96A]" /> Last Updated: July 18, 2026
            </p>
            <p className="text-sm text-gray-400 leading-relaxed pt-2">
              A quick summary of our store service agreements and purchase terms.
            </p>
          </div>

          {/* Core Layout */}
          <div className="grid lg:grid-cols-4 gap-10 items-start pt-6">
            {/* TOC Sidebar */}
            <aside className="hidden lg:block sticky top-28 bg-[#121212]/50 backdrop-blur rounded-3xl p-5 border border-white/5 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-hide">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#C8A96A] border-b border-white/5 pb-2 flex items-center gap-2">
                <FileText size={12} /> Summary List
              </h3>
              <div className="space-y-1">
                {termsSections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={[
                      "w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer flex items-center gap-2.5",
                      activeSection === s.id
                        ? "text-[#C8A96A] bg-white/[0.03]"
                        : "text-gray-500 hover:text-white"
                    ].join(" ")}
                  >
                    {s.icon}
                    <span className="truncate">{s.title.replace(/^\d+\.\s/, "")}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Content Cards */}
            <div className="lg:col-span-3 space-y-6">
              {termsSections.map(s => (
                <section
                  key={s.id}
                  id={s.id}
                  className={[
                    "bg-[#121212] rounded-3xl p-6 md:p-8 border transition-all duration-300",
                    activeSection === s.id ? "border-[#C8A96A]/30 shadow-lg" : "border-white/5"
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A] flex-shrink-0">
                      {s.icon}
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-white tracking-wider" style={{ fontFamily: "var(--font-playfair)" }}>
                      {s.title}
                    </h2>
                  </div>
                  <div className="space-y-4 text-xs md:text-sm text-gray-400 leading-relaxed font-medium">
                    {s.content.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}

              {/* Need Help Card */}
              <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-3xl p-8 border border-[#C8A96A]/15 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-lg font-bold text-white font-serif tracking-wider" style={{ fontFamily: "var(--font-playfair)" }}>
                    Have questions about our terms?
                  </h3>
                  <p className="text-xs text-gray-400 max-w-md leading-relaxed font-medium">
                    Our customer support team is available Mon–Sat (10AM–8PM) to help you understand our service agreements.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/contact"
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl text-xs font-bold text-[#111] uppercase tracking-widest cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
