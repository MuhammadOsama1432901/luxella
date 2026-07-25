import { FREE_DELIVERY_THRESHOLD, RETURN_POLICY_DAYS, SUPPORT_HOURS } from "@/constants/business";

export default function Features() {
  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="#C8A96A" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="1" y="8" width="6" height="8" rx="1" stroke="#C8A96A" strokeWidth="1.6" fill="none" />
          <circle cx="20" cy="12" r="3" stroke="#C8A96A" strokeWidth="1.6" fill="none" />
        </svg>
      ),
      title: "Free Delivery",
      text: `On orders above PKR ${FREE_DELIVERY_THRESHOLD.toLocaleString()}`,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3 6.5h7l-5.5 4 2 6.5L12 15l-6.5 4 2-6.5L2 8.5h7L12 2z"
            stroke="#C8A96A" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
        </svg>
      ),
      title: "Premium Quality",
      text: "Hand-inspected hypoallergenic metals",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" stroke="#C8A96A" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M21 3v5h-5" stroke="#C8A96A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" stroke="#C8A96A" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M3 21v-5h5" stroke="#C8A96A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Easy Returns",
      text: `${RETURN_POLICY_DAYS}-day hassle-free returns`,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
            stroke="#C8A96A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
      ),
      title: "Expert Support",
      text: SUPPORT_HOURS,
    },
  ];

  return (
    <section className="py-6 relative" style={{ background: "var(--bg-surface)" }}>
      {/* Top/bottom gold lines */}
      <div className="gold-divider absolute top-0 left-0 right-0" />
      <div className="gold-divider absolute bottom-0 left-0 right-0" />

      {/* 2x2 compact grid — ideal for 430px container */}
      <div className="grid grid-cols-2 divide-x divide-y" style={{ borderColor: "rgba(200,169,106,0.12)" }}>
        {features.map((f, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center px-4 py-5 gap-2"
            style={{ borderColor: "rgba(200,169,106,0.12)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(200,169,106,0.08)",
                border: "1px solid rgba(200,169,106,0.2)",
              }}
            >
              {f.icon}
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
              {f.title}
            </h3>
            <p className="text-[9px] leading-snug" style={{ color: "var(--text-muted)" }}>
              {f.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}