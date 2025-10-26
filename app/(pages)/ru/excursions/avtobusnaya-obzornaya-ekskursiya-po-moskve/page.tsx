import { moscowSightseeingTourWithMeta } from "@/app/config/ru/tours/moscow-sightseeing";
import TourPage from "@/app/components/ru/TourPage";

const { metadata, ...data } = moscowSightseeingTourWithMeta;

export { metadata };

export default function MoscowSightseeingTourPage() {
  return <TourPage data={data} />;
}
