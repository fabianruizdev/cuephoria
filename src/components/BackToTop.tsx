"use client";

/**
 * Cue ball at the foot of the page: clicking it scrolls back to the top.
 * On hover its red dot rolls upward, hinting at the direction.
 */
export default function BackToTop() {
  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Move focus back to the start of the page too, so keyboard users land at the top.
    document.querySelector<HTMLElement>(".site-logo")?.focus({ preventScroll: true });
  };

  return (
    <button type="button" onClick={toTop} className="cue-top group flex cursor-pointer flex-col items-center gap-2.5 rounded-full text-xs text-bone/60 transition-colors hover:text-bone">
      <span aria-hidden="true" className="cue-ball relative block size-14 rounded-full">
        <span className="cue-ball-dot absolute top-1/2 left-1/2 size-[18%] rounded-full" />
        <span className="cue-ball-shine absolute inset-0 rounded-full" />
      </span>
      <span>Back to top</span>
    </button>
  );
}
