const values = [
  {
    icon: "✦",
    title: "Timeless Design",
    description:
      "Every piece is crafted to be worn for years, not seasons. We blend classic elegance with modern sensibility.",
  },
  {
    icon: "♛",
    title: "Premium Quality",
    description:
      "We use only high-grade materials — hypoallergenic metals, premium zirconia stones, and durable gold/silver plating.",
  },
  {
    icon: "♻",
    title: "Affordable Luxury",
    description:
      "Beautiful jewelry shouldn't break the bank. We offer couture-inspired designs at prices everyone can celebrate.",
  },
  {
    icon: "❤",
    title: "Made with Love",
    description:
      "Each piece is inspected by hand before shipping. We treat every order as if it were our own.",
  },
  {
    icon: "✈",
    title: "Fast Delivery",
    description:
      "We ship all across Pakistan within 3-5 business days, with careful packaging to ensure your jewelry arrives pristine.",
  },
  {
    icon: "✿",
    title: "Customer First",
    description:
      "Not satisfied? We offer hassle-free returns and exchanges. Your happiness is our only measure of success.",
  },
];

export default function AboutValues() {
  return (
    <section className="py-24 px-6 bg-[#F8F5F2]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C8A96A] uppercase tracking-[0.3em] text-xs font-medium mb-4">
            What We Stand For
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#111]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Our Core Values
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-transparent hover:border-[#C8A96A]/30"
            >
              <span className="text-3xl text-[#C8A96A] block mb-5 group-hover:scale-110 transition-transform duration-300 origin-left">
                {v.icon}
              </span>
              <h3
                className="text-xl font-bold text-[#111] mb-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {v.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
