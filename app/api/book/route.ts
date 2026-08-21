import { NextResponse } from "next/server";
import { bookingSchema, deliverBooking, buildGoogleCalendarLink } from "@/lib/leads";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const time = (parsed.data.time || "12:00").slice(0, 5);
    const date = new Date(`${parsed.data.date}T${time}:00-04:00`);
    if (!Number.isNaN(date.getTime()) && date.getTime() < Date.now() - 3600000) {
      return NextResponse.json(
        { ok: false, error: "Please pick a future date and time (Mon–Fri 9 AM – 5 PM Eastern)." },
        { status: 400 }
      );
    }

    const local = new Date(`${parsed.data.date}T12:00:00-04:00`);
    const day = local.getDay();
    if (day === 0 || day === 6) {
      return NextResponse.json(
        { ok: false, error: "Collin is available Monday–Friday only. Pick a weekday." },
        { status: 400 }
      );
    }

    const hour = parseInt(time.split(":")[0], 10);
    const min = parseInt(time.split(":")[1] || "0", 10);
    const mins = hour * 60 + min;
    if (mins < 9 * 60 || mins > 17 * 60) {
      return NextResponse.json(
        { ok: false, error: "Pick a time between 9:00 AM and 5:00 PM Eastern." },
        { status: 400 }
      );
    }

    try {
      const result = await deliverBooking(parsed.data);
      return NextResponse.json({
        ok: true,
        channel: result.channel,
        emailed: (result as any).emailed ?? true,
        emails: result.emails,
        sheet: result.sheet,
        calendarLink: result.calendarLink || buildGoogleCalendarLink(parsed.data),
        appointmentUrl: result.appointmentUrl,
      });
    } catch {
      const calendarLink = buildGoogleCalendarLink(parsed.data);
      return NextResponse.json({
        ok: true,
        channel: "calendar_only",
        emailed: false,
        calendarLink,
        emails: ["collin.forde.international@gmail.com", "CollinsellsFlorida@gmail.com"],
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Booking failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
