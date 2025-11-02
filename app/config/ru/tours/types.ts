export enum MovementType {
  Bus = "bus",
  Pedestrian = "pedestrian",
}

export enum TourLanguage {
  Russian = "Русский",
  English = "Английский",
}

export enum Currency {
  RUB = "₽",
}

export enum TourCity {
  Moscow = "Москва",
  Kolomna = "Коломна",
  SergievPosad = "Сергиев Посад",
}

export enum TourSeason {
  Spring = "весна",
  Summer = "лето",
  Autumn = "осень",
  Winter = "зима",
}

export enum TourAgeLimit {
  AllAges = "Для всех возрастов",
  FamilyFriendly = "Можно с детьми",
  SixPlus = "6+",
  TwelvePlus = "12+",
}

export type Rating = {
  value: number;
  count: number;
};

export type MeetingPointInfoItem = {
  label: string;
  value: string;
};

export type MeetingPointDetails = {
  mapSrc: string;
  address: string;
  endAddress?: string;
  timeSlots?: string[];
  note?: string;
  lat?: number;
  lng?: number;
};

export type MeetingPoint = MeetingPointDetails & {
  info: MeetingPointInfoItem[];
};

export type Attraction = {
  image: string;
  alt: string;
  title: string;
  description: string[];
};

export type ProgramItem = {
  time?: string;
  title: string;
  description: string;
};

export type LearnMoreItem = {
  title: string;
  text: string;
};

export type Longread = {
  title: string;
  tldr: string[];
  paragraphs: string[];
};

export type GalleryItem = {
  src: string;
  alt: string;
};

export type MapPoint = {
  title: string;
  lat: number;
  lng: number;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type Hero = {
  image: string;
  description: string;
};

export type TourData = {
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  city: TourCity;
  price: number;
  currency: Currency;
  duration: string;
  languages: TourLanguage[];
  hero: Hero;
  badges: string[];
  expectations: string;
  longread: Longread;
  inclusions: string[];
  exclusions: string[];
  details: string[];
  meetingPoint: MeetingPoint;
  attractions: Attraction[];
  program: ProgramItem[];
  learnMore: LearnMoreItem[];
  gallery: GalleryItem[];
  faq: FAQItem[];
  mapPoints: MapPoint[];
  rating: Rating | null;
  visibility: boolean;
  movementType: MovementType;
  groupSize: string;
  ageLimit: TourAgeLimit;
  season: TourSeason[];
};

export type ExcursionCard = {
  slug: string;
  href: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  price: number;
  duration: string;
  languages: TourLanguage[];
  city: TourCity;
  meetingPoint: string;
  badges: string[];
  rating: Rating | null;
  timeSlots?: string[];
};

export function defineTour<T extends TourData>(tour: T): T {
  return tour;
}
