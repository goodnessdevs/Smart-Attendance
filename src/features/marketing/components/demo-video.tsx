"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";

/**
 * Click-to-play walkthrough video.
 *
 * The Vite version rendered `<video src="/demo.mp4" autoPlay muted loop>` with
 * no preload hint, so every visitor to the landing page downloaded 26MB before
 * seeing anything — on mobile data included. Nothing loads here until the
 * visitor actually asks for it.
 */
export function DemoVideo() {
  const [playing, setPlaying] = useState(false);

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label="Play the walkthrough video"
        className="group relative flex aspect-video w-full items-center justify-center rounded-2xl border border-green-500/40 bg-gradient-to-br from-green-950 via-black to-green-900 shadow-2xl transition hover:border-green-400"
      >
        <span className="flex flex-col items-center gap-3 text-white">
          <PlayCircle className="h-16 w-16 transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium">
            Play walkthrough
            <span className="block text-xs text-gray-400">26MB video</span>
          </span>
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-green-400/30" />
      </button>
    );
  }

  return (
    <video
      src="/demo.mp4"
      controls
      autoPlay
      playsInline
      preload="none"
      className="aspect-video w-full rounded-2xl border border-green-500/40 bg-black shadow-2xl"
    />
  );
}
