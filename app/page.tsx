"use client";
import { useEffect, useState, FormEvent } from "react";
import Globe from "./Globe";
import ContactIcons from "./ContactIcons";
import { LISTINGS } from "../lib/data";

const PRIMARY = "collin.forde.international@gmail.com";
const CC = "CollinsellsFlorida@gmail.com";
const PORTRAIT = "/api/portrait?v=5";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

function labelTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

async function dualEmail(subject: string, fields: Record<string, string>) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(PRIMARY)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ _subject: subject, _template: "table", _cc: CC, _captcha: "false", ...fields }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok || data.success === true || data.success === "true") return data;
  if (typeof data.message === "string" && /confirm|email/i.test(data.message)) return data;
  const r2 = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
  const d2 = await r2.json().catch(() => ({}));
  if (d2.ok) return d2;
  throw new Error(data.message || "Send failed — call (321) 208-2111");
}

function calendarAddLink(name: string, date: string, time: string, notes: string) {
  const start = new Date(`${date}T${(time || "12:00").slice(0, 5)}:00-04:00`);
  if (Number.isNaN(start.getTime())) return "";
  const end = new Date(start.getTime() + 45 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `Real estate viewing / call with Collin Forde — ${name}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Client: ${name}\nNotes: ${notes || "none"}\nCollin: (321) 208-2111`,
    location: "Phone / Google Meet / property",
    add: `${PRIMARY},${CC}`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

const MARKETS = [
  { src: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&q=75", alt: "West Palm Beach, Florida", coord: "26.82°N · 80.14°W", h: "Florida Real Estate", p: "Home base — residential, investment, and relocation across Palm Beach County and beyond." },
  { src: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=800&q=75", alt: "Thailand", coord: "7.88°N · 98.39°E", h: "Thailand Real Estate", p: "Investment and vacation property in Southeast Asia." },
  { src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=75", alt: "Tobago", coord: "10.65°N · 61.52°W", h: "Trinidad & Tobago Real Estate", p: "Caribbean residential and land for clients with ties to the twin islands." },
];

export default function Page() {
  const [inq, setInq] = useState("");
  const [sch, setSch] = useState("");
  const [cal, setCal] = useState("");
  const [addLink, setAddLink] = useState("");

  useEffect(() => {
    fetch("/api/config").then((r) => r.json()).then((d) => { if (d.calendarUrl) setCal(d.calendarUrl); }).catch(() => {});
  }, []);

  async function onInq(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInq("Sending…");
    const f = new FormData(e.currentTarget);
    try {
      await dualEmail(`Real Estate Inquiry from ${f.get("name")}`, {
        name: String(f.get("name")), email: String(f.get("email")), phone: String(f.get("phone") || ""),
        market: String(f.get("market") || ""), message: String(f.get("message")), type: "inquiry",
      });
      setInq("Sent to both of Collin's inboxes. He usually replies within one business day.");
      e.currentTarget.reset();
    } catch (err: any) { setInq(err.message); }
  }

  async function onSch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSch("Sending…");
    setAddLink("");
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name"));
    const date = String(f.get("date"));
    const time = String(f.get("time"));
    const notes = String(f.get("notes") || "");
    const body = { name, email: String(f.get("email")), date, time, notes };
    try {
      const r = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!d.ok) await dualEmail(`Real estate viewing / call from ${name}`, body as any);
      const link = d.calendarLink || calendarAddLink(name, date, time, notes);
      setAddLink(link);
      setSch("Request sent to both inboxes. Add it to Google Calendar below — Collin will confirm.");
      e.currentTarget.reset();
    } catch (err: any) { setSch(err.message); }
  }

  return (
    <>
      <nav>
        <div className="nav-mark">Collin M. <span>Forde</span></div>
        <div className="nav-links">
          <a href="#real-estate">Real Estate</a>
          <a href="#markets">Markets</a>
          <a href="#listings">Listings</a>
          <a href="#calendar">Calendar</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-call" href="tel:+13212082111">(321) 208-2111</a>
      </nav>

      <section className="hero">
        <Globe />
        <div className="hero-content">
          <div className="eyebrow">International Real Estate</div>
          <h1>REAL ESTATE<br />without <em>borders.</em></h1>
          <div className="hero-cta">
            <a className="btn btn-primary" href="tel:+13212082111">Call about real estate</a>
            <div className="hero-cta-row"><ContactIcons /></div>
          </div>
          <p className="lede">Collin M. Forde — Mr. Real Estate — Florida, Thailand, Trinidad &amp; Tobago. Buy. Sell. Invest. One advisor. No borders.</p>
        </div>
      </section>

      <section id="real-estate">
        <div className="section-head">
          <div className="eyebrow">The Practice</div>
          <h2>Mr. Real Estate.</h2>
        </div>
        <div className="about-grid">
          <div className="about-body">
            <p>This is a real estate practice. Houses, condos, land, relocations, and cross-border investment property. Twenty-plus years. Florida license first. International clients second.</p>
            <p>License <strong>#SL3058438</strong>. All U.S. real estate is sold through <strong>Dalton Wade Real Estate Group</strong>.</p>
          </div>
          <div>
            <div className="portrait">
              <img src={PORTRAIT} alt="Collin M. Forde — Real Estate" width={480} height={480} />
            </div>
          </div>
        </div>
      </section>

      <section id="markets">
        <div className="section-head">
          <div className="eyebrow">Where the real estate lives</div>
          <h2>A portfolio that spans oceans.</h2>
        </div>
        <div className="market-grid">
          {MARKETS.map((m) => (
            <div className="card" key={m.h}>
              <div className="market-scene">
                <img src={m.src} alt={m.alt} loading="lazy" />
              </div>
              <div className="card-body">
                <span className="coord">{m.coord}</span>
                <h3>{m.h}</h3>
                <p>{m.p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="listings">
        <div className="section-head">
          <div className="eyebrow">Featured Real Estate</div>
          <h2>Inventory style. Live availability on request.</h2>
        </div>
        <div className="market-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          {LISTINGS.map((l) => (
            <article className="card" key={l.id}>
              <div className="market-scene">
                <img src={l.img} alt={`${l.title} — real estate`} loading="lazy" />
              </div>
              <div className="card-body">
                <span className="coord">{l.city} · {l.status}</span>
                <h3>{l.title}</h3>
                <p>{l.price} · {l.beds} bd · {l.baths} ba · {l.sqft} sf</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="calendar">
        <div className="section-head">
          <div className="eyebrow">Google Calendar</div>
          <h2>Book a real estate viewing.</h2>
          {cal ? <p style={{ marginTop: 16 }}><a className="btn btn-primary" href={cal} target="_blank" rel="noreferrer">Open live availability</a></p> : null}
        </div>
        <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="card"><div className="card-body">
            <form onSubmit={onSch}>
              <div className="field-row">
                <label>Name<input name="name" required /></label>
                <label>Email<input name="email" type="email" required /></label>
              </div>
              <div className="field-row">
                <label>Preferred date<input name="date" type="date" required /></label>
                <label>Preferred time
                  <select name="time" required defaultValue="">
                    <option value="" disabled>Select 9 AM – 5 PM</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{labelTime(t)}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label>Notes<textarea name="notes" rows={3} /></label>
              <button className="btn btn-primary" type="submit">Request this time</button>
              <p className="status">{sch}</p>
              {addLink ? <p className="status"><a className="btn btn-ghost" href={addLink} target="_blank" rel="noreferrer">Add to Google Calendar</a></p> : null}
            </form>
          </div></div>
        </div>
      </section>

      <section id="contact">
        <div className="section-head">
          <div className="eyebrow">Get In Touch</div>
          <h2>Let&apos;s talk real estate.</h2>
        </div>
        <div className="contact-wrap">
          <div className="contact-left">
            <p className="lede">Florida, Thailand, Trinidad &amp; Tobago — Collin is a call away.</p>
            <div className="cta-stack">
              <a className="btn btn-primary" href="tel:+13212082111">Call (321) 208-2111</a>
              <ContactIcons />
            </div>
          </div>
          <div className="card"><div className="card-body">
            <form onSubmit={onInq}>
              <div className="field-row">
                <label>Name<input name="name" required /></label>
                <label>Email<input name="email" type="email" required /></label>
              </div>
              <div className="field-row">
                <label>Phone<input name="phone" type="tel" /></label>
                <label>Market
                  <select name="market">
                    <option>Florida real estate</option>
                    <option>Thailand real estate</option>
                    <option>Trinidad & Tobago real estate</option>
                    <option>Other / International real estate</option>
                  </select>
                </label>
              </div>
              <label>Message<textarea name="message" rows={4} required /></label>
              <button className="btn btn-primary" type="submit">Send Inquiry</button>
              <p className="status">{inq}</p>
            </form>
          </div></div>
        </div>
      </section>

      <footer>
        REAL ESTATE · Collin M. Forde · License #SL3058438 · Dalton Wade Real Estate Group
        <br />(321) 208-2111 · Mon–Fri 9:00 AM – 5:00 PM Eastern
      </footer>
    </>
  );
}
