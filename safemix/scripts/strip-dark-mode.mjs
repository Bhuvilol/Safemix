/**
 * One-shot codemod: strip all Tailwind `dark:*` variants and dark-mode toggle code
 * from the codebase. Run once with `node scripts/strip-dark-mode.mjs`.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../src");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(tsx?|css)$/.test(p)) out.push(p);
  }
  return out;
}

// Strip a single `dark:foo-bar/30` token (handles arbitrary values too).
const DARK_TOKEN_RE = /(?:^|\s)dark:[^\s"'`]+/g;

let changed = 0;
for (const file of walk(ROOT)) {
  const before = readFileSync(file, "utf8");
  let after = before
    // Remove `dark:foo` tokens inside className strings, multiple per match
    .replace(DARK_TOKEN_RE, (m) => (m.startsWith(" ") ? " " : ""))
    // Tidy any double/triple spaces left in className strings
    .replace(/className="([^"]*?)"/g, (_m, inner) =>
      `className="${inner.replace(/\s{2,}/g, " ").trim()}"`
    )
    .replace(/className=\{`([^`]*?)`\}/g, (_m, inner) =>
      `className={\`${inner.replace(/\s{2,}/g, " ").trim()}\`}`
    );

  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}
console.log(`stripped dark: classes in ${changed} files`);
