// i18n-extract.ts — flat, chunked RU locales with strong filtering
// Output files (flat, no folders):
//   i18n/locales/ru.part-1.json, ru.part-2.json, ...
//   (optional scaffold) i18n/locales/<lang>.part-1.json, ... — same IDs, empty strings
//
// Configure chunk size (edit constant below).
// Configure scaffolded target locales via env I18N_SCAFFOLD_TARGETS="en,es,fr,de"
// or CLI: --scaffoldTargets=en,es,fr,de
// By default, scaffold writes files only if missing. Force overwrite with --forceScaffold.
//
// At the end, prints total character count of RU strings.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

// -------- Constants you can tweak --------
const CHUNK_SIZE = 300; // max pairs per part file

// ----------------------------------------

type Argv = Record<string, string | boolean>;
const argv: Argv = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
  }),
);

const PROJECT_ROOT = path.resolve(String(argv.root || process.cwd()));
const SRC_LANG = String(argv.src || "ru");
const PAGES_DIR = String(argv.pagesDir || "app/(pages)");
const OUT_DIR = path.resolve(PROJECT_ROOT, String(argv.outDir || "i18n"));
const LOCALES_DIR = path.join(OUT_DIR, "locales");
const SCAN_PARAM = String(
  argv.scan ||
    `${PAGES_DIR}/${SRC_LANG},app/components/${SRC_LANG},app/config/${SRC_LANG},packages/shared-ui/src/${SRC_LANG}`,
);
const EXCURSIONS_DIR = String(
  argv.excursionsDir || path.join(PAGES_DIR, SRC_LANG, "excursions"),
);
const EXCURSIONS_LIMIT = Number(argv.excursionsLimit || 0);
const WRITE_INDEX = !Boolean(argv.noIndex);
const CLEAR_RU = Boolean(argv.clear || false);
const FORCE_SCAFFOLD = Boolean(argv.forceScaffold || false);
const SCAFFOLD_TARGETS = String(
  process.env.I18N_SCAFFOLD_TARGETS || argv.scaffoldTargets || "",
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const relFromRoot = (abs: string) =>
  path.relative(PROJECT_ROOT, abs).replace(/\\/g, "/");

// Normalization: remove "/ru" segment after known roots when hashing ids
type MapPair = { withLangAbs: string; withoutLangAbs: string };
function buildLangDirMappings(): MapPair[] {
  const pairs: [string, string][] = [
    [
      path.join(PROJECT_ROOT, PAGES_DIR, SRC_LANG),
      path.join(PROJECT_ROOT, PAGES_DIR),
    ],
    [
      path.join(PROJECT_ROOT, "app", "components", SRC_LANG),
      path.join(PROJECT_ROOT, "app", "components"),
    ],
    [
      path.join(PROJECT_ROOT, "app", "config", SRC_LANG),
      path.join(PROJECT_ROOT, "app", "config"),
    ],
    [
      path.join(PROJECT_ROOT, "packages", "shared-ui", "src", SRC_LANG),
      path.join(PROJECT_ROOT, "packages", "shared-ui", "src"),
    ],
  ];
  return pairs.map(([w, wo]) => ({
    withLangAbs: path.resolve(w),
    withoutLangAbs: path.resolve(wo),
  }));
}
const LANG_MAP = buildLangDirMappings();
function normalizedRelFor(absFile: string): string {
  const abs = path.resolve(absFile);
  for (const m of LANG_MAP) {
    if (abs.startsWith(m.withLangAbs + path.sep) || abs === m.withLangAbs) {
      const relInside = path.relative(m.withLangAbs, abs);
      const replacedAbs = path.join(m.withoutLangAbs, relInside);
      return relFromRoot(replacedAbs);
    }
  }
  return relFromRoot(abs);
}

function stableId(relNorm: string, text: string): string {
  const h = crypto
    .createHash("sha1")
    .update(relNorm + "|" + text)
    .digest("hex");
  return "p" + h.slice(0, 9);
}

function isFileEligible(p: string): boolean {
  return /\.(tsx?|jsx?)$/i.test(p);
}
function listDirs(): string[] {
  return SCAN_PARAM.split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => path.resolve(PROJECT_ROOT, p));
}
function walkWithExcursionsLimit(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const isExcursionsRoot =
    EXCURSIONS_LIMIT > 0 && path.resolve(dir) === path.resolve(EXCURSIONS_DIR);
  let allowed: Set<string> | null = null;
  if (isExcursionsRoot) {
    const only = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
      .slice(0, EXCURSIONS_LIMIT);
    allowed = new Set(only);
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (
        allowed &&
        path.resolve(dir) === path.resolve(EXCURSIONS_DIR) &&
        !allowed.has(e.name)
      )
        continue;
      walkWithExcursionsLimit(p, out);
    } else if (e.isFile() && isFileEligible(p)) out.push(p);
  }
  return out;
}

