import type { Metadata } from "next";
import "./globals.css";
import { AGENT } from "@/lib/data";

export const metadata: Metadata = {
  title: "Collin Forde International | Florida & Caribbean Real Estate",
  description:
    "Collin Forde, ABR — 20 years helping buyers and sellers across Tampa Bay, St. Petersburg, and the Caribbean. License SL3058438.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav>
          <a className="brand" href="/">
            Collin <span>Forde</span>
          </a>
          <div className="links">
            <a href="/#markets">Markets</a>
            <a href="/listings">Listings</a>
            <a href="/book">Book a viewing</a>
            <a href="/#contact">Contact</a>
          </div>
          <a className="cta" href={`tel:+1${AGENT.phone}`}>
            Call {AGENT.phonePretty}
          </a>
        </nav>
        {children}
        <footer>
          <div className="wrap">
            {AGENT.name} · {AGENT.title} · License {AGENT.license} · {AGENT.brokerage}
            <br />
            {AGENT.address} · {AGENT.email}
            <br />
            Equal Housing Opportunity. This is not an MLS feed. Featured homes are examples until live inventory is connected.
          </div>
        </footer>
      </body>
    </html>
  );
}
