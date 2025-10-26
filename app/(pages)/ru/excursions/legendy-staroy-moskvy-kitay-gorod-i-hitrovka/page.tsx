import { tourWithMeta } from "@/app/config/ru/tours/legendy-staroy-moskvy-kitay-gorod-i-hitrovka";
import TourPage from "@/app/components/ru/TourPage";

const { metadata, ...data } = tourWithMeta;

export { metadata };

export default function LegendsMoscowTourPage() {
  return <TourPage data={data} />;
}
