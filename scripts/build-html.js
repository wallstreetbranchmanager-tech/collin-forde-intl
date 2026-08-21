const fs = require("fs");
const path = require("path");
const parts = [0, 1, 2].map((i) =>
  fs.readFileSync(path.join(__dirname, "..", "html-parts", `part${i}.txt`), "utf8")
);
fs.mkdirSync(path.join(__dirname, "..", "public"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "..", "public", "index.html"), parts.join(""));
console.log("Built public/index.html", parts.reduce((a, b) => a + b.length, 0), "chars");
