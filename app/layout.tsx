import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/Providers";

const playfair = { variable: "font-playfair" };
const poppins = { variable: "font-poppins" };

export const metadata: Metadata = {
  title: "Luxella | Premium Artificial Jewelry in Pakistan – Bridal & Party Wear",
  description:
    "Shop Pakistan's finest hand-crafted artificial jewelry for weddings, bridal events, and party wear. Perfected with 24K gold plating and premium zirconia stones. COD & Express Shipping across Pakistan.",
  keywords: [
    "Artificial Jewelry Pakistan",
    "Bridal Jewelry Pakistan",
    "Wedding Jewelry Sets",
    "Gold Plated Jewelry Pakistan",
    "Buy Kundan Sets Lahore",
    "Premium Rings & Earrings Pakistan",
    "Luxella PK",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var saved = localStorage.getItem('theme');
                var theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}