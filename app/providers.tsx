"use client";

import { YandexMetricaProvider } from "next-yandex-metrica";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster richColors />
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
    </>
  );
}
