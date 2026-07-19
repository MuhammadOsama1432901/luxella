"use client";

import Link from "next/link";
import Image from "next/image";

export default function ShopHero() {
  return (
    <section className="relative h-[360px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="/images/banners/shop-banner.jpg"
        alt="Luxury Jewelry Banner"
        fill
        priority
        className="object-cover opacity-65"
      />

      {/* Dark Overlay with subtle gold radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 10%, var(--bg-base) 90%), rgba(8, 8, 8, 0.45)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.5em] font-semibold" style={{ color: "#C8A96A" }}>
          ✦ Premium Collection
        </p>

        <h1 className="mb-4 text-4xl font-bold md:text-6xl tracking-wide text-white" style={{ fontFamily: "var(--font-playfair)" }}>
          Luxella Atelier
        </h1>

        <p className="max-w-lg text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Indulge in our selection of carefully curated premium artificial jewelry.
        </p>

        {/* Breadcrumb */}
        <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          <Link
            href="/"
            className="transition hover:text-white"
          >
            Home
          </Link>

          <span>/</span>

          <span className="text-[#C8A96A]">
            Shop
          </span>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="gold-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}