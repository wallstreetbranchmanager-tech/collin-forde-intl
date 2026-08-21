import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const dir = join(process.cwd(), "public");
  const b64 = readFileSync(join(dir, "portrait-p1.txt"), "utf8") + readFileSync(join(dir, "portrait-p2.txt"), "utf8");
  const buf = Buffer.from(b64, "base64");
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
