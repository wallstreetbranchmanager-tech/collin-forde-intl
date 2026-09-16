import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") || "";
  if (!["fl", "th", "tt"].includes(id)) {
    return new NextResponse("not found", { status: 404 });
  }
  const file = join(process.cwd(), "public", `market-${id}.b64`);
  if (!existsSync(file)) {
    return new NextResponse("photo missing", { status: 404 });
  }
  const raw = readFileSync(file, "utf8").replace(/\s+/g, "");
  const buf = Buffer.from(raw, "base64");
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
