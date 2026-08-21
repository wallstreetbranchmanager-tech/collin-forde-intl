const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const partsDir = path.join(root, "html-parts");
const publicDir = path.join(root, "public");
fs.mkdirSync(publicDir, { recursive: true });

const html = fs.readFileSync(path.join(partsDir, "html0.txt"), "utf8")
  + fs.readFileSync(path.join(partsDir, "html1.txt"), "utf8");
fs.writeFileSync(path.join(publicDir, "index.html"), html);

const b64 = fs.readFileSync(path.join(partsDir, "portrait0.b64"), "utf8")
  + fs.readFileSync(path.join(partsDir, "portrait1.b64"), "utf8");
fs.writeFileSync(path.join(publicDir, "collin-portrait.jpg"), Buffer.from(b64, "base64"));

console.log("Built public/index.html", html.length, "and portrait", Buffer.from(b64, "base64").length);
