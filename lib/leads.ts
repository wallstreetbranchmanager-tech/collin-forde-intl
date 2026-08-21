import { z } from "zod";

export const inquirySchema = z.object({
  type: z.enum(["buyer", "seller", "inquiry"]).default("inquiry"),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(7).max(30).optional().or(z.literal("")),
  market: z.string().max(80).optional(),
  budget: z.string().max(80).optional(),
  timeline: z.string().max(80).optional(),
  message: z.string().min(5).max(4000),
  listingId: z.string().max(80).optional(),
});

export const bookingSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(7).max(30).optional().or(z.literal("")),
  date: z.string().min(8),
  time: z.string().min(4),
  listingId: z.string().max(80).optional(),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type Inquiry = z.infer<typeof inquirySchema>;
export type Booking = z.infer<typeof bookingSchema>;

const LEADS_EMAILS = [
  "collin.forde.international@gmail.com",
  "CollinsellsFlorida@gmail.com",
];

export function buildGoogleCalendarLink(data: Booking) {
  const start = parseLocal(data.date, data.time);
  if (!start) return "";
  const end = new Date(start.getTime() + 45 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Property viewing / call — ${data.name}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: [
      `Client: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "n/a"}`,
      `Notes: ${data.notes || "none"}`,
      "",
      "Collin M. Forde · (321) 208-2111",
      "collin.forde.international@gmail.com · CollinsellsFlorida@gmail.com",
    ].join("\n"),
    location: "Phone / Google Meet / TBD",
    add: LEADS_EMAILS.join(","),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function parseLocal(date: string, time: string) {
  const d = new Date(`${date}T${time.length === 5 ? time : time.slice(0, 5)}:00-04:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatInquiry(data: Inquiry) {
  return [
    `Type: ${data.type}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "n/a"}`,
    `Market: ${data.market || "n/a"}`,
    `Budget: ${data.budget || "n/a"}`,
    `Timeline: ${data.timeline || "n/a"}`,
    `Listing: ${data.listingId || "n/a"}`,
    "",
    data.message,
  ].join("\n");
}

function formatBooking(data: Booking) {
  const cal = buildGoogleCalendarLink(data);
  return [
    `VIEWING / CALL REQUEST`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "n/a"}`,
    `Date: ${data.date}`,
    `Time: ${data.time} (confirm time zone)`,
    `Listing: ${data.listingId || "general"}`,
    "",
    data.notes || "",
    "",
    cal ? `Add to Google Calendar:\n${cal}` : "",
  ].filter(Boolean).join("\n");
}

async function logToSheets(row: Record<string, string>) {
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK;
  if (!webhook) return { ok: false as const, reason: "no_webhook" };
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        source: "collin-forde-intl",
        status: "new",
        ...row,
      }),
    });
    return { ok: res.ok, reason: res.ok ? "sheets" : `http_${res.status}` };
  } catch (e) {
    return { ok: false as const, reason: e instanceof Error ? e.message : "sheets_error" };
  }
}

async function sendViaResend(subject: string, text: string, replyTo: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "Collin Forde Site <onboarding@resend.dev>",
      to: LEADS_EMAILS,
      reply_to: replyTo,
      subject,
      text,
    }),
  });
  return res.ok;
}

async function sendViaFormSubmit(subject: string, payload: Record<string, string>) {
  const primary = LEADS_EMAILS[0];
  const cc = LEADS_EMAILS[1];
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(primary)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: subject,
      _template: "table",
      _cc: cc,
      _captcha: "false",
      ...payload,
    }),
  });
  return res.ok;
}

export async function deliverInquiry(data: Inquiry) {
  const subject = `[INQUIRY] ${data.name} — Collin Forde`;
  const text = formatInquiry(data);
  const sheet = await logToSheets({
    type: data.type,
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    market: data.market || "",
    message: data.message,
  });
  let channel: "resend" | "formsubmit" = "formsubmit";
  if (await sendViaResend(subject, text, data.email)) {
    channel = "resend";
  } else {
    const ok = await sendViaFormSubmit(subject, {
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      type: data.type,
      market: data.market || "",
      budget: data.budget || "",
      timeline: data.timeline || "",
      listingId: data.listingId || "",
      message: data.message,
    });
    if (!ok) throw new Error("Email delivery failed. Call (321) 208-2111.");
  }
  return { channel, emails: LEADS_EMAILS, sheet };
}

export async function deliverBooking(data: Booking) {
  const subject = `VIEWING / CALL ${data.date} ${data.time} — ${data.name}`;
  const text = formatBooking(data);
  const calendarLink = buildGoogleCalendarLink(data);
  const appointmentUrl = process.env.NEXT_PUBLIC_CALENDAR_URL || "";
  const sheet = await logToSheets({
    type: "viewing",
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    date: data.date,
    time: data.time,
    notes: data.notes || "",
  });
  let channel: "resend" | "formsubmit" = "formsubmit";
  if (await sendViaResend(subject, text, data.email)) {
    channel = "resend";
  } else {
    const ok = await sendViaFormSubmit(subject, {
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      date: data.date,
      time: data.time,
      listingId: data.listingId || "",
      notes: data.notes || "",
      calendar_link: calendarLink,
    });
    if (!ok) throw new Error("Email delivery failed. Call (321) 208-2111.");
  }
  return { channel, emails: LEADS_EMAILS, sheet, calendarLink, appointmentUrl };
}

export function getCalendarUrl() {
  return process.env.NEXT_PUBLIC_CALENDAR_URL || "";
}
