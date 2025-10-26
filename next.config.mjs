// next.config.mjs
import withPWA from "next-pwa";
import createNextIntlPlugin from "next-intl/plugin";
import { I18nGenPagesPlugin } from "./tools/I18nGenPagesPlugin.js";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

// ===== Необязательный пользовательский конфиг =====
let userConfig = undefined;
try {
  const mod = await import("./v0-user-next.config");
  userConfig = mod.default ?? mod;
} catch {
  /* ignore */
}

const I18N_TARGETS = process.env.I18N_TARGETS || "en"; // например: "en,es,fr,de"
const I18N_EXCURSIONS_LIMIT = process.env.I18N_EXCURSIONS_LIMIT || ""; // "1" в dev для скорости

function startDevWatcher() {
  const chokidar = require("chokidar");
  const { spawn } = require("node:child_process");
  let timer = null, running = false;

  const run = () => {
    if (running) return;
    running = true;
    const p = spawn(process.execPath, ["tools/i18n-gen-runner.js"], { stdio: "inherit" });
    p.on("exit", () => { running = false; });
  };

  const watchGlobs = [
    "app/(pages)/ru/**/*.{ts,tsx}",
    "app/components/ru/**/*.{ts,tsx}",
    "app/config/ru/**/*.{ts,tsx}",
    "packages/shared-ui/src/ru/**/*.{ts,tsx}",
    "i18n/locales/ru.part-*.json",
    // если делаешь ручные правки перевода — тоже триггерим
    "i18n/locales/*.part-*.json"
  ];

  const watcher = chokidar.watch(watchGlobs, { ignoreInitial: true });
  const debounce = () => { clearTimeout(timer); timer = setTimeout(run, 150); };
  watcher.on("add", debounce).on("change", debounce).on("unlink", debounce);

  console.log("[i18n] dev watcher started");

  // Запустим генерацию сразу при старте dev
  setTimeout(run, 100);
}

/** @type {import('next').NextConfig} */
let nextConfig = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  // dev: запустим вотчер сразу при старте Next
  if (isDev) {
    // пробросим дефолты (можно выставить в .env.local)
    process.env.I18N_TARGETS = process.env.I18N_TARGETS || I18N_TARGETS;
    process.env.I18N_EXCURSIONS_LIMIT = process.env.I18N_EXCURSIONS_LIMIT || I18N_EXCURSIONS_LIMIT;
    // отложенный старт, чтобы логи не перемешались
    setTimeout(() => {
      try { startDevWatcher(); } catch (e) { console.warn("[i18n] watcher disabled:", e.message); }
    }, 300);
  }

  return {
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    trailingSlash: true, // чтобы пути вида /ru/tours/... отдавались как /.../index.html

    transpilePackages: [ "@4trip/shared-ui"],

    experimental: {
      webpackBuildWorker: true,
      parallelServerBuildTraces: true,
      parallelServerCompiles: true,
    },

    webpack(config, { isServer, webpack }) {
      // Exclude .svg from existing asset loaders so SVGR can handle it
      const fileLoaderRule = config.module.rules.find(
        (rule) => typeof rule.test === "object" && rule.test?.test?.(".svg")
      );
      if (fileLoaderRule) {
        fileLoaderRule.exclude = Array.isArray(fileLoaderRule.exclude)
          ? [...fileLoaderRule.exclude, /\.svg$/i]
          : /\.svg$/i;
      }

      // Use SVGR for React SVG components
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: { and: [/\.[jt]sx?$/] },
        use: ["@svgr/webpack"],
      });

      // prod: плагин, который запускает генератор в шаге сборки
      if (!isDev) {
        config.plugins = config.plugins || [];
        config.plugins.push(new I18nGenPagesPlugin({
          targets: I18N_TARGETS,
          excursionsLimit: I18N_EXCURSIONS_LIMIT,
        }));
      }

      return config;
    },

    env: {
      nextImageExportOptimizer_imageFolderPath: "public/images",
      nextImageExportOptimizer_exportFolderPath: "out",
      nextImageExportOptimizer_quality: "75",
      nextImageExportOptimizer_storePicturesInWEBP: "true",
      nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
      nextImageExportOptimizer_generateAndUseBlurImages: "true",
      nextImageExportOptimizer_remoteImageCacheTTL: "0",
    },
  };
};

// мягкий мёрдж опционального user-конфига
mergeConfig(nextConfig, userConfig);

// PWA-обёртка после вычисления ghBase/pwaScope
// PWA: возвращаем поддержку. По умолчанию включено в production, выключено в dev и на CI (Pages).
// Можно форсировать включение через ENABLE_PWA=true
const isCI = !!process.env.GITHUB_ACTIONS;
const enablePWAEnv = process.env.ENABLE_PWA === "true" || process.env.ENABLE_PWA === "1";
const disablePWA = !(enablePWAEnv || (process.env.NODE_ENV === "production" && !isCI));

const withPWAWrapped = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: disablePWA,
  sw: "sw.js",
});

nextConfig = withPWAWrapped(nextConfig);

// next-intl плагин поверх
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return;
  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === "object" &&
      nextConfig[key] !== null &&
      !Array.isArray(nextConfig[key]) &&
      typeof userConfig[key] === "object" &&
      userConfig[key] !== null &&
      !Array.isArray(userConfig[key])
    ) {
      nextConfig[key] = { ...nextConfig[key], ...userConfig[key] };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}
