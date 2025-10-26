// i18n-translate.ts — translate flat RU parts to <lang> parts (same chunking size not required)
import fs from "node:fs";
import path from "node:path";

type Argv = Record<string, string | boolean>;
const argv: Argv = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ""), true];
  }),
);

const PROJECT_ROOT = path.resolve(String(argv.root || process.cwd()));
const OUT_DIR = path.resolve(PROJECT_ROOT, String(argv.outDir || "i18n"));
const LOCALES_DIR = path.join(OUT_DIR, "locales");
const FROM_LANG = String(argv.from || "ru");
const TO_PARAM = String(argv.to || "en");
const PROVIDER = String(argv.provider || "deepl");
const DRY_RUN = Boolean(argv.dryRun || false);
const MAX_PER_REQUEST = Number(argv.maxPerRequest || 40);

const TO_LANGS = TO_PARAM.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const CACHE_DIR = path.join(OUT_DIR, ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "translations.json"); // { "<lang>||<text>": "translated" }

function loadCache(): Record<string, string> {
  if (!fs.existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    return {};
  }
}
function saveCache(obj: Record<string, string>) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2), "utf8");
}
const cache = loadCache();

function listPartFiles(lang: string): string[] {
  if (!fs.existsSync(LOCALES_DIR)) return [];
  return fs
    .readdirSync(LOCALES_DIR)
    .filter((n) => n.startsWith(`${lang}.part-`) && n.endsWith(".json"))
    .map((n) => path.join(LOCALES_DIR, n))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function batch<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// Provider implementations
async function translateDeepl(
  texts: string[],
  targetLang: string,
): Promise<string[]> {
  const key = process.env.DEEPL_API_KEY || "";
  const base =
    process.env.DEEPL_API_URL ||
    (key && key.startsWith("dp")
      ? "https://api.deepl.com"
      : "https://api-free.deepl.com");
  if (!key) throw new Error("DEEPL_API_KEY is required for provider=deepl");

  const params = new URLSearchParams();
  for (const t of texts) params.append("text", t);
  params.set("target_lang", targetLang.toUpperCase());
  params.set("source_lang", FROM_LANG.toUpperCase());

  const res = await fetch(`${base}/v2/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `DeepL-Auth-Key ${key}`,
    },
    body: params.toString(),
  } as any);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DeepL error ${res.status}: ${body}`);
  }
  const data = (await res.json()) as { translations: { text: string }[] };
  return data.translations.map((t) => t.text);
}

async function translateDummy(
  texts: string[],
  _targetLang: string,
): Promise<string[]> {
  return texts.slice();
}

async function translateArray(
  texts: string[],
  lang: string,
): Promise<string[]> {
  const missing: [number, string][] = [];
  const result: string[] = new Array(texts.length);

  for (let i = 0; i < texts.length; i++) {
    const key = `${lang}||${texts[i]}`;
    if (cache[key]) result[i] = cache[key];
    else missing.push([i, texts[i]]);
  }
  if (missing.length === 0) return result;

  let providerFn: (t: string[], l: string) => Promise<string[]>;
  if (PROVIDER === "deepl") providerFn = translateDeepl;
  else if (PROVIDER === "dummy") providerFn = translateDummy;
  else throw new Error(`Unknown provider=${PROVIDER}`);

  const batches = batch(
    missing.map(([, s]) => s),
    MAX_PER_REQUEST,
  );
  let cursor = 0;
  for (const b of batches) {
    const translated = DRY_RUN ? b : await providerFn(b, lang);
    for (let j = 0; j < b.length; j++) {
      const idx = missing[cursor + j][0];
      result[idx] = translated[j];
      cache[`${lang}||${texts[idx]}`] = translated[j];
    }
    cursor += b.length;
    saveCache(cache);
  }
  return result;
}

function writePart(
  lang: string,
  partIndex: number,
  ids: string[],
  ruTexts: string[],
  translations: string[],
) {
  const obj: Record<string, string> = {};
  for (let i = 0; i < ids.length; i++)
    obj[ids[i]] = translations[i] || ruTexts[i];
  const name = `${lang}.part-${partIndex}.json`;
  const outPath = path.join(LOCALES_DIR, name);
  fs.writeFileSync(outPath, JSON.stringify(obj, null, 2), "utf8");
  console.log(`[translate] wrote ${name} (${ids.length})`);
}

(async function main() {
  const parts = listPartFiles(FROM_LANG);
  if (parts.length === 0) {
    console.log(`[i18n-translate] nothing to do: no ${FROM_LANG}.part-*.json`);
    return;
  }

  for (const lang of TO_LANGS) {
    let partIndex = 1;
    for (const ruPath of parts) {
      const ruMap: Record<string, string> = JSON.parse(
        fs.readFileSync(ruPath, "utf8"),
      );
      const ids = Object.keys(ruMap).sort();
      if (ids.length === 0) continue;
      const ruTexts = ids.map((id) => ruMap[id]);
      const translated = await translateArray(ruTexts, lang);
      writePart(lang, partIndex, ids, ruTexts, translated);
      partIndex++;
    }
  }

  console.log(
    `\n[i18n-translate] done. Provider=${PROVIDER}, dryRun=${DRY_RUN}`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
