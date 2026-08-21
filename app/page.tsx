"use client";
import { useEffect, useState, FormEvent } from "react";

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
  throw new Error(data.message || "Send failed — call (321) 208-2111");
}

export default function Page() {
  const [inq, setInq] = useState("");
  const [sch, setSch] = useState("");
  const [cal, setCal] = useState("");

  useEffect(() => {
    fetch("/api/config").then(r => r.json()).then(d => { if (d.calendarUrl) setCal(d.calendarUrl); }).catch(() => {});
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
      setInq("Sent to both of Collin's inboxes.");
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
      if (!d.ok) await dualEmail(`Viewing / Call from ${body.name}`, body as any);
      setSch(d.calendarLink ? `Sent. Calendar: ${d.calendarLink}` : "Sent to both inboxes. Collin will confirm.");
      e.currentTarget.reset();
    } catch (err: any) { setSch(err.message); }
  }

  return (
    <>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#081820;color:#F3EDE3;font-family:system-ui,sans-serif}
nav{display:flex;justify-content:space-between;padding:1rem 1.25rem;position:sticky;top:0;background:#081820ee;z-index:10}
.mark{font-family:Georgia,serif;font-size:1.15rem}.mark span{color:#C9A15E}
a.btn,button.btn{display:inline-block;padding:.75rem 1.3rem;border-radius:999px;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;border:none;cursor:pointer;text-decoration:none}
.btn-p{background:#C9A15E;color:#081820;font-weight:600}.btn-g{border:1px solid rgba(243,237,227,.2);color:#F3EDE3;background:transparent}
.hero{padding:5rem 1.25rem 3rem;max-width:640px}
h1{font-family:Georgia,serif;font-size:clamp(2.2rem,6vw,3.6rem);line-height:1.05;margin:1rem 0 1.2rem}
h1 em{color:#E4C989;font-style:italic}
.lede{color:#B9C4C4;line-height:1.7;margin-top:1.2rem}
section{padding:3rem 1.25rem;max-width:1000px;margin:0 auto}
h2{font-family:Georgia,serif;font-size:1.8rem;margin:.5rem 0 1.2rem}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem}
.card{background:#0F2E38;border:1px solid rgba(243,237,227,.12);border-radius:16px;padding:1.3rem}
label{display:block;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:#4C8C7D;margin-bottom:.85rem}
input,select,textarea{display:block;width:100%;margin-top:.35rem;background:#081820;border:1px solid rgba(243,237,227,.12);border-radius:10px;padding:.65rem;color:#F3EDE3;font-size:16px}
.status{margin-top:.7rem;font-size:.85rem;color:#E4C989;min-height:1.2em}
footer{text-align:center;padding:2rem;font-size:.7rem;color:#B9C4C4;opacity:.7}`}</style>
      <nav>
        <div className="mark">Collin M. <span>Forde</span></div>
        <a className="btn btn-g" href="tel:+13212082111">(321) 208-2111</a>
      </nav>
      <div className="hero">
        <div style={{ fontSize: ".7rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#E4C989" }}>International Real Estate</div>
        <h1>Property<br/>without <em>borders.</em></h1>
        <a className="btn btn-p" href="tel:+13212082111">Call (321) 208-2111</a>
        <p className="lede">Collin M. Forde — Mr. Real Estate — Florida, Thailand, Trinidad &amp; Tobago, and international markets. License #SL3058438 · Dalton Wade.</p>
      </div>
      <section>
        <h2>Markets</h2>
        <div className="grid">
          <div className="card"><strong>Florida</strong><p style={{ color: "#B9C4C4", marginTop: 8, lineHeight: 1.6 }}>Home base — Palm Beach County and beyond.</p></div>
          <div className="card"><strong>Thailand</strong><p style={{ color: "#B9C4C4", marginTop: 8, lineHeight: 1.6 }}>Investment and vacation property in Southeast Asia.</p></div>
          <div className="card"><strong>Trinidad &amp; Tobago</strong><p style={{ color: "#B9C4C4", marginTop: 8, lineHeight: 1.6 }}>Caribbean residential and land opportunities.</p></div>
        </div>
      </section>
      <section>
        <h2>Contact</h2>
        {cal ? <p style={{ marginBottom: 16 }}><a className="btn btn-g" href={cal} target="_blank" rel="noreferrer">Book on calendar</a></p> : null}
        <div className="grid">
          <div className="card">
            <h3 style={{ fontFamily: "Georgia,serif", marginBottom: 12 }}>Send an inquiry</h3>
            <form onSubmit={onInq}>
              <label>Name<input name="name" required /></label>
              <label>Email<input name="email" type="email" required /></label>
              <label>Phone<input name="phone" type="tel" /></label>
              <label>Market<select name="market"><option>Florida</option><option>Thailand</option><option>Trinidad &amp; Tobago</option><option>Other / International</option></select></label>
              <label>Message<textarea name="message" rows={4} required /></label>
              <button className="btn btn-p" type="submit">Send Inquiry</button>
              <p className="status">{inq}</p>
            </form>
          </div>
          <div className="card">
            <h3 style={{ fontFamily: "Georgia,serif", marginBottom: 12 }}>Schedule a call</h3>
            <form onSubmit={onSch}>
              <label>Name<input name="name" required /></label>
              <label>Email<input name="email" type="email" required /></label>
              <label>Date<input name="date" type="date" required /></label>
              <label>Time<input name="time" type="time" required /></label>
              <label>Notes<textarea name="notes" rows={3} /></label>
              <button className="btn btn-p" type="submit">Request This Time</button>
              <p className="status">{sch}</p>
            </form>
          </div>
        </div>
      </section>
      <footer>Collin M. Forde · SL3058438 · Dalton Wade CQ1047837 · Level 2 · Apex Executive Studio 2026<br/>Forms deliver to CollinsellsFlorida@gmail.com and collin.forde.international@gmail.com</footer>
    </>
  );
}
