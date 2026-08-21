import { NextResponse } from "next/server";
import { bookingSchema, deliverBooking } from "@/lib/leads";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }
    const date = new Date(`${parsed.data.date}T${parsed.data.time || "12:00"}:00`);
    if (!Number.isNaN(date.getTime()) && date.getTime() < Date.now() - 86400000) {
      return NextResponse.json(
        { ok: false, error: "Please pick a future date and time." },
        { status: 400 }
      );
    }
    const result = await deliverBooking(parsed.data);
    return NextResponse.json({
      ok: true,
      channel: result.channel,
      emails: result.emails,
      sheet: result.sheet,
      calendarLink: result.calendarLink,
      appointmentUrl: result.appointmentUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Booking failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
