import { moscowSightseeingTourWithMeta } from "@/app/config/ru/tours/moscow-sightseeing";
import TourPage from "@/app/components/ru/TourPage";

export const { metadata, ...data } = moscowSightseeingTourWithMeta;

export default function MoscowSightseeingTourPage() {
  return <TourPage data={data} />;
}
