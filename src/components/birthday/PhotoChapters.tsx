"use client";

import Image from "next/image";
import birthday from "@/config/birthdayConfig";
import { useLang } from "./LangContext";
import { Kicker, Reveal } from "./Reveal";

export function FamilySection() {
  const { t } = useLang();

  return (
    <section className="relative px-5 py-20">
      <Reveal className="mb-10 text-center">
        <Kicker>{t(birthday.ui.familyMoments)}</Kicker>
        <h2 className="mt-2 font-display text-[30px] text-cream">{t(birthday.ui.familyMoments)}</h2>
      </Reveal>
      <div className="mx-auto flex max-w-[440px] flex-col gap-12">
        {birthday.familyPhotos.map((p, i) => (
          <Reveal key={p.src} delay={0.05 * i}>
            <figure>
              <div
                className="relative overflow-hidden rounded-[18px] border border-gold/20 shadow-[0_28px_50px_-30px_rgba(0,0,0,0.9)]"
                style={{ aspectRatio: i === 0 ? "16/10" : "4/3" }}
              >
                <Image src={p.src} alt={t(p.alt)} fill className="object-cover" sizes="440px" />
                <span className="absolute inset-0 bg-gradient-to-t from-night/55 via-transparent to-transparent" />
              </div>
              <figcaption className="mt-3 px-1 font-display text-[17px] italic leading-relaxed text-cream/80">
                {t(p.caption)}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function SiblingSection() {
  const { t } = useLang();
  const photo = birthday.siblingPhotos[0];

  return (
    <section className="relative px-5 py-20">
      <Reveal className="mb-8 text-center">
        <h2 className="font-display text-[30px] text-cream">{t(birthday.ui.siblingMoments)}</h2>
      </Reveal>
      <Reveal className="mx-auto max-w-[360px] text-center">
        <p className="font-display text-[20px] italic text-cream/80">{t(birthday.siblingNote1)}</p>
        <p className="mt-2 font-display text-[18px] text-amber">{t(birthday.siblingNote2)}</p>
      </Reveal>
      {photo && (
        <Reveal delay={0.1} className="mx-auto mt-8 max-w-[380px]">
          <figure>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] border border-gold/25 shadow-[0_40px_70px_-32px_rgba(0,0,0,0.9)]">
              <Image src={photo.src} alt={t(photo.alt)} fill className="object-cover" sizes="380px" />
              <span className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
            </div>
            <figcaption className="mt-4 text-center font-display text-[17px] italic text-cream/80">
              {t(photo.caption)}
            </figcaption>
          </figure>
        </Reveal>
      )}
    </section>
  );
}

export function TourSection() {
  const { t } = useLang();
  const photo = birthday.tourPhotos[0];

  return (
    <section className="relative px-5 py-20">
      <Reveal className="mb-8 text-center">
        <h2 className="font-display text-[30px] text-cream">{t(birthday.ui.recentTour)}</h2>
      </Reveal>
      {photo && (
        <Reveal className="mx-auto max-w-[440px]">
          <figure>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] border border-gold/20">
              <Image src={photo.src} alt={t(photo.alt)} fill className="object-cover" sizes="440px" />
            </div>
            <figcaption className="mt-4 text-center">
              <p className="font-display text-[18px] italic text-cream/85">{t(photo.caption)}</p>
              <p className="mt-2 font-display text-[16px] text-cream/60">{t(birthday.tourNote)}</p>
            </figcaption>
          </figure>
        </Reveal>
      )}
    </section>
  );
}

export function GrowingSection() {
  const { t } = useLang();

  return (
    <section className="relative flex min-h-[80dvh] flex-col items-center justify-center px-6 py-20 text-center">
      <Reveal>
        <Kicker>{t(birthday.ui.growingUp)}</Kicker>
        <h2 className="mt-2 font-display text-[36px] text-cream">{t(birthday.growHeading)}</h2>
        <p className="mt-3 font-display text-[18px] italic text-cream/70">{t(birthday.growLine)}</p>
      </Reveal>
      <div className="relative mt-12 w-full max-w-[280px] pl-6 text-left">
        <span className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-gold/60 to-transparent" />
        {birthday.growYears.map((g, i) => (
          <Reveal key={i} delay={0.08 * i} className="relative pb-8 last:pb-0">
            <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border border-gold bg-night" />
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-gold/80">{t(g.year)}</p>
            <p className="mt-0.5 font-display text-[22px] text-cream">{t(g.title)}</p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.3} className="mt-8">
        <p className="font-display text-[20px] italic text-amber">{t(birthday.growEnd)}</p>
      </Reveal>
    </section>
  );
}
