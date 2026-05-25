import { readFileSync, writeFileSync } from "fs";

const report = JSON.parse(readFileSync("eslint-report.json", "utf8"));

for (const result of report) {
  const fixes = [];
  for (const msg of result.messages ?? []) {
    for (const suggestion of msg.suggestions ?? []) {
      if (suggestion.fix) fixes.push(suggestion.fix);
    }
  }
  if (!fixes.length) continue;

  fixes.sort((a, b) => b.range[0] - a.range[0]);
  let text = readFileSync(result.filePath, "utf8");
  for (const fix of fixes) {
    text = text.slice(0, fix.range[0]) + fix.text + text.slice(fix.range[1]);
  }
  writeFileSync(result.filePath, text);
}

console.log("Applied ESLint suggestion fixes");
