"use client";

import { useEffect, useState } from "react";

interface Review {
  name: string;
  review: string;
  rating?: number;
  product?: string;
}

// Fallback data shown while loading or if no approved reviews exist
const FALLBACK_REVIEWS: Review[] = [
  {
    name: "Hadiqa Ali",
    review:
      "Very classy drop earrings! The synthetic emerald stones stand out beautifully and look so premium.",
    rating: 5,
    product: "Elegant Earrings"
  },
  {
    name: "Amna Javed",
    review:
      "The details are exquisite, and the packaging felt extremely premium. Excellent support from their stylists too!",
    rating: 5,
    product: "Luxury Gold Necklace"
  },
  {
    name: "Sarah Ahmed",
    review:
      "Amazing quality! It looks even better in real life. The virtual try-on tool is incredibly helpful and accurate.",
    rating: 5,
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
        if (approved.length >= 3) {
          setReviews(approved);
        }
      } catch {
        // Keep fallback reviews
      }
    }
    fetchApprovedReviews();
  }, []);

  return (
    <section className="py-14 relative overflow-hidden" style={{ background: "var(--bg-surface)" }}>
      {/* Top and Bottom Borders */}
      <div className="gold-divider absolute top-0 left-0 right-0" />
      <div className="gold-divider absolute bottom-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.5em] font-semibold mb-4" style={{ color: "#C8A96A" }}>
            ✦ Customer Love
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            What Our Customers Say
          </h2>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.slice(0, 6).map((review, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl flex flex-col justify-between group border border-[rgba(200,169,106,0.12)] hover:border-[#C8A96A]/40 hover:-translate-y-1.5"
              style={{ background: "var(--bg-elevated)" }}
            >
              <div>
                {/* Star rating */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={i < (review.rating ?? 5) ? "#C8A96A" : "transparent"}
                      stroke="#C8A96A"
                      strokeWidth="1.5"
                    >
                      <path d="M12 2l3 6.5h7l-5.5 4 2 6.5-6.5-4-6.5 4 2-6.5L2 8.5h7L12 2z" />
                    </svg>
                  ))}
                </div>

                <p
                  className="text-sm leading-relaxed mb-6 italic"
                  style={{ color: "var(--text-secondary)" }}
                >
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>

              <div>
                <div className="gold-divider w-12 mb-4 opacity-50" />
                <h3
                  className="font-bold text-sm tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  {review.name}
                </h3>
                {review.product && (
                  <p className="text-[10px] mt-0.5" style={{ color: "#C8A96A" }}>
                    {review.product}
                  </p>
                )}
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Verified Buyer</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}