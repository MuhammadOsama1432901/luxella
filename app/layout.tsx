import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/Providers";

const playfair = { variable: "font-playfair" };
const poppins = { variable: "font-poppins" };

export const metadata: Metadata = {
  title: "Luxella | Premium Artificial Jewelry",
  description:
    "Luxury artificial jewelry crafted for elegance. Shop premium necklaces, earrings, rings and bracelets.",
  keywords: [
    "Artificial Jewelry",
    "Luxury Jewelry",
    "Necklace",
    "Ring",
    "Bracelet",
    "Pakistan",
    "Fashion",
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