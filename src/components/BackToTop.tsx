"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * 8-ball at the foot of the page: clicking it scrolls back to the top.
 * On hover a cue rises beneath it and lines up the shot; on click the cue strikes
 * and the ball shoots upward as the page scrolls.
 */
export default function BackToTop() {
  const [shot, setShot] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShot(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShot(false), 1100);
    // Let the cue land the strike before the page starts moving.
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }), reduce ? 0 : 140);
    // Move focus back to the start of the page too, so keyboard users land at the top.
    document.querySelector<HTMLElement>(".site-logo")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      data-shot={shot ? "" : undefined}
      className="to-top group flex cursor-pointer flex-col items-center gap-2.5 rounded-full text-xs text-bone/60 transition-colors hover:text-bone"
    >
      <span>Back to top</span>
      <Image src="/img/eight-ball.webp" alt="" width={112} height={112} sizes="56px" className="to-top-ball block size-14" />
      <span aria-hidden="true" className="to-top-cue-zone">
        <Image src="/img/cue-v.webp" alt="" width={32} height={900} sizes="8px" className="to-top-cue" draggable={false} />
      </span>
    </button>
  );
}
