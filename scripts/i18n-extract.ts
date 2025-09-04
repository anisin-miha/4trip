/* eslint-disable */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import fg from "fast-glob";
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

// --------- CONFIG ----------
const PROJECT_ROOT = process.cwd();

// что сканируем
const SCAN_DIRS = [
  "app/(pages)/ru",
  "app/components",
  "app/config",
];

const CODE_EXT = new Set([".tsx", ".jsx", ".ts", ".js"]);

const OUT_DIR = path.join(PROJECT_ROOT, "i18n", "extract");
const LOCALES_DIR = path.join(PROJECT_ROOT, "i18n", "locales");
const RU_JSON = path.join(OUT_DIR, "messages.ru.json");
const CTX_JSON = path.join(OUT_DIR, "contexts.json");

const TARGET_LOCALES: string[] = (process.env.I18N_LOCALES || "ru,en")
  .split(",").map(s => s.trim()).filter(Boolean);

// агрессивный режим для конфигов: собирать любые «человеческие» строки
const CONFIG_ALL = /^1|true$/i.test(process.env.I18N_CONFIG_ALL || "");

// какие JSX-атрибуты считаем текстовыми
const TRANSLATABLE_ATTRS = new Set([
  "alt","title","aria-label","ariaDescription","placeholder",
  "label","aria-placeholder","aria-labelledby","aria-describedby","content"
]);

// ключи, по которым вытаскиваем строки из объектов в конфиге/турах/мета
const CONFIG_KEYS = new Set([
  "title","name","label","subtitle","heading","buttonText","cta",
  "description","shortDescription","summary","note","info","warning",
  "city","country","location","itinerary","highlights",
  "seoTitle","seoDescription","metaTitle","metaDescription","keywords",
]);

// VariableDeclarator id hints: const title="..."
const VAR_NAME_HINTS = new Set([
  "title","name","label","heading","subtitle","button","buttonText","cta","text","caption","placeholder","summary","description"
]);

// функции, из которых извлекаем строки аргументов
const CALL_TEXT_FUNS = new Set(["toast","alert","confirm","prompt"]);

// в export const metadata = { ... } эти ключи считаем текстовыми
const SEO_KEYS = new Set(["title","description","openGraph","alternates","twitter","keywords"]);
// ---------------------------

type Context = { file: string; where: string; sample?: string };

const messages = new Map<string, string>();      // id -> ru
const contexts = new Map<string, Context[]>();   // id -> occurrences

const ensureDir = (p: string) => fs.mkdirSync(p, { recursive: true });

