import { patriotTourWithMeta } from "@/app/config/tours/patriot";
import TourPage from "../../components/TourPage";

export const { metadata, ...data } = patriotTourWithMeta;

export default function PatriotTourPage() {
  return <TourPage data={data} />;
}
