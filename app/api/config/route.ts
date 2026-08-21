import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    calendarUrl: process.env.NEXT_PUBLIC_CALENDAR_URL || "",
    emails: [
      "CollinsellsFlorida@gmail.com",
      "collin.forde.international@gmail.com",
    ],
  });
}
