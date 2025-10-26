import fs from "node:fs";
import path from "node:path";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import crypto from "node:crypto";

type Dict = Record<string, string>;

const argv = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
  }),
);

const PROJECT_ROOT = path.resolve(String(argv.root || process.cwd()));
const SRC_LANG = String(argv.src || "ru");
const TARGETS = String(argv.to || "en")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const PAGES_DIR = String(argv.pagesDir || "app/(pages)");
const OVERWRITE = String(argv.overwrite || "0") === "1";
const COPY_SIDE = String(argv.copySideDirs || "1") === "1";
const SIDE_DIRS = String(argv.sideDirs || "app/components,app/config")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}
function normalizeText(s: string): string {
  return s
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function idFor(text: string): string {
  const n = normalizeText(text);
  return crypto.createHash("sha1").update(n).digest("hex").slice(0, 10);
}

function loadDict(lang: string): Dict {
  const locDir = path.join(PROJECT_ROOT, "i18n", "locales");
  const agg = path.join(locDir, `${lang}.json`);
  let dict: Dict = {};
  if (fs.existsSync(agg)) {
    dict = JSON.parse(fs.readFileSync(agg, "utf8"));
  } else {
    const parts = fs
      .readdirSync(locDir)
      .filter((f) => f.startsWith(`${lang}.part`) && f.endsWith(".json"))
      .sort();
    for (const f of parts) {
      const part = JSON.parse(fs.readFileSync(path.join(locDir, f), "utf8"));
      dict = { ...dict, ...part };
    }
    if (Object.keys(dict).length === 0)
      throw new Error(`No dictionary for ${lang}`);
  }
  return dict;
}

function parseCode(code: string, filename: string) {
  return parser.parse(code, {
    sourceType: "module",
    plugins: [
      "typescript",
      "jsx",
      "importAttributes",
      "classProperties",
      "classPrivateProperties",
      "classPrivateMethods",
      "dynamicImport",
      "topLevelAwait",
    ],
    sourceFilename: filename,
  });
}

function walk(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, files);
    else if (entry.isFile() && (p.endsWith(".ts") || p.endsWith(".tsx")))
      files.push(p);
  }
  return files;
}

function copyTree(srcDir: string, dstDir: string) {
  ensureDir(dstDir);
  const files: string[] = [];
  (function walk2(d: string) {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk2(p);
      else if (e.isFile() && (p.endsWith(".ts") || p.endsWith(".tsx")))
        files.push(p);
    }
  })(srcDir);
  for (const abs of files) {
    const rel = path.relative(srcDir, abs);
    const dst = path.join(dstDir, rel);
    ensureDir(path.dirname(dst));
    if (!fs.existsSync(dst) || OVERWRITE) fs.copyFileSync(abs, dst);
  }
}

