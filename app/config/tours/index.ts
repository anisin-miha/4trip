import { patriotTour } from "./patriot";
import { sergievPosadTour } from "./sergiev-posad";
import { kolomnaTour } from "./kolomna";

export const tours = [patriotTour, sergievPosadTour, kolomnaTour];

export type Tour = typeof patriotTour;

