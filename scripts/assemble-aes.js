const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const parts = path.join(root, "html-parts");
function joinPrefix(prefix, dest) {
  const files = fs.readdirSync(parts).filter((f) => f.startsWith(prefix) && f.endsWith(".txt")).sort();
  const data = files.map((f) => fs.readFileSync(path.join(parts, f), "utf8")).join("");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, data);
  console.log(dest, data.length, "from", files.join(","));
}
joinPrefix("css", path.join(root, "app/aes.css"));
joinPrefix("body", path.join(root, "app/level1-body.html"));
joinPrefix("boot", path.join(root, "public/aes-boot.js"));
const p0 = path.join(parts, "portrait0.b64");
if (fs.existsSync(p0)) {
  const b64 = fs.readFileSync(p0, "utf8") + fs.readFileSync(path.join(parts, "portrait1.b64"), "utf8");
  fs.mkdirSync(path.join(root, "public"), { recursive: true });
  fs.writeFileSync(path.join(root, "public/collin-portrait.jpg"), Buffer.from(b64, "base64"));
  console.log("portrait", Buffer.from(b64, "base64").length);
}
