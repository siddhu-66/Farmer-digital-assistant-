import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(path);
  }
  return out;
}

for (const file of walk("src")) {
  let text = readFileSync(file, "utf8");
  const next = text.replace(
    /catch \((err|error)\) \{([^}]*)\}/g,
    (match, name, body) => {
      if (new RegExp(`\\b${name}\\b`).test(body)) return match;
      return `catch (_${name}) {${body}}`;
    },
  );
  if (next !== text) writeFileSync(file, next);
}

console.log("Renamed unused catch variables");
