import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const dir = join(process.cwd(), "public");
  const b64 = [0,1,2,3].map(i => readFileSync(join(dir, `pp${i}.txt`), "utf8")).join("");
  const buf = Buffer.from(b64.trim(), "base64");
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
