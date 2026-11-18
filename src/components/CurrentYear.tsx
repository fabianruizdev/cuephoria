"use client";

import { useEffect, useRef } from "react";

/** Written in the browser after hydration, so the prerendered page never carries a stale year. */
export default function CurrentYear() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.textContent = String(new Date().getFullYear());
  }, []);
  return <span ref={ref} />;
}
