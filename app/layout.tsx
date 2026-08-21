import type { Metadata } from "next";
import "./globals.css";
import {
  SITE_URL,
  SEO_TITLE,
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  FLORIDA_CITIES,
  THAILAND_CITIES,
  TT_CITIES,
} from "../lib/markets";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_TITLE,
    template: "%s · Collin M. Forde",
  },
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Collin M. Forde" }, { name: "Apex Executive Studio" }],
  creator: "Apex Executive Studio / Paul Destocki",
  publisher: "Collin M. Forde",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    siteName: "Collin M. Forde — International Realtor",
    locale: "en_US",
    images: [{ url: `${SITE_URL}/api/portrait`, width: 600, height: 600, alt: "Collin M. Forde" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
  },
  category: "real estate",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Collin M. Forde",
  alternateName: "Mr. Real Estate",
  url: SITE_URL,
  telephone: "+1-321-208-2111",
  email: "collin.forde.international@gmail.com",
  image: `${SITE_URL}/api/portrait`,
  priceRange: "$$",
  openingHours: "Mo-Fr 09:00-17:00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "260 1st Ave S",
    addressLocality: "St. Petersburg",
    addressRegion: "FL",
    postalCode: "33701",
    addressCountry: "US",
  },
  areaServed: [
    ...FLORIDA_CITIES.map((name) => ({ "@type": "City", name, containedInPlace: "Florida, USA" })),
    ...THAILAND_CITIES.map((name) => ({ "@type": "City", name, containedInPlace: "Thailand" })),
    ...TT_CITIES.map((name) => ({ "@type": "City", name, containedInPlace: "Trinidad and Tobago" })),
  ],
  memberOf: {
    "@type": "Organization",
    name: "Dalton Wade Real Estate Group",
  },
  identifier: "Florida license SL3058438",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#081820" />
        <meta name="geo.region" content="US-FL" />
        <meta name="geo.placename" content="Florida; Thailand; Trinidad and Tobago" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
