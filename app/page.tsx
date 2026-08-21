import { readFile } from "fs/promises";
import { join } from "path";

/**
 * Exact AES collin-forde HTML (AES-7F3A9C2E). Forms → /api/lead + /api/book
 * which email BOTH CollinsellsFlorida@gmail.com and collin.forde.international@gmail.com.
 */
export default async function HomePage() {
  const raw = await readFile(join(process.cwd(), "public/index.html"), "utf8");
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const headMatch = raw.match(/<head[^>]*>([\s\S]*)<\/head>/i);
  const headInner = headMatch ? headMatch[1] : "";
  const bodyInner = bodyMatch ? bodyMatch[1] : raw;
  const styleBlocks = [...headInner.matchAll(/<style[\s\S]*?<\/style>/gi)].map((m) => m[0]).join("\n");
  const linkBlocks = [...headInner.matchAll(/<link[^>]*>/gi)].map((m) => m[0]).join("\n");

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: linkBlocks + styleBlocks }} />
      <div dangerouslySetInnerHTML={{ __html: bodyInner }} />
    </>
  );
}
