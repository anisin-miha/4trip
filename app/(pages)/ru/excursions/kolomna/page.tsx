import { kolomnaTourWithMeta } from "@/app/config/ru/tours/kolomna";
import TourPage from "@/app/components/ru/TourPage";

export const { metadata, ...data } = kolomnaTourWithMeta;

export default function kolomnaTourPage() {
  return <TourPage data={data} />;
}
