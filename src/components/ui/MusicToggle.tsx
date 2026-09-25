"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music, Pause } from "lucide-react";
import { haptic, subscribe, toggleMusic } from "@/lib/audio";
import birthday from "@/config/birthdayConfig";

export default function MusicToggle({ revealed = true }: { revealed?: boolean }) {
  const [on, setOn] = useState(false);
  useEffect(() => subscribe(setOn), []);

  return (
    <AnimatePresence>
      {revealed && (
        <motion.button
          type="button"
          key="music"
          aria-label={on ? "Pause music" : "Play music"}
          aria-pressed={on}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileTap={{ scale: 0.88 }}
          onClick={() => {
            haptic(8);
            void toggleMusic(birthday.musicUrl || undefined);
          }}
          className="fixed right-4 top-[calc(env(safe-area-inset-top)+14px)] z-[70] grid h-11 w-11 place-items-center rounded-full border border-amber/30 bg-night/70 text-cream backdrop-blur-md"
        >
          <span className={on ? "animate-spin-slow" : ""}>
            {on ? <Pause className="h-[16px] w-[16px]" strokeWidth={1.4} /> : <Music className="h-[16px] w-[16px]" strokeWidth={1.4} />}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
