import { NextResponse } from "next/server";
import { deliverInquiry, inquirySchema } from "@/lib/leads";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = inquirySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }
    const result = await deliverInquiry(parsed.data);
    return NextResponse.json({
      ok: true,
      channel: result.channel,
      emails: result.emails,
      sheet: result.sheet,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submit failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
