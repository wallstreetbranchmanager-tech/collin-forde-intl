import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const dir = join(process.cwd(), "public");
    try {
      const jpg = readFileSync(join(dir, "collin-portrait.jpg"));
      if (jpg.length > 1000 && jpg[0] === 0xff && jpg[1] === 0xd8) {
        return new NextResponse(jpg, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    } catch {
      /* fall through */
    }
    const b64 = [0, 1, 2, 3]
      .map((i) => readFileSync(join(dir, `pp${i}.txt`), "utf8").trim())
      .join("");
    const buf = Buffer.from(b64, "base64");
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
