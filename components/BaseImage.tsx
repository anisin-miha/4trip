// components/BaseImage.tsx
import Image, { ImageProps } from 'next/image'

const basePath = process.env.NODE_ENV === 'production' ? '/patriot' : ''

export default function BaseImage(props: ImageProps) {
  return <Image {...props} src={`${basePath}${props.src}`} />
}