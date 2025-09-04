"use client";
import { Footer } from "@4trip/shared-ui";
import { Link as IntlLink } from "@/i18n/navigation";
import type React from "react";

type FooterProps = React.ComponentProps<typeof Footer>;

export default function SiteFooter(props: Omit<FooterProps, "LinkComponent">) {
  return <Footer {...props} LinkComponent={IntlLink} />;
}

