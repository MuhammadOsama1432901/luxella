export default function AboutStory() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Image side */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#C8A96A] rounded-2xl" />
          <div className="relative rounded-2xl overflow-hidden bg-[#F8F5F2] aspect-[4/5] flex items-center justify-center">
            {/* Decorative jewelry SVG placeholder */}
            <svg
              viewBox="0 0 300 350"
              className="w-4/5 opacity-30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="150"
                cy="120"
                r="80"
                stroke="#C8A96A"
                strokeWidth="3"
              />
              <circle
                cx="150"
                cy="120"
                r="50"
                stroke="#C8A96A"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
              <circle cx="150" cy="120" r="15" fill="#C8A96A" opacity="0.6" />
              <line
                x1="150"
                y1="200"
                x2="150"
                y2="300"
                stroke="#C8A96A"
                strokeWidth="3"
              />
              <ellipse
                cx="150"
                cy="310"
                rx="40"
                ry="20"
                stroke="#C8A96A"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute inset-0 flex items-end p-8">
              <div className="bg-white/90 backdrop-blur rounded-xl p-4 w-full">
                <p className="text-xs text-[#C8A96A] uppercase tracking-widest font-medium mb-1">
                  Est. 2022
                </p>
                <p className="text-gray-800 font-semibold text-sm">
                  Lahore, Pakistan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Text side */}
        <div>
          <p className="text-[#C8A96A] uppercase tracking-[0.3em] text-xs font-medium mb-4">
            How We Started
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#111] leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            A Dream Forged in{" "}
            <span className="text-[#C8A96A]">Gold</span>
          </h2>

          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>
              Luxella was founded by a passionate designer who believed that
              luxury should be accessible. Growing up surrounded by the rich
              craft tradition of Lahore, she saw how beautiful jewelry could
              transform a person's confidence and presence.
            </p>
            <p>
              In 2022, with a small workshop and a big dream, we began creating
              artificial jewelry that doesn't compromise on beauty, quality, or
              style. Every piece is thoughtfully designed to replicate the look
              of fine jewelry at a fraction of the cost.
            </p>
            <p>
              Today, Luxella serves thousands of customers across Pakistan and
              beyond — from brides seeking the perfect bridal set, to working
              women wanting everyday elegance.
            </p>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="w-12 h-[2px] bg-[#C8A96A]" />
            <p className="text-sm text-[#C8A96A] italic font-medium">
              "Luxury is not a privilege, it's a feeling."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
