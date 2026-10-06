/**
 * ────────────────────────────────────────────────────────────────
 *  TONOYA'S BIRTHDAY  ·  brother → sister  ·  single source of truth
 * ────────────────────────────────────────────────────────────────
 *  Replace photos in public/images/birthday/ and edit copy here.
 *  Every user-facing string is { bn, en }.
 */

export type Lang = "bn" | "en";
export type Bi = { bn: string; en: string };

export type PhotoMoment = {
  src: string;
  alt: Bi;
  caption: Bi;
};

export const birthday = {
  defaultLang: "bn" as Lang,

  name: { bn: "তাবারাকা হাসান তনয়া", en: "Tabaraka Hasan Tonoya" },
  nickname: { bn: "তনয়া", en: "Tonoya" },
  birthDate: "2005-10-21",
  birthDateDisplay: { bn: "২১ অক্টোবর ২০০৫", en: "21 October 2005" },
  calledAs: { bn: "তনয়া বলে ডাকি।", en: "I just call her Tonoya." },
  from: { bn: "তোর ভাই", en: "Your brother" },

  profilePhoto: "/images/birthday/profile.jpg",
  secondSoloPhoto: "/images/birthday/solo-2.jpg",

  /* ── Opening cake & candle scene ───────────────────────── */
  openLine1: { bn: "তনয়া, আগে একটা কাজ কর...", en: "Tonoya, do one thing first..." },
  openLine2: { bn: "মোমবাতিগুলো নিভিয়ে দে।", en: "Blow out the candles." },
  afterBlow: { bn: "Happy Birthday, তনয়া ❤️", en: "Happy Birthday, Tonoya ❤️" },
  nowComeIn: { bn: "এবার ভিতরে আয়...", en: "Now come inside..." },
  tapToEnter: { bn: "ভেতরে আসতে স্পর্শ করো", en: "Tap to come in" },

  /* ── Computer Vision / Camera Mode ─────────────────────── */
  cameraModeBtn: {
    bn: "ক্যামেরা মোড — ফুঁ দিয়ে নেভাও 💨",
    en: "Camera Mode — Blow out candles 💨",
  },
  tryWithCamera: {
    bn: "ক্যামেরা দিয়ে চেষ্টা করো",
    en: "Try with camera",
  },
  continueWithoutCamera: {
    bn: "ক্যামেরা ছাড়া চালিয়ে যাও",
    en: "Continue without camera",
  },
  cameraPrompt: {
    bn: "মোমবাতির দিকে তাকিয়ে ফুঁ দাও 💨",
    en: "Look at the candles and blow 💨",
  },
  cameraBlowingDetected: {
    bn: "ফুঁ শনাক্ত হচ্ছে... 💨",
    en: "Blowing detected... 💨",
  },
  cameraSuccess: {
    bn: "দারুণ! এবার জন্মদিনের গল্পে ঢুকে পড়ো ✨",
    en: "Awesome! Now step into the birthday story ✨",
  },
  cameraDenied: {
    bn: "ক্যামেরা পাওয়া যায়নি — মোমবাতিতে ট্যাপ করো",
    en: "Camera unavailable — tap the candles directly",
  },
  cameraClose: {
    bn: "ক্যামেরা বন্ধ করো",
    en: "Close camera",
  },
  tapFallbackHint: {
    bn: "অথবা মোমবাতিতে ট্যাপ করো",
    en: "or tap the candles directly",
  },
  cameraDetectingFace: {
    bn: "মুখ শনাক্ত করছি...",
    en: "Detecting face...",
  },
  cameraReady: {
    bn: "প্রস্তুত 💨",
    en: "Ready 💨",
  },
  cameraBlowing: {
    bn: "ফুঁ দিচ্ছো…",
    en: "Blowing…",
  },
  cameraBlowDetected: {
    bn: "ফুঁ detected…",
    en: "ফুঁ detected…",
  },
  cameraFaceMissing: {
    bn: "মুখটা ফ্রেমে দেখাও",
    en: "Show your face to the camera",
  },
  cameraLoadingModel: {
    bn: "চিহ্নিত করছি…",
    en: "Warming up…",
  },
  cameraAlmostThere: {
    bn: "প্রায় হয়ে গেছে...",
    en: "Almost there...",
  },

  introKicker: { bn: "শুভ জন্মদিন, তনয়া! 🎂", en: "Happy Birthday, Tonoya! 🎂" },
  introSub: {
    bn: "একটা ছোট্ট ডিজিটাল উপহার — তোর ভাইয়ের তরফ থেকে।",
    en: "A small digital gift — from your brother.",
  },

  /* ── Brother intro lines ───────────────────────────────── */
  aboutHeading: { bn: "আমার বোন সম্পর্কে কিছু কথা...", en: "A few words about my sister..." },
  aboutLines: [
    { bn: "যে আমাকে সবচেয়ে বেশি বিরক্ত করে...", en: "The one who annoys me the most..." },
    { bn: "যার সাথে সবচেয়ে বেশি ঝগড়া হয়...", en: "The one I argue with the most..." },
    { bn: "যাকে সবচেয়ে বেশি জ্বালাই...", en: "The one I tease the most..." },
    { bn: "আবার প্রয়োজন হলে সবার আগে যার পাশে দাঁড়াই...", en: "And the one I stand beside first, if she ever needs it..." },
  ] as Bi[],
  aboutPunch: { bn: "হ্যাঁ, সে-ই তনয়া।", en: "Yes. That's Tonoya." },

  /* ── Peaceful relationship (not peaceful) ──────────────── */
  peaceTitle: { bn: "আমাদের শান্তিপূর্ণ সম্পর্ক 🙂", en: "Our peaceful relationship 🙂" },
  peaceNope: { bn: "মানে... শান্তিপূর্ণ না।", en: "Okay wait. Not peaceful." },
  peaceCards: [
    {
      q: { bn: "৫ মিনিট শান্তি", en: "Five minutes of peace" },
      a: { bn: "impossible", en: "impossible" },
    },
    {
      q: { bn: "একজন কিছু বলবে", en: "One of us says something" },
      a: { bn: "আরেকজন উত্তর দেবে", en: "the other has a reply ready" },
    },
    {
      q: { bn: "তারপর?", en: "Then?" },
      a: { bn: "ঝগড়া", en: "an argument" },
    },
    {
      q: { bn: "তারপর?", en: "Then?" },
      a: { bn: "খুনসুটি", en: "more teasing" },
    },
    {
      q: { bn: "তারপর?", en: "Then?" },
      a: { bn: "আবার ঠিক হয়ে যাওয়া", en: "and we're fine again" },
    },
  ] as Array<{ q: Bi; a: Bi }>,
  fightTimeline: [
    { bn: "খুনসুটি", en: "Teasing" },
    { bn: "মারামারি", en: "A little fight" },
    { bn: "বকা-বকি", en: "Scolding" },
    { bn: "কে আগে দোষ করেছে?", en: "Who started it?" },
    { bn: "দুজনেরই দোষ", en: "Both of us, obviously" },
    { bn: "আবার একসাথে খাওয়া", en: "Then we eat together anyway" },
  ] as Bi[],

  /* ── Confession ────────────────────────────────────────── */
  confessHeading: { bn: "একটা কথা স্বীকার করি...", en: "Okay, I'll admit one thing..." },
  confessLines: [
    { bn: "তোকে জ্বালাতে আমার বেশ ভালোই লাগে।", en: "I actually enjoy annoying you." },
    {
      bn: "কিন্তু কেউ তোকে জ্বালালে সেটা আবার আমার একদম ভালো লাগে না।",
      en: "But if anyone else annoys you — I don't like that at all.",
    },
    { bn: "ভাই হিসেবে এই privilege শুধু আমার। 😌", en: "That's a brother's privilege. Mine only. 😌" },
  ] as Bi[],
  confessSoft: {
    bn: "মজা বাদ দিলে, তুই আমার জীবনের খুব গুরুত্বপূর্ণ একজন মানুষ।",
    en: "Jokes aside — you're one of the most important people in my life.",
  },

  /* ── Photos (keep this list short) ─────────────────────── */
  familyPhotos: [
    {
      src: "/images/birthday/family-1.jpg",
      alt: { bn: "পরিবার একসাথে", en: "The family together" },
      caption: { bn: "সবাই একসাথে থাকলে ছবিটাও একটু বেশি সুন্দর হয়।", en: "When everyone's together, even the photo looks a little kinder." },
    },
    {
      src: "/images/birthday/family-2.jpg",
      alt: { bn: "পারিবারিক একটি মুহূর্ত", en: "A family moment" },
      caption: { bn: "এই ছবিগুলোই আসলে আসল স্মৃতি।", en: "These are the real memories." },
    },
    {
      src: "/images/birthday/family-casual.jpg",
      alt: { bn: "একটা সাধারণ পরিবারের দিন", en: "An ordinary family day" },
      caption: { bn: "পরিবারের সাথে কাটানো সময়গুলো পরে গিয়ে সবচেয়ে বেশি মনে পড়ে।", en: "The ordinary family days are the ones you miss later." },
    },
  ] satisfies PhotoMoment[],

  siblingPhotos: [
    {
      src: "/images/birthday/sibling.jpg",
      alt: { bn: "ভাই-বোন", en: "Brother and sister" },
      caption: { bn: "তবুও এই অল্প কয়েকটা ছবির value অনেক।", en: "Still — these few pictures are worth a lot." },
    },
  ] satisfies PhotoMoment[],
  siblingNote1: {
    bn: "একসাথে ছবি তোলার সংখ্যাটা কম...",
    en: "We don't have many photos together...",
  },
  siblingNote2: {
    bn: "কারণ আমরা ছবি তোলার চেয়ে বেশি সময় ঝগড়া করতেই ব্যস্ত। 😂",
    en: "Because we spend more time arguing than posing. 😂",
  },

  tourPhotos: [
    {
      src: "/images/birthday/tour.jpg",
      alt: { bn: "সাম্প্রতিক ফ্যামিলি ট্যুর", en: "A recent family tour" },
      caption: { bn: "সাম্প্রতিক কিছু সুন্দর সময়...", en: "Some recent, good days..." },
    },
  ] satisfies PhotoMoment[],
  tourNote: {
    bn: "সব ছবি perfect না হলেও, সময়গুলো perfect ছিল।",
    en: "Not every photo is perfect. The days were.",
  },

  growYears: [
    { year: { bn: "২০০৫", en: "2005" }, title: { bn: "শুরু", en: "The beginning" } },
    { year: { bn: "শৈশব", en: "Childhood" }, title: { bn: "ছোট্ট তনয়া", en: "Little Tonoya" } },
    { year: { bn: "স্কুল", en: "School" }, title: { bn: "বড় হতে থাকা", en: "Growing up" } },
    { year: { bn: "এখন", en: "Now" }, title: { bn: "আজকের তনয়া", en: "Today's Tonoya" } },
  ],
  growHeading: { bn: "২০০৫ → আজ", en: "2005 → Today" },
  growLine: {
    bn: "একটা ছোট্ট মানুষ থেকে আজকের তনয়া...",
    en: "From a tiny human to the Tonoya of today...",
  },
  growEnd: { bn: "সময় কত দ্রুত চলে যায়, তাই না?", en: "Time moves too fast, doesn't it?" },

  /* ── Letter ────────────────────────────────────────────── */
  letterGreeting: { bn: "তনয়া,", en: "Tonoya," },
  letterParagraphs: [
    {
      bn: "তোকে নিয়ে অনেক কিছুই বলা যায়।",
      en: "There's a lot I could say about you.",
    },
    {
      bn: "তোকে সবচেয়ে বেশি মনে থাকে আমাদের মারামারি, খুনসুটি, একজন আরেকজনকে জ্বালানো, আর ছোট ছোট বিষয় নিয়ে ঝগড়া করা।",
      en: "What I remember most is the fighting, the teasing, the way we wind each other up over the smallest things.",
    },
    {
      bn: "কিন্তু এইসবের মাঝেই কখন যে এতগুলো বছর কেটে গেল, সেটা বুঝতেই পারিনি।",
      en: "And somewhere inside all of that, years went by without us noticing.",
    },
    {
      bn: "সবসময় হয়তো বলি না, কিন্তু তুই আমার খুব আপন একজন।",
      en: "I don't always say it — but you're one of my people. Properly.",
    },
    {
      bn: "তোর জীবনটা অনেক সুন্দর হোক। তুই যেটা হতে চাস, সেটা হতে পারিস। অনেক হাসিস, অনেক ঘুরিস, অনেক ভালো থাকিস।",
      en: "I hope your life is a good one. Become whoever you want to be. Laugh a lot. Go places. Stay well.",
    },
    {
      bn: "আর হ্যাঁ... আমাকে বেশি জ্বালাস না। 😑",
      en: "And yes... don't annoy me too much. 😑",
    },
    {
      bn: "কারণ তোকে জ্বালানোর দায়িত্বটা আমার। 😂",
      en: "Annoying you is my job. 😂",
    },
  ] as Bi[],
  letterSign: { bn: "শুভ জন্মদিন, তনয়া। ❤️", en: "Happy Birthday, Tonoya. ❤️" },

  cakeLine1: { bn: "আরেকটা বছর শুরু...", en: "Another year begins..." },
  cakeLine2: { bn: "আরও অনেক গল্প বাকি।", en: "Plenty of stories still left." },
  cakeWish: { bn: "একটা wish কর।", en: "Make a wish." },
  cakeHappy: { bn: "শুভ জন্মদিন, তনয়া ❤️", en: "Happy Birthday, Tonoya ❤️" },

  lastHeading: { bn: "একটা শেষ কথা...", en: "One last thing..." },
  lastLines: [
    {
      bn: "জীবনে যত বড়ই হয়ে যাস, আমার কাছে তুই সবসময় সেই তনয়াই থাকবি",
      en: "No matter how grown-up you get, to me you'll always be that same Tonoya",
    },
    {
      bn: "যাকে একটু জ্বালানো যায়, একটু বকা যায়, আর অনেক ভালোবাসা যায়। ❤️",
      en: "the one I can tease a little, scold a little, and love a lot. ❤️",
    },
  ] as Bi[],

  ui: {
    happyBirthday: { bn: "শুভ জন্মদিন", en: "Happy Birthday" },
    birthDateLabel: { bn: "জন্মদিন", en: "Birth Date" },
    ageLabel: { bn: "বয়স", en: "Age" },
    familyMoments: { bn: "আমাদের Family Moments", en: "Our Family Moments" },
    siblingMoments: { bn: "ভাই-বোনের কিছু মুহূর্ত", en: "A few brother–sister moments" },
    recentTour: { bn: "Recent Family Tour", en: "Recent Family Tour" },
    growingUp: { bn: "বড় হওয়া", en: "Growing up" },
  },

  musicUrl: "",
} as const;

export type BirthdayConfig = typeof birthday;
export default birthday;

export function computeAge(iso = birthday.birthDate, now = new Date()): number {
  const d = new Date(iso);
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

export function formatAge(age: number, lang: Lang): string {
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const n = lang === "bn" ? String(age).replace(/\d/g, (c) => bn[Number(c)] ?? c) : String(age);
  return lang === "bn" ? `${n} বছর` : `${n} years`;
}
