import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const dir = join(process.cwd(), "public");
    const a = readFileSync(join(dir, "portrait-a.b64"), "utf8").trim();
    const b = readFileSync(join(dir, "portrait-b.b64"), "utf8").trim();
    const buf = Buffer.from(a + b, "base64");
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("portrait unavailable", { status: 404 });
  }
}
