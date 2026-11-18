"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { site } from "@/content/site-data";
import { tel } from "@/lib/format";
import { PillLink } from "./ui";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/table-rates", label: "Table rates" },
  { href: "/food-menu", label: "Menu" },
  { href: "/book-events-contact-us", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/hours-location", label: "Visit" },
] as const;

/* The inline navigation appears at this width; below it the same list is a popover. */
const WIDE = "(min-width: 75rem)";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="text-[1.625rem] font-extrabold tracking-[-0.01em] text-bone uppercase">Cue-Phoria</span>
      <span className="mt-1.5 text-[0.6875rem] tracking-[0.3em] text-bone/80 uppercase">Billiards &amp; Sports Bar</span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLUListElement>(null);

  // Keep `popover` only in the collapsed layout, as the navbar guide recommends.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const mq = window.matchMedia(WIDE);
    const sync = () => {
      if (mq.matches) {
        if (menu.hasAttribute("popover")) {
          try { menu.hidePopover(); } catch {}
          menu.removeAttribute("popover");
        }
      } else if (!menu.hasAttribute("popover")) {
        menu.setAttribute("popover", "auto");
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Client-side navigation does not reload the page, so close the menu ourselves.
  useEffect(() => {
    const menu = menuRef.current;
    if (menu?.matches(":popover-open")) menu.hidePopover();
  }, [pathname]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-[6.875rem] max-w-[90rem] items-center gap-4 px-5 pt-4 sm:px-8 xl:h-[7.125rem] xl:px-14">
        <Link href="/" className="me-auto shrink-0 rounded-sm" aria-label={`${site.business.shortName} home`}>
          <Logo />
        </Link>

        <nav aria-label="Primary" className="contents">
          <button
            type="button"
            popoverTarget="site-menu"
            aria-controls="site-menu"
            className="order-3 inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full border border-bone/25 px-4 text-small text-bone transition-colors hover:border-bone/60 min-[75rem]:hidden"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>Menu</span>
          </button>

          <ul
            id="site-menu"
            ref={menuRef}
            popover="auto"
            className="site-menu rounded-card border border-bone/10 bg-ink-2 p-2 text-bone shadow-2xl shadow-black/50 min-[75rem]:static min-[75rem]:order-1 min-[75rem]:mx-auto min-[75rem]:flex min-[75rem]:w-auto min-[75rem]:max-w-none min-[75rem]:items-center min-[75rem]:gap-1 min-[75rem]:overflow-visible min-[75rem]:rounded-full min-[75rem]:border-0 min-[75rem]:bg-ink/35 min-[75rem]:p-1 min-[75rem]:shadow-none min-[75rem]:backdrop-blur-sm"
          >
            {NAV.map((item) => {
              const current = isCurrent(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-body-xl transition-colors min-[75rem]:rounded-full min-[75rem]:px-[1.125rem] min-[75rem]:py-2 min-[75rem]:text-small ${
                      current
                        ? "bg-bone font-medium text-ink"
                        : "text-bone/85 hover:bg-bone/10 hover:text-bone"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 border-t border-bone/10 px-4 pt-4 pb-3 min-[75rem]:hidden">
              <a href={tel} className="text-body-lg text-bone">
                {site.business.phoneDisplay}
              </a>
              <p className="mt-1 text-xs leading-snug text-bone/60">
                {site.business.street}, {site.business.city}
              </p>
            </li>
          </ul>
        </nav>

        <a
          href={tel}
          className="order-2 hidden text-small text-bone transition-colors hover:text-flame min-[75rem]:ms-auto min-[75rem]:block xl:me-4"
        >
          {site.business.phoneDisplay}
        </a>
        <PillLink href={tel} tone="flame" className="order-2 max-sm:hidden">
          Call to reserve a table
        </PillLink>
      </div>
    </header>
  );
}
