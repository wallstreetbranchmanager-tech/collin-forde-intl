import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id || !["fl", "th", "tt"].includes(id)) {
    return new NextResponse("not found", { status: 404 });
  }
  try {
    const dir = join(process.cwd(), "public");
    const a = readFileSync(join(dir, `market-${id}-a.b64`), "utf8").trim();
    const b = readFileSync(join(dir, `market-${id}-b.b64`), "utf8").trim();
    const buf = Buffer.from(a + b, "base64");
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("unavailable", { status: 404 });
  }
}
