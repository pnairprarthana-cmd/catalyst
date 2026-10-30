import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
        className={`${inter.variable} min-h-screen bg-[#f8fafc] text-slate-800 antialiased`}
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
