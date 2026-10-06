"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import birthday from "@/config/birthdayConfig";
import { haptic, playBlow, playChime, unlockAudio } from "@/lib/audio";
import { preloadFaceLandmarker } from "@/lib/faceLandmarker";
import { useLang } from "./LangContext";
import Cake3D from "./Cake3D";
import CameraBlowingDetector from "./CameraBlowingDetector";

type Phase = "lit" | "blowing" | "happy" | "enter";

const TOTAL_CANDLES = 5;

const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  left: `${8 + ((i * 17) % 84)}%`,
  delay: (i % 7) * 0.7,
  duration: 9 + (i % 5),
  size: 1.5 + (i % 3),
}));

export default function CandleScene({ onEnter }: { onEnter: () => void }) {
  const { t } = useLang();
  const prefersReduced = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("lit");
  const [candleStates, setCandleStates] = useState<boolean[]>([true, true, true, true, true]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [sparklesVisible, setSparklesVisible] = useState(false);
  const candleStatesRef = useRef<boolean[]>(candleStates);
  candleStatesRef.current = candleStates;

  /* Start downloading the face model in the background as early as practical —
     the user is reading the intro right now, so Camera Mode opens instantly. */
  useEffect(() => {
    const supportsCamera =
      typeof navigator !== "undefined" &&
      typeof navigator.mediaDevices !== "undefined" &&
      typeof navigator.mediaDevices.getUserMedia === "function";
    if (!supportsCamera) return undefined;

    const kick = () => void preloadFaceLandmarker().catch(() => undefined);
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(kick, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(kick, 400);
    return () => window.clearTimeout(id);
  }, []);

  // Extinguish candles sequentially with individual timing & sound
  const extinguishCandlesSequentially = useCallback(() => {
    if (phase !== "lit") return;
    setPhase("blowing");
    haptic([12, 40, 18, 30, 10]);
    unlockAudio();
    playBlow();

    // Staggered flame cutout across the 5 candles
    for (let i = 0; i < TOTAL_CANDLES; i++) {
      window.setTimeout(() => {
        setCandleStates((prev) => {
          const next = [...prev];
          next[i] = false;
          return next;
        });
      }, i * 90);
    }

    // Celebratory sparkles & transitions
    window.setTimeout(() => {
      setSparklesVisible(true);
    }, 450);

    window.setTimeout(() => {
      setPhase("happy");
    }, 1500);

    window.setTimeout(() => {
      setPhase("enter");
    }, 4200);
  }, [phase]);

  /** extinguish the next still-lit candle from the left — exactly one per call */
  const extinguishNextCandle = useCallback((): boolean => {
    const states = candleStatesRef.current;
    const nextIndex = states.findIndex((s) => s);
    if (nextIndex === -1) return false;
    setCandleStates((prev) => {
      if (!prev[nextIndex]) return prev;
      const next = [...prev];
      next[nextIndex] = false;
      return next;
    });
    return true;
  }, []);

  // CV detector says: one deliberate mouth-open → one candle out
  const handleCandleStep = useCallback(() => {
    if (phase !== "lit") return;
    const didExtinguish = extinguishNextCandle();
    if (didExtinguish) {
      playBlow();
      window.setTimeout(() => setSparklesVisible(true), 300);
    }
  }, [phase, extinguishNextCandle]);

  // All five candles are out via camera → celebrate and invite her inside
  const handleCameraBlowComplete = useCallback(() => {
    setIsCameraActive(false);
    if (phase !== "lit") return;
    setPhase("blowing");
    unlockAudio();
    window.setTimeout(() => setPhase("happy"), 1300);
    window.setTimeout(() => setPhase("enter"), 4000);
  }, [phase]);

  // Direct manual tap handler (always works)
  const handleManualBlow = useCallback(() => {
    setIsCameraActive(false);
    extinguishCandlesSequentially();
  }, [extinguishCandlesSequentially]);

  // Final enter into the memories story
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
        if (phase === "lit") handleManualBlow();
        else if (phase === "enter") enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, handleManualBlow, enter]);

  const onStageClick = () => {
    if (phase === "lit" && !isCameraActive) {
      handleManualBlow();
    } else if (phase === "enter") {
      enter();
    }
  };

  const isAllLit = candleStates.some(Boolean);
  const remainingLitCount = candleStates.filter(Boolean).length;
  const candleGlowIntensity = remainingLitCount / TOTAL_CANDLES;

  return (
    <motion.section
      className="relative flex h-dvh w-full cursor-pointer flex-col items-center justify-end overflow-hidden bg-night film-grain select-none"
      onClick={onStageClick}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Background candle lighting fade */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: isAllLit
            ? `radial-gradient(70% 55% at 50% 78%, rgba(232,165,75,${(
                0.3 * candleGlowIntensity
              ).toFixed(2)}) 0%, rgba(80,30,8,${(0.38 * candleGlowIntensity).toFixed(
                2,
              )}) 38%, #070504 72%)`
            : "radial-gradient(70% 55% at 50% 78%, rgba(20,10,6,0.18) 0%, #070504 70%)",
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Floating gentle amber particles */}
      {!prefersReduced &&
        isAllLit &&
        EMBERS.map((e, i) => (
          <span
            key={i}
            className="pointer-events-none absolute bottom-[22%] rounded-full bg-amber-hot"
            style={{
              left: e.left,
              width: e.size,
              height: e.size,
              opacity: 0.45 * candleGlowIntensity,
              animation: `ember ${e.duration}s linear ${e.delay}s infinite`,
              ["--ex" as string]: `${i % 2 === 0 ? 24 : -18}px`,
            }}
          />
        ))}

      {/* Celebratory sparkles when candles extinguish */}
      <AnimatePresence>
        {sparklesVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-amber-hot shadow-[0_0_8px_rgba(255,200,80,0.9)]"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i * 20 * Math.PI) / 180) * (60 + (i % 5) * 20),
                  y: Math.sin((i * 20 * Math.PI) / 180) * (50 + (i % 4) * 18),
                  opacity: 0,
                  scale: 0.2,
                }}
                transition={{ duration: 1.8, delay: (i % 6) * 0.04, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Birthday Cake with 5 candles */}
      <div className="relative z-10 mb-[min(14vh,110px)] flex w-full flex-col items-center">
        <Cake3D
          candleStates={candleStates}
          blowing={phase !== "lit"}
          onTap={phase === "lit" ? handleManualBlow : undefined}
        />
      </div>

      {/* Interactive Controls & Prompts */}
      <div className="relative z-20 mb-[calc(env(safe-area-inset-bottom)+28px)] min-h-[120px] w-full max-w-[380px] px-6 text-center">
        <AnimatePresence mode="wait">
          {phase === "lit" && (
            <motion.div
              key="lit-controls"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-3"
            >
              {/* If Camera Mode is active: show the Computer Vision Detector */}
              {isCameraActive ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <CameraBlowingDetector
                    onCandleStep={handleCandleStep}
                    onComplete={handleCameraBlowComplete}
                    onClose={() => setIsCameraActive(false)}
                  />
                </div>
              ) : (
                <>
                  <p className="font-display text-[20px] italic text-cream/90">
                    {t(birthday.openLine1)}
                  </p>

                  {/* Primary Camera Mode Action Button */}
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      haptic(10);
                      setIsCameraActive(true);
                    }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gradient-to-r from-amber/20 via-gold/15 to-amber/20 px-4 py-2.5 font-sans text-[12px] font-medium tracking-wide text-cream shadow-[0_4px_20px_rgba(232,165,75,0.25)] backdrop-blur-md transition-all hover:border-gold/70 hover:shadow-[0_4px_28px_rgba(232,165,75,0.4)]"
                  >
                    <Camera className="h-4 w-4 text-amber" />
                    <span>{t(birthday.cameraModeBtn)}</span>
                  </motion.button>

                  {/* Gentle Tap Fallback Prompt */}
                  <motion.p
                    animate={{ opacity: [0.45, 0.95, 0.45] }}
                    transition={{ duration: 2.8, repeat: Infinity }}
                    className="font-display text-[15px] tracking-wide text-cream/70"
                  >
                    {t(birthday.openLine2)}
                  </motion.p>
                </>
              )}
            </motion.div>
          )}

          {phase === "happy" && (
            <motion.div
              key="happy"
              initial={{ opacity: 0, y: 12, filter: "blur(8px)", scale: 0.96 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="font-display text-[28px] text-cream">{t(birthday.afterBlow)}</p>
              <p className="font-sans text-[11px] text-amber/80 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                {t(birthday.cameraSuccess)}
              </p>
            </motion.div>
          )}

          {phase === "enter" && (
            <motion.div
              key="enter"
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="font-display text-[24px] italic text-cream">
                {t(birthday.nowComeIn)}
              </p>
              <p className="font-sans text-[10.5px] uppercase tracking-[0.3em] text-amber/80">
                {t(birthday.tapToEnter)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
