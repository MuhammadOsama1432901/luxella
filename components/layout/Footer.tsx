"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Footer() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to load footer settings:", err);
      }
    }
    loadSettings();
  }, []);

  const shopLinks = [
    { name: "Necklaces", path: "/shop?category=Necklaces" },
    { name: "Earrings", path: "/shop?category=Earrings" },
    { name: "Rings", path: "/shop?category=Rings" },
    { name: "Bracelets", path: "/shop?category=Bracelets" },
  ];

  const companyLinks = [
    { name: "Home", path: "/" },
    { name: "Shop Catalog", path: "/shop" },
    { name: "Gift Studio", path: "/gift-studio" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const policyLinks = [
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Returns & Refunds", path: "/returns" },
  ];

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? null : name);
  };

  const emailVal = settings?.email || "osamaafzal1432901@gmail.com";
  const phoneVal = settings?.phone || "+92 349 5804586";
  const cleanPhone = phoneVal.replace(/[^0-9]/g, "");

  return (
    <footer className="relative py-16 overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Gold top border line */}
      <div className="gold-divider absolute top-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ── Desktop & Tablet Layout (Responsive Grid) ───────────────── */}
        {/* Changed from md:grid-cols-4 to sm:grid-cols-2 lg:grid-cols-4 to optimize layouts on medium viewports */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-12 border-b border-white/5">
          {/* Logo & Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 border border-[rgba(200,169,106,0.15)] flex-shrink-0">
                <Image
                  src="/images/logo/logo-crest.jpg"
                  alt="LUXELLA Crest"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <span
                className="text-2xl font-bold tracking-[0.2em] text-[var(--text-primary)] group-hover:text-[#C8A96A] transition-colors"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                LUXELLA
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: "var(--text-secondary)" }}>
              Premium Artificial Jewelry crafted with elegance, style, and modern design. Timeless beauty for the modern you.
            </p>
            
            {/* Premium Gold Social Buttons */}
            <div className="flex items-center gap-3.5 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300"
                style={{
                  background: "rgba(200, 169, 106, 0.04)",
                  borderColor: "rgba(200, 169, 106, 0.15)",
                  color: "#C8A96A",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C8A96A";
                  e.currentTarget.style.background = "rgba(200, 169, 106, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(200, 169, 106, 0.15)";
                  e.currentTarget.style.background = "rgba(200, 169, 106, 0.04)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300"
                style={{
                  background: "rgba(200, 169, 106, 0.04)",
                  borderColor: "rgba(200, 169, 106, 0.15)",
                  color: "#C8A96A",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C8A96A";
                  e.currentTarget.style.background = "rgba(200, 169, 106, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(200, 169, 106, 0.15)";
                  e.currentTarget.style.background = "rgba(200, 169, 106, 0.04)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="lg:pl-8">
            <h3 className="font-bold mb-6 uppercase text-[10px] tracking-[0.2em]" style={{ color: "#C8A96A" }}>
              Shop
            </h3>
            <ul className="space-y-4 text-xs">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="transition-colors hover:text-[#C8A96A]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:pl-4">
            <h3 className="font-bold mb-6 uppercase text-[10px] tracking-[0.2em]" style={{ color: "#C8A96A" }}>
              Company
            </h3>
            <ul className="space-y-4 text-xs">
              {companyLinks.concat(policyLinks).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="transition-colors hover:text-[#C8A96A]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support Column */}
          {/* Enhanced alignment and overflow prevention for long emails */}
          <div className="space-y-6">
            <h3 className="font-bold uppercase text-[10px] tracking-[0.2em]" style={{ color: "#C8A96A" }}>
              Customer Support
            </h3>
            <div className="space-y-4">
              <a href={`mailto:${emailVal}`} className="flex items-center gap-3 group min-w-0">
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all border border-[rgba(200,169,106,0.2)] group-hover:border-[#C8A96A]"
                  style={{ background: "rgba(200, 169, 106, 0.06)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#C8A96A]">
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-xs transition-colors group-hover:text-[#C8A96A] truncate font-medium max-w-[190px] xl:max-w-none" style={{ color: "var(--text-secondary)" }}>
                  {emailVal}
                </span>
              </a>

              <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group min-w-0">
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all border border-[rgba(200,169,106,0.2)] group-hover:border-[#C8A96A]"
                  style={{ background: "rgba(200, 169, 106, 0.06)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#C8A96A]">
                    <path
                      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-xs transition-colors group-hover:text-[#C8A96A] font-medium" style={{ color: "var(--text-secondary)" }}>
                  {phoneVal}
                </span>
              </a>

              <p className="text-[10px] mt-6 pt-4 border-t border-gray-800/40" style={{ color: "var(--text-muted)" }}>
                Mon – Sat &nbsp;|&nbsp; 10AM – 8PM
              </p>
            </div>
          </div>
        </div>

        {/* ── Mobile Layout (accordions) ─────────────────────────────── */}
        <div className="sm:hidden space-y-5">
          
          {/* Logo & Description */}
          <div className="text-center space-y-4 pb-4 border-b border-white/5">
            <div className="flex justify-center">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-[rgba(200,169,106,0.15)] flex-shrink-0">
                  <img src="/images/logo/logo-crest.jpg" alt="LUXELLA Crest" className="object-cover w-full h-full" />
                </div>
                <span className="text-xl font-bold tracking-[0.2em] text-[var(--text-primary)] font-serif" style={{ fontFamily: "var(--font-playfair)" }}>
                  LUXELLA
                </span>
              </Link>
            </div>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              Premium Artificial Jewelry crafted with elegance, style, and modern design. Timeless beauty for the modern you.
            </p>

            {/* Mobile Social Buttons */}
            <div className="flex items-center justify-center gap-4">
              <a href="https://instagram.com" className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-[#C8A96A] bg-white/5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://facebook.com" className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-[#C8A96A] bg-white/5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Accordion 1: Shop */}
          <div className="border-b border-white/5 pb-2">
            <button
              onClick={() => toggleAccordion("shop")}
              className="w-full flex items-center justify-between py-3 text-left font-bold uppercase text-[10px] tracking-widest text-[#C8A96A] cursor-pointer"
            >
              <span>Shop Collections</span>
              {activeAccordion === "shop" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {activeAccordion === "shop" && (
              <ul className="pl-2 pb-3 space-y-3 text-xs text-gray-400">
                {shopLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.path} className="block py-1 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accordion 2: Company */}
          <div className="border-b border-white/5 pb-2">
            <button
              onClick={() => toggleAccordion("company")}
              className="w-full flex items-center justify-between py-3 text-left font-bold uppercase text-[10px] tracking-widest text-[#C8A96A] cursor-pointer"
            >
              <span>Our Maison</span>
              {activeAccordion === "company" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {activeAccordion === "company" && (
              <ul className="pl-2 pb-3 space-y-3 text-xs text-gray-400">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.path} className="block py-1 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accordion 3: Policies */}
          <div className="border-b border-white/5 pb-2">
            <button
              onClick={() => toggleAccordion("policies")}
              className="w-full flex items-center justify-between py-3 text-left font-bold uppercase text-[10px] tracking-widest text-[#C8A96A] cursor-pointer"
            >
              <span>Policies & Trust</span>
              {activeAccordion === "policies" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {activeAccordion === "policies" && (
              <ul className="pl-2 pb-3 space-y-3 text-xs text-gray-400">
                {policyLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.path} className="block py-1 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact Details (Simple dynamic display on mobile) */}
          <div className="pt-4 space-y-3 text-center text-xs">
            <div className="flex justify-center gap-4">
              <a href={`mailto:${emailVal}`} className="p-2.5 rounded-full border border-white/5 bg-white/[0.02] text-[#C8A96A]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>
              </a>
              <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/5 bg-white/[0.02] text-[#C8A96A]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            </div>
            <p className="text-[10px] text-gray-500">Mon – Sat &nbsp;|&nbsp; 10AM – 8PM</p>
          </div>

        </div>

        {/* ── Copyright ────────────────────────────────────────────── */}
        <div className="border-t border-gray-800/30 mt-12 pt-6 text-center text-[10px] sm:text-xs tracking-widest" style={{ color: "var(--text-muted)" }}>
          &copy; {new Date().getFullYear()} LUXELLA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}