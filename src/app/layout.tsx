import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CampusProvider } from "@/context/CampusContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CampusExchange — Don't Buy For 4 Years. Rent, Exchange & Reuse.",
  description:
    "A verified student-only marketplace to buy, sell, rent, borrow and exchange academic materials, clothing, electronics and more on campus.",
  keywords: [
    "campus exchange",
    "student marketplace",
    "peer to peer rental",
    "textbook exchange",
    "borrow calculator",
    "campus circular economy",
  ],
  authors: [{ name: "CampusExchange" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${outfit.variable} min-h-screen bg-[#fff5f7] text-slate-800 antialiased`}
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
      >
        <CampusProvider>
          {children}
        </CampusProvider>
      </body>
    </html>
  );
}

