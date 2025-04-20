let userConfig = undefined;
try {
  userConfig = await import("./v0-user-next.config");
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = "patriot";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // 👇 для GitHub Pages и статического экспорта
  output: "export",
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  env: {
    // папка с исходными картинками (по умолчанию public/images)
    nextImageExportOptimizer_imageFolderPath: "public/images",
    // куда положить готовый экспорт (по умолчанию out)
    nextImageExportOptimizer_exportFolderPath: "out",
    // качество WebP (0–100)
    nextImageExportOptimizer_quality: "75",
    // хранить в WEBP
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    // имя вложенной папки внутри export-а
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
    // генерировать и использовать размазанные placeholder-ы
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
    // TTL кеша для remote-картинок в секундах
    nextImageExportOptimizer_remoteImageCacheTTL: "0",
  },
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return;

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
