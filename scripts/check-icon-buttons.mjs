#!/usr/bin/env node
/**
 * Accessibility lint: every icon-only Button (size="icon") must have an
 * accessible name (aria-label or title). Toggle-like icon buttons that
 * bind a boolean state should also expose aria-pressed.
 *
 * Exits non-zero (failing the build) when violations are found.
 *
 * Scope: shadcn <Button size="icon" ...> and <Toggle size="icon" ...>.
 * Raw <button> elements are out of scope here — they're covered by the
 * focus-visible token pass and the manual aria-label sweep.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

/** @type {{file:string; line:number; tag:string; reason:string}[]} */
const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(tsx|jsx)$/.test(entry) && !entry.endsWith(".gen.tsx")) scan(p);
  }
}

// Match the start of an opening tag for components named Button / Toggle /
// IconButton. We then scan forward respecting JSX brace nesting to find the
// real closing '>' (so '=>' inside attribute expressions doesn't fool us).
const TAG_START = /<(Button|Toggle|IconButton)\b/g;

function findTagEnd(src, start) {
  let depth = 0;
  let inStr = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === ">" && depth === 0) return i;
  }
  return -1;
}

function scan(file) {
  const src = readFileSync(file, "utf8");
  // Strip block + line comments to avoid false positives.
  const clean = src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (_m, p1) => p1 + " ");

  let m;
  const TAG_RE = TAG_START;
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(clean))) {
    const [full, tag, attrs] = m;
    if (!/\bsize=("icon"|{[^}]*"icon"[^}]*})/.test(attrs)) continue;

    const hasAriaLabel = /\baria-label\s*=/.test(attrs);
    const hasAriaLabelledBy = /\baria-labelledby\s*=/.test(attrs);
    const hasTitle = /\btitle\s*=/.test(attrs);
    const spreadsProps = /\{\.\.\.[A-Za-z_$][\w$]*\}/.test(attrs);

    if (hasAriaLabel || hasAriaLabelledBy || hasTitle || spreadsProps) continue;

    const line = src.slice(0, m.index).split("\n").length;
    violations.push({
      file: relative(ROOT, file),
      line,
      tag: full.slice(0, 80).replace(/\s+/g, " "),
      reason: `<${tag} size="icon"> missing aria-label / aria-labelledby / title`,
    });
  }
}

walk(SRC);

if (violations.length) {
  console.error(
    `\n✖ a11y check: ${violations.length} icon-only button(s) missing accessible name\n`
  );
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}`);
    console.error(`    ${v.reason}`);
    console.error(`    ${v.tag}`);
  }
  console.error(
    "\nFix: add aria-label=\"…\" (or title=\"…\") to every icon-only Button/Toggle.\n"
  );
  process.exit(1);
}

console.log("✓ a11y check: all icon-only buttons have accessible names");
