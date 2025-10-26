import { tourWithMeta } from "@/app/config/ru/tours/bulgakovskaya-moskva-po-sledam-mastera-i-margarita";
import TourPage from "@/app/components/ru/TourPage";

const { metadata, ...data } = tourWithMeta;

export { metadata };

export default function BulgakovTourPage() {
  return <TourPage data={data} />;
}
