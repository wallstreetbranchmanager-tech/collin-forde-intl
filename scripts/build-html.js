const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const partsDir = path.join(root, "html-parts");
const publicDir = path.join(root, "public");
fs.mkdirSync(publicDir, { recursive: true });
const html = [0,1,2,3].map(i => fs.readFileSync(path.join(partsDir, `aes${i}.txt`), "utf8")).join("");
fs.writeFileSync(path.join(publicDir, "aes.html"), html);
fs.writeFileSync(path.join(publicDir, "index.html"), html);
const p0 = path.join(partsDir, "portrait0.b64");
if (fs.existsSync(p0)) {
  const b64 = fs.readFileSync(p0, "utf8") + fs.readFileSync(path.join(partsDir, "portrait1.b64"), "utf8");
  fs.writeFileSync(path.join(publicDir, "collin-portrait.jpg"), Buffer.from(b64, "base64"));
}
console.log("Built aes.html", html.length);
