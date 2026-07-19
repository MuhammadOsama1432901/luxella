import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Luxella — We'd Love to Hear from You",
  description:
    "Get in touch with Luxella. Visit our showroom at Factory No 51, Model Town, Islamabad or reach us via email and phone.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative bg-[#111] text-white py-20 px-6 text-center overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(200,169,106,0.15) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-[#C8A96A] uppercase tracking-[0.35em] text-xs font-medium mb-4">
              ✦ Get In Touch
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              We&apos;d Love to{" "}
              <span className="text-[#C8A96A]">Hear from You</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Whether you have a question about our collection, need styling
              advice, or want to place a custom order — our team is here for
              you.
            </p>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
