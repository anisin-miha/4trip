"use client";

import { YandexMetricaProvider } from "next-yandex-metrica";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <YandexMetricaProvider
      tagID={101206958}
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
