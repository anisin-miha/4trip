"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/lang";
import { switchLangInPath } from "@/lib/lang";

export default function LanguageSelect() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [value, setValue] = useState<Lang>("ru");

  // Инициализация из URL
  useEffect(() => {
    const m = pathname.match(/^\/(ru|en)(\/|$)/i);
    setValue(m ? (m[1].toLowerCase() as Lang) : "ru");
  }, [pathname]);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const to = e.target.value as Lang;
    setValue(to);
    // ставим cookie для мгновенного эффекта в клиентских компонентах
    document.cookie = `lang=${to}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const next = switchLangInPath(pathname, to);
    router.push(next, { scroll: false });
  }

  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">Language</span>
      <select
        value={value}
        onChange={onChange}
        className="border rounded px-2 py-1"
      >
        <option value="ru">RU</option>
        <option value="en">EN</option>
      </select>
    </label>
  );
}
