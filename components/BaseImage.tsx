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
  return (
    <div className={fill ? "relative w-full h-full" : undefined}>
      <ExportedImage
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={className}
        unoptimized={false}
        {...props}
      />
    </div>
  );
}