// ----------------- filtering helpers -----------------
function hasCyrillic(s: string): boolean {
  return /[А-Яа-яЁё]/.test(s);
}
function isUrlish(s: string): boolean {
  return /^(https?:)?\/\//i.test(s) || /^tel:/i.test(s) || /^mailto:/i.test(s);
}
function isPathish(s: string): boolean {
  return /^\s*\/[^\s]+?\s*$/.test(s);
}
function looksLikeJsonLdKey(s: string): boolean {
  return s === "@context" || s === "@type" || s.startsWith("schema:");
}
function tokenIsUtility(tk: string): boolean {
  return /^(?:[a-z]{1,3}:)?[a-z0-9_-]+(?:\/\d+)?(?:\[[^\]]*\])?$/i.test(tk);
}
function looksLikeClassList(s: string): boolean {
  const trimmed = s.trim();
  if (!trimmed) return false;
  if (/\s/.test(trimmed) === false) return false;
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2) return false;
  let util = 0;
  for (const p of parts) {
    if (!hasCyrillic(p) && (tokenIsUtility(p) || /-/.test(p) || /:/.test(p)))
      util++;
  }
  return util / parts.length >= 0.8;
}
function hasCodeKeywords(s: string): boolean {
  return /\b(function|const|let|var|return|if|else|for|while|switch|case|break|continue|=>|document\.|window\.|addEventListener|querySelector|setTimeout|clearTimeout|requestSubmit)\b/.test(
    s,
  );
}
function looksLikeCodeBlock(s: string): boolean {
  const nl = (s.match(/\n/g) || []).length;
  if (nl >= 2) return true;
  const punct = (s.match(/[{}();=\[\]<>]/g) || []).length;
  if (punct >= 4) return true;
  if (hasCodeKeywords(s)) return true;
  return false;
}
function isBlockedAttrName(name: string): boolean {
  const n = name.toLowerCase();
  if (n === "class" || n === "classname" || n === "style") return true;
  if (n === "href" || n === "src" || n === "rel" || n === "target") return true;
  if (
    n === "id" ||
    n === "role" ||
    n === "type" ||
    n === "name" ||
    n === "value"
  )
    return true;
  if (n === "srcset" || n === "sizes" || n === "alt" || n === "loading")
    return true;
  if (n.startsWith("data-") || n.startsWith("aria-")) return true;
  return false;
}
function isInBlockedJsxAttr(
  path: NodePath<t.StringLiteral> | NodePath<t.TemplateLiteral>,
): boolean {
  let p: NodePath | null = path.parentPath;
  while (p) {
    if (p.isJSXAttribute()) {
      const attr = p.node.name;
      if (t.isJSXIdentifier(attr) && isBlockedAttrName(attr.name)) return true;
    }
    if (p.isJSXOpeningElement()) break;
    p = p.parentPath;
  }
  return false;
}
function isObjectPropertyKey(path: NodePath<t.StringLiteral>): boolean {
  const parent = path.parentPath?.node;
  return !!(parent && t.isObjectProperty(parent) && parent.key === path.node);
}
function isLikelyHumanRuText(s: string): boolean {
  const trimmed = s.trim();
  if (!trimmed) return false;
  if (!hasCyrillic(trimmed)) return false;
  if (isUrlish(trimmed) || isPathish(trimmed)) return false;
  if (looksLikeJsonLdKey(trimmed)) return false;
  if (looksLikeClassList(trimmed)) return false;
  if (looksLikeCodeBlock(trimmed)) return false;
  if (!/[A-Za-zА-Яа-яЁё]/.test(trimmed) && /[\d\s.,:/\\-]+/.test(trimmed))
    return false;
  return true;
}

// ----------------- parse & collect -----------------
function parseCode(file: string) {
  const src = fs.readFileSync(file, "utf8");
  const ast = parser.parse(src, {
    sourceType: "module",
    plugins: [
      "typescript",
      "jsx",
      "classProperties",
      "decorators-legacy",
      "importAssertions",
      "topLevelAwait",
    ],
  });
  return { src, ast };
}

type IndexItem = { src: string; text: string };
const GLOBAL_MAP: Record<string, string> = {};
const INDEX_MAP: Record<string, IndexItem> = {};
let TOTAL_CHARS = 0;

