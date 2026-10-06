"use client";

import { AnimatePresence, motion } from "framer-motion";

const CANDLES = [
  { left: "30%", color: "#c45c4a", delay: 0 },
  { left: "40%", color: "#e8c27a", delay: 80 },
  { left: "50%", color: "#6e1220", delay: 40 },
  { left: "60%", color: "#d4a05a", delay: 120 },
  { left: "70%", color: "#8a3a28", delay: 20 },
];

const DRIPS = [
  { left: "16%", height: 16 },
  { left: "36%", height: 22 },
  { left: "56%", height: 15 },
  { left: "76%", height: 20 },
  { left: "88%", height: 12 },
];

export default function Cake3D({
  lit,
  candleStates,
  blowing = false,
  compact = false,
  onTap,
}: {
  lit?: boolean;
  candleStates?: boolean[];
  blowing?: boolean;
  compact?: boolean;
  onTap?: () => void;
}) {
  // If specific candleStates provided (5 booleans), use it; otherwise fallback to lit (default true)
  const isAllLit = lit !== undefined ? lit : true;
  const states = candleStates ?? [isAllLit, isAllLit, isAllLit, isAllLit, isAllLit];

  return (
    <button
      type="button"
      onClick={onTap}
      aria-label="Birthday cake"
      className={`relative mx-auto block cursor-pointer select-none transition-transform active:scale-[0.98] ${
        compact ? "scale-[0.86]" : ""
      }`}
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

        {CANDLES.map((c, i) => {
          const isCandleLit = states[i] ?? true;
          return (
            <span key={i} className="candle relative" style={{ left: c.left, background: c.color }}>
              {/* Wax drip rim on candle top */}
              <span className="absolute -top-[1.5px] -left-[1.5px] -right-[1.5px] h-[3px] rounded-full bg-cream/40 opacity-80" />

              {/* Wick */}
              <span className="wick" />

              {/* Glowing Ember on extinguished wick tip for a few moments */}
              <AnimatePresence>
                {!isCandleLit && (
                  <motion.span
                    key="ember-tip"
                    className="absolute left-1/2 -top-[6px] h-[2.5px] w-[2.5px] -translate-x-1/2 rounded-full bg-flame shadow-[0_0_4px_1px_rgba(255,140,20,0.8)]"
                    initial={{ opacity: 1, scale: 1.2 }}
                    animate={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 1.6, delay: 0.1 }}
                  />
                )}
              </AnimatePresence>

              {/* Flame */}
              <AnimatePresence>
                {isCandleLit && (
                  <motion.span
                    key="flame"
                    className="flame"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.15,
                      y: 8,
                      filter: "blur(2px)",
                      transition: { duration: 0.28, delay: blowing ? (i % 3) * 0.06 : 0 },
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Glow */}
              <AnimatePresence>
                {isCandleLit && (
                  <motion.span
                    key="glow"
                    className="candle-glow"
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.6, delay: blowing ? (i % 3) * 0.06 : 0 },
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Rising Smoke Plume on Extinguish */}
              <AnimatePresence>
                {!isCandleLit && (
                  <motion.span
                    key="smoke"
                    className="absolute left-1/2 -top-[10px] h-9 w-4 -translate-x-1/2 rounded-full bg-cream/25 blur-[3px]"
                    style={{ ["--drift" as string]: `${i % 2 === 0 ? 16 : -14}px` }}
                    initial={{ opacity: 0.55, y: 0, scale: 0.4 }}
                    animate={{ opacity: 0, y: -90, scale: 1.8, x: i % 2 === 0 ? 16 : -14 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.7, delay: (i % 3) * 0.05, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>
            </span>
          );
        })}
      </div>
    </button>
  );
}
