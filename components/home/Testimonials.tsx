"use client";

import { useEffect, useState } from "react";

interface Review {
  name: string;
  review: string;
  rating?: number;
  product?: string;
}

const FALLBACK_REVIEWS: Review[] = [
  {
    name: "Hadiqa Ali",
    review: "Very classy drop earrings! The synthetic emerald stones stand out beautifully and look so premium.",
    rating: 5,
    product: "Elegant Earrings"
  },
  {
    name: "Amna Javed",
    review: "The packaging felt extremely premium. Excellent support from their stylists too! Will order again.",
    rating: 5,
    product: "Luxury Gold Necklace"
  },
  {
    name: "Sarah Ahmed",
    review: "Amazing quality! Looks even better in real life. The virtual try-on tool is incredibly accurate.",
    rating: 5,
  },
  {
    name: "Zara Malik",
    review: "Ordered the bridal set for my nikah — it was absolutely stunning. Every guest complimented it!",
    rating: 5,
    product: "Bridal Kundan Set"
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);

  useEffect(() => {
    async function fetchApprovedReviews() {
      try {
        const res = await fetch("/api/admin?tab=reviews");
        if (!res.ok) return;
        const data = await res.json();
        const approved: Review[] = (data.reviews || [])
          .filter((r: { status: string }) => r.status === "approved")
          .slice(0, 6)
          .map((r: { customerName?: string; name?: string; comment?: string; review?: string; rating?: number; productName?: string }) => ({
            name: r.customerName || r.name || "Customer",
            review: r.comment || r.review || "",
            rating: r.rating || 5,
            product: r.productName,
          }));
        if (approved.length >= 3) setReviews(approved);
      } catch {
        // Keep fallback reviews
      }
    }
    fetchApprovedReviews();
  }, []);

  return (
    <section className="py-10 relative overflow-hidden" style={{ background: "var(--bg-surface)" }}>
      {/* Top/bottom gold borders */}
      <div className="gold-divider absolute top-0 left-0 right-0" />
      <div className="gold-divider absolute bottom-0 left-0 right-0" />

      <div className="relative z-10">
        {/* Header */}
        <div className="px-4 mb-6">
          <p className="text-[9px] uppercase tracking-[0.35em] font-bold text-[#C8A96A] mb-1">
            ✦ Customer Love
          </p>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            What Our Customers Say
          </h2>
        </div>

        {/* Horizontal scroll carousel of review cards */}
        <div className="flex gap-4 overflow-x-auto scrollbar-none px-4 pb-2">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[260px] p-5 rounded-2xl border flex flex-col justify-between"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "rgba(200,169,106,0.15)",
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill={i < (review.rating ?? 5) ? "#C8A96A" : "transparent"}
                    stroke="#C8A96A"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2l3 6.5h7l-5.5 4 2 6.5-6.5-4-6.5 4 2-6.5L2 8.5h7L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[11px] leading-relaxed italic flex-grow" style={{ color: "var(--text-secondary)" }}>
                &ldquo;{review.review}&rdquo;
              </p>

              {/* Attribution */}
              <div className="mt-4 pt-3 border-t" style={{ borderColor: "rgba(200,169,106,0.1)" }}>
                <p className="text-[10px] font-bold text-white tracking-wider uppercase">
                  {review.name}
                </p>
                {review.product && (
                  <p className="text-[9px] text-[#C8A96A] mt-0.5">{review.product}</p>
                )}
                <p className="text-[9px] text-stone-600 uppercase tracking-widest mt-0.5">✓ Verified Buyer</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}