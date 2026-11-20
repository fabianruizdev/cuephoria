"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, motionOn, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Homepage intro: the 8-ball rolls across the "Cue-Phoria" word and reveals it in gold;
 * a few letters behind the ball the gold cools to the word's normal colour. Then the
 * headline lines and the rest of the hero follow.
 *
 * Markup contract (see HomeHero in sections.tsx):
 *   [data-hero="word"]  the big word, sibling of this component inside a relative wrapper
 *   [data-hero-glow]    gold copy of the word laid over it (hidden unless motion runs)
 *   [data-hero="title"] the h1, split into masked lines
 *   [data-hero="item"]  everything else, faded up in order
 * Those elements are hidden by CSS only while <html> has the `motion` class.
 */
export default function HeroBall() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const ballBox = ref.current;
      if (!ballBox || !motionOn()) return;

      const wrap = ballBox.parentElement!;
      const section = wrap.closest("section")!;
      const word = wrap.querySelector<HTMLElement>('[data-hero="word"]')!;
      const glow = wrap.querySelector<HTMLElement>("[data-hero-glow]");
      const spin = ballBox.querySelector<HTMLElement>("[data-ball-spin]")!;
      const title = section.querySelector<HTMLElement>('[data-hero="title"]');
      const items = section.querySelectorAll<HTMLElement>('[data-hero="item"]');

      const showAll = () => {
        gsap.set([word, title, ...items].filter(Boolean), { visibility: "visible", clearProps: "clipPath" });
        if (glow) gsap.set(glow, { display: "none" });
      };

      const play = contextSafe!(() => {
        try {
          // Measure after fonts load: the word's width depends on the font. The ball is
          // display:none until now, so show it first or it measures 0 wide.
          gsap.set(ballBox, { display: "block" });
          const d = ballBox.offsetWidth;
          const r = d / 2;
          const W = word.offsetWidth;
          const left = wrap.getBoundingClientRect().left;
          const startX = -left - d - 8;
          const endX = window.innerWidth - left + 8;
          const dur = gsap.utils.clamp(1.4, 2.5, (endX - startX) / 650);
          // The glow layer is padded so its text-shadow is not masked off; offset the mask by that.
          const pad = glow ? word.getBoundingClientRect().left - glow.getBoundingClientRect().left : 0;
          // How far behind the ball the gold has fully cooled to the normal colour.
          const trail = Math.max(d * 1.5, W * 0.22);

          const p = { x: startX };
          // Rolling without slipping: angle = distance / radius. The light and shading stay
          // fixed; only the "8" decal travels around the sphere. We look down on the ball by
          // TILT degrees, and the decal sits LAT degrees above the rolling circle's front point,
          // so at angle 0 it faces us (like the photo) and it disappears round the back.
          const RAD = Math.PI / 180;
          const TILT = 42;
          const LAT = 48;
          const depth = r * 0.87; // decal plane sits just inside the sphere so its rim meets the surface
          // Finish the roll with the 8 facing front, so the last frames match the photo.
          const endAngle = ((endX - startX) / r) * 57.2958;
          const offset = Math.ceil(endAngle / 360) * 360 - endAngle;
          const render = () => {
            const x = p.x;
            ballBox.style.transform = `translate3d(${x}px,0,0)`;
            const angle = ((x - startX) / r) * 57.2958 + offset;
            spin.style.transform = `translate(-50%,-50%) rotateX(${-TILT}deg) rotateZ(${angle}deg) rotateX(${LAT}deg) translateZ(${depth}px)`;
            // How squarely the decal faces us (1 = straight on); fade it out as it turns edge-on.
            const facing = Math.sin(LAT * RAD) * Math.cos(angle * RAD) * Math.sin(TILT * RAD) + Math.cos(LAT * RAD) * Math.cos(TILT * RAD);
            spin.style.opacity = String(gsap.utils.clamp(0, 1, (facing - 0.05) / 0.3));
            // Reveal up to the ball's centre so the ball always covers the edge.
            const edge = Math.min(W + 40, Math.max(0, x + r));
            word.style.clipPath = edge > 0 ? `polygon(-40px -40%, ${edge}px -40%, ${edge}px 140%, -40px 140%)` : "inset(50%)";
            if (glow) {
              // Solid gold right behind the ball, fading out over `trail` px so the real colour shows through.
              const e = edge + pad;
              glow.style.maskImage = `linear-gradient(90deg, transparent ${e - trail}px, #000 ${e - trail * 0.3}px, #000 ${e}px, transparent ${e}px)`;
            }
          };

          gsap.set(word, { visibility: "visible" });
          render();
          if (glow) gsap.set(glow, { visibility: "visible" });

          const tl = gsap.timeline({
            delay: 0.2,
            onComplete: () => {
              gsap.set(ballBox, { display: "none" });
              gsap.set(word, { clearProps: "clipPath" });
              if (glow) gsap.set(glow, { display: "none" });
            },
          });

          tl.to(p, { x: endX, duration: dur, ease: "power1.inOut", onUpdate: render }, 0);
          // The last letters are still gold when the ball leaves; let them cool too.
          if (glow) tl.to(glow, { opacity: 0, duration: 0.9, ease: "power2.out" }, dur - 0.15);

          if (title) {
            const split = SplitText.create(title, { type: "lines", mask: "lines" });
            gsap.set(title, { visibility: "visible" });
            tl.from(split.lines, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.12, onComplete: () => split.revert() }, dur * 0.45);
          }

          if (items.length) {
            tl.fromTo(items, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, clearProps: "transform" }, dur * 0.6);
          }
        } catch {
          showAll();
        }
      });

      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        play();
      };
      document.fonts?.ready.then(go);
      const fallback = window.setTimeout(go, 1200);

      return () => {
        started = true; // never start after unmount
        window.clearTimeout(fallback);
      };
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="hero-ball pointer-events-none absolute top-1/2 left-0 z-10 aspect-square h-[96%] -translate-y-1/2 will-change-transform"
    >
      {/* Warm light the ball throws on the freshly revealed gold letters */}
      <span className="hero-ball-light absolute top-[-30%] left-[-110%] h-[160%] w-[180%]" />
      {/* Contact shadow stays level under the ball */}
      <span className="absolute inset-x-[14%] bottom-[-4%] h-[10%] rounded-[50%] bg-black/70 blur-[6px]" />
      {/* Glossy black sphere, built in layers so the light never rotates with the ball */}
      <div className="eight-ball absolute inset-0 overflow-hidden rounded-full">
        <div data-ball-spin className="absolute top-1/2 left-1/2 w-[48%] backface-hidden will-change-transform">
          <Image src="/img/eight-decal.webp" alt="" width={256} height={256} sizes="(min-width: 90rem) 100px, 7vw" loading="eager" className="block size-full select-none" draggable={false} />
        </div>
        <span className="eight-ball-shade absolute inset-0 rounded-full" />
        <span className="eight-ball-gloss absolute rounded-[50%]" />
      </div>
    </div>
  );
}
