const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Unique Designs" },
  { value: "4.9★", label: "Average Rating" },
  { value: "3+", label: "Years of Craft" },
];

export default function AboutStats() {
  return (
    <section className="bg-[#C8A96A] py-16 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="group">
            <p
              className="text-4xl md:text-5xl font-bold text-[#111] mb-2 transition-transform duration-300 group-hover:scale-110"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {stat.value}
            </p>
            <p className="text-sm uppercase tracking-widest text-[#111]/70 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
