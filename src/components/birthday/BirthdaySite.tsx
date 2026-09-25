"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toggleMusic } from "@/lib/audio";
import birthday from "@/config/birthdayConfig";
import MusicToggle from "@/components/ui/MusicToggle";
import CandleScene from "./CandleScene";
import LanguageToggle from "./LanguageToggle";
import { LangProvider } from "./LangContext";
import { AboutSisterSection, ConfessSection, IntroSection, PeaceSection } from "./MemoryJourney";
import { FamilySection, GrowingSection, SiblingSection, TourSection } from "./PhotoChapters";
import { FinaleSection, LetterSection, WishCakeSection } from "./Closing";

function Inner() {
  const [inside, setInside] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!inside) {
      root.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      root.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      root.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [inside]);

  const enter = useCallback(() => {
    setInside(true);
    window.setTimeout(() => {
      void toggleMusic(birthday.musicUrl || undefined);
    }, 800);
  }, []);

  return (
    <>
      <LanguageToggle onDark />
      <MusicToggle revealed={inside} />

      <AnimatePresence>{!inside && <CandleScene key="candles" onEnter={enter} />}</AnimatePresence>

      {inside && (
        <main className="relative min-h-dvh bg-night film-grain">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,rgba(110,18,32,0.12),transparent_55%)]" />
          <div className="relative mx-auto w-full max-w-[760px]">
            <IntroSection />
            <AboutSisterSection />
            <PeaceSection />
            <ConfessSection />
            <FamilySection />
            <SiblingSection />
            <TourSection />
            <GrowingSection />
            <LetterSection />
            <WishCakeSection />
            <FinaleSection />
          </div>
        </main>
      )}
    </>
  );
}

export default function BirthdaySite() {
  return (
    <LangProvider>
      <Inner />
    </LangProvider>
  );
}
