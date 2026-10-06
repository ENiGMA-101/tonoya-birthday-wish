# শুভ জন্মদিন, তনয়া ❤️ (Tabaraka Hasan Tonoya)

A premium, cinematic, interactive birthday memory website created as a brother-to-sister digital birthday gift for **তাবারাকা হাসান তনয়া** (21 October 2005).

---

## ✨ Features & Interactions

### 1. 🕯️ 3D Birthday Cake & Dual-Mode Candle Interaction
- **Cinematic Opening Scene**: Dark ambient lighting with a realistic 3D birthday cake and 5 flickering candles.
- **📷 Computer Vision / Camera Mode**:
  - Tapping **“ক্যামেরা মোড — ফুঁ দিয়ে নেভাও 💨”** requests local in-browser camera access.
  - **MediaPipe FaceLandmarker** tracks the face live and watches the mouth with a scale-invariant, adaptive baseline — the face landmark model is even pre-downloaded while the intro is showing, so Camera Mode opens instantly.
  - The moment a slight mouth opening is confirmed (2 quick frames), **one candle goes out** — then a short cooldown before the next. No multi-second proof required.
  - Sequential natural extinguishing: 1st → short delay → 2nd → … → 5th, each with flame fade, rising smoke, glowing cooling wick, and sound.
  - Blinking, smiling, talking, and head movement don't trigger: adaptive baseline + hysteresis + cooldown + re-arm guard.
  - Camera stream stops immediately after the 5th candle (`MediaStreamTrack.stop()`). 100% local — no frames ever leave the browser.
- **👆 Touch / Fallback Mode**:
  - Tapping the cake or candles directly extinguishes them at any time.
  - Includes a gentle **“ক্যামেরা ছাড়া চালিয়ে যাও”** / **“Continue without camera”** option.
  - Graceful handling if camera permission is denied or unsupported.

### 2. 👫 Brother → Sister Sibling Storytelling
- **Dynamic Age & Intro**: Real-time age computed dynamically from `2005-10-21`.
- **আমার বোন সম্পর্কে কিছু কথা...**: Lines revealing teasing, fighting, and caring.
- **আমাদের শান্তিপূর্ণ সম্পর্ক 🙂 (মানে... শান্তিপূর্ণ না)**: Humorous timeline of sibling arguments and making up.
- **একটা কথা স্বীকার করি...**: *"তোকে জ্বালাতে আমার বেশ ভালো লাগে... ভাই হিসেবে এই privilege শুধু আমার। 😌"*
- **Family Moments & Brother-Sister Memories**: Selected family and sibling photos (purposefully curated, avoiding huge generic galleries).
- **Recent Family Tour & ২০০৫ → আজ Timeline**: Nostalgic milestone progression.
- **Brother's Personal Birthday Letter**: Heartfelt handwritten-style note.
- **Second Cake with Sparkles**: Another wish before the final birthday tribute.

### 3. 🌐 Language Switcher (`বাংলা | ENG`)
- **Default Language**: **বাংলা (`bn`)**.
- Live switcher toggle without page reload or losing scroll position.
- Natural sibling humor translated contextually into English.

---

## 🛠️ Configuration

All copy, photo paths, and settings are centralized in:
`src/config/birthdayConfig.ts`
