import { readFile } from "fs/promises";
import { join } from "path";

export default async function HomePage() {
  try {
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
  } catch {
    return (
      <main style={{ padding: 40, fontFamily: "system-ui", background: "#081820", color: "#F3EDE3", minHeight: "100vh" }}>
        <h1>Collin M. Forde</h1>
        <p>Site loading. If this persists, contact support.</p>
        <p><a href="tel:+13212082111" style={{ color: "#C9A15E" }}>(321) 208-2111</a></p>
      </main>
    );
  }
}
