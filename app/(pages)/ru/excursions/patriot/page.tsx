import { patriotTourWithMeta } from "@/app/config/ru/tours/patriot";
import TourPage from "@/app/components/ru/TourPage";

export const { metadata, ...data } = patriotTourWithMeta;

export default function PatriotTourPage() {
  return <TourPage data={data} />;
}
