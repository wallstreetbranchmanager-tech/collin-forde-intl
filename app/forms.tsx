"use client";

import { useState } from "react";
import { LISTINGS, SLOTS } from "@/lib/data";

type Status = { kind: "idle" | "ok" | "err"; text: string };

export function InquiryForm({ listingId }: { listingId?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "idle", text: "Sending…" });
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, listingId }),
    });
    const json = await res.json();
    if (res.ok && json.ok) {
      setStatus({ kind: "ok", text: "Got it. Collin will reply from the international desk." });
      e.currentTarget.reset();
    } else {
      setStatus({ kind: "err", text: json.error || "Form rejected. Check the fields and try again." });
    }
  }
  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="kicker">Inquiry</div>
      <h3>Tell him what you want</h3>
      <label>I am a
        <select name="type" defaultValue="buyer">
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="inquiry">General</option>
        </select>
      </label>
      <label>Name<input name="name" required minLength={2} /></label>
      <div className="grid g2">
        <label>Email<input type="email" name="email" required /></label>
        <label>Phone<input type="tel" name="phone" /></label>
      </div>
      <div className="grid g2">
        <label>Market
          <select name="market">
            <option>St. Petersburg</option>
            <option>Tampa Bay</option>
            <option>Pinellas Beaches</option>
            <option>Caribbean / International</option>
            <option>Other Florida</option>
          </select>
        </label>
        <label>Budget<input name="budget" placeholder="$400k–$900k" /></label>
      </div>
      <label>Timeline
        <select name="timeline">
          <option>ASAP</option>
          <option>30–60 days</option>
          <option>This season</option>
          <option>Just looking</option>
        </select>
      </label>
      <label>Message<textarea name="message" rows={4} required minLength={8} /></label>
      <button className="cta" type="submit">Send to Collin</button>
      <p className="status">{status.text}</p>
    </form>
  );
}

export function BookingForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });
  const calendar = process.env.NEXT_PUBLIC_CALENDAR_URL;
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "idle", text: "Booking…" });
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (res.ok && json.ok) {
      setStatus({ kind: "ok", text: "Request in. He will confirm the slot on calendar." });
      e.currentTarget.reset();
    } else {
      setStatus({ kind: "err", text: json.error || "Could not book that slot." });
    }
  }
  return (
    <div>
      {calendar ? (
        <iframe title="Google Calendar booking" src={calendar} style={{ width: "100%", minHeight: 720, border: 0, borderRadius: 16, marginBottom: 24 }} />
      ) : null}
      <form className="form" onSubmit={onSubmit}>
        <div className="kicker">Viewing</div>
        <h3>Book a showing</h3>
        <p className="muted">Times are Eastern. Collin confirms against his live calendar. When his Google Appointment Schedule is live it embeds above this form.</p>
        <label>Name<input name="name" required /></label>
        <div className="grid g2">
          <label>Email<input type="email" name="email" required /></label>
          <label>Phone<input type="tel" name="phone" required /></label>
        </div>
        <div className="grid g2">
          <label>Date<input type="date" name="date" required /></label>
          <label>Time
            <select name="time" required>
              {SLOTS.map((s) => (<option key={s}>{s}</option>))}
            </select>
          </label>
        </div>
        <label>Property
          <select name="listingId">
            <option value="">General / consult</option>
            {LISTINGS.map((l) => (<option key={l.id} value={l.id}>{l.title}</option>))}
          </select>
        </label>
        <label>Notes<textarea name="notes" rows={3} /></label>
        <button className="cta" type="submit">Request viewing</button>
        <p className="status">{status.text}</p>
      </form>
    </div>
  );
}
