import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

function loadPortrait(): Uint8Array {
  const dir = join(process.cwd(), "public");
  const full = join(dir, "portrait.b64");
  if (existsSync(full)) {
    const raw = readFileSync(full, "utf8").replace(/\s+/g, "");
    const buf = Buffer.from(raw, "base64");
    if (buf.length > 2000 && buf[0] === 0xff && buf[1] === 0xd8) {
      return Uint8Array.from(buf);
    }
  }
  const a = readFileSync(join(dir, "portrait-a.b64"), "utf8").trim();
  const b = readFileSync(join(dir, "portrait-b.b64"), "utf8").trim();
  return Uint8Array.from(Buffer.from(a + b, "base64"));
}

export async function GET() {
  try {
    const bytes = loadPortrait();
    return new Response(bytes, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("portrait unavailable", { status: 404 });
  }
}
