import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collin M. Forde — International Realtor",
  description:
    "Collin M. Forde — Mr. Real Estate. Property without borders across Florida, Thailand, Trinidad & Tobago, and international markets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
