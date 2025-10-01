// app/sergiev-posad/page.tsx

import { sergievPosadTourWithMeta } from "@/app/config/tours/sergiev-posad";
import TourPage from "@/app/components/TourPage";

export const { metadata, ...data } = sergievPosadTourWithMeta;

export default function SergievPosadTourPage() {
  return <TourPage data={data} />;
}
