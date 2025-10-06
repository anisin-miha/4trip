"use client";
import { Header, Logo4Trip } from "@4trip/shared-ui";
import { Link as IntlLink } from "@/i18n/navigation";
import type React from "react";

type HeaderProps = React.ComponentProps<typeof Header>;

export default function SiteHeader(
  props: Omit<HeaderProps, "Logo" | "LinkComponent">,
) {
  const normalizedLinks = props.links?.map((l) => {
    // Удаляем префикс /ru для intl Link — он сам добавит локаль
    if (l.href?.startsWith("/ru")) {
      const rest = l.href.replace(/^\/ru(\/|$)/, "/");
      return { ...l, href: rest || "/" };
    }
    return l;
  });

  return (
    <Header
      {...props}
      links={normalizedLinks}
      Logo={Logo4Trip}
      LinkComponent={IntlLink}
    />
  );
}
