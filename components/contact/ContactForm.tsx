"use client";

import { useState } from "react";

// ── Info cards data ────────────────────────────────────────────────────────────
const INFO = [
  {
    id: "location",
    label: "Showroom",
    value: "Factory No 51, Model Town",
    sub: "Islamabad, Pakistan",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#C8A96A]">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.12" strokeLinejoin="round"/>
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
    action: {
      label: "Get Directions",
      href: "https://maps.google.com/?q=Model+Town+Islamabad",
    },
  },
  {
    id: "email",
    label: "Email Us",
    value: "osamaafzal1432901@gmail.com",
    sub: "We reply within 24 hours",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#C8A96A]">
        <rect x="2" y="4" width="20" height="16" rx="3"
          stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08"/>
        <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    action: {
      label: "Send Email",
      href: "mailto:osamaafzal1432901@gmail.com",
    },
  },
  {
    id: "phone",
    label: "Call / Message",
    value: "+92 349 5804586",
    sub: "Mon – Sat · 10AM – 8PM",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#C8A96A]">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          fill="currentColor" fillOpacity="0.08"/>
      </svg>
    ),
    action: {
      label: "Call Now",
      href: "tel:+923495804586",
    },
  },
  {
    id: "hours",
    label: "Opening Hours",
    value: "Mon – Saturday",
    sub: "10:00 AM – 8:00 PM",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#C8A96A]">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.08"/>
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    action: null,
  },
];

// ── Form ───────────────────────────────────────────────────────────────────────
export default function ContactForm() {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    // Simulate sending (replace with real API call if needed)
    await new Promise((r) => setTimeout(r, 1800));
    setStatus("sent");
  }

  return (
    <section style={{ background: "var(--bg-base)" }} className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Info Cards Row ──────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {INFO.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl p-6 shadow-sm flex flex-col gap-4 transition-all duration-300 hover:shadow-2xl"
              style={{ background:"var(--bg-elevated)", border:"1px solid rgba(200,169,106,0.15)" }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#C8A96A18,#8B691418)", border: "1px solid #C8A96A33" }}
              >
                {item.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-[#C8A96A] font-semibold mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-bold text-[#111] leading-snug break-all">{item.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
              </div>

              {/* CTA */}
              {item.action && (
                <a
                  href={item.action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#C8A96A] hover:text-[#8B6914] flex items-center gap-1 transition-colors"
                >
                  {item.action.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* ── Main Content: Form + Map ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-10">

          {/* FORM */}
          <div style={{ background:"var(--bg-elevated)", border:"1px solid rgba(200,169,106,0.15)" }} className="rounded-3xl p-8 shadow-sm">
            <h2
              className="text-2xl font-bold text-[#111] mb-1"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Send Us a Message
            </h2>
            <p className="text-sm mb-8" style={{ color:"var(--text-secondary)" }}>
              Fill in the form and we&apos;ll get back to you within 24 hours.
            </p>

            {status === "sent" ? (
              <div className="text-center py-16">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#111] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                  Message Sent!
                </h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">
                  Thank you for reaching out. Our team will reply to{" "}
                  <span className="text-[#C8A96A] font-medium">{form.email}</span> within 24 hours.
                </p>
                <button
                  onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setStatus("idle"); }}
                  className="mt-6 text-xs font-semibold text-[#C8A96A] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Your Name *
                    </label>
                    <input
                      id="name" name="name" type="text"
                      value={form.name} onChange={handleChange}
                      required placeholder="e.g. Ayesha Khan"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/30 focus:border-[#C8A96A] transition-all bg-gray-50 placeholder-gray-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email" name="email" type="email"
                      value={form.email} onChange={handleChange}
                      required placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/30 focus:border-[#C8A96A] transition-all bg-gray-50 placeholder-gray-300"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <select
                    id="subject" name="subject"
                    value={form.subject} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/30 focus:border-[#C8A96A] transition-all bg-gray-50 text-gray-600"
                  >
                    <option value="">Select a topic…</option>
                    <option value="order">Order Enquiry</option>
                    <option value="product">Product Question</option>
                    <option value="return">Return / Exchange</option>
                    <option value="custom">Custom Order</option>
                    <option value="wholesale">Wholesale / Bulk</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message" name="message" rows={5}
                    value={form.message} onChange={handleChange}
                    required placeholder="Tell us how we can help you…"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96A]/30 focus:border-[#C8A96A] transition-all bg-gray-50 placeholder-gray-300 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-4 rounded-2xl text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-lg hover:scale-[1.01] active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                >
                  {status === "sending" ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.2"/>
                        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="white" fillOpacity="0.15"/>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: Map + Quick Info */}
          <div className="space-y-6">

            {/* Embedded Map */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100" style={{ height: "320px" }}>
              <iframe
                title="Luxella Showroom Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.5!2d73.0479!3d33.6844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQxJzA0LjAiTiA3M8KwMDInNTIuNCJF!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Address card */}
            <div
              className="rounded-3xl p-7 text-white"
              style={{ background: "linear-gradient(135deg, #111 0%, #1c1205 100%)" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      stroke="white" strokeWidth="1.8" fill="white" fillOpacity="0.2" strokeLinejoin="round"/>
                    <circle cx="12" cy="9" r="2.5" stroke="white" strokeWidth="1.8"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[#C8A96A] text-[10px] uppercase tracking-widest font-semibold mb-1">
                    Our Showroom
                  </p>
                  <p className="text-white font-bold text-lg leading-snug" style={{ fontFamily: "var(--font-playfair)" }}>
                    Factory No 51
                  </p>
                  <p className="text-gray-300 text-sm mt-0.5">Model Town, Islamabad</p>
                  <p className="text-gray-500 text-xs mt-2">Pakistan</p>
                  <a
                    href="https://maps.google.com/?q=Model+Town+Islamabad+Pakistan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-[#C8A96A] hover:text-white transition-colors"
                  >
                    Open in Google Maps
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ teaser */}
            <div style={{ background:"var(--bg-elevated)", border:"1px solid rgba(200,169,106,0.15)" }} className="rounded-3xl p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color:"#C8A96A" }}>Quick Answers</p>
              {[
                { q: "Do you take custom orders?", a: "Yes! Contact us with your design and we'll craft it for you." },
                { q: "How fast is delivery?", a: "3–5 business days across all of Pakistan." },
                { q: "Can I visit the showroom?", a: "Absolutely — we're open Mon–Sat, 10AM to 8PM." },
              ].map((faq) => (
                <details key={faq.q} className="group py-3" style={{ borderBottom:"1px solid rgba(200,169,106,0.1)" }}>
                  <summary className="text-sm font-semibold cursor-pointer list-none flex items-center justify-between gap-2" style={{ color:"var(--text-primary)" }}>
                    {faq.q}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      className="flex-shrink-0 group-open:rotate-180 transition-transform text-[#C8A96A]">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </summary>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color:"var(--text-secondary)" }}>{faq.a}</p>
                </details>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
