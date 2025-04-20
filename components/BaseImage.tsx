import ExportedImage from 'next-image-export-optimizer';

// Добавляем базовый префикс для GitHub Pages
const basePath = process.env.NODE_ENV === 'production' ? '/patriot' : '';

export default function BaseImage(props: any) {
  // Пропускаем props.src через basePath и рендерим ExportedImage
  return (
    <ExportedImage
      {...props}
      src={`${basePath}${props.src}`}
    />
  );
};
