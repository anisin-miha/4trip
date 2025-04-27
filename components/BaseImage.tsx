import ExportedImage from "next-image-export-optimizer";

export default function BaseImage(props: any) {

  return (
    <ExportedImage
      {...props}
      src={props.src}
    />
  );
}
