// i18n-docx-export.ts
// Build a DOCX that lists all RU strings in a table: [ID | RU | RU_SHA1]
// Use this file to translate via DeepL document translator (web/app/API).
// After translation, run i18n-docx-import.ts to reconstruct <lang>.part-*.json.
//
// Usage:
//   ts-node i18n-docx-export.ts --out=out/deepl-ru.docx [--title="My Batch"]
//
// Deps: npm i docx

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel } from "docx";

type Argv = Record<string, string | boolean>;
const argv: Argv = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)=(.*)$/);
  return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
}));

const PROJECT_ROOT = path.resolve(String(argv.root || process.cwd()));
const OUT_DOCX = path.resolve(String(argv.out || "i18n/deepl-ru.docx"));
const OUT_DIR = path.dirname(OUT_DOCX);
const I18N_DIR = path.resolve(PROJECT_ROOT, String(argv.i18nDir || "i18n"));
const LOCALES_DIR = path.join(I18N_DIR, "locales");
const TITLE = String(argv.title || "i18n RU strings");
const MAX_ROWS_PER_TABLE = Math.max(1000, Number(argv.maxRowsPerTable || 2000)); // avoid docx perf issues

function sha1(s: string) {
  return crypto.createHash("sha1").update(s).digest("hex");
}

function listRuParts(): string[] {
  if (!fs.existsSync(LOCALES_DIR)) throw new Error(`Locales dir not found: ${LOCALES_DIR}`);
  return fs.readdirSync(LOCALES_DIR)
    .filter(n => n.startsWith("ru.part-") && n.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map(n => path.join(LOCALES_DIR, n));
}

function loadRuIndex(): Record<string, { src: string; text: string }> | null {
  const idxPath = path.join(LOCALES_DIR, "ru.index.json");
  if (!fs.existsSync(idxPath)) return null;
  try { return JSON.parse(fs.readFileSync(idxPath, "utf8")); } catch { return null; }
}

function gatherPairs(): Array<{ id: string; ru: string; src?: string }> {
  const pairs: Array<{ id: string; ru: string; src?: string }> = [];
  const parts = listRuParts();
  const index = loadRuIndex();
  for (const p of parts) {
    const obj: Record<string, string> = JSON.parse(fs.readFileSync(p, "utf8"));
    for (const [id, ru] of Object.entries(obj)) {
      pairs.push({ id, ru, src: index?.[id]?.src });
    }
  }
  // stable sort by id for deterministic order
  pairs.sort((a, b) => a.id.localeCompare(b.id));
  return pairs;
}

function makeDoc(pairs: Array<{ id: string; ru: string; src?: string }>): Document {
  const doc = new Document({
    creator: "i18n-docx-export",
    description: "Auto-generated from ru.part-*.json for DeepL document translation round-trip",
    title: TITLE,
  });

  const header = new Paragraph({
    text: TITLE,
    heading: HeadingLevel.HEADING_1,
  });
  const note = new Paragraph({
    children: [
      new TextRun({ text: "Columns: ID (do not translate) | RU (translate) | RU_SHA1 (do not translate).", italics: true }),
    ],
  });

  const rows: TableRow[] = [];
  // header row
  rows.push(new TableRow({
    children: [
      new TableCell({ children: [new Paragraph("ID")], width: { size: 20, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [new Paragraph("RU")], width: { size: 70, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [new Paragraph("RU_SHA1")], width: { size: 10, type: WidthType.PERCENTAGE } }),
    ]
  }));

  let tableChunks: Table[] = [];
  let rowCount = 0;
  const flushTable = () => {
    if (rows.length > 1) {
      tableChunks.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: rows.splice(0, rows.length),
      }));
    }
  };

  for (const { id, ru, src } of pairs) {
    const hash = sha1(ru);
    const idCellText = src ? `${id}  (${src})` : id; // hint src inline; parsers will split on first token
    rows.push(new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(idCellText)] }),
        new TableCell({ children: [new Paragraph(ru)] }),
        new TableCell({ children: [new Paragraph(hash)] }),
      ]
    }));
    rowCount++;
    if (rowCount % MAX_ROWS_PER_TABLE === 0) {
      flushTable();
      // push again the header for the next table
      rows.push(new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("ID")], width: { size: 20, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("RU")], width: { size: 70, type: WidthType.PERCENTAGE } }),
          new TableCell({ children: [new Paragraph("RU_SHA1")], width: { size: 10, type: WidthType.PERCENTAGE } }),
        ]
      }));
    }
  }
  flushTable();

  doc.addSection({
    children: [header, note, ...tableChunks],
  });
  return doc;
}

(async function main() {
  const pairs = gatherPairs();
  if (pairs.length === 0) {
    console.log("No RU pairs found (ru.part-*.json). Aborting.");
    return;
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const doc = makeDoc(pairs);
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT_DOCX, buf);
  console.log(`[docx-export] Wrote: ${OUT_DOCX} (rows=${pairs.length})`);
})().catch(e => { console.error(e); process.exit(1); });
