"use client";

import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { gsap, motionOn, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Site-wide scroll motion, driven by data attributes so the sections stay server components.
 *
 *   [data-intro]        inner-page hero items, staggered in on load (hidden by CSS until then)
 *   [data-hero-bg]      hero photo: slow zoom-out on load, parallax on scroll
 *   [data-reveal]       fades up when scrolled into view (batched, so siblings stagger)
 *   [data-split]        display heading: letters pop up when scrolled into view
 *   [data-fill]         statement text: words light up one by one as you scroll through it
 *   [data-count="n"]    single text node with a number: counts from n to its value
 *   [data-media]        rounded photo box: clip-path opens up, photo drifts with scroll
 *   [data-drift="px"]   moves against the scroll by up to px (gallery columns)
 *   .text-neon          flickers on like a neon tube, then buzzes now and then
 *
 * Rendered inside each page's hero (HomeHero / PageHero), not the layout or a template:
 * it has to sit in the page's own tree so its effect runs after the page hydrates. Run any
 * earlier and GSAP edits server HTML React has not hydrated yet (hydration mismatch).
 * It remounts with the page on every navigation. Skipped entirely when motion is off.
 */
export default function PageMotion() {
  useGSAP(
    () => {
      const root = document.documentElement;
      root.classList.add("motion-ready"); // cancels the no-JS failsafe in layout.tsx
      if (!motionOn()) return;

      const main = document.getElementById("main");
      if (!main) return;
      const all = (sel: string, scope: ParentNode = main) => Array.from(scope.querySelectorAll<HTMLElement>(sel));
      const cleanups: (() => void)[] = [];

      /* Inner-page hero ------------------------------------------------ */
      const intro = all("[data-intro]");
      if (intro.length) {
        gsap.fromTo(intro, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, delay: 0.1, clearProps: "transform" });
      }

      all("[data-hero-bg]").forEach((img) => {
        gsap.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 2.6, ease: "power2.out" });
        const panel = img.parentElement!;
        gsap.to(panel, { yPercent: 10, ease: "none", scrollTrigger: { trigger: panel, start: "top top", end: "bottom top", scrub: true } });
      });

      /* Reveals ------------------------------------------------------- */
      const reveals = all("[data-reveal]");
      if (reveals.length) {
        gsap.set(reveals, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(reveals, {
          start: "top 90%",
          once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, overwrite: true, clearProps: "transform" }),
        });
      }

      /* Display headings: letters pop up ------------------------------ */
      all("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "words,chars",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.chars, {
              yPercent: 80,
              rotate: () => gsap.utils.random(-14, 14),
              autoAlpha: 0,
              duration: 0.75,
              ease: "back.out(2.4)",
              stagger: 0.018,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          },
        });
      });

      /* Statement: words fill in with the scroll --------------------- */
      all("[data-fill]").forEach((el) => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            return gsap.fromTo(
              self.words,
              { opacity: 0.15 },
              { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 50%", scrub: true } }
            );
          },
        });
      });

      /* Counters ------------------------------------------------------ */
      all("[data-count]").forEach((el) => {
        const node = el.firstChild;
        if (!node || node.nodeType !== Node.TEXT_NODE) return;
        const original = node.nodeValue ?? "";
        const m = original.match(/^(\D*)(\d+)(.*)$/);
        if (!m) return;
        const [, pre, num, post] = m;
        const o = { v: Number(el.dataset.count) || 0 };
        // Edit the text node React rendered rather than replacing it.
        const write = () => (node.nodeValue = `${pre}${Math.round(o.v)}${post}`);
        write();
        gsap.to(o, { v: Number(num), duration: 1.8, ease: "power2.out", onUpdate: write, scrollTrigger: { trigger: el, start: "top 92%", once: true } });
        cleanups.push(() => (node.nodeValue = original));
      });

      /* Photos -------------------------------------------------------- */
      all("[data-media]").forEach((box) => {
        gsap.fromTo(
          box,
          { clipPath: "inset(10% 7% 10% 7% round 1.5rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", duration: 1.4, ease: "expo.out", clearProps: "clipPath", scrollTrigger: { trigger: box, start: "top 90%", once: true } }
        );
        const img = box.querySelector("img");
        if (img) {
          gsap.fromTo(img, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: "none", scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true } });
        }
      });

      all("[data-drift]").forEach((el) => {
        const amt = Number(el.dataset.drift) || 50;
        gsap.fromTo(el, { y: amt }, { y: -amt, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* Neon tube ----------------------------------------------------- */
      all(".text-neon").forEach((el) => {
        const buzz = gsap.to(el, { keyframes: { opacity: [1, 0.35, 1, 0.75, 1], easeEach: "steps(1)" }, duration: 0.4, repeat: -1, repeatDelay: 5.5, paused: true });
        gsap.fromTo(
          el,
          { opacity: 0.06 },
          {
            keyframes: { opacity: [0.06, 1, 0.12, 0.9, 0.06, 0.06, 1, 0.4, 1], easeEach: "steps(1)" },
            duration: 1.2,
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
            onComplete: () => void buzz.play(),
          }
        );
      });

      // Headings and line breaks shift once the web fonts arrive.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => cleanups.forEach((fn) => fn());
    },
    []
  );

  // The meter goes straight onto <body>: inside the hero it would share the hero's stacking
  // context, and photos further down the page would paint over it.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return mounted ? createPortal(<ScrollMeter />, document.body) : null;
}

const noop = () => () => {};

/** Scroll meter: an orange bar fills along the top edge while an 8-ball rolls with it. */
function ScrollMeter() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const m = ref.current;
    if (!m || !motionOn()) return;
    const bar = m.querySelector("[data-meter-bar]");
    const ball = m.querySelector("[data-meter-ball]");
    const size = 16;
    const dist = () => window.innerWidth - size;
    gsap
      .timeline({ scrollTrigger: { start: 0, end: "max", scrub: 0.4, invalidateOnRefresh: true } })
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0)
      .fromTo(ball, { x: 0, rotation: 0 }, { x: dist, rotation: () => (dist() / (size / 2)) * 57.2958, ease: "none" }, 0);
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="scroll-meter pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div data-meter-bar className="h-full origin-left bg-flame" style={{ transform: "scaleX(0)" }} />
      {/* eslint-disable-next-line @next/next/no-img-element -- 16px decoration, no need for the image optimizer */}
      <img data-meter-ball src="/img/eight-ball.webp" alt="" width={16} height={16} className="absolute top-[3px] left-0 size-4" />
    </div>
  );
}
