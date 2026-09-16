import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

const FALLBACK: Record<string, string> = {
  fl: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=960&q=75",
  th: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=960&q=75",
  tt: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=960&q=75",
};

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") || "";
  if (!["fl", "th", "tt"].includes(id)) {
    return new NextResponse("not found", { status: 404 });
  }
  const file = join(process.cwd(), "public", `market-${id}.b64`);
  try {
    if (existsSync(file)) {
      const raw = readFileSync(file, "utf8").replace(/\s+/g, "");
      const buf = Buffer.from(raw, "base64");
      if (buf.length > 400 && buf[0] === 0xff && buf[1] === 0xd8) {
        const blob = new Blob([new Uint8Array(buf)], { type: "image/jpeg" });
        return new Response(blob, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    }
  } catch {
    /* fall through */
  }
  return NextResponse.redirect(FALLBACK[id], 302);
}
