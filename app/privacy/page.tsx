"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  FileText, Shield, Eye, ShieldCheck, Database, Server, Smartphone, Lock,
  Clock, ChevronRight, Mail, Key
} from "lucide-react";

interface LegalSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const privacySections: LegalSection[] = [
  {
    id: "introduction",
    title: "1. Overview",
    icon: <Eye size={16} />,
    content: [
      "Luxella respects your privacy and is committed to protecting your personal data. This policy details how we collect, process, and secure your information."
    ]
  },
  {
    id: "collection",
    title: "2. Data We Collect",
    icon: <Database size={16} />,
    content: [
      "We collect basic credentials to process checkouts:",
      "• Identity: Name, shipping address, email address, and phone numbers.",
      "• Transactions: Order products history, subtotal records, and payment method options.",
      "• Technical: IP address, browser type, and cookies to keep you logged in."
    ]
  },
  {
    id: "tryon-data",
    title: "3. AI Try-On Images",
    icon: <Smartphone size={16} />,
    content: [
      "The AI Virtual Try-On feature requires temporary access to your camera/photo uploads. Images are processed in-memory solely for aligning jewelry overlays. Files are deleted from our servers immediately after the session ends."
    ]
  },
  {
    id: "usage",
    title: "4. How We Use Data",
    icon: <ShieldCheck size={16} />,
    content: [
      "We use your details to fulfill purchases, handle shipping coordination, manage user accounts, and prevent database vulnerabilities."
    ]
  },
  {
    id: "cookies",
    title: "5. Cookies Policy",
    icon: <Key size={16} />,
    content: [
      "We use cookies to remember cart contents, manage login sessions, and track user navigation flows. You can disable cookies in your browser settings."
    ]
  },
  {
    id: "sharing",
    title: "6. Data Sharing",
    icon: <Server size={16} />,
    content: [
      "We do not sell your personal data. Information is shared only with payment processors (Stripe) and courier partners to complete your checkout delivery."
    ]
  },
  {
    id: "security",
    title: "7. Security Measures",
    icon: <Lock size={16} />,
    content: [
      "Your details are protected using SSL encryption. While we maintain strict database security protocols, no online transaction is 100% immune to leaks."
    ]
  },
  {
    id: "rights",
    title: "8. Your Rights",
    icon: <ShieldCheck size={16} />,
    content: [
      "You have the right to request access to your profile data, edit details, or request permanent deletion of your account. Contact us at privacy@luxella.pk."
    ]
  }
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of privacySections) {
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
            <span className="text-[#C8A96A]">Privacy Policy</span>
          </div>

          {/* Hero Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold tracking-wider" style={{ fontFamily: "var(--font-playfair)" }}>
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
              <Clock size={12} className="text-[#C8A96A]" /> Last Updated: July 18, 2026
            </p>
            <p className="text-sm text-gray-400 leading-relaxed pt-2">
              Learn how we protect and manage your personal details, cookies, and AI try-on photos.
            </p>
          </div>

          {/* Core Layout */}
          <div className="grid lg:grid-cols-4 gap-10 items-start pt-6">
            {/* TOC Sidebar */}
            <aside className="hidden lg:block sticky top-28 bg-[#121212]/50 backdrop-blur rounded-3xl p-5 border border-white/5 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-hide">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#C8A96A] border-b border-white/5 pb-2 flex items-center gap-2">
                <FileText size={12} /> Privacy Center
              </h3>
              <div className="space-y-1">
                {privacySections.map(s => (
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

            {/* Privacy Cards */}
            <div className="lg:col-span-3 space-y-6">
              {privacySections.map(s => (
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

              {/* Contact Help Card */}
              <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-3xl p-8 border border-[#C8A96A]/15 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-lg font-bold text-white font-serif tracking-wider" style={{ fontFamily: "var(--font-playfair)" }}>
                    Data deletion & updates
                  </h3>
                  <p className="text-xs text-gray-400 max-w-md leading-relaxed font-medium">
                    You can request complete deletion of your account history by contacting our security auditor.
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href="mailto:privacy@luxella.pk"
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl text-xs font-bold text-[#111] uppercase tracking-widest cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                  >
                    <Mail size={12} /> Email Privacy Auditor
                  </a>
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
