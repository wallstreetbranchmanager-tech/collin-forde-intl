import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const dir = join(process.cwd(), "public");
    // single compressed b64 file
    try {
      const b64 = readFileSync(join(dir, "portrait-full.b64"), "utf8").trim();
      const buf = Buffer.from(b64, "base64");
      if (buf.length > 500 && buf[0] === 0xff && buf[1] === 0xd8) {
        return new NextResponse(buf, {
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
      .map((i) => {
        try {
          return readFileSync(join(dir, `pp${i}.txt`), "utf8").trim();
        } catch {
          return "";
        }
      })
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
