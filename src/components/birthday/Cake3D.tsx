"use client";

import { AnimatePresence, motion } from "framer-motion";

const CANDLES = [
  { left: "32%", color: "#c45c4a", delay: 0 },
  { left: "42%", color: "#e8c27a", delay: 80 },
  { left: "50%", color: "#6e1220", delay: 40 },
  { left: "58%", color: "#d4a05a", delay: 120 },
  { left: "68%", color: "#8a3a28", delay: 20 },
];

const DRIPS = [
  { left: "18%", height: 16 },
  { left: "38%", height: 22 },
  { left: "58%", height: 14 },
  { left: "78%", height: 20 },
];

export default function Cake3D({
  lit,
  blowing,
  compact = false,
  onTap,
}: {
  lit: boolean;
  blowing?: boolean;
  compact?: boolean;
  onTap?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label="Birthday cake"
      className={`relative mx-auto block select-none ${compact ? "scale-[0.86]" : ""}`}
      style={{ width: 280, height: compact ? 240 : 280 }}
    >
      <div className="cake-stage mx-auto">
        <div className="cake-plate" />
        <div className="cake-layer bottom" />
        <div className="cake-layer mid" />
        <div className="cake-layer top" />
        <div className="cake-icing">
          {DRIPS.map((d, i) => (
            <span key={i} className="drip" style={{ left: d.left, height: d.height }} />
          ))}
        </div>

        {CANDLES.map((c, i) => (
          <span key={i} className="candle" style={{ left: c.left, background: c.color }}>
            <span className="wick" />
            <AnimatePresence>
              {lit && (
                <motion.span
                  key="flame"
                  className="flame"
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.2,
                    y: 6,
                    transition: { duration: 0.28, delay: blowing ? i * 0.09 : 0 },
                  }}
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {lit && (
                <motion.span
                  key="glow"
                  className="candle-glow"
                  exit={{ opacity: 0, transition: { duration: 0.8, delay: blowing ? i * 0.09 : 0 } }}
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {blowing && !lit && (
                <motion.span
                  key="smoke"
                  className="absolute left-1/2 top-[-8px] h-8 w-4 -translate-x-1/2 rounded-full bg-cream/25 blur-[3px]"
                  style={{ ["--drift" as string]: `${i % 2 === 0 ? 16 : -14}px` }}
                  initial={{ opacity: 0.5, y: 0, scale: 0.4 }}
                  animate={{ opacity: 0, y: -88, scale: 1.7, x: i % 2 === 0 ? 16 : -14 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.7, delay: i * 0.08, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>
          </span>
        ))}
      </div>
    </button>
  );
}
