export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#111] text-white py-32 px-6">
      {/* Background gradient circles */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, #C8A96A 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-[#C8A96A] uppercase tracking-[0.3em] text-sm font-medium mb-6">
          Our Story
        </p>
        <h1
          className="text-5xl md:text-7xl font-bold leading-tight mb-8"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Crafted for the{" "}
          <span className="text-[#C8A96A]">Modern Woman</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Luxella was born from a simple belief — that every woman deserves to
          feel like royalty, without compromise. We create premium artificial
          jewelry that blends timeless elegance with contemporary design.
        </p>

        <div className="mt-12 flex justify-center">
          <div className="w-16 h-[2px] bg-[#C8A96A]" />
        </div>
      </div>
    </section>
  );
}
