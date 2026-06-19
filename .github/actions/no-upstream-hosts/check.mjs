#!/usr/bin/env node
// Fail CI if any upstream runtime host (a penguinmod-owned host) appears in
// tracked files, outside an explicit allowlist.
//
// This enforces the PatternYard runtime-independence goal: app code must reach
// ZERO `*.penguinmod.com` (and related upstream) hosts at runtime. Tooling that
// intentionally references the upstream host in order to rewrite it (the rebrand
// pipeline), migration provenance keys, and documentation are exempted via the
// per-repo allowlist file or an inline marker.
//
// Usage:  node check.mjs [--allow-file <path>]
// Exit:   0 = clean, 1 = violations found, 2 = invocation/setup error.
//
// Allowlist file (default `.penguinmod-host-allowlist`, gitignore-style):
//   - one path glob per line; matching files are skipped entirely
//   - blank lines and lines starting with `#` are ignored
//   - supports `*` (within a path segment) and `**` (across segments)
//
// Inline exemption: any line containing the marker token
//   penguin""mod-host-allow   (written without the quotes)
// is skipped, for one-off legitimate references.

import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

// Build the marker + host patterns WITHOUT writing the literal upstream host in
// a single token, so this very script does not need to be self-allowlisted in
// consumer repos (it lives outside their git tree anyway, but this keeps it
// robust if someone vendors it).
const UP = "penguin" + "mod";
const INLINE_MARKER = `${UP}-host-allow`;

// Upstream runtime host families: bare apex + any subdomain, the migration-era
// vercel.app preview hosts, and the upstream GitHub Pages host.
const HOST_RES = [
  new RegExp(`(?:[a-z0-9-]+\\.)*${UP}\\.com\\b`, "i"),
  new RegExp(`${UP}[a-z0-9-]*\\.vercel\\.app\\b`, "i"),
  new RegExp(`${UP}\\.github\\.io\\b`, "i"),
];

function parseArgs(argv) {
  let allowFile = ".penguinmod-host-allowlist";
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--allow-file") allowFile = argv[++i];
  }
  return { allowFile };
}

// Minimal gitignore-ish glob -> RegExp (anchored to full repo-relative path).
function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        // `**` matches across path segments (including none)
        re += ".*";
        i++;
        if (glob[i + 1] === "/") i++; // consume trailing slash of `**/`
      } else {
        re += "[^/]*"; // `*` stays within a segment
      }
    } else if (c === "?") {
      re += "[^/]";
    } else if ("\\^$+.()|{}[]".includes(c)) {
      re += "\\" + c;
    } else {
      re += c;
    }
  }
  return new RegExp("^" + re + "$");
}

function loadAllowlist(allowFile) {
  if (!existsSync(allowFile)) return [];
  return readFileSync(allowFile, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((pattern) => {
      // A bare directory pattern like `docs/` or `docs` should match everything under it.
      const normalized = pattern.endsWith("/") ? pattern + "**" : pattern;
      return { pattern, re: globToRegExp(normalized) };
    });
}

function isAllowed(path, allow) {
  return allow.some(({ re }) => re.test(path));
}

function listTrackedFiles() {
  const out = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return out.split("\0").filter(Boolean);
}

function scanFile(path) {
  let content;
  try {
    content = readFileSync(path, "utf8");
  } catch {
    return []; // unreadable / removed
  }
  if (content.includes("\u0000")) return []; // binary
  const hits = [];
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(INLINE_MARKER)) continue;
    for (const re of HOST_RES) {
      const m = re.exec(line);
      if (m) {
        hits.push({ line: i + 1, col: m.index + 1, match: m[0] });
        break; // one report per line is enough
      }
    }
  }
  return hits;
}

function main() {
  const { allowFile } = parseArgs(process.argv.slice(2));
  let files;
  try {
    files = listTrackedFiles();
  } catch (e) {
    console.error(`error: not a git repository or git unavailable (${e.message})`);
    process.exit(2);
  }
  const allow = loadAllowlist(allowFile);

  const violations = [];
  let scanned = 0;
  for (const file of files) {
    if (file === allowFile) continue;
    if (isAllowed(file, allow)) continue;
    scanned++;
    for (const hit of scanFile(file)) {
      violations.push({ file, ...hit });
    }
  }

  if (violations.length === 0) {
    console.log(`OK: no upstream (${UP}) runtime hosts found in ${scanned} scanned files.`);
    if (allow.length) console.log(`     (${allow.length} allowlist pattern(s) from ${allowFile})`);
    process.exit(0);
  }

  console.error(`Found ${violations.length} upstream-host reference(s) outside the allowlist:\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}:${v.col}  ${v.match}`);
  }
  console.error(
    `\nThese hosts must resolve to patternyard.dev at runtime (no upstream fallback).\n` +
      `Fix the reference, or if it is legitimate (tooling/provenance/docs) add the path to\n` +
      `${allowFile} or put the inline marker "${INLINE_MARKER}" on the line.`
  );
  process.exit(1);
}

main();
