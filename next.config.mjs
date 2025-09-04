// next.config.mjs
import withPWA from "next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

// ===== basePath/assetPrefix =====
// ВАЖНО: для кастомного домена (без подпути) basePath ДОЛЖЕН быть пустым.
// При необходимости можно явно задать префикс через переменную окружения BASE_PATH (например, "/4trip").
const ghBase = process.env.BASE_PATH ?? ""; // принудительный префикс или ""
const pwaScope = ghBase ? `${ghBase}/` : "/";

// ===== Необязательный пользовательский конфиг =====
let userConfig = undefined;
try {
  const mod = await import("./v0-user-next.config");
  userConfig = mod.default ?? mod;
} catch {
  /* ignore */
}

/** @type {import('next').NextConfig} */
let nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Важное для static export и GitHub Pages
  output: "export",
  basePath: ghBase,
  assetPrefix: ghBase ? `${ghBase}/` : "",
  trailingSlash: true, // чтобы пути вида /ru/tours/... отдавались как /.../index.html

  images: {
    loader: "custom",
    imageSizes: [128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // images.unoptimized не нужен при кастом-лоадере + export
  },

  transpilePackages: ["next-image-export-optimizer", "@4trip/shared-ui"],

  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },

  webpack(config) {
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
  // корректный scope с учётом basePath
  scope: pwaScope,
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
