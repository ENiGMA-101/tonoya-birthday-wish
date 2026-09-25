"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import birthday from "@/config/birthdayConfig";
import { haptic, playBlow, playChime } from "@/lib/audio";
import { useLang } from "./LangContext";
import Cake3D from "./Cake3D";
import { Reveal } from "./Reveal";

export function LetterSection() {
  const { t } = useLang();

  return (
    <section className="relative px-5 py-20">
      <div className="paper-letter relative mx-auto max-w-[380px] rounded-[4px] px-7 py-10 text-ink shadow-[0_30px_60px_-28px_rgba(0,0,0,0.7)]">
        <Reveal>
          <p className="font-letter text-[22px] italic text-burgundy">{t(birthday.letterGreeting)}</p>
        </Reveal>
        <div className="mt-5 flex flex-col gap-4">
          {birthday.letterParagraphs.map((p, i) => (
            <Reveal key={i} delay={0.04 * i} y={12}>
              <p className="font-letter text-[16.5px] leading-[1.85] text-brown">{t(p)}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="mt-8">
          <p className="font-letter text-[20px] text-burgundy">{t(birthday.letterSign)}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function WishCakeSection() {
  const { t } = useLang();
  const [lit, setLit] = useState(true);
  const [done, setDone] = useState(false);
  const [bits, setBits] = useState(false);

  const blow = () => {
    if (done) return;
    haptic([10, 28, 10]);
    playBlow();
    setLit(false);
    setBits(true);
    window.setTimeout(() => {
      setDone(true);
      playChime(0.1);
    }, 700);
    window.setTimeout(() => setBits(false), 2400);
  };

  return (
    <section className="relative flex min-h-[90dvh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_70%,rgba(232,165,75,0.16),transparent_70%)]" />
      {bits &&
        Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute bottom-[42%] h-1.5 w-1.5 rounded-[1px]"
            style={{
              left: `${12 + ((i * 17) % 76)}%`,
              background: i % 3 === 0 ? "#c2a05f" : i % 3 === 1 ? "#6e1220" : "#e8a54b",
              animation: `ember ${1.5 + (i % 4) * 0.2}s ease-out forwards`,
              ["--ex" as string]: `${(i % 2 === 0 ? 1 : -1) * (10 + (i % 6) * 5)}px`,
            }}
          />
        ))}
      <Reveal>
        <p className="font-display text-[22px] italic text-cream/85">{t(birthday.cakeLine1)}</p>
        <p className="mt-1 font-display text-[18px] text-amber">{t(birthday.cakeLine2)}</p>
      </Reveal>
      <p className="mt-4 font-display text-[16px] text-cream/60">{t(birthday.cakeWish)}</p>
      <div className="mt-2">
        <Cake3D lit={lit} blowing={!lit} compact onTap={blow} />
      </div>
      {done && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 font-display text-[24px] text-cream"
        >
          {t(birthday.cakeHappy)}
        </motion.p>
      )}
    </section>
  );
}

export function FinaleSection() {
  const { t } = useLang();

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 pb-24 pt-10 text-center">
      <Reveal>
        <p className="font-sans text-[10px] uppercase tracking-[0.34em] text-gold/80">{t(birthday.lastHeading)}</p>
      </Reveal>
      <Reveal delay={0.12} className="mt-8 max-w-[340px]">
        {birthday.lastLines.map((line, i) => (
          <p key={i} className="font-display text-[22px] leading-relaxed text-cream">
            {t(line)}
          </p>
        ))}
      </Reveal>
      <Reveal delay={0.25} className="mt-10">
        <p className="font-display text-[18px] italic text-amber">— {t(birthday.from)}</p>
      </Reveal>
      <div className="relative mt-14 h-16 w-8">
        <span className="absolute bottom-0 left-1/2 h-10 w-1.5 -translate-x-1/2 rounded-sm bg-[#c45c4a]" />
        <span className="flame absolute left-1/2 top-[-6px] !h-7 !w-4" />
      </div>
    </section>
  );
}
