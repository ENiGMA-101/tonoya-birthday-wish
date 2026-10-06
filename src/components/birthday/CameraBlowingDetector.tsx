"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff, Flame, Loader2, X } from "lucide-react";
import birthday from "@/config/birthdayConfig";
import { useLang } from "./LangContext";
import { haptic } from "@/lib/audio";
import { preloadFaceLandmarker } from "@/lib/faceLandmarker";
import type { FaceLandmarker, FaceLandmarkerResult } from "@mediapipe/tasks-vision";

type CvStatus = "loading" | "ready" | "blowing" | "done" | "denied" | "error";

/* ── MediaPipe FaceMesh landmark indices ─────────────────────── */
const UPPER_LIP = 13;
const LOWER_LIP = 14;
const OUTER_EYE_L = 33;
const OUTER_EYE_R = 263;
const OUTER_LIP_L = 308; // horizontal mouth width anchor (left corner)
const OUTER_LIP_R = 78; // horizontal mouth width anchor (right corner)

/*
 * Tuning for the "ফু" pursed-lips blowing shape:
 *   • small rounded/open mouth (tiny airflow hole)
 *   • lips puckered forward (lip width NARROWS vs neutral)
 *   • `mouthPucker` blendshape high
 *
 * The thresholds are intentionally *loose* — the goal is to feel instant,
 * while the temporal streak (2 open frames / 2 closed frames) + cooldown
 * guards against blinks, smiles, and talking.
 */
const BASELINE_SETTLE_FRAMES = 8; // ~0.27s — "Ready" faster
const OPEN_ENTER_FRAMES = 2; // 2 consecutive ~66ms — near-instant trigger
const OPEN_EXIT_FRAMES = 2;
const CANDLE_COOLDOWN_MS = 650; // short natural delay between candles
const REARM_TIMEOUT_MS = 1300; // controlled re-trigger if mouth stays pursed
const MAR_MIN_AIRFLOW = 0.006; // tiny vertical gap = airflow hole (not sealed smile)
const MAR_REL_THRESHOLD = 1.25; // mouth gap > 1.25× baseline
const LIP_NARROW_RATIO = 0.88; // lip width < 88% of baseline → pursed
const PUCKER_BLEND_MIN = 0.2; // mouthPucker blendshape score
const TOTAL_CANDLES = 5;

