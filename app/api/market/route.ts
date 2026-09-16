import { NextRequest, NextResponse } from "next/server";

/** Stable remote photos so cards never 404 on missing b64 shards. */
const MAP: Record<string, string> = {
  fl: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=1400&q=80",
  th: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1400&q=80",
  tt: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80",
};

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") || "";
  const target = MAP[id];
  if (!target) return new NextResponse("not found", { status: 404 });
  return NextResponse.redirect(target, 302);
}