function slugify(s: string) {
  return s.toLowerCase().replace(/["'`’]/g,"").replace(/[^a-zа-я0-9]+/gi,"-").replace(/^-+|-+$/g,"").slice(0, 40);
}
function norm(s: string) { return s.replace(/\s+/g, " ").trim(); }
function shortHash(s: string) { return crypto.createHash("sha256").update(s).digest("hex").slice(0, 8); }
function makeId(ru: string) { const n = norm(ru); const slug = slugify(n) || "text"; return `${slug}__${shortHash(n)}`; }
function isWhitespaceOnly(s: string) { return norm(s).length === 0; }

function isUrlLike(s: string) { return /^https?:\/\//i.test(s) || /^mailto:|^tel:/i.test(s); }
function looksLikePathOrFile(s: string) {
  if (/[\\/]/.test(s) || /\.[a-z0-9]{2,5}$/i.test(s)) return true;
  return /\.(svg|png|jpe?g|webp|avif|gif|ico|css|scss|less|ts|tsx|js|jsx|json|mdx?|mp3|mp4|pdf)$/i.test(s);
}
function looksLikeClassnames(s: string) {
  // грубо: много токенов a-z0-9-:/[...]
  const tokens = s.trim().split(/\s+/);
  if (tokens.length < 3) return false;
  const techish = tokens.filter(t => /^[a-z0-9\-:\/\[\]\(\)\.]+$/i.test(t)).length;
  return techish / tokens.length > 0.8 && !/[А-Яа-яЁё]/.test(s);
}
function isProbablyHumanText(s: string) {
  const n = norm(s);
  if (n.length < 2) return false;
  if (isUrlLike(n) || looksLikePathOrFile(n) || looksLikeClassnames(n)) return false;
  // кириллица → точно текст
  if (/[А-Яа-яЁё]/.test(n)) return true;
  // латиница с пробелом и буквами → вероятный текст
  if (/\s/.test(n) && /[A-Za-z]/.test(n)) return true;
  return false;
}

function record(id: string, ru: string, where: Context) {
  const ex = messages.get(id);
  if (ex && ex !== ru) { id = `${id}_${shortHash(ru).slice(0,4)}`; }
  messages.set(id, ru);
  const arr = contexts.get(id) || [];
  arr.push(where);
  contexts.set(id, arr);
}

function underAny(nodePath: NodePath, keys: Set<string>): boolean {
  let p: NodePath | null = nodePath;
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

function underVarName(path: NodePath, names: Set<string>): boolean {
  let p: NodePath | null = path;
  while (p) {
    if (t.isVariableDeclarator(p.node) && t.isIdentifier(p.node.id)) {
      if (names.has(p.node.id.name)) return true;
    }
    p = p.parentPath as NodePath | null;
  }
  return false;
}

function isConfigFile(abs: string) {
  const p = abs.replace(/\\/g,"/");
  return p.includes("/app/config/");
}

function isInComponents(abs: string) {
  const p = abs.replace(/\\/g,"/");
  return p.includes("/app/components/");
}

async function processFile(absPath: string) {
  const code = fs.readFileSync(absPath, "utf8");
  const ast = parser.parse(code, { sourceType: "module", plugins: ["jsx","typescript","classProperties","decorators-legacy"] });
  const rel = path.relative(PROJECT_ROOT, absPath).replace(/\\/g,"/");
  const inConfig = isConfigFile(absPath);
  const inComponents = isInComponents(absPath);

  traverse(ast, {
    // 1) Чистый текст между JSX-тегами
    JSXText(p) {
      const raw = p.node.value;
      if (isWhitespaceOnly(raw)) return;
      const ru = norm(raw);
      if (!ru) return;
      record(makeId(ru), ru, { file: rel, where: "<JSXText>", sample: ru.slice(0,120) });
    },
    // 2) Строковые атрибуты JSX
    JSXAttribute(p) {
      if (!t.isJSXIdentifier(p.node.name)) return;
      const name = p.node.name.name;
      if (!TRANSLATABLE_ATTRS.has(name)) return;
      const v = p.node.value; if (!v) return;
      let ru: string | null = null;
      if (t.isStringLiteral(v)) ru = norm(v.value);
      else if (t.isJSXExpressionContainer(v) && t.isStringLiteral(v.expression)) ru = norm(v.expression.value);
      if (!ru || !isProbablyHumanText(ru)) return;
      record(makeId(ru), ru, { file: rel, where: `<@${name}>`, sample: ru.slice(0,120) });
    },
    // 3) Строки в metadata, конфиг-объектах, переменных, вызовах
    StringLiteral(p) {
      const ru = norm(p.node.value || "");
      if (!ru) return;

      // метаданные (в любых файлах)
      if (underAny(p, SEO_KEYS) && isProbablyHumanText(ru)) {
        record(makeId(ru), ru, { file: rel, where: "<metadata>", sample: ru.slice(0,120) });
        return;
      }

      // конфиг: либо whitelisted ключи, либо любой «человеческий» текст в агрессивном режиме
      if (inConfig) {
        if ((CONFIG_ALL && isProbablyHumanText(ru)) || (underAny(p, CONFIG_KEYS) && isProbablyHumanText(ru))) {
          record(makeId(ru), ru, { file: rel, where: "<config>", sample: ru.slice(0,120) });
          return;
        }
      }

      // компоненты/страницы: строки в переменных типа const title="..."
      if ((inComponents || !inConfig) && underVarName(p, VAR_NAME_HINTS) && isProbablyHumanText(ru)) {
        record(makeId(ru), ru, { file: rel, where: "<var>", sample: ru.slice(0,120) });
        return;
      }
    },
    // 4) Чистые шаблоны без выражений
    TemplateLiteral(p) {
      if (p.node.expressions.length > 0) return;
      const raw = p.node.quasis.map(q => q.value.cooked ?? q.value.raw ?? "").join("");
      const ru = norm(raw);
      if (!ru || !isProbablyHumanText(ru)) return;

      if (underAny(p, SEO_KEYS)) {
        record(makeId(ru), ru, { file: rel, where: "<template:metadata>", sample: ru.slice(0,120) });
        return;
      }
      if (inConfig && (CONFIG_ALL || underAny(p, CONFIG_KEYS))) {
        record(makeId(ru), ru, { file: rel, where: "<template:config>", sample: ru.slice(0,120) });
        return;
      }
      if (underVarName(p, VAR_NAME_HINTS)) {
        record(makeId(ru), ru, { file: rel, where: "<template:var>", sample: ru.slice(0,120) });
        return;
      }
    },
    // 5) Вызовы типа toast("..."), alert("...")
    CallExpression(p) {
      const callee = p.node.callee;
      let name: string | null = null;
      if (t.isIdentifier(callee)) name = callee.name;
      if (!name || !CALL_TEXT_FUNS.has(name)) return;
      const arg = p.node.arguments[0];
      if (arg && t.isStringLiteral(arg)) {
        const ru = norm(arg.value);
        if (isProbablyHumanText(ru)) {
          record(makeId(ru), ru, { file: rel, where: `<call:${name}>`, sample: ru.slice(0,120) });
        }
      }
    }
  });
}

function saveJson(p: string, obj: any) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf8");
}

function loadLocale(lang: string): Record<string,string> {
  const p = path.join(LOCALES_DIR, `${lang}.json`);
  if (!fs.existsSync(p)) return {};
  try { return JSON.parse(fs.readFileSync(p,"utf8")); } catch { return {}; }
}

function syncLocales() {
  const source = Object.fromEntries([...messages.entries()].sort());
  // ru.json — полный источник
  saveJson(path.join(LOCALES_DIR, "ru.json"), source);

  // остальные локали — добавляем недостающие ключи пустыми
  for (const lang of TARGET_LOCALES) {
    if (lang === "ru") continue;
    const current = loadLocale(lang);
    const next: Record<string,string> = {};
    for (const [id, ru] of Object.entries(source)) {
      next[id] = Object.prototype.hasOwnProperty.call(current, id) ? current[id] : "";
    }
    saveJson(path.join(LOCALES_DIR, `${lang}.json`), next);
    const missing = Object.entries(next).filter(([_, v]) => !v).length;
    const obsolete = Object.keys(current).filter(id => !(id in source)).length;
    console.log(`Locale ${lang}: missing=${missing}, obsolete_kept=${obsolete}`);
  }
}

(async function main() {
  const patterns = SCAN_DIRS.map(d => `${d.replace(/\\/g,"/")}/**/*`);
  const files = await fg(patterns, {
    cwd: PROJECT_ROOT,
    absolute: true,
    dot: false,
    ignore: ["**/node_modules/**","**/.next/**","**/.git/**","**/.i18n/**"],
  });

  for (const f of files) {
    if (!CODE_EXT.has(path.extname(f))) continue;
    await processFile(path.resolve(f));
  }

  const ruObj = Object.fromEntries([...messages.entries()].sort());
  ensureDir(OUT_DIR);
  saveJson(RU_JSON, ruObj);
  const ctxObj = Object.fromEntries([...contexts.entries()].map(([k,v]) => [k, v]));
  saveJson(CTX_JSON, ctxObj);

  console.log(`Extracted ${Object.keys(ruObj).length} strings`);
  console.log(`  -> ${path.relative(PROJECT_ROOT, RU_JSON)}`);
  console.log(`  -> ${path.relative(PROJECT_ROOT, CTX_JSON)}`);

  ensureDir(LOCALES_DIR);
  syncLocales();
})().catch(e => { console.error(e); process.exit(1); });
