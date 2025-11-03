"use client";

import { Link } from "@/i18n/navigation";
import React, { memo, useEffect, useState } from "react";
import {
  SiTelegram,
  SiVk,
  SiWhatsapp,
  SiOdnoklassniki,
  SiViber,
} from "@icons-pack/react-simple-icons";
// import DzenIcon from "@/public/images/dzen.svg"; // положи сюда официальный PD-икон dzen.svg

type Social = "telegram" | "vk" | "whatsapp" | "ok" | "viber" | "dzen";

type UtmParams = Partial<{
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}>;

export type SocialShareProps = {
  url: string;
  title: string;
  description?: string;
  image?: string;
  networks?: Social[];
  className?: string;
  size?: "sm" | "md";
  rounded?: "md" | "lg" | "full";
  hashtags?: string[];
  via?: string;
  utm?: UtmParams;
  /** Короткий адрес/URL канала Дзена (например: "4trip" или "https://dzen.ru/4trip") */
  dzenChannel?: string;
};

const DEFAULT_NETWORKS: Social[] = [
  "telegram",
  "vk",
  "whatsapp",
  "viber",
  "ok",
  "dzen",
];

function withUtm(rawUrl: string, utm?: UtmParams) {
  if (!utm) return rawUrl;
  try {
    const u = new URL(rawUrl);
    Object.entries(utm).forEach(([k, v]) => v && u.searchParams.set(k, v));
    return u.toString();
  } catch {
    return rawUrl;
  }
}

function normalizeDzenUrl(dzenChannel?: string): string | null {
  if (!dzenChannel) return null;
  if (/^https?:\/\//i.test(dzenChannel)) return dzenChannel;
  const handle = dzenChannel.replace(/^@/, "");
  return `https://dzen.ru/${handle}`;
}

function buildShareLinks(url: string, title: string, opts: { image?: string }) {
  const enc = encodeURIComponent;
  const u = enc(url);
  const t = enc(title);
  const img = opts.image ? enc(opts.image) : "";

  const links = {
    telegram: `https://t.me/share/url?url=${u}&text=${t}`,
    vk: `https://vk.com/share.php?url=${u}&title=${t}${img ? `&image=${img}` : ""}&noparse=true`,
    whatsapp: `https://api.whatsapp.com/send?text=${t}%20${u}`,
    viber: `viber://forward?text=${t}%20${u}`, // открывается только на мобиле
    ok: `https://connect.ok.ru/offer?url=${u}&title=${t}${img ? `&imageUrl=${img}` : ""}`,
  } as const;

  return links;
}

const ICONS: Record<
  Exclude<Social, "dzen">,
  React.ComponentType<{
    title?: string;
    size?: number | string;
    color?: string;
  }>
> = {
  telegram: SiTelegram,
  vk: SiVk,
  whatsapp: SiWhatsapp,
  ok: SiOdnoklassniki,
  viber: SiViber,
};

function IconMono({
  name,
  sizePx,
}: {
  name: Exclude<Social, "dzen">;
  sizePx: number;
}) {
  const Cmp = ICONS[name];
  return <Cmp size={sizePx} aria-hidden />;
}

function SocialShareCmp({
  url,
  title,
  description,
  image,
  networks = DEFAULT_NETWORKS,
  className = "",
  size = "md",
  rounded = "lg",
  utm,
  dzenChannel,
}: SocialShareProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // детектируем только на клиенте, чтобы не ловить SSR/CSR рассинхрон
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMobile(/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));
      setCanNativeShare(typeof (navigator as any).share === "function");
    }
  }, []);

  const urlWithUtm = withUtm(url, utm);
  const links = buildShareLinks(urlWithUtm, title, { image });
  const dzenUrl = normalizeDzenUrl(dzenChannel);

  // размеры/стили
  const baseBtn =
    "inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 transition";
  const sizeBtn = size === "sm" ? "px-3 py-1.5 text-sm" : "px-3.5 py-2 text-sm";
  const radius =
    rounded === "full"
      ? "rounded-full"
      : rounded === "md"
        ? "rounded-md"
        : "rounded-lg";
  const iconSize = size === "sm" ? 18 : 20;

  // итоговый список с учётом платформы и наличия dzen-канала + ДЕДУП
  const filteredNetworks = (networks ?? DEFAULT_NETWORKS).filter((n) => {
    if (n === "viber" && !isMobile) return false;
    if (n === "dzen" && !dzenUrl) return false;
    return true;
  });
  const seenNetworks = new Set<string>();
  const networksToRender = filteredNetworks.filter((n) => {
    if (seenNetworks.has(n)) return false;
    seenNetworks.add(n);
    return true;
  });

  async function handleNativeShare() {
    try {
      await (navigator as any).share?.({ title, text: title, url: urlWithUtm });
    } catch {
      try {
        await navigator.clipboard.writeText(urlWithUtm);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        /* ignore */
      }
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(urlWithUtm);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-500">Поделиться:</span>

      {/* Нативный шаринг на мобиле */}
      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className={`${baseBtn} ${sizeBtn} ${radius}`}
          aria-label="Поделиться через системное меню"
        >
          {/* простая системная иконка */}
          <svg
            viewBox="0 0 24 24"
            width={iconSize}
            height={iconSize}
            aria-hidden
          >
            <path d="M12 3l4 4h-3v6h-2V7H8l4-4Zm-7 9h2v8H5v-8Zm11 0h2v8h-2v-8Zm-6 3h6v2H10v-2Z" />
          </svg>
          <span>Поделиться…</span>
        </button>
      )}

      {/* Фолбэк «Копировать» */}
      <button
        type="button"
        onClick={handleCopy}
        className={`${baseBtn} ${sizeBtn} ${radius}`}
      >
        <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} aria-hidden>
          <path d="M7 7V5h10v12h-2V7H7Zm-2 2h10v10H5V9Zm2 2v6h6v-6H7Z" />
        </svg>
        <span>{copied ? "Скопировано!" : "Скопировать ссылку"}</span>
      </button>

      {networksToRender.map((n) => {
        let href: string | undefined;
        if (n === "dzen") href = dzenUrl || undefined;
        else href = (links as any)[n] as string;

        if (!href) return null;

        const label =
          n === "vk"
            ? "VK"
            : n === "ok"
              ? "OK"
              : n === "dzen"
                ? "Дзен"
                : n.toUpperCase();

        const btnClasses = `${baseBtn} ${sizeBtn} ${radius}`;

        // Для не-http(s) схем используем <a>, а не <Link>
        if (n === "viber") {
          return (
            <a
              key={n}
              href={href}
              aria-label={`Поделиться в ${label}`}
              className={btnClasses}
            >
              <IconMono name="viber" sizePx={iconSize} />
              <span className="capitalize">{label}</span>
            </a>
          );
        }

        return (
          <Link
            key={n}
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            prefetch={false}
            aria-label={`Поделиться в ${label}`}
            className={btnClasses}
          >
            {n === "dzen" ? (
              // <DzenIcon width={iconSize} height={iconSize} aria-hidden />
              <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                aria-hidden
              >
                {/* временный моно-икон плейсхолдер */}
                <circle cx="12" cy="12" r="10" />
              </svg>
            ) : (
              <IconMono name={n as Exclude<Social, "dzen">} sizePx={iconSize} />
            )}
            <span className="capitalize">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default memo(SocialShareCmp);
