import { tourWithMeta } from "@/app/config/ru/tours/moskva-kupecheskaya-progulka-po-zamoskvorechyu";
import TourPage from "@/app/components/ru/TourPage";

const { metadata, ...data } = tourWithMeta;

export { metadata };

export default function ZamoskvorechyeTourPage() {
  return <TourPage data={data} />;
}
