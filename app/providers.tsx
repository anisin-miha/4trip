"use client";

import { YandexMetricaProvider } from "next-yandex-metrica";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <YandexMetricaProvider
      tagID={Number(process.env.NEXT_PUBLIC_YM_TAG_ID)}
      initParameters={{
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      }}
    >
      {children}
    </YandexMetricaProvider>
  );
}
