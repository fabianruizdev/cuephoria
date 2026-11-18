"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/content/site-data";

/**
 * Photo grid with a native <dialog> viewer: focus containment, Esc / back-gesture
 * dismissal and focus return come from the browser. Click outside also closes.
 */
export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const current = images[index];

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const step = useCallback((d: number) => setIndex((i) => (i + d + images.length) % images.length), [images.length]);

  // Light dismiss where `closedby` is not supported (Safari): press and release outside the dialog box.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;
    const outside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    const down = (e: PointerEvent) => { pressedOutside = outside(e); };
    const up = (e: PointerEvent) => { if (pressedOutside && outside(e)) dialog.close(); };
    dialog.addEventListener("pointerdown", down);
    dialog.addEventListener("pointerup", up);
    return () => {
      dialog.removeEventListener("pointerdown", down);
      dialog.removeEventListener("pointerup", up);
    };
  }, []);

  const navBtn =
    "grid size-12 cursor-pointer place-items-center rounded-full bg-bone text-ink transition-transform hover:scale-105";

  return (
    <>
      <ul className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        {images.map((g, i) => (
          <li key={g.file} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => open(i)}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-card"
              aria-label={`View larger: ${g.alt}`}
            >
              <Image
                src={`/img/gallery/${g.file}.jpg`}
                alt=""
                width={g.w}
                height={g.h}
                sizes="(min-width: 1024px) 308px, (min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        closedby="any"
        aria-label="Photo viewer"
        className="viewer m-auto max-h-[100dvh] w-full max-w-[min(92vw,80rem)] bg-transparent p-0 text-bone backdrop:bg-transparent"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {current && (
          <figure className="flex flex-col items-center gap-4">
            <Image
              key={current.file}
              src={`/img/gallery/${current.file}.jpg`}
              alt={current.alt}
              width={current.w}
              height={current.h}
              sizes="92vw"
              className="max-h-[78dvh] w-auto rounded-card object-contain"
            />
            <figcaption className="text-center text-small text-bone/80">
              {current.alt} <span className="text-bone/50">({index + 1} of {images.length})</span>
            </figcaption>
          </figure>
        )}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button type="button" className={navBtn} onClick={() => step(-1)} aria-label="Previous photo">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none"><path d="M13.5 8h-11M7 3.5 2.5 8 7 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <form method="dialog">
            <button type="submit" autoFocus className="min-h-12 cursor-pointer rounded-full border border-bone/30 px-6 text-small text-bone hover:border-bone/70">
              Close
            </button>
          </form>
          <button type="button" className={navBtn} onClick={() => step(1)} aria-label="Next photo">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </dialog>
    </>
  );
}
