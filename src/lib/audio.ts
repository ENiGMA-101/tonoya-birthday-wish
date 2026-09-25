/**
 * Tiny Web Audio engine for the birthday experience.
 * · unlock on first gesture
 * · blow / whoosh when candles go out
 * · soft chime on enter
 * · optional generative ambient pad
 */

type Ctx = AudioContext & { _unlocked?: boolean };

let ctx: Ctx | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let playing = false;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let droneNodes: OscillatorNode[] = [];
let nextNoteAt = 0;
let externalAudio: HTMLAudioElement | null = null;
const listeners = new Set<(on: boolean) => void>();

const SCALE = [196.0, 246.94, 293.66, 329.63, 392.0, 493.88];

function ensureContext(): Ctx | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC: typeof AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC() as Ctx;
      master = ctx.createGain();
      master.gain.value = 0.85;
      master.connect(ctx.destination);
      musicBus = ctx.createGain();
      musicBus.gain.value = 0;
      musicBus.connect(master);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function unlockAudio(url?: string) {
  if (url) {
    if (!externalAudio) {
      externalAudio = new Audio(url);
      externalAudio.loop = true;
      externalAudio.volume = 0;
    }
    return;
  }
  ensureContext();
}

export function haptic(pattern: number | number[] = 12) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* noop */
    }
  }
}

/** airy noise burst — blowing out candles */
export function playBlow() {
  const c = ensureContext();
  if (!c || !master) return;
  const bufferSize = c.sampleRate * 0.9;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const t = i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 1.8) * 0.55;
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.7;
  const gain = c.createGain();
  const now = c.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.55, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  src.start(now);
  src.stop(now + 0.9);
}

export function playChime(volume = 0.14) {
  const c = ensureContext();
  if (!c || !master) return;
  const now = c.currentTime;
  const bus = c.createGain();
  bus.gain.value = volume;
  bus.connect(master);
  [392.0, 523.25, 659.25].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    const at = now + i * 0.11;
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.45, at + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 2.1);
    osc.connect(gain);
    gain.connect(bus);
    osc.start(at);
    osc.stop(at + 2.3);
  });
}

function startDrone() {
  const c = ensureContext();
  if (!c || !musicBus || droneNodes.length) return;
  [98.0, 146.83].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = i === 0 ? 0.03 : 0.018;
    osc.connect(gain);
    gain.connect(musicBus!);
    osc.start();
    droneNodes.push(osc);
  });
}

function bell(at: number, freq: number) {
  const c = ensureContext();
  if (!c || !musicBus) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.04, at + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 3.2);
  osc.connect(gain);
  gain.connect(musicBus);
  osc.start(at);
  osc.stop(at + 3.4);
}

function scheduler() {
  const c = ctx;
  if (!c) return;
  while (nextNoteAt < c.currentTime + 1.2) {
    bell(nextNoteAt, SCALE[Math.floor(Math.random() * SCALE.length)]);
    nextNoteAt += 2.4 + Math.random() * 2;
  }
}

function emit() {
  listeners.forEach((l) => l(playing));
}

export function subscribe(fn: (on: boolean) => void) {
  listeners.add(fn);
  fn(playing);
  return () => {
    listeners.delete(fn);
  };
}

export async function toggleMusic(url?: string): Promise<boolean> {
  if (url) {
    try {
      if (!externalAudio) {
        externalAudio = new Audio(url);
        externalAudio.loop = true;
      }
      if (playing) {
        externalAudio.pause();
        playing = false;
      } else {
        externalAudio.volume = 0.45;
        await externalAudio.play();
        playing = true;
      }
      emit();
      return playing;
    } catch {
      /* fall through */
    }
  }
  const c = ensureContext();
  if (!c || !musicBus) return false;
  if (playing) {
    playing = false;
    const now = c.currentTime;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setValueAtTime(musicBus.gain.value, now);
    musicBus.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
    emit();
    return false;
  }
  startDrone();
  const now = c.currentTime;
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(0.0001, now);
  musicBus.gain.linearRampToValueAtTime(0.7, now + 2);
  nextNoteAt = now + 0.4;
  scheduler();
  musicTimer = setInterval(scheduler, 600);
  playing = true;
  emit();
  return true;
}
