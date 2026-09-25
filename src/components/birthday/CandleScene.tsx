"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import birthday from "@/config/birthdayConfig";
import { haptic, playBlow, playChime, unlockAudio } from "@/lib/audio";
import { useLang } from "./LangContext";
import Cake3D from "./Cake3D";

type Phase = "lit" | "blowing" | "happy" | "enter";

const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  left: `${8 + ((i * 17) % 84)}%`,
  delay: (i % 7) * 0.7,
  duration: 9 + (i % 5),
  size: 1.5 + (i % 3),
}));

export default function CandleScene({ onEnter }: { onEnter: () => void }) {
  const { t } = useLang();
  const [phase, setPhase] = useState<Phase>("lit");
  const [lit, setLit] = useState(true);

  const blow = useCallback(() => {
    if (phase !== "lit") return;
    setPhase("blowing");
    haptic([12, 40, 18, 30, 10]);
    unlockAudio();
    playBlow();
    window.setTimeout(() => setLit(false), 90);
    window.setTimeout(() => setPhase("happy"), 1600);
    window.setTimeout(() => setPhase("enter"), 4300);
  }, [phase]);

  const enter = useCallback(() => {
    if (phase !== "enter") return;
    haptic(14);
    playChime();
    onEnter();
  }, [phase, onEnter]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (phase === "lit") blow();
        else if (phase === "enter") enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, blow, enter]);

  const onStage = () => {
    if (phase === "lit") blow();
    else if (phase === "enter") enter();
  };

  return (
    <motion.section
      className="relative flex h-dvh w-full cursor-pointer flex-col items-center justify-end overflow-hidden bg-night film-grain"
      onClick={onStage}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: lit
            ? "radial-gradient(70% 55% at 50% 78%, rgba(232,165,75,0.3) 0%, rgba(80,30,8,0.38) 38%, #070504 72%)"
            : "radial-gradient(70% 55% at 50% 78%, rgba(20,10,6,0.2) 0%, #070504 70%)",
        }}
        transition={{ duration: 1.5 }}
      />

      {lit &&
        EMBERS.map((e, i) => (
          <span
            key={i}
            className="pointer-events-none absolute bottom-[22%] rounded-full bg-amber-hot"
            style={{
              left: e.left,
              width: e.size,
              height: e.size,
              opacity: 0.45,
              animation: `ember ${e.duration}s linear ${e.delay}s infinite`,
              ["--ex" as string]: `${i % 2 === 0 ? 24 : -18}px`,
            }}
          />
        ))}

      <div className="relative z-10 mb-[min(16vh,120px)] flex w-full flex-col items-center">
        <Cake3D lit={lit} blowing={phase !== "lit"} onTap={phase === "lit" ? blow : undefined} />
      </div>

      <div className="relative z-10 mb-[calc(env(safe-area-inset-bottom)+32px)] min-h-[88px] px-7 text-center">
        <AnimatePresence mode="wait">
          {phase === "lit" && (
            <motion.div
              key="lit"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="font-display text-[20px] italic text-cream/90">{t(birthday.openLine1)}</p>
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.8, repeat: Infinity }}
                className="font-display text-[17px] tracking-wide text-amber"
              >
                {t(birthday.openLine2)}
              </motion.p>
            </motion.div>
          )}
          {phase === "happy" && (
            <motion.p
              key="happy"
              initial={{ opacity: 0, y: 12, filter: "blur(8px)", scale: 0.96 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 1 }}
              className="font-display text-[26px] text-cream"
            >
              {t(birthday.afterBlow)}
            </motion.p>
          )}
          {phase === "enter" && (
            <motion.div
              key="enter"
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="font-display text-[24px] italic text-cream">{t(birthday.nowComeIn)}</p>
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-amber/70">{t(birthday.tapToEnter)}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
