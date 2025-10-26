import { kolomnaTourWithMeta } from "@/app/config/ru/tours/kolomna";
import TourPage from "@/app/components/ru/TourPage";

const { metadata, ...data } = kolomnaTourWithMeta;

export { metadata };

export default function kolomnaTourPage() {
  return <TourPage data={data} />;
}
