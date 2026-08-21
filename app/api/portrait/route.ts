import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const b64 = readFileSync(join(process.cwd(), "public", "portrait.b64"), "utf8");
  const buf = Buffer.from(b64, "base64");
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
