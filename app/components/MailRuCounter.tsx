'use client';

import React, { useEffect } from "react";

declare global {
  interface Window {
    _tmr?: any[];
    // маркер, чтобы не отправлять pageView дважды в StrictMode
    __tmr_pv_flags__?: Record<string, boolean>;
  }
}

type MailRuCounterProps = {
  /** ID счётчика из Top.Mail.Ru */
  counterId: string;
  /** ID подключаемого <script>, чтобы не дублировать */
  scriptId?: string;
  /** Кастомный стиль для <noscript> картинки (не обязателен) */
  imgStyle?: React.CSSProperties;
};

const MailRuCounter: React.FC<MailRuCounterProps> = ({
  counterId,
  scriptId = "tmr-code",
  imgStyle,
}) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Инициализация буфера событий
    window._tmr = window._tmr || [];
    window.__tmr_pv_flags__ = window.__tmr_pv_flags__ || {};

    // Не допускаем двойного pageView (напр., из-за React.StrictMode)
    if (!window.__tmr_pv_flags__[counterId]) {
      window._tmr.push({
        id: counterId,
        type: "pageView",
        start: Date.now(),
      });
      window.__tmr_pv_flags__[counterId] = true;
    }

    // Подключаем внешний код счётчика один раз
    if (!document.getElementById(scriptId)) {
      const ts = document.createElement("script");
      ts.type = "text/javascript";
      ts.async = true;
      ts.id = scriptId;
      ts.src = "https://top-fwz1.mail.ru/js/code.js";

      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(ts, firstScript);
      } else {
        document.head.appendChild(ts);
      }
    }
  }, [counterId, scriptId]);

  // Фолбэк для отключённого JS (будет полезен при SSR)
  return (
    <noscript>
      <div>
        <img
          src={`https://top-fwz1.mail.ru/counter?id=${counterId};js=na`}
          style={{ position: "absolute", left: -9999, ...(imgStyle || {}) }}
          alt="Top.Mail.Ru"
        />
      </div>
    </noscript>
  );
};

export default MailRuCounter;
