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

/** Both inboxes — Level 2 requirement */
const LEADS_EMAILS = [
  "CollinsellsFlorida@gmail.com",
  "collin.forde.international@gmail.com",
];

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
  return [
    `VIEWING / CALL REQUEST`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "n/a"}`,
    `Date: ${data.date}`,
    `Time: ${data.time} (confirm time zone with client)`,
    `Listing: ${data.listingId || "general"}`,
    "",
    data.notes || "",
  ].join("\n");
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

/** FormSubmit: primary inbox + _cc for the second so both receive */
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
  const sentResend = await sendViaResend(subject, text, data.email);
  if (sentResend) return { channel: "resend" as const, emails: LEADS_EMAILS };
  const sentForm = await sendViaFormSubmit(subject, {
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
  if (sentForm) return { channel: "formsubmit" as const, emails: LEADS_EMAILS };
  throw new Error("No mail channel configured. Add RESEND_API_KEY or confirm FormSubmit for the inbox.");
}

export async function deliverBooking(data: Booking) {
  const subject = `VIEWING / CALL ${data.date} ${data.time} — ${data.name}`;
  const text = formatBooking(data);
  const sentResend = await sendViaResend(subject, text, data.email);
  if (sentResend) return { channel: "resend" as const, emails: LEADS_EMAILS };
  const sentForm = await sendViaFormSubmit(subject, {
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    date: data.date,
    time: data.time,
    listingId: data.listingId || "",
    notes: data.notes || "",
  });
  if (sentForm) return { channel: "formsubmit" as const, emails: LEADS_EMAILS };
  throw new Error("No mail channel configured.");
}
