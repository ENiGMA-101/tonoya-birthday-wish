"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import birthday, { computeAge, formatAge } from "@/config/birthdayConfig";
import { useLang } from "./LangContext";
import { Kicker, Reveal } from "./Reveal";

export function IntroSection() {
  const { t, lang } = useLang();
  const age = computeAge();

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_18%,rgba(232,165,75,0.09),transparent_70%)]" />
      <Reveal>
        <p className="font-display text-[22px] italic text-amber">{t(birthday.introKicker)}</p>
      </Reveal>
      <Reveal delay={0.1} y={26}>
        <h1 className="mt-4 font-display text-[34px] font-light leading-[1.2] text-cream sm:text-[44px]">
          {t(birthday.name)}
        </h1>
      </Reveal>
      <Reveal delay={0.18} className="mt-6 flex items-center gap-7">
        <div>
          <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-cream/40">{t(birthday.ui.birthDateLabel)}</p>
          <p className="mt-1 font-display text-[18px] text-cream">{t(birthday.birthDateDisplay)}</p>
        </div>
        <span className="h-8 w-px bg-gold/30" />
        <div>
          <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-cream/40">{t(birthday.ui.ageLabel)}</p>
          <p className="mt-1 font-display text-[18px] text-cream">{formatAge(age, lang)}</p>
        </div>
      </Reveal>
      <Reveal delay={0.26} className="mt-5">
        <p className="font-display text-[18px] italic text-cream/75">{t(birthday.calledAs)}</p>
      </Reveal>
      <Reveal delay={0.32} className="mt-3 max-w-[300px]">
        <p className="font-sans text-[13px] leading-relaxed text-cream/50">{t(birthday.introSub)}</p>
      </Reveal>
      <motion.div
        className="relative mt-10 h-52 w-36 overflow-hidden rounded-[20px] border border-gold/25 shadow-[0_32px_60px_-28px_rgba(0,0,0,0.85)]"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.15 }}
      >
        <Image src={birthday.profilePhoto} alt={t(birthday.name)} fill sizes="180px" className="object-cover" priority />
      </motion.div>
    </section>
  );
}

export function AboutSisterSection() {
  const { t } = useLang();

  return (
    <section className="relative flex min-h-[90dvh] flex-col items-center justify-center px-6 py-20 text-center">
      <Reveal>
        <h2 className="font-display text-[28px] leading-snug text-cream sm:text-[34px]">{t(birthday.aboutHeading)}</h2>
      </Reveal>
      <div className="mt-10 flex max-w-[360px] flex-col gap-6">
        {birthday.aboutLines.map((line, i) => (
          <Reveal key={i} delay={0.08 * i} y={18}>
            <p className="font-display text-[20px] italic leading-relaxed text-cream/80">{t(line)}</p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.45} className="mt-12">
        <p className="font-display text-[26px] text-amber">{t(birthday.aboutPunch)}</p>
      </Reveal>
    </section>
  );
}

export function PeaceSection() {
  const { t } = useLang();

  return (
    <section className="relative px-5 py-20">
      <Reveal className="text-center">
        <h2 className="font-display text-[28px] text-cream">{t(birthday.peaceTitle)}</h2>
      </Reveal>
      <Reveal delay={0.15} className="mt-3 text-center">
        <p className="font-display text-[20px] italic text-amber">{t(birthday.peaceNope)}</p>
      </Reveal>

      <div className="mx-auto mt-10 flex max-w-[400px] flex-col gap-3">
        {birthday.peaceCards.map((card, i) => (
          <Reveal key={i} delay={0.04 * i}>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-gold/20 bg-cream/[0.04] px-4 py-3.5">
              <span className="font-display text-[17px] text-cream/85">{t(card.q)}</span>
              <span className="shrink-0 font-sans text-[12px] uppercase tracking-[0.14em] text-amber">→ {t(card.a)}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="relative mx-auto mt-14 max-w-[320px] pl-7">
        <span className="absolute bottom-1 left-[9px] top-1 w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent" />
        {birthday.fightTimeline.map((step, i) => (
          <Reveal key={i} delay={0.05 * i} className="relative pb-7 last:pb-0">
            <span className="absolute -left-[23px] top-1.5 h-2.5 w-2.5 rounded-full border border-gold bg-night" />
            <p className="font-display text-[20px] text-cream">{t(step)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ConfessSection() {
  const { t } = useLang();

  return (
    <section className="relative flex min-h-[85dvh] flex-col items-center justify-center px-6 py-20 text-center">
      <Reveal>
        <Kicker>{t(birthday.confessHeading)}</Kicker>
        <h2 className="mt-2 font-display text-[28px] text-cream">{t(birthday.confessHeading)}</h2>
      </Reveal>
      <div className="mt-10 flex max-w-[340px] flex-col gap-7">
        {birthday.confessLines.map((line, i) => (
          <Reveal key={i} delay={0.1 * i} y={16}>
            <p className="font-display text-[22px] italic leading-relaxed text-cream/85">{t(line)}</p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.4} className="mt-12 max-w-[320px]">
        <p className="font-display text-[20px] leading-relaxed text-amber">{t(birthday.confessSoft)}</p>
      </Reveal>
    </section>
  );
}
