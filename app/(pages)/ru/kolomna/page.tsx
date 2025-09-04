import { kolomnaTourWithMeta } from "@/app/config/tours/kolomna";
import TourPage from "../../../components/TourPage";

export const { metadata, ...data } = kolomnaTourWithMeta;

export default function kolomnaTourPage() {
  return <TourPage data={data} />;
}
