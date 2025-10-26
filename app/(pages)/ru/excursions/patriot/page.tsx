import { patriotTourWithMeta } from "@/app/config/ru/tours/patriot";
import TourPage from "@/app/components/ru/TourPage";

const { metadata, ...data } = patriotTourWithMeta;

export { metadata };

export default function PatriotTourPage() {
  return <TourPage data={data} />;
}
