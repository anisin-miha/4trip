import ExportedImage from "next-image-export-optimizer";

export type AllowedImageWidth =
  | 10
  | 128
  | 256
  | 384
  | 640
  | 750
  | 828
  | 1080
  | 1200
  | 1920
  | 2048
  | 3840;

const ALLOWED_SIZES: AllowedImageWidth[] = [
  10,
  128,
  256,
  384,
  640,
  750,
  828,
  1080,
  1200,
  1920,
  2048,
  3840,
];

function pickClosestSize(requested?: number): AllowedImageWidth {
  const target = requested ?? 1080;
  let closest = ALLOWED_SIZES[0];
  let minDiff = Math.abs(target - closest);
  for (const size of ALLOWED_SIZES) {
    const diff = Math.abs(target - size);
    if (diff < minDiff) {
      closest = size;
      minDiff = diff;
    }
  }
  return closest;
}

interface BaseImageProps {
  src: string;
  alt: string;
  width?: AllowedImageWidth;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
}

export function getOptimizedSrc(src: string, width?: number): string {
  // Если формат уже оптимальный — ничего не трогаем
  if (src.match(/\.(svg|gif|webp)$/i)) {
    return src;
  }

  // Проверяем, что путь начинается с /images/
  if (src.startsWith("/images/")) {
    const relativePath = src.replace("/images/", "");
    const lastSlashIndex = relativePath.lastIndexOf("/");
    const folder = relativePath.substring(0, lastSlashIndex);
    const file = relativePath.substring(lastSlashIndex + 1);

    const filenameWithoutExt = file.replace(/\.(png|jpg|jpeg)$/i, "");
    const size = pickClosestSize(width);
    return `/images/${folder}/nextImageExportOptimizer/${filenameWithoutExt}-opt-${size}.WEBP`;
  }

  // Если путь странный — оставляем как есть
  return src;
}

export default function BaseImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  ...props
}: BaseImageProps) {
  const optimizedSrc = getOptimizedSrc(src, width);

  return (
    <div className={fill ? "relative w-full h-full" : undefined}>
      <ExportedImage
        src={optimizedSrc}
        alt={alt}
        {...(fill ? { fill: true } : { width, height })}
        priority={priority}
        className={className}
        unoptimized={true}
        {...props}
      />
    </div>
  );
}
