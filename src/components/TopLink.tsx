"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ComponentProps } from "react";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Site navigation link (header and footer) that always lands at the top of the page:
 * on another page it opens at the top, and on the current page it scrolls up.
 */
export default function TopLink({ href, onClick, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (href.split("#")[0] === pathname) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });
        }
      }}
      {...rest}
    />
  );
}

/**
 * Every page change opens at the top of the new page. Mount once, in a component that
 * persists across pages (the header). Exceptions: back/forward keeps the position the
 * browser restores.
 */
export function useScrollTopAfterNav() {
  const pathname = usePathname();
  const first = useRef(true);
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPop = () => (fromHistory.current = true);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
}