function replaceImportPath(p: string, lang: string): string {
  if (/^[a-z]+:\/\//i.test(p)) return p;
  return p.replace(/\/ru(?=\/)/g, `/${lang}`);
}

function replaceLocaleSlugInSpecifier(s: string, lang: string): string {
  return replaceImportPath(s, lang);
}

function replaceHrefStart(s: string, lang: string): string {
  return s.replace(/^\/ru(?=\/|$)/g, `/${lang}`);
}

function transformWithDict(
  code: string,
  fileRel: string,
  dict: Dict,
  lang: string,
): {
  code: string;
  replaced: number;
  importChanged: number;
  hrefChanged: number;
} {
  const ast = parseCode(code, fileRel);
  let replaced = 0;
  let importChanged = 0;
  let hrefChanged = 0;

  function tryTranslate(value: string): string | null {
    const tr = dict[idFor(value)];
    return tr && tr !== value ? tr : null;
  }

  traverse(ast, {
    ImportDeclaration(p) {
      const s = (p.node.source && (p.node.source as any).value) as
        | string
        | undefined;
      if (!s) return;
      const rep = replaceLocaleSlugInSpecifier(s, lang);
      if (rep !== s) (p.node.source as any).value = rep;
    },
    ExportAllDeclaration(p) {
      const s = (p.node.source && (p.node.source as any).value) as
        | string
        | undefined;
      if (!s) return;
      const rep = replaceLocaleSlugInSpecifier(s, lang);
      if (rep !== s) (p.node.source as any).value = rep;
    },
    ExportNamedDeclaration(p) {
      const s = (p.node.source && (p.node.source as any).value) as
        | string
        | undefined;
      if (!s) return;
      const rep = replaceLocaleSlugInSpecifier(s, lang);
      if (rep !== s) (p.node.source as any).value = rep;
    },
    ImportExpression(p) {
      const arg = p.node.source;
      if (t.isStringLiteral(arg)) {
        const rep = replaceLocaleSlugInSpecifier(arg.value, lang);
        if (rep !== arg.value) arg.value = rep;
      }
    },
    CallExpression(p) {
      const callee = p.node.callee;
      if (
        t.isIdentifier(callee) &&
        callee.name === "require" &&
        p.node.arguments.length === 1
      ) {
        const a0 = p.node.arguments[0];
        if (t.isStringLiteral(a0)) {
          const rep = replaceLocaleSlugInSpecifier(a0.value, lang);
          if (rep !== a0.value) a0.value = rep;
        }
      }
    },

    JSXText(path) {
      const raw = path.node.value;
      const n = normalizeText(raw);
      if (!n) return;
      const tr = tryTranslate(n);
      if (!tr) return;
      const leading = raw.match(/^\s*/)?.[0] ?? "";
      const trailing = raw.match(/\s*$/)?.[0] ?? "";
      const next = `${leading}${tr}${trailing}`;
      if (next !== raw) {
        path.node.value = next;
        replaced++;
      }
    },

    JSXAttribute(path) {
      const v = path.node.value;
      if (t.isStringLiteral(v)) {
        const tr = tryTranslate(v.value);
        let newVal = tr ?? v.value;
        const hrefFix = replaceHrefStart(newVal, lang);
        if (hrefFix !== newVal) {
          newVal = hrefFix;
          hrefChanged++;
        }
        if (newVal !== v.value) {
          v.value = newVal;
          replaced++;
        }
      } else if (
        t.isJSXExpressionContainer(v) &&
        t.isStringLiteral(v.expression)
      ) {
        const lit = v.expression;
        const tr = tryTranslate(lit.value);
        let newVal = tr ?? lit.value;
        const hrefFix = replaceHrefStart(newVal, lang);
        if (hrefFix !== newVal) {
          newVal = hrefFix;
          hrefChanged++;
        }
        if (newVal !== lit.value) {
          lit.value = newVal;
          replaced++;
        }
      } else if (
        t.isJSXExpressionContainer(v) &&
        t.isTemplateLiteral(v.expression)
      ) {
        const tpl = v.expression as t.TemplateLiteral;
        for (const q of tpl.quasis) {
          const rawVal = (q.value.cooked ?? q.value.raw) || "";
          const leading = rawVal.match(/^\s*/)?.[0] ?? "";
          const trailing = rawVal.match(/\s*$/)?.[0] ?? "";
          const core = rawVal.slice(
            leading.length,
            rawVal.length - trailing.length,
          );
          let changed = false;
          let nextCore = core;
          const norm = normalizeText(core);
          if (norm) {
            const tr = tryTranslate(norm);
            if (tr) {
              nextCore = tr;
              changed = true;
            }
          }
          const hrefFix = replaceHrefStart(nextCore, lang);
          if (hrefFix !== nextCore) {
            nextCore = hrefFix;
            hrefChanged++;
            changed = true;
          }
          const nextVal = `${leading}${nextCore}${trailing}`;
          if (nextVal !== rawVal) {
            q.value = { cooked: nextVal, raw: nextVal };
            if (changed) replaced++;
          }
        }
      }
    },

    StringLiteral(path) {
      const p = path.findParent(
        (p) =>
          p.isObjectProperty() ||
          p.isVariableDeclarator() ||
          p.isCallExpression(),
      );
      let allow = false;
      if (p?.isObjectProperty()) {
        allow = true;
      } else if (p?.isVariableDeclarator()) {
        allow = true;
      } else if (p?.isCallExpression()) {
        allow = true;
      }
      let val = path.node.value;
      if (!allow) {
        const fixed = replaceHrefStart(val, lang);
        if (fixed !== val) {
          path.node.value = fixed;
          hrefChanged++;
        }
        return;
      }
      const tr = tryTranslate(val);
      let newVal = tr ?? val;
      const fixed = replaceHrefStart(newVal, lang);
      if (fixed !== newVal) {
        newVal = fixed;
        hrefChanged++;
      }
      if (newVal !== val) {
        path.node.value = newVal;
        replaced++;
      }
    },

    TemplateLiteral(path) {
      for (const q of path.node.quasis) {
        const rawVal = (q.value.cooked ?? q.value.raw) || "";
        const leading = rawVal.match(/^\s*/)?.[0] ?? "";
        const trailing = rawVal.match(/\s*$/)?.[0] ?? "";
        const core = rawVal.slice(
          leading.length,
          rawVal.length - trailing.length,
        );
        let changed = false;
        let nextCore = core;
        const norm = normalizeText(core);
        if (norm) {
          const tr = tryTranslate(norm);
          if (tr) {
            nextCore = tr;
            changed = true;
          }
        }
        const fixed = replaceHrefStart(nextCore, lang);
        if (fixed !== nextCore) {
          nextCore = fixed;
          hrefChanged++;
          changed = true;
        }
        const nextVal = `${leading}${nextCore}${trailing}`;
        if (nextVal !== rawVal) {
          q.value = { cooked: nextVal, raw: nextVal };
          if (changed) replaced++;
        }
      }
    },
  });

  const gen = generate(
    ast,
    { retainLines: true, decoratorsBeforeExport: true },
    code,
  );
  return { code: gen.code, replaced, importChanged, hrefChanged };
}

(async () => {
  const srcDir = path.join(PROJECT_ROOT, PAGES_DIR, SRC_LANG);
  if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) {
    throw new Error(
      "Source pages folder not found: " + path.relative(PROJECT_ROOT, srcDir),
    );
  }

  for (const lang of TARGETS) {
    const langDir = path.join(PROJECT_ROOT, PAGES_DIR, lang);
    ensureDir(langDir);

    // copy pages ru -> lang
    copyTree(srcDir, langDir);

    // optionally copy side RU dirs -> LANG
    if (COPY_SIDE) {
      for (const base of SIDE_DIRS) {
        const ruSide = path.join(PROJECT_ROOT, base, SRC_LANG);
        if (fs.existsSync(ruSide) && fs.statSync(ruSide).isDirectory()) {
          const langSide = path.join(PROJECT_ROOT, base, lang);
          copyTree(ruSide, langSide);
        }
      }
    }

    const dict = loadDict(lang);

    const processTree = (root: string) => {
      const files: string[] = [];
      (function walk2(d: string) {
        if (!fs.existsSync(d)) return;
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
          const p = path.join(d, e.name);
          if (e.isDirectory()) walk2(p);
          else if (e.isFile() && (p.endsWith(".ts") || p.endsWith(".tsx")))
            files.push(p);
        }
      })(root);

      let replaced = 0,
        importChanged = 0,
        hrefChanged = 0;
      for (const file of files) {
        const code = fs.readFileSync(file, "utf8");
        const out = transformWithDict(
          code,
          path.relative(PROJECT_ROOT, file),
          dict,
          lang,
        );
        if (out.code !== code) fs.writeFileSync(file, out.code, "utf8");
        replaced += out.replaced;
        importChanged += out.importChanged;
        hrefChanged += out.hrefChanged;
      }
      return { files: files.length, replaced, importChanged, hrefChanged };
    };

    const statsPages = processTree(langDir);
    const statsSide = COPY_SIDE
      ? SIDE_DIRS.map((d) => processTree(path.join(PROJECT_ROOT, d, lang)))
      : [];

    const report = {
      lang,
      pagesDir: path.relative(PROJECT_ROOT, langDir),
      statsPages,
      statsSide,
    };
    const reportPath = path.join(PROJECT_ROOT, "i18n", `report.${lang}.json`);
    ensureDir(path.dirname(reportPath));
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
    console.log(
      `${lang}: pages(files=${statsPages.files}, replaced=${statsPages.replaced}, imports=${statsPages.importChanged}, hrefs=${statsPages.hrefChanged})`,
    );
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
