/* eslint-disable */
import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import crypto from "node:crypto";

/**
 * Генерирует локали в .i18n/worktree:
 *   - копия проекта (без node_modules/.git/.next/.i18n)
 *   - app/(pages)/<lang>/** — из app/(pages)/ru/**
 *   - зеркальные и переведённые app/components/** и app/config/**
 * Переводы берутся из i18n/locales/<lang>.json.
 */

// ---------------- CONFIG ----------------
const PROJECT_ROOT = process.cwd();
const OUT_ROOT = path.resolve(process.env.I18N_OUT_DIR || path.join(PROJECT_ROOT, ".i18n", "worktree"));

const PAGES_GROUP   = "(pages)";
const SRC_LOCALE    = "ru";
const PAGES_RU_DIR  = path.join(OUT_ROOT, "app", PAGES_GROUP, SRC_LOCALE); // работаем в worktree
const OUT_BASE      = path.join(OUT_ROOT, "app", PAGES_GROUP);
const LOCALES_DIR   = path.join(PROJECT_ROOT, "i18n", "locales");
const PUBLIC_DIR    = path.join(OUT_ROOT, "public");

const LANGS: string[] = (process.argv[2] || process.env.I18N_GEN_LANGS || "en")
  .split(",").map(s => s.trim()).filter(Boolean);

// каталоги для зеркалирования/перевода (от корня проекта)
const MIRROR_DIRS = ["app/components","app/config"];

const CODE_EXT = new Set([".tsx",".jsx",".ts",".js"]);

const TRANSLATABLE_ATTRS = new Set([
  "alt","title","aria-label","ariaDescription","placeholder",
  "label","aria-placeholder","aria-labelledby","aria-describedby","content"
]);

const CONFIG_KEYS = new Set([
  "title","name","label","subtitle","heading","buttonText","cta",
  "description","shortDescription","summary","note","info","warning",
  "city","country","location","itinerary","highlights",
  "seoTitle","seoDescription","metaTitle","metaDescription","keywords",
]);

const VAR_NAME_HINTS = new Set([
  "title","name","label","heading","subtitle","button","buttonText","cta","text","caption","placeholder","summary","description"
]);

const CALL_TEXT_FUNS = new Set(["toast","alert","confirm","prompt"]);

const SEO_KEYS = new Set(["title","description","openGraph","alternates","twitter","keywords"]);

// агрессивный режим для конфигов: переводить любые «человеческие» строки
const CONFIG_ALL = /^1|true$/i.test(process.env.I18N_CONFIG_ALL || "");

// ---------------------------------------

type Dict = Record<string, string>;
type Report = { replaced: number; missing: Array<{file:string; value:string; id:string; where:string}> };

