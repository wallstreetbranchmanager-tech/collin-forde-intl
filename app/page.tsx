"use client";
import { useEffect, useState, FormEvent } from "react";
import Globe from "./Globe";

const PRIMARY = "CollinsellsFlorida@gmail.com";
const CC = "collin.forde.international@gmail.com";

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

export default function Page() {
  const [inq, setInq] = useState("");
  const [sch, setSch] = useState("");
  const [cal, setCal] = useState("");
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
    const f = new FormData(e.currentTarget);
    const body = {
      name: String(f.get("name")), email: String(f.get("email")),
      date: String(f.get("date")), time: String(f.get("time")), notes: String(f.get("notes") || ""),
    };
    try {
      const r = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!d.ok) await dualEmail(`Call Request from ${body.name}`, body as any);
      setSch("Request sent to both inboxes. Collin will confirm the time.");
      e.currentTarget.reset();
    } catch (err: any) { setSch(err.message); }
  }

  return (
    <>
      <nav>
        <div className="nav-mark">Collin M. <span>Forde</span></div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#markets">Markets</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-call" href="tel:+13212082111">(321) 208-2111</a>
      </nav>

      <section className="hero">
        <Globe />
        <div className="hero-content">
          <div className="eyebrow">International Real Estate</div>
          <h1>Property<br />without <em>borders.</em></h1>
          <a className="btn btn-primary" href="tel:+13212082111">Call (321) 208-2111</a>
          <p className="lede">Collin M. Forde — Mr. Real Estate — closes deals across Florida, Thailand, and Trinidad &amp; Tobago, with growing international reach. One advisor. Three markets. No borders.</p>
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
              <img src="/collin-portrait.jpg" alt="Collin M. Forde — Mr. Real Estate" />
            </div>
            <div className="stats">
              <div><div className="num">3</div><div className="label">Core markets</div></div>
              <div><div className="num">SL3058438</div><div className="label">Florida license</div></div>
              <div><div className="num">24h</div><div className="label">Typical follow-up</div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="markets">
        <div className="section-head">
          <div className="eyebrow">Where He Works</div>
          <h2>A portfolio that spans oceans.</h2>
        </div>
        <div className="market-grid">
          <article className="card">
            <div className="market-scene"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/West_Palm_Beach_Skyline_Night.JPG?width=600" alt="West Palm Beach" /></div>
            <div className="card-body"><div className="coord">26.7°N · 80.0°W</div><h3>Florida</h3><p style={{color:"var(--ivory-dim)",marginTop:8,lineHeight:1.65}}>Home base and primary market — residential, investment, and relocation property across Palm Beach County and beyond.</p></div>
          </article>
          <article className="card">
            <div className="market-scene"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Wat_Arun_from_Chao_Phraya_River.jpg?width=600" alt="Bangkok" /></div>
            <div className="card-body"><div className="coord">13.8°N · 100.5°E</div><h3>Thailand</h3><p style={{color:"var(--ivory-dim)",marginTop:8,lineHeight:1.65}}>International investment and vacation property for buyers looking to place capital — and roots — in Southeast Asia.</p></div>
          </article>
          <article className="card">
            <div className="market-scene"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Pigeon_Point_beach.jpg?width=800" alt="Tobago" /></div>
            <div className="card-body"><div className="coord">10.7°N · 61.2°W</div><h3>Trinidad &amp; Tobago</h3><p style={{color:"var(--ivory-dim)",marginTop:8,lineHeight:1.65}}>Caribbean residential and land opportunities for clients with ties to, or interest in, the twin islands.</p></div>
          </article>
        </div>
      </section>

      <section id="contact">
        <div className="section-head">
          <div className="eyebrow">Get In Touch</div>
          <h2>Let&apos;s talk property.</h2>
          <p className="lede" style={{marginTop:12}}>Wherever the property is — Florida, Thailand, Trinidad &amp; Tobago, or somewhere else entirely — Collin is a call or message away.</p>
          {cal ? <p style={{marginTop:16}}><a className="btn btn-ghost" href={cal} target="_blank" rel="noreferrer">Book a viewing on calendar</a></p> : null}
        </div>
        <div className="form-grid">
          <div className="card"><div className="card-body">
            <div className="eyebrow">Send An Inquiry</div>
            <h3 style={{margin:"0.6rem 0 1rem"}}>Tell him what you&apos;re looking for.</h3>
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
          <div className="card"><div className="card-body">
            <div className="eyebrow">Schedule A Call</div>
            <h3 style={{margin:"0.6rem 0 1rem"}}>Request a consultation time.</h3>
            <form onSubmit={onSch}>
              <div className="field-row">
                <label>Name<input name="name" required /></label>
                <label>Email<input name="email" type="email" required /></label>
              </div>
              <div className="field-row">
                <label>Preferred date<input name="date" type="date" required /></label>
                <label>Preferred time<input name="time" type="time" required /></label>
              </div>
              <label>Notes<textarea name="notes" rows={3} placeholder="Time zone, property you're interested in, anything else" /></label>
              <button className="btn btn-primary" type="submit">Request This Time</button>
              <p className="status">{sch}</p>
            </form>
          </div></div>
        </div>
      </section>

      <footer>
        Collin M. Forde — Mr. Real Estate · License #SL3058438 · All U.S. properties sold through Dalton Wade Real Estate Group (CQ1047837)
        <br />Created by Apex Executive Studio / Paul Destocki 2026
        <br />Forms deliver to both CollinsellsFlorida@gmail.com and collin.forde.international@gmail.com
      </footer>
    </>
  );
}
