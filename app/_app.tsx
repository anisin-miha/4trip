// pages/_app.tsx
import { YandexMetricaProvider } from "next-yandex-metrica";

export default function MyApp({ Component, pageProps }: any) {
  return (
    <YandexMetricaProvider
      tagID={Number(process.env.YM_TAG_ID)}
      initParameters={{
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      }}
    >
      <Component {...pageProps} />
    </YandexMetricaProvider>
  );
}
