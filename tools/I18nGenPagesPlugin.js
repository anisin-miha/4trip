// tools/I18nGenPagesPlugin.js
const path = require("node:path");
const { spawn } = require("node:child_process");

function runNode(script, args = []) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [script, ...args], { stdio: "inherit" });
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`))));
  });
}

class I18nGenPagesPlugin {
  constructor(options = {}) {
    this.targets = options.targets || process.env.I18N_TARGETS || "en";
    this.excursionsLimit = options.excursionsLimit || process.env.I18N_EXCURSIONS_LIMIT || "";
    this._inFlight = false;
  }
  apply(compiler) {
    const trigger = async () => {
      if (this._inFlight) return;
      this._inFlight = true;
      try {
        const script = path.resolve("tools/i18n-gen-runner.js");
        const args = [];
        process.env.I18N_TARGETS = this.targets;
        if (this.excursionsLimit) process.env.I18N_EXCURSIONS_LIMIT = String(this.excursionsLimit);
        await runNode(script, args);
      } finally {
        this._inFlight = false;
      }
    };

    // prod build
    compiler.hooks.beforeCompile.tapPromise("I18nGenPagesPlugin", trigger);

    // webpack-dev fallback (если отключишь Turbopack)
    compiler.hooks.watchRun?.tapPromise("I18nGenPagesPlugin", trigger);
  }
}

module.exports = { I18nGenPagesPlugin };