function ensureDir(p: string) { fs.mkdirSync(p, { recursive: true }); }
function norm(s: string) { return s.replace(/\s+/g, " ").trim(); }
function slugify(s: string) { return s.toLowerCase().replace(/["'`’]/g,"").replace(/[^a-zа-я0-9]+/gi,"-").replace(/^-+|-+$/g,"").slice(0,40); }
function shortHash(s: string) { return crypto.createHash("sha256").update(s).digest("hex").slice(0,8); }
function makeId(ru: string) { const n = norm(ru); const slug = slugify(n) || "text"; return `${slug}__${shortHash(n)}`; }
function isWS(s: string) { return norm(s).length === 0; }

function isUrlLike(s: string) { return /^https?:\/\//i.test(s) || /^mailto:|^tel:/i.test(s); }
function looksLikePathOrFile(s: string) {
  if (/[\\/]/.test(s) || /\.[a-z0-9]{2,5}$/i.test(s)) return true;
  return /\.(svg|png|jpe?g|webp|avif|gif|ico|css|scss|less|ts|tsx|js|jsx|json|mdx?|mp3|mp4|pdf)$/i.test(s);
}
function looksLikeClassnames(s: string) {
  const tokens = s.trim().split(/\s+/);
  if (tokens.length < 3) return false;
  const techish = tokens.filter(t => /^[a-z0-9\-:\/\[\]\(\)\.]+$/i.test(t)).length;
  return techish / tokens.length > 0.8 && !/[А-Яа-яЁё]/.test(s);
}
function isProbablyHumanText(s: string) {
  const n = norm(s);
  if (n.length < 2) return false;
  if (isUrlLike(n) || looksLikePathOrFile(n) || looksLikeClassnames(n)) return false;
  if (/[А-Яа-яЁё]/.test(n)) return true;
  if (/\s/.test(n) && /[A-Za-z]/.test(n)) return true;
  return false;
}

function readJson(p: string, fallback: any = {}) { if (!fs.existsSync(p)) return fallback; try { return JSON.parse(fs.readFileSync(p,"utf8")); } catch { return fallback; } }

// --- перевод по словарю (ищем по id и по RU-строке) ---
function lookup(dict: Dict, ruRaw: string) {
  const ruNorm = norm(ruRaw);
  const id = makeId(ruNorm);
  if (dict[id] && dict[id].length > 0) return dict[id];
  if (dict[ruRaw] && dict[ruRaw].length > 0) return dict[ruRaw];
  if (dict[ruNorm] && dict[ruNorm].length > 0) return dict[ruNorm];
  return null;
}

let report: Report;

function translate(ru: string, dict: Dict, fileRel: string, where: string) {
  const found = lookup(dict, ru);
  if (found !== null) { report.replaced++; return found; }
  const id = makeId(ru);
  report.missing.push({ file:fileRel, value:ru, id, where });
  return ru;
}

// ---------- подготовка worktree ----------
function copyProjectToOut() {
  fs.rmSync(OUT_ROOT, { recursive: true, force: true });
  ensureDir(OUT_ROOT);
  const files = fg.sync(["**/*"], {
    cwd: PROJECT_ROOT,
    dot: true,
    absolute: false,
    ignore: ["**/node_modules/**","**/.git/**","**/.next/**","**/.i18n/**",".i18n/**"],
  });
  for (const rel of files) {
    const src = path.join(PROJECT_ROOT, rel);
    const dst = path.join(OUT_ROOT, rel);
    const st = fs.lstatSync(src);
    if (st.isDirectory()) { ensureDir(dst); continue; }
    ensureDir(path.dirname(dst));
    fs.copyFileSync(src, dst);
  }
}

// ---------- резолв импортов в worktree ----------
const EXT_TRY = ["", ".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts", "/index.jsx", "/index.js"];

function resolveImport(fromAbs: string, spec: string): string | null {
  if (spec.startsWith("@/")) {
    const base = path.join(OUT_ROOT, spec.slice(2));
    for (const ext of EXT_TRY) { const p = base + ext; if (fs.existsSync(p)) return p; }
    return null;
  }
  if (spec.startsWith("/")) {
    const base = path.join(OUT_ROOT, spec.slice(1));
    for (const ext of EXT_TRY) { const p = base + ext; if (fs.existsSync(p)) return p; }
    return null;
  }
  const base = path.resolve(path.dirname(fromAbs), spec);
  for (const ext of EXT_TRY) { const p = base + ext; if (fs.existsSync(p)) return p; }
  return null;
}
function pathNoExt(p: string) { const pr = path.parse(p); return path.join(pr.dir, pr.name).replace(/\\/g,"/"); }
function relSpecifier(fromFileAbs: string, targetAbs: string) {
  let rel = path.relative(path.dirname(fromFileAbs), targetAbs);
  if (!rel.startsWith(".")) rel = "./" + rel;
  rel = rel.replace(/\\/g,"/");
  return pathNoExt(rel);
}
function underAnyDir(p: string, dirsAbs: string[]) {
  const normp = p.replace(/\\/g,"/");
  for (const d of dirsAbs) {
    const dn = d.replace(/\\/g,"/") + "/";
    if (normp.startsWith(dn)) return { dirAbs: d, rel: normp.slice(dn.length) };
  }
  return null;
}
function startsWithPublic(p: string) {
  const a = p.replace(/\\/g, "/");
  const b = PUBLIC_DIR.replace(/\\/g, "/") + "/";
  return a.startsWith(b);
}
function extractAfterPublic(spec: string) {
  const i = spec.indexOf("public/");
  return i >= 0 ? spec.slice(i + "public/".length) : null;
}

// ---------- трансформация кода ----------
async function transformCode(code: string, dict: Dict, outAbs: string, fileRel: string, importRewriter: (spec: string) => string | null) {
  const ast = parser.parse(code, { sourceType: "module", plugins: ["jsx","typescript","classProperties","decorators-legacy"] });
  let changed = false; const mark = () => { changed = true; };

  traverse(ast, {
    JSXText(p) {
      const raw = p.node.value;
      if (isWS(raw)) return;
      const ru = norm(raw);
      const tr = translate(ru, dict, fileRel, "<JSXText>");
      if (tr !== ru) {
        const lead = raw.match(/^\s*/)?.[0] || "", trail = raw.match(/\s*$/)?.[0] || "";
        p.node.value = lead + tr + trail; mark();
      }
    },
    JSXAttribute(p) {
      if (!t.isJSXIdentifier(p.node.name)) return;
      const name = p.node.name.name;
      if (!TRANSLATABLE_ATTRS.has(name)) return;
      const v = p.node.value; if (!v) return;
      const set = (val: string) => { p.node.value = t.stringLiteral(val); mark(); };
      if (t.isStringLiteral(v)) {
        const ru = norm(v.value); if (!ru || !isProbablyHumanText(ru)) return;
        const tr = translate(ru, dict, fileRel, `<@${name}>`);
        if (tr !== ru) set(tr);
      } else if (t.isJSXExpressionContainer(v) && t.isStringLiteral(v.expression)) {
        const ru = norm(v.expression.value); if (!ru || !isProbablyHumanText(ru)) return;
        const tr = translate(ru, dict, fileRel, `<@${name}>`);
        if (tr !== ru) set(tr);
      }
    },
    StringLiteral(p) {
      const ru = norm(p.node.value || ""); if (!ru) return;

      if (underAny(p, SEO_KEYS) && isProbablyHumanText(ru)) {
        const tr = translate(ru, dict, fileRel, "<metadata>");
        if (tr !== ru) { p.node.value = tr; mark(); }
        return;
      }

      // находимся в файле
      const absHint = path.join(OUT_ROOT, fileRel);

      const inConfig = absHint.includes("/app/config/");
      const inComponents = absHint.includes("/app/components/");

      if (inConfig) {
        if ((CONFIG_ALL && isProbablyHumanText(ru)) || (underAny(p, CONFIG_KEYS) && isProbablyHumanText(ru))) {
          const tr = translate(ru, dict, fileRel, "<config>");
          if (tr !== ru) { p.node.value = tr; mark(); }
          return;
        }
      }

      if ((inComponents || !inConfig) && underVarName(p, VAR_NAME_HINTS) && isProbablyHumanText(ru)) {
        const tr = translate(ru, dict, fileRel, "<var>");
        if (tr !== ru) { p.node.value = tr; mark(); }
        return;
      }
    },
    TemplateLiteral(p) {
      if (p.node.expressions.length > 0) return;
      const raw = p.node.quasis.map(q => q.value.cooked ?? q.value.raw ?? "").join("");
      const ru = norm(raw); if (!ru || !isProbablyHumanText(ru)) return;
      const absHint = path.join(OUT_ROOT, fileRel);
      const inConfig = absHint.includes("/app/config/");

      if (underAny(p, SEO_KEYS)) {
        const tr = translate(ru, dict, fileRel, "<template:metadata>");
        if (tr !== ru) {
          const lead = raw.match(/^\s*/)?.[0] || "", trail = raw.match(/\s*$/)?.[0] || "";
          p.node.quasis = [t.templateElement({ raw: lead+tr+trail, cooked: lead+tr+trail }, true)];
          mark();
        }
        return;
      }
      if (inConfig && (CONFIG_ALL || underAny(p, CONFIG_KEYS))) {
        const tr = translate(ru, dict, fileRel, "<template:config>");
        if (tr !== ru) {
          const lead = raw.match(/^\s*/)?.[0] || "", trail = raw.match(/\s*$/)?.[0] || "";
          p.node.quasis = [t.templateElement({ raw: lead+tr+trail, cooked: lead+tr+trail }, true)];
          mark();
        }
      }
    },
    CallExpression(p) {
      const callee = p.node.callee;
      let name: string | null = null;
      if (t.isIdentifier(callee)) name = callee.name;
      if (!name || !CALL_TEXT_FUNS.has(name)) return;
      const arg = p.node.arguments[0];
      if (arg && t.isStringLiteral(arg) && isProbablyHumanText(arg.value)) {
        const ru = norm(arg.value);
        const tr = translate(ru, dict, fileRel, `<call:${name}>`);
        if (tr !== ru) { arg.value = tr; mark(); }
      }
    },
    ImportDeclaration(p) {
      const src = p.node.source.value;
      const repl = importRewriter(src);
      if (repl) { p.node.source = t.stringLiteral(repl); mark(); }
    },
  });

  // Safety-pass: любые импорты, начинающиеся с "__mirror/", превращаем в "./__mirror/..."
  traverse(ast, {
    ImportDeclaration(p) {
      const v = p.node.source.value;
      if (typeof v === "string" && v.startsWith("__mirror/")) {
        p.node.source = t.stringLiteral("./" + v);
      }
    }
  });

  const out = generate(ast, { retainLines: true, jsescOption: { minimal: true } }, code).code;
  return { code: out, changed };
}

// helpers for AST context
function underVarName(pathNode: NodePath, names: Set<string>): boolean {
  let p: NodePath | null = pathNode;
  while (p) {
    if (t.isVariableDeclarator(p.node) && t.isIdentifier(p.node.id)) {
      if (names.has(p.node.id.name)) return true;
    }
    p = p.parentPath as NodePath | null;
  }
  return false;
}

function underAny(pathNode: NodePath, keys: Set<string>): boolean {
  let p: NodePath | null = pathNode;
  while (p) {
    const n = p.node;
    if (t.isObjectProperty(n)) {
      const k = t.isIdentifier(n.key) ? n.key.name : (t.isStringLiteral(n.key) ? n.key.value : "");
      if (k && keys.has(k)) return true;
    }
    p = p.parentPath as NodePath | null;
  }
  return false;
}

// ---------- генерация ----------
(async function main() {
  // 1) подготовить чистую worktree-копию проекта
  copyProjectToOut();

  // 2) список ru-страниц внутри worktree
  if (!fs.existsSync(PAGES_RU_DIR)) {
    console.error(`Не найден источник страниц: ${path.relative(OUT_ROOT, PAGES_RU_DIR)}`);
    process.exit(1);
  }
  const pageFilesRU = await fg("**/*", { cwd: PAGES_RU_DIR, absolute: true, dot: true, ignore: ["**/.DS_Store"] });

  // 3) абсолютные пути зеркалируемых корней (внутри worktree)
  const mirrorRootsAbs = MIRROR_DIRS.map(d => path.join(OUT_ROOT, d)).filter(d => fs.existsSync(d));

  for (const lang of LANGS) {
    if (lang === SRC_LOCALE) continue;

    const dictPath = path.join(LOCALES_DIR, `${lang}.json`);
    const dict: Dict = readJson(dictPath, {});
    console.log(`${lang}: loaded ${Object.keys(dict).length} keys from ${path.relative(PROJECT_ROOT, dictPath)}`);

    report = { replaced: 0, missing: [] };

    // 3.1) зеркалим и переводим компоненты/конфиги
    const mirrorBase = path.join(OUT_BASE, lang, "__mirror");
    for (const rootAbs of mirrorRootsAbs) {
      const relRoot = path.relative(OUT_ROOT, rootAbs).replace(/\\/g,"/"); // напр. "app/components"
      const files = await fg("**/*", { cwd: rootAbs, absolute: true, dot: true, ignore: ["**/.DS_Store"] });
      for (const srcAbs of files) {
        const rel = path.relative(rootAbs, srcAbs);
        const outAbs = path.join(mirrorBase, relRoot, rel);
        ensureDir(path.dirname(outAbs));
        const ext = path.extname(srcAbs).toLowerCase();

        if (!CODE_EXT.has(ext)) { fs.copyFileSync(srcAbs, outAbs); continue; }

        const code = fs.readFileSync(srcAbs, "utf8");
        // импорты внутри зеркала: на зеркало или в public
        const importRewriter = (spec: string) => {
          const resolved = resolveImport(srcAbs, spec);
          if (resolved) {
            const hit = underAnyDir(resolved, mirrorRootsAbs);
            if (hit) {
              const targetAbs = path.join(mirrorBase, path.relative(OUT_ROOT, resolved));
              return relSpecifier(outAbs, targetAbs);
            }
            if (startsWithPublic(resolved)) {
              return relSpecifier(outAbs, resolved);
            }
          } else {
            const after = extractAfterPublic(spec);
            if (after) {
              const candidate = path.join(PUBLIC_DIR, after);
              if (fs.existsSync(candidate)) return relSpecifier(outAbs, candidate);
            }
          }
          return null;
        };
        const fileRel = path.relative(OUT_ROOT, srcAbs).replace(/\\/g,"/");
        const { code: out } = await transformCode(code, dict, outAbs, fileRel, importRewriter);
        fs.writeFileSync(outAbs, out, "utf8");
      }
    }

    // 3.2) генерим страницы <lang> из ru + переписываем импорты
    const outDir = path.join(OUT_BASE, lang);
    let changedPages = 0;

    for (const srcAbs of pageFilesRU) {
      const rel = path.relative(PAGES_RU_DIR, srcAbs).replace(/\\/g,"/");
      const outAbs = path.join(outDir, rel);
      ensureDir(path.dirname(outAbs));
      const ext = path.extname(srcAbs).toLowerCase();

      if (!CODE_EXT.has(ext)) { fs.copyFileSync(srcAbs, outAbs); continue; }

      const code = fs.readFileSync(srcAbs, "utf8");
      const importRewriter = (spec: string) => {
        const resolvedForPages = resolveImport(srcAbs, spec);
        if (resolvedForPages && resolvedForPages.replace(/\\/g,"/").startsWith(PAGES_RU_DIR.replace(/\\/g,"/") + "/")) {
          const relFromRu = path.relative(PAGES_RU_DIR, resolvedForPages);
          const targetAbs = path.join(outDir, relFromRu);
          return relSpecifier(outAbs, targetAbs);
        }
        if (resolvedForPages) {
          const hit = underAnyDir(resolvedForPages, mirrorRootsAbs);
          if (hit) {
            const targetAbs = path.join(outDir, "__mirror", path.relative(OUT_ROOT, resolvedForPages));
            return relSpecifier(outAbs, targetAbs);
          }
          if (startsWithPublic(resolvedForPages)) {
            return relSpecifier(outAbs, resolvedForPages);
          }
        } else {
          const after = extractAfterPublic(spec);
          if (after) {
            const candidate = path.join(PUBLIC_DIR, after);
            if (fs.existsSync(candidate)) return relSpecifier(outAbs, candidate);
          }
        }
        if (spec.startsWith("@/app/components/") || spec.startsWith("@/app/config/") || spec.startsWith("@/components/") || spec.startsWith("@/config/")) {
          const absGuess = path.join(OUT_ROOT, spec.slice(2));
          const targetAbs = path.join(outDir, "__mirror", path.relative(OUT_ROOT, absGuess));
          return relSpecifier(outAbs, targetAbs);
        }
        return null;
      };

      const fileRel = path.relative(OUT_ROOT, srcAbs).replace(/\\/g,"/");
      const { code: out, changed } = await transformCode(code, dict, outAbs, fileRel, importRewriter);
      fs.writeFileSync(outAbs, out, "utf8");
      if (changed) changedPages++;
    }

    const rptPath = path.join(PROJECT_ROOT, "i18n", `report.${lang}.json`);
    ensureDir(path.dirname(rptPath));
    fs.writeFileSync(rptPath, JSON.stringify(report, null, 2), "utf8");

    console.log(`${lang}: pages=${pageFilesRU.length}, changed=${changedPages}, replaced=${report.replaced}, missing=${report.missing.length}`);
    console.log(`worktree: ${path.relative(PROJECT_ROOT, OUT_ROOT)}`);
  }
})().catch(e => { console.error(e); process.exit(1); });
