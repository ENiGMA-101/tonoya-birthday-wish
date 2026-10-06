"use client";

import type { FaceLandmarker } from "@mediapipe/tasks-vision";

/**
 * Singleton loader for the MediaPipe FaceLandmarker.
 *
 * The WASM runtime + model are downloaded once per session and shared,
 * so opening Camera Mode feels instant. All inference runs locally in the
 * browser — camera frames never leave the device.
 */

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

let cachedPromise: Promise<FaceLandmarker> | null = null;

export function preloadFaceLandmarker(): Promise<FaceLandmarker> {
  if (!cachedPromise) {
    cachedPromise = (async () => {
      const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
      const landmarker = await FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.45,
        minFacePresenceConfidence: 0.45,
        minTrackingConfidence: 0.45,
        outputFaceBlendshapes: true,
      });
      return landmarker;
    })();

    // Keep the singleton fresh across reloads / tabs closing.
    cachedPromise.catch(() => {
      cachedPromise = null;
    });

    if (typeof window !== "undefined") {
      window.addEventListener(
        "pagehide",
        () => {
          void cachedPromise?.then((l) => {
            try {
              l.close();
            } catch {
              /* already closed */
            }
            cachedPromise = null;
          });
        },
        { once: true },
      );
    }
  }
  return cachedPromise;
}
