"use client";

import { haptic } from "@/lib/audio";
import { useLang } from "./LangContext";

export default function LanguageToggle({ onDark = true }: { onDark?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className="fixed left-4 top-[calc(env(safe-area-inset-top)+14px)] z-[70]"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        role="group"
        aria-label="Language"
        className={`inline-flex items-center rounded-full border p-0.5 backdrop-blur-md ${
          onDark
            ? "border-amber/30 bg-night/70 text-cream"
            : "border-brown/20 bg-cream/80 text-ink"
        }`}
      >
        <button
          type="button"
          aria-pressed={lang === "bn"}
          onClick={() => {
            if (lang !== "bn") {
              haptic(8);
              setLang("bn");
            }
          }}
          className={`rounded-full px-3 py-1 font-sans text-[11px] ${
            lang === "bn" ? (onDark ? "bg-amber text-ink" : "bg-ink text-cream") : "opacity-70"
          }`}
        >
          বাংলা
        </button>
        <span className="px-0.5 text-[10px] opacity-40">|</span>
        <button
          type="button"
          aria-pressed={lang === "en"}
          onClick={() => {
            if (lang !== "en") {
              haptic(8);
              setLang("en");
            }
          }}
          className={`rounded-full px-3 py-1 font-sans text-[10.5px] tracking-[0.12em] ${
            lang === "en" ? (onDark ? "bg-amber text-ink" : "bg-ink text-cream") : "opacity-70"
          }`}
        >
          ENG
        </button>
      </div>
    </div>
  );
}
