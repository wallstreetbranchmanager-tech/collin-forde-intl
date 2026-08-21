import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    calendarUrl: process.env.NEXT_PUBLIC_CALENDAR_URL || "",
    emails: [
      "CollinsellsFlorida@gmail.com",
      "collin.forde.international@gmail.com",
    ],
    sheetsConfigured: Boolean(process.env.GOOGLE_SHEETS_WEBHOOK),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
  });
}
