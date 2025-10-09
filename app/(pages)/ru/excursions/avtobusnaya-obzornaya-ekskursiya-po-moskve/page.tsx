import { moscowSightseeingTourWithMeta } from "@/app/config/tours/moscow-sightseeing";
import TourPage from "@/app/components/TourPage";

export const { metadata, ...data } = moscowSightseeingTourWithMeta;

export default function MoscowSightseeingTourPage() {
  return <TourPage data={data} />;
}