export default function CameraBlowingDetector({
  onCandleStep,
  onComplete,
  onClose,
}: {
  onCandleStep: () => void;
  onComplete: () => void;
  onClose: () => void;
}) {
  const { t } = useLang();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);

  /* React state changes only on meaningful edges — never per frame */
  const [status, setStatus] = useState<CvStatus>("loading");
  const [candlesOut, setCandlesOut] = useState(0);
  const [faceSeen, setFaceSeen] = useState(false);

  const cleanup = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    landmarkerRef.current = null; // singleton model stays warm for the session
  }, []);

  useEffect(() => {
    let disposed = false;

    const start = async () => {
      /* ── camera ── */
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!disposed) setStatus("denied");
        return;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 480 },
            height: { ideal: 360 },
            frameRate: { ideal: 30, max: 30 },
          },
          audio: false,
        });
      } catch (err) {
        console.warn("camera.permission.denied", err);
        if (!disposed) setStatus("denied");
        return;
      }
      if (disposed) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {
          /* autoplay handled by playsInline + muted */
        }
      }

      /* ── model (already pre-warmed from CandleScene's idle preloader) ── */
      let landmarker: FaceLandmarker;
      try {
        landmarker = await preloadFaceLandmarker();
      } catch (err) {
        console.warn("faceLandmarker.init.failed", err);
        if (!disposed) setStatus("error");
        return;
      }
      if (disposed) return;
      landmarkerRef.current = landmarker;

      /* ── all loop state in refs — zero per-frame re-renders ── */
      let lastVideoTime = -1;
      let marBase = -1; // adaptive neutral mouth-gap baseline
      let lipWidthBase = -1; // adaptive neutral lip-width baseline
      let openStreak = 0;
      let closeStreak = 0;
      let settleFrames = 0;
      let faceStreak = 0;
      let lostFrames = 0;
      let enteredFace = false;
      let enteredReady = false;
      let enteredBlowing = false;
      let outCount = 0;
      let armed = true;
      let nextAllowedAt = 0;
      let rearmDeadline = 0;
      let done = false;

      const analyze = () => {
        if (disposed || done) return;
        const video = videoRef.current;
        const lm = landmarkerRef.current;

        if (!video || !lm || video.videoWidth === 0) {
          rafRef.current = requestAnimationFrame(analyze);
          return;
        }
        if (video.currentTime === lastVideoTime) {
          rafRef.current = requestAnimationFrame(analyze);
          return;
        }
        lastVideoTime = video.currentTime;

        let result: FaceLandmarkerResult | null = null;
        try {
          result = lm.detectForVideo(video, performance.now());
        } catch {
          rafRef.current = requestAnimationFrame(analyze);
          return;
        }

        const now = performance.now();
        const face = result?.faceLandmarks?.[0];

        if (!face) {
          lostFrames += 1;
          faceStreak = 0;
          openStreak = 0;
          closeStreak = 0;
          if (lostFrames > 14 && faceSeen) setFaceSeen(false);
          if (lostFrames > 14 && enteredBlowing) {
            enteredBlowing = false;
            setStatus((s) => (s === "done" ? s : "ready"));
          }
          rafRef.current = requestAnimationFrame(analyze);
          return;
        }

        /* face present */
        lostFrames = 0;
        faceStreak += 1;
        if (!enteredFace && faceStreak >= 3) {
          enteredFace = true;
          setFaceSeen(true);
        }

        const upper = face[UPPER_LIP];
        const lower = face[LOWER_LIP];
        const eyeL = face[OUTER_EYE_L];
        const eyeR = face[OUTER_EYE_R];
        const lipL = face[OUTER_LIP_L];
        const lipR = face[OUTER_LIP_R];

        const faceScale = Math.hypot(eyeL.x - eyeR.x, eyeL.y - eyeR.y) || 1;
        const mouthGap = Math.hypot(lower.x - upper.x, lower.y - upper.y);
        const lipWidth = Math.hypot(lipL.x - lipR.x, lipL.y - lipR.y);
        const mar = mouthGap / faceScale; // vertical mouth-open ratio
        const lipW = lipWidth / faceScale; // horizontal lip-width ratio

        /* Adaptive baselines (only update while mouth is in neutral range) */
        if (marBase < 0) {
          marBase = mar;
          lipWidthBase = lipW;
        } else {
          // drift downward when mouth relaxes below current baseline
          if (mar < marBase) marBase = marBase * 0.92 + mar * 0.08;
          // drift slowly otherwise — but only if mouth looks neutral
          else if (mar < marBase * 1.2) marBase = marBase * 0.96 + mar * 0.04;

          if (lipW < lipWidthBase) lipWidthBase = lipWidthBase * 0.92 + lipW * 0.08;
          else if (lipW < lipWidthBase * 1.15)
            lipWidthBase = lipWidthBase * 0.96 + lipW * 0.04;
        }

        settleFrames += 1;
        if (settleFrames >= BASELINE_SETTLE_FRAMES && marBase > 0 && lipWidthBase > 0) {
          if (!enteredReady) {
            enteredReady = true;
            setStatus("ready");
          }

          /* ── Blendshape co-signals (cheap — already computed by model) ── */
          let pucker = 0;
          let jawOpen = 0;
          const blend = result?.faceBlendshapes?.[0]?.categories;
          if (blend) {
            for (const c of blend) {
              if (c.categoryName === "mouthPucker") pucker = c.score ?? 0;
              else if (c.categoryName === "jawOpen") jawOpen = c.score ?? 0;
              if (pucker && jawOpen) break;
            }
          }

          /*
           * ── "ফু" shape classifier ──
           *
           *  (1) lips pursed forward: lipW < baseline × 0.88
           *  (2) mouthPucker blendshape high (pucker ≥ 0.20)
           *  (3) tiny vertical airflow gap still visible: mar > 0.006
           *  (4) mouth slightly more open than neutral: mar > 1.25× baseline
           *  (5) NOT a wide jaw-open (talking/shouting) — jawOpen < 0.25
           *
           * All five together = the reference shape. The temporal streak (2
           * consecutive frames) filters out momentary lip pursing while still
           * feeling instant.
           */
          const pursed = lipW < lipWidthBase * LIP_NARROW_RATIO;
          const hasAirflowGap = mar > MAR_MIN_AIRFLOW;
          const slightGapIncrease = mar > marBase * MAR_REL_THRESHOLD;
          const strongPucker = pucker >= PUCKER_BLEND_MIN;
          const notTalking = jawOpen < 0.25;

          const isOpen =
            pursed && hasAirflowGap && slightGapIncrease && strongPucker && notTalking;

          if (isOpen) {
            openStreak += 1;
            closeStreak = 0;
          } else {
            closeStreak += 1;
            openStreak = 0;
          }

          /* Re-arm: mouth back to neutral OR controlled re-trigger after timeout */
          if (armed) {
            rearmDeadline = now + REARM_TIMEOUT_MS;
          } else if (closeStreak >= OPEN_EXIT_FRAMES || now > rearmDeadline) {
            armed = true;
            rearmDeadline = now + REARM_TIMEOUT_MS;
          }

          if (!enteredBlowing && openStreak >= OPEN_ENTER_FRAMES) {
            enteredBlowing = true;
            setStatus("blowing");
          }
          if (enteredBlowing && openStreak === 0) {
            enteredBlowing = false;
            setStatus("ready");
          }

          /* Trigger exactly one candle per confirmed "ফু" edge */
          if (armed && openStreak >= OPEN_ENTER_FRAMES && now >= nextAllowedAt) {
            outCount += 1;
            armed = false;
            nextAllowedAt = now + CANDLE_COOLDOWN_MS;
            rearmDeadline = now + REARM_TIMEOUT_MS;
            setCandlesOut(outCount);
            haptic(10);
            onCandleStep();

            if (outCount >= TOTAL_CANDLES) {
              done = true;
              setStatus("done");
              cleanup(); // stop camera immediately
              haptic([12, 40, 16]);
              onComplete();
              return;
            }
          }
        }

        rafRef.current = requestAnimationFrame(analyze);
      };

      rafRef.current = requestAnimationFrame(analyze);
    };

    void start();

    return () => {
      disposed = true;
      cleanup();
    };
    // onCandleStep / onComplete / onClose are stable-useCallback identities in parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 10 }}
      transition={{ duration: 0.35 }}
      className="relative z-30 mx-auto flex w-full max-w-[340px] flex-col items-center rounded-2xl border border-gold/30 bg-night/90 p-3.5 shadow-[0_16px_36px_-18px_rgba(232,165,75,0.4)] backdrop-blur-md"
    >
      {/* header row */}
      <div className="flex w-full items-center justify-between border-b border-gold/15 pb-2">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              status === "ready" || status === "done"
                ? "bg-emerald-400"
                : status === "blowing"
                  ? "animate-pulse bg-flame"
                  : status === "loading"
                    ? "animate-ping bg-amber"
                    : "bg-red-400"
            }`}
          />
          <span className="font-sans text-[11px] font-medium tracking-wider text-cream/90">
            {status === "loading"
              ? t(birthday.cameraLoadingModel)
              : status === "denied" || status === "error"
                ? t(birthday.cameraDenied)
                : status === "blowing"
                  ? t(birthday.cameraBlowDetected)
                  : status === "done"
                    ? t(birthday.cameraSuccess)
                    : faceSeen
                      ? t(birthday.cameraReady)
                      : t(birthday.cameraFaceMissing)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            haptic(8);
            cleanup();
            onClose();
          }}
          aria-label={t(birthday.cameraClose)}
          className="grid h-7 w-7 place-items-center rounded-full border border-gold/20 text-cream/70 transition-colors hover:border-gold/50 hover:text-cream"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* preview + candle sequence */}
      <div className="mt-3 flex w-full items-center justify-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-gold/40 shadow-inner">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="h-full w-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
          {status === "loading" && (
            <div className="absolute inset-0 grid place-items-center bg-night/85 text-cream/75">
              <Loader2 className="h-5 w-5 animate-spin text-amber" />
            </div>
          )}
          {(status === "denied" || status === "error") && (
            <div className="absolute inset-0 grid place-items-center bg-night/85 text-red-400">
              <CameraOff className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <p className="font-sans text-[10px] text-cream/60">{t(birthday.cameraPrompt)}</p>

          {/* five-candle progress (one flame per candle) */}
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_CANDLES }).map((_, i) => {
              const extinguished = i < candlesOut;
              return (
                <motion.span
                  key={i}
                  animate={
                    extinguished
                      ? { opacity: 0.18, scale: 0.8, filter: "grayscale(1)" }
                      : { opacity: 1, scale: 1 }
                  }
                  transition={{ duration: 0.35 }}
                  className="grid h-7 w-7 place-items-center rounded-full border border-gold/25 bg-cream/5"
                >
                  <Flame
                    className={`h-3.5 w-3.5 ${extinguished ? "text-cream/30" : "text-flame"}`}
                    strokeWidth={1.6}
                  />
                </motion.span>
              );
            })}
          </div>

          <p className="font-sans text-[9px] text-cream/45">{t(birthday.tapFallbackHint)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          haptic(8);
          cleanup();
          onClose();
        }}
        className="mt-2.5 inline-flex items-center gap-1.5 font-sans text-[10px] text-cream/60 transition-colors hover:text-amber"
      >
        {status === "loading" ? <Camera className="h-3 w-3" /> : null}
        <span>{t(birthday.continueWithoutCamera)}</span>
      </button>
    </motion.div>
  );
}