function collectFromFile(fileAbs: string) {
  const relNorm = normalizedRelFor(fileAbs);
  const { ast } = parseCode(fileAbs);

  function pushText(raw: string) {
    if (!isLikelyHumanRuText(raw)) return;
    const id = stableId(relNorm, raw);
    if (GLOBAL_MAP[id]) return;
    GLOBAL_MAP[id] = raw;
    INDEX_MAP[id] = { src: relNorm, text: raw };
    TOTAL_CHARS += raw.length;
  }

  traverse(ast, {
    StringLiteral(p) {
      const parent = p.parentPath?.node;
      if (
        t.isImportDeclaration(parent) ||
        t.isExportAllDeclaration(parent) ||
        t.isExportNamedDeclaration(parent)
      )
        return;
      if (isObjectPropertyKey(p)) return;
      if (isInBlockedJsxAttr(p)) return;
      pushText(p.node.value);
    },
    TemplateLiteral(p) {
      if (p.node.expressions.length > 0) return;
      if (isInBlockedJsxAttr(p)) return;
      const txt = p.node.quasis.map((q) => q.value.cooked ?? "").join("");
      pushText(txt);
    },
    JSXText(p) {
      const raw = p.node.value;
      const cleaned = raw.replace(/\s+/g, " ").trim();
      if (!cleaned) return;
      pushText(cleaned);
    },
  });
}

function removeOldParts(lang: string) {
  if (!fs.existsSync(LOCALES_DIR)) return;
  for (const name of fs.readdirSync(LOCALES_DIR)) {
    if (name.startsWith(`${lang}.part-`) && name.endsWith(".json")) {
      fs.unlinkSync(path.join(LOCALES_DIR, name));
    }
  }
}

function writeParts(lang: string, map: Record<string, string>) {
  const ids = Object.keys(map).sort(); // stable
  if (ids.length === 0) return 0;
  if (lang === "ru" && CLEAR_RU) removeOldParts(lang);
  else if (lang !== "ru" && FORCE_SCAFFOLD) removeOldParts(lang);

  let part = 1,
    written = 0;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunkIds = ids.slice(i, i + CHUNK_SIZE);
    const obj: Record<string, string> = {};
    for (const id of chunkIds) obj[id] = map[id];
    const fname = `${lang}.part-${part}.json`;
    const outPath = path.join(LOCALES_DIR, fname);
    if (lang !== "ru" && !FORCE_SCAFFOLD && fs.existsSync(outPath)) {
      // keep existing translations unless forcing
      console.log(`[extract] skip existing ${fname}`);
    } else {
      fs.mkdirSync(LOCALES_DIR, { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify(obj, null, 2), "utf8");
      console.log(`[extract] wrote ${fname} (${chunkIds.length})`);
      written++;
    }
    part++;
  }
  return written;
}

function writeIndex(lang: string, index: Record<string, IndexItem>) {
  if (!WRITE_INDEX) return;
  const outPath = path.join(LOCALES_DIR, `${lang}.index.json`);
  fs.writeFileSync(outPath, JSON.stringify(index, null, 2), "utf8");
  console.log(`[extract] wrote ${lang}.index.json (for debugging)`);
}

function scaffoldTargets(idsToText: Record<string, string>) {
  if (SCAFFOLD_TARGETS.length === 0) return;
  const emptyMap: Record<string, string> = {};
  for (const id of Object.keys(idsToText)) emptyMap[id] = "";
  for (const lang of SCAFFOLD_TARGETS) {
    writeParts(lang, emptyMap);
  }
}

(async function main() {
  const dirs = listDirs();
  const files: string[] = [];
  for (const d of dirs) walkWithExcursionsLimit(d, files);

  for (const abs of files) collectFromFile(abs);

  // Always write RU parts from GLOBAL_MAP
  const ruWritten = writeParts("ru", GLOBAL_MAP);
  if (WRITE_INDEX) writeIndex("ru", INDEX_MAP);

  // Optionally scaffold other locales with empty strings (without clobbering unless --forceScaffold)
  scaffoldTargets(GLOBAL_MAP);

  const total = Object.keys(GLOBAL_MAP).length;
  const partsCount = Math.ceil(total / CHUNK_SIZE);

  console.log(
    `\n[i18n-extract] ru strings=${total}, parts=${partsCount}, CHUNK_SIZE=${CHUNK_SIZE}`,
  );
  console.log(`[i18n-extract] total RU characters=${TOTAL_CHARS}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
