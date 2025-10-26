// app/sergiev-posad/page.tsx

import { sergievPosadTourWithMeta } from "@/app/config/ru/tours/sergiev-posad";
import TourPage from "@/app/components/ru/TourPage";

const { metadata, ...data } = sergievPosadTourWithMeta;

export { metadata };

export default function SergievPosadTourPage() {
  return <TourPage data={data} />;
}
