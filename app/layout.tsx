import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collin M. Forde — International Realtor",
  description: "Collin M. Forde — Mr. Real Estate. Property without borders across Florida, Thailand, Trinidad & Tobago, and international markets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#081820" />
      </head>
      <body>{children}</body>
    </html>
  );
}
