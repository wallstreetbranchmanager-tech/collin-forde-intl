"use client";
import { useEffect, useState, FormEvent } from "react";
import Globe from "./Globe";

const PRIMARY = "CollinsellsFlorida@gmail.com";
const CC = "collin.forde.international@gmail.com";
const PORTRAIT = "https://lh3.googleusercontent.com/d/1G8w94ZoNhGcZWdbIS7cxRZHCk2Oh-hKP=w1000";

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
    text: `Viewing / call with Collin Forde — ${name}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Client: ${name}\nNotes: ${notes || "none"}\nCollin: (321) 208-2111`,
    location: "Phone / Google Meet / property",
    add: `${PRIMARY},${CC}`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

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
      await dualEmail(`Property Inquiry from ${f.get("name")}`, {
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
      if (!d.ok) await dualEmail(`Viewing / Call from ${name}`, body as any);
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
          <a href="#about">About</a>
          <a href="#calendar">Calendar</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-call" href="tel:+13212082111">(321) 208-2111</a>
      </nav>

      <section className="hero">
        <Globe />
        <div className="hero-content">
          <div className="eyebrow">International Real Estate</div>
          <h1>Property<br />without <em>borders.</em></h1>
          <a className="btn btn-primary" href="#calendar">Book a viewing</a>
          <p className="lede">Collin M. Forde — Mr. Real Estate — Florida, Thailand, Trinidad &amp; Tobago, and international clients. One advisor. No borders.</p>
        </div>
      </section>

      <section id="about">
        <div className="section-head">
          <div className="eyebrow">The Advisor</div>
          <h2>Mr. Real Estate.</h2>
        </div>
        <div className="about-grid">
          <div className="about-body">
            <p>What started as a Florida practice has grown into an international one — buyers and sellers now reach him from the Caribbean to Southeast Asia, drawn by the same thing: a realtor who actually picks up, follows through, and treats every transaction like it is the only one that matters.</p>
            <p>License <strong>#SL3058438</strong>. All U.S. properties are sold through <strong>Dalton Wade Real Estate Group</strong>. International work is coordinated the same way Collin works at home — personally, directly, and without a runaround.</p>
          </div>
          <div>
            <div className="portrait">
              <img src={PORTRAIT} alt="Collin M. Forde — Mr. Real Estate" onError={(e) => { (e.target as HTMLImageElement).src = "/collin-portrait.jpg"; }} />
            </div>
            <div className="stats">
              <div><div className="num">SL3058438</div><div className="label">Florida license</div></div>
              <div><div className="num">24h</div><div className="label">Typical follow-up</div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="calendar">
        <div className="section-head">
          <div className="eyebrow">Google Calendar</div>
          <h2>Book a viewing.</h2>
          <p className="lede" style={{ marginTop: 12 }}>Pick a date and time. The request hits both of Collin&apos;s inboxes and you can drop it straight onto Google Calendar.</p>
          {cal ? (
            <p style={{ marginTop: 16 }}>
              <a className="btn btn-primary" href={cal} target="_blank" rel="noreferrer">Open live availability</a>
            </p>
          ) : null}
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
                <label>Preferred time<input name="time" type="time" required /></label>
              </div>
              <label>Notes<textarea name="notes" rows={3} placeholder="Time zone, property, phone, anything else" /></label>
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
          <h2>Let&apos;s talk property.</h2>
        </div>
        <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="card"><div className="card-body">
            <div className="eyebrow">Send An Inquiry</div>
            <h3 style={{ margin: "0.6rem 0 1rem" }}>Tell him what you&apos;re looking for.</h3>
            <form onSubmit={onInq}>
              <div className="field-row">
                <label>Name<input name="name" required /></label>
                <label>Email<input name="email" type="email" required /></label>
              </div>
              <div className="field-row">
                <label>Phone<input name="phone" type="tel" /></label>
                <label>Market<select name="market"><option>Florida</option><option>Thailand</option><option>Trinidad &amp; Tobago</option><option>Other / International</option></select></label>
              </div>
              <label>Message<textarea name="message" rows={4} required placeholder="What are you looking to buy, sell, or invest in?" /></label>
              <button className="btn btn-primary" type="submit">Send Inquiry</button>
              <p className="status">{inq}</p>
            </form>
          </div></div>
        </div>
      </section>

      <footer>
        Collin M. Forde — Mr. Real Estate · License #SL3058438 · Dalton Wade Real Estate Group (CQ1047837)
        <br />Created by Apex Executive Studio / Paul Destocki 2026
        <br />Forms deliver to CollinsellsFlorida@gmail.com and collin.forde.international@gmail.com
      </footer>
    </>
  );
}
