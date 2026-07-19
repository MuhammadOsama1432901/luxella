"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  FileText, Shield, AlertCircle, RefreshCw, Clock,
  Truck, DollarSign, ChevronRight, HelpCircle as QuestionIcon
} from "lucide-react";

interface LegalSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
}

const returnSections: LegalSection[] = [
  {
    id: "eligibility",
    title: "1. Return Eligibility",
    icon: <Shield size={16} />,
    content: [
      "Items must be unworn, undamaged, and returned in their original packaging, including velvet gift boxes, authenticity certificates, and promotional materials."
    ]
  },
  {
    id: "window",
    title: "2. Return Window",
    icon: <Clock size={16} />,
    content: [
      "We offer a 7-day return and exchange window, commencing from the official delivery date tracking information provided by our shipping couriers."
    ]
  },
  {
    id: "exchanges",
    title: "3. Exchange Policy",
    icon: <RefreshCw size={16} />,
    content: [
      "You can swap items for different sizing/color models. We dispatch your exchange item once the returned piece arrives at our center and passes inspection."
    ]
  },
  {
    id: "refund-process",
    title: "4. Refund Process",
    icon: <DollarSign size={16} />,
    content: [
      "Returned items undergo quality control inspection (2-3 business days) at our Lahore hub. You will receive an email notice when inspection finishes."
    ]
  },
  {
    id: "timeline",
    title: "5. Refund Timeline",
    icon: <Clock size={16} />,
    content: [
      "Approved refunds are credited within 3-5 business days via Bank Transfer. Cash on Delivery (COD) checkouts are refunded via EasyPaisa or Bank Transfer."
    ]
  },
  {
    id: "damaged-products",
    title: "6. Damaged / Incorrect Orders",
    icon: <AlertCircle size={16} />,
    content: [
      "If you receive a damaged or incorrect package, report it with photos/videos to support@luxella.pk within 24 hours to secure a free courier exchange."
    ]
  },
  {
    id: "non-returnable",
    title: "7. Non-Returnable Items",
    icon: <AlertCircle size={16} />,
    content: [
      "Earrings (for hygiene reasons), customized/resized rings, and items purchased during clearout or final flash sales are not returnable."
    ]
  },
  {
    id: "shipping",
    title: "8. Return Courier Costs",
    icon: <Truck size={16} />,
    content: [
      "Return courier fees are paid by the customer and are non-refundable. We recommend trackable courier slips to prevent parcel loss."
    ]
  }
];

const faqs = [
  { q: "How do I start a return?", a: "Email support@luxella.pk with your Order ID and photos. We will verify and send the return address." },
  { q: "Is there a restocking fee?", a: "No restocking fees. We refund your full item purchase price (excluding initial delivery fees)." },
  { q: "Can I return a sale item?", a: "No, sale items are final catalog purchases and cannot be refunded or exchanged." }
];

export default function ReturnsPage() {
  const [activeSection, setActiveSection] = useState("eligibility");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of returnSections) {
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
            <span className="text-[#C8A96A]">Return & Refund Policy</span>
          </div>

          {/* Hero Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold tracking-wider" style={{ fontFamily: "var(--font-playfair)" }}>
              Return & Refund Policy
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
              <Clock size={12} className="text-[#C8A96A]" /> Last Updated: July 18, 2026
            </p>
            <p className="text-sm text-gray-400 leading-relaxed pt-2">
              Our 7-day guarantee ensures a stress-free shopping experience for all jewelry and luxury gifts.
            </p>
          </div>

          {/* Core Layout */}
          <div className="grid lg:grid-cols-4 gap-10 items-start pt-6">
            {/* TOC Sidebar */}
            <aside className="hidden lg:block sticky top-28 bg-[#121212]/50 backdrop-blur rounded-3xl p-5 border border-white/5 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-hide">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#C8A96A] border-b border-white/5 pb-2 flex items-center gap-2">
                <FileText size={12} /> Return Center
              </h3>
              <div className="space-y-1">
                {returnSections.map(s => (
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
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-6">
                {returnSections.map(s => (
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
              </div>

              {/* FAQs */}
              <div className="bg-[#121212] rounded-3xl p-6 md:p-8 border border-white/5 space-y-6">
                <h2 className="text-xl font-bold text-white tracking-wider border-b border-white/5 pb-4 flex items-center gap-2.5 font-serif" style={{ fontFamily: "var(--font-playfair)" }}>
                  <QuestionIcon size={18} className="text-[#C8A96A]" /> Frequently Asked Questions
                </h2>
                <div className="space-y-4 text-xs md:text-sm">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="space-y-1.5 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                      <p className="font-bold text-white">{faq.q}</p>
                      <p className="text-gray-400 leading-relaxed font-medium">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-3xl p-8 border border-[#C8A96A]/15 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-lg font-bold text-white font-serif tracking-wider" style={{ fontFamily: "var(--font-playfair)" }}>
                    Ready to initiate a return?
                  </h3>
                  <p className="text-xs text-gray-400 max-w-md leading-relaxed font-medium">
                    Send us your order reference number, and we will issue your Return Authorization Code within 24 hours.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/contact"
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl text-xs font-bold text-[#111] uppercase tracking-widest cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                  >
                    Contact Returns Team
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
