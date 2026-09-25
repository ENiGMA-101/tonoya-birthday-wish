"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import birthday, { type Lang } from "@/config/birthdayConfig";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (v: { bn: string; en: string }) => string };

const LangContext = createContext<Ctx>({
  lang: "bn",
  setLang: () => {},
  t: (v) => v.bn,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(birthday.defaultLang);

  useEffect(() => {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (v) => v[lang],
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
