import { moscowSightseeingTourWithMeta } from "@/app/config/tours/moscow-sightseeing";
import TourPage2 from "@/app/components/TourPage2";

export const { metadata, ...data } = moscowSightseeingTourWithMeta;

export default function MoscowSightseeingTourPage() {
  return <TourPage2 data={data} />;
}
