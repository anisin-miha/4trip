// i18n-docx-import.ts
// Parse a translated DOCX and rebuild <lang>.part-*.json with original IDs.
// Expects a table with columns: ID | <translated> | RU_SHA1 (hex), as produced by i18n-docx-export.ts
//
// Usage:
//   ts-node i18n-docx-import.ts --in=out/deepl-ru-en.docx --lang=en [--chunkSize=400]
//
// Deps: npm i mammoth cheerio

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import mammoth from "mammoth";
import * as cheerio from "cheerio";

type Argv = Record<string, string | boolean | number>;
const argv: Argv = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)=(.*)$/);
  return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
}));

const PROJECT_ROOT = path.resolve(String(argv.root || process.cwd()));
const IN_DOCX = path.resolve(String(argv.in || ""));
const TARGET_LANG = String(argv.lang || "en");
const CHUNK_SIZE = Math.max(1, Number(argv.chunkSize || 400));
const I18N_DIR = path.resolve(PROJECT_ROOT, String(argv.i18nDir || "i18n"));
const LOCALES_DIR = path.join(I18N_DIR, "locales");
const INDEX_PATH = path.join(LOCALES_DIR, "ru.index.json");

if (!IN_DOCX) {
  console.error("--in=<file.docx> is required");
  process.exit(2);
}

function sha1(s: string) {
  return crypto.createHash("sha1").update(s).digest("hex");
}

function loadRuIndex(): Record<string, { src: string; text: string }> | null {
  if (!fs.existsSync(INDEX_PATH)) return null;
  try { return JSON.parse(fs.readFileSync(INDEX_PATH, "utf8")); } catch { return null; }
}

async function extractRowsFromDocx(file: string): Promise<Array<[string, string, string]>> {
  const { value: html } = await mammoth.convertToHtml({ path: file });
  const $ = cheerio.load(html);
  const rows: Array<[string, string, string]> = [];

  $("table").each((_, table) => {
    $(table).find("tr").each((ri, tr) => {
      const cells = $(tr).find("td,th").toArray();
      if (cells.length < 3) return;
      const a = $(cells[0]).text().trim();
      const b = $(cells[1]).text().trim();
      const c = $(cells[2]).text().trim();
      if (!a || !b) return;
      if (/^id$/i.test(a) && /^ru(_sha1)?$/i.test(c)) return; // skip header
      // If ID cell contains "id (src)" — split by two spaces before "("
      const id = a.split("  (")[0].trim();
      rows.push([id, b, c]);
    });
  });
  return rows;
}

function writeParts(lang: string, map: Record<string, string>) {
  const ids = Object.keys(map).sort();
  let part = 1;
  for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
    const chunk = ids.slice(i, i + CHUNK_SIZE);
    const obj: Record<string, string> = {};
    for (const id of chunk) obj[id] = map[id];
    const name = `${lang}.part-${part}.json`;
    const outPath = path.join(LOCALES_DIR, name);
    fs.mkdirSync(LOCALES_DIR, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(obj, null, 2), "utf8");
    console.log(`[docx-import] wrote ${name} (${chunk.length})`);
    part++;
  }
}

(async function main() {
  const index = loadRuIndex();
  if (!index) console.warn(`[docx-import] Warning: ${INDEX_PATH} not found; checksum validation disabled.`);

  const rows = await extractRowsFromDocx(IN_DOCX);
  if (rows.length === 0) {
    console.error(`[docx-import] No rows found in ${IN_DOCX}.`);
    process.exit(2);
  }

  const dict: Record<string, string> = {};
  let ok = 0, bad = 0, skipped = 0;
  for (const [id, tr, ruSha] of rows) {
    if (!/^[a-z0-9]+$/i.test(id)) { skipped++; continue; }
    if (index && index[id]) {
      const expected = sha1(index[id].text);
      if (ruSha && ruSha !== expected) {
        bad++;
        console.warn(`[docx-import] checksum mismatch for ${id}: got=${ruSha} expected=${expected}`);
        // still accept translation; but flag
      } else {
        ok++;
      }
    }
    dict[id] = tr;
  }

  writeParts(TARGET_LANG, dict);

  console.log(`[docx-import] rows=${rows.length}, ok=${ok}, warned=${bad}, skipped=${skipped}`);
})().catch(e => { console.error(e); process.exit(1); });
