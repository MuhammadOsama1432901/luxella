const team = [
  {
    name: "Aisha Malik",
    role: "Founder & Creative Director",
    initials: "AM",
    bio: "Jewelry designer with 8+ years of experience in traditional and modern Pakistani craftsmanship.",
  },
  {
    name: "Zara Khan",
    role: "Head of Design",
    initials: "ZK",
    bio: "Award-winning designer who brings international fashion trends to our local collections.",
  },
  {
    name: "Fatima Noor",
    role: "Customer Experience Lead",
    initials: "FN",
    bio: "Passionate about creating exceptional shopping experiences and building lasting customer relationships.",
  },
];

export default function AboutTeam() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C8A96A] uppercase tracking-[0.3em] text-xs font-medium mb-4">
            The People Behind
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#111]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Meet Our Team
          </h2>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {team.map((member) => (
            <div key={member.name} className="text-center group">
              {/* Avatar */}
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="absolute inset-0 rounded-full bg-[#C8A96A]/20 scale-110 group-hover:scale-125 transition-transform duration-500" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#C8A96A] to-[#8B6914] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {member.initials}
                </div>
              </div>

              <h3
                className="text-xl font-bold text-[#111] mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {member.name}
              </h3>
              <p className="text-[#C8A96A] text-xs uppercase tracking-widest font-medium mb-4">
                {member.role}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                {member.bio}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 bg-[#111] rounded-3xl p-12 text-center text-white">
          <h3
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to experience Luxella?
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Browse our exclusive collection and find the piece that speaks to
            your soul.
          </p>
          <a
            href="/shop"
            className="inline-block bg-[#C8A96A] text-[#111] font-semibold px-10 py-4 rounded-full hover:bg-[#b8944f] transition-colors duration-300 uppercase tracking-widest text-sm"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
}
