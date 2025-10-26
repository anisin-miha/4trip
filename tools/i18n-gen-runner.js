// tools/i18n-gen-runner.js
const { spawn } = require("node:child_process");
const path = require("node:path");

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...opts,
    });
    p.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`)),
    );
  });
}

// Используем tsx (быстро, без настроек). Если не стоит — поставь: npm i -D tsx
const RUNTIME = process.env.I18N_TS_RUNNER || "npx";
const RUNTIME_ARGS = process.env.I18N_TS_RUNNER ? [] : ["tsx"];

const GEN = path.resolve("scripts/i18n-gen-pages.ts");
const TARGETS = process.env.I18N_TARGETS || "en"; // например: "en,es,fr,de"
const LIMIT = process.env.I18N_EXCURSIONS_LIMIT || ""; // опционально: "1" для дев-быстрого прогона

async function main() {
  const args = [GEN, `--targets=${TARGETS}`];
  if (LIMIT) args.push(`--excursionsLimit=${LIMIT}`);

  console.log(
    `[i18n] generate pages -> targets=${TARGETS} limit=${LIMIT || "-"}`,
  );
  await run(RUNTIME, [...RUNTIME_ARGS, ...args]);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { main };
