import { readFileSync } from "fs";
import { join } from "path";
import GlobeBoot from "./GlobeBoot";

export default function Page() {
  const css = readFileSync(join(process.cwd(), "app/aes.css"), "utf8");
  const body = readFileSync(join(process.cwd(), "app/level1-body.html"), "utf8");
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <GlobeBoot />
    </>
  );
}
