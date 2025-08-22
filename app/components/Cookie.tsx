"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Cookie.module.scss";

const COOKIE_NAME = "cookie-accepted";
const TRANSITION_MS = 300;

function hasAccepted(): boolean {
  if (typeof document === "undefined") return true; // не рендерим на SSR
  return document.cookie
    .split("; ")
    .some((c) => c.startsWith(`${encodeURIComponent(COOKIE_NAME)}=`));
}

function acceptCookie(days = 365): void {
  const d = new Date();
  d.setDate(d.getDate() + days);
  document.cookie = `${encodeURIComponent(COOKIE_NAME)}=true; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
}

export default function CookieAlert() {
  const [mounted, setMounted] = useState(false);
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasAccepted()) {
      setRender(true);
      // даём разметке смонтироваться без --visible, затем включаем для анимации
      requestAnimationFrame(() => setVisible(true));
    }
  }, []);

  if (!mounted || !render) return null;

  const handleAccept = () => {
    acceptCookie();
    setVisible(false);
    window.setTimeout(() => setRender(false), TRANSITION_MS);
  };

  return (
    <div
      className={`${styles.cookieAlert} ${visible ? styles.cookieAlertVisible : ""}`}
    >
      <span className={styles.cookieAlertText}>
        Оставаясь на&nbsp;сайте, вы&nbsp;даете согласие на&nbsp;применение
        cookie и&nbsp;обработку данных. Подробнее&nbsp;&mdash; в&nbsp;
        <Link
          href="/privacy-policy"
          className={styles.cookieAlertLink + " text-blue-600"}
          target="_blank"
          rel="noopener noreferrer"
        >
          политике
        </Link>
      </span>
      <button
        className={styles.cookieAlertButton}
        type="button"
        onClick={handleAccept}
      >
        Согласен
      </button>
    </div>
  );
}
