import ExportedImage from "next-image-export-optimizer";

interface BaseImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
}

export function getOptimizedSrc(src: string): string {
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
    return `/images/${folder}/nextImageExportOptimizer/${filenameWithoutExt}-opt-1080.WEBP`;
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
  const optimizedSrc = getOptimizedSrc(src);

  return (
    <div className={fill ? "relative w-full h-full" : undefined}>
      <ExportedImage
        src={optimizedSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={className}
        unoptimized={true}
        {...props}
      />
    </div>
  );
}
