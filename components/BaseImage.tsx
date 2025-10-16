import Image from "next/image";

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
      <Image
        src={src}
        alt={alt}
        {...(fill ? { fill: true } : { width, height })}
        priority={priority}
        className={className}
        {...props}
      />
    </div>
  );
}
