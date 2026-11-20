"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/content/site-data";
import { tel } from "@/lib/format";
import TopLink, { useScrollTopAfterNav } from "./TopLink";
import { PillLink } from "./ui";

/* 20px line icons for the compact (scrolled) header */
const ico = (d: ReactNode) => (
  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const ICONS = {
  home: ico(<path d="M3 9.2 10 3.5l7 5.7V16a1 1 0 0 1-1 1h-3.5v-4.5h-5V17H4a1 1 0 0 1-1-1Z" />),
  rates: ico(<><path d="M10.6 2.8H16a1.2 1.2 0 0 1 1.2 1.2v5.4a1 1 0 0 1-.3.7l-7 7a1.2 1.2 0 0 1-1.7 0l-5-5a1.2 1.2 0 0 1 0-1.7l7-7a1 1 0 0 1 .4-.6Z" /><circle cx="13.6" cy="6.4" r="1.2" /></>),
  menu: ico(<><path d="M5.5 9.5v8M3.5 2.5V7a2 2 0 0 0 2 2.5 2 2 0 0 0 2-2.5V2.5M5.5 2.5v4" /><path d="M14.5 17.5v-15c-2 1-3 3.5-3 6.5v2h3" /></>),
  events: ico(<><path d="m3 17 4-11 7 7Z" /><path d="M11 3.5c.5 1 .3 2-.5 2.8M14 6.5c1-.6 2.2-.6 3 0M13.5 2.5v.5M17.5 9.5h.5M16 3.5l-.8.8" /></>),
  gallery: ico(<><rect x="2.5" y="3.5" width="15" height="13" rx="2" /><circle cx="7" cy="8" r="1.5" /><path d="m17.5 13.5-4-4-8 7" /></>),
  visit: ico(<><path d="M10 17.5s5.5-4.8 5.5-9.3a5.5 5.5 0 0 0-11 0c0 4.5 5.5 9.3 5.5 9.3Z" /><circle cx="10" cy="8.2" r="2" /></>),
};

export const NAV = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/table-rates", label: "Table rates", icon: "rates" },
  { href: "/food-menu", label: "Menu", icon: "menu" },
  { href: "/book-events-contact-us", label: "Events", icon: "events" },
  { href: "/gallery", label: "Gallery", icon: "gallery" },
  { href: "/hours-location", label: "Visit", icon: "visit" },
] as const;

/* The header shrinks to icons only past COMPACT_AT px of scroll and grows back above
   EXPAND_AT, so it does not flicker when the page rests near one threshold. */
const COMPACT_AT = 96;
const EXPAND_AT = 32;

/* The inline navigation appears at this width; below it the same list is a popover. */
const WIDE = "(min-width: 75rem)";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="text-[1.625rem] font-extrabold whitespace-nowrap tracking-[-0.01em] text-bone uppercase">Cue-Phoria</span>
      <span className="mt-1.5 text-[0.6875rem] whitespace-nowrap tracking-[0.3em] text-bone/80 uppercase">Billiards &amp; Sports Bar</span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLUListElement>(null);
  const [compact, setCompact] = useState(false);
  useScrollTopAfterNav();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCompact((was) => (was ? y > EXPAND_AT : y > COMPACT_AT));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header data-compact={compact ? "" : undefined} className="site-header fixed inset-x-0 top-0 z-30">
      <div className="site-header-bar mx-auto flex items-center gap-4 px-5 sm:px-8 xl:px-14">
        <TopLink href="/" className="site-logo me-auto flex shrink-0 items-center rounded-sm" aria-label={`${site.business.shortName} home`}>
          {/* Scrolled: the wordmark rolls away and an 8-ball rolls in */}
          <span aria-hidden="true" className="hdr-x show-compact grid">
            <span>
              <Image src="/img/eight-ball.webp" alt="" width={88} height={88} sizes="44px" className="logo-ball block size-11 max-w-none" />
            </span>
          </span>
          <span className="hdr-x hide-compact grid">
            <span>
              <Logo />
            </span>
          </span>
        </TopLink>

        <nav aria-label="Primary" className="contents">
          <button
            type="button"
            popoverTarget="site-menu"
            aria-controls="site-menu"
            className="hdr-menu-btn order-3 inline-flex min-h-12 cursor-pointer items-center rounded-full border border-bone/25 px-4 text-small text-bone transition-colors hover:border-bone/60 min-[75rem]:hidden"
          >
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" className="shrink-0">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="hdr-x hide-compact grid">
              <span className="ps-2.5">Menu</span>
            </span>
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
                  <TopLink
                    href={item.href}
                    data-label={item.label}
                    aria-current={current ? "page" : undefined}
                    className={`nav-link relative flex items-center rounded-2xl px-4 py-3.5 text-body-xl transition-colors min-[75rem]:rounded-full min-[75rem]:px-[1.125rem] min-[75rem]:py-2 min-[75rem]:text-small ${
                      current ? "bg-bone font-medium text-ink" : "text-bone/85 hover:bg-bone/10 hover:text-bone"
                    }`}
                  >
                    <span className="nav-ico hdr-x grid">
                      <span>{ICONS[item.icon]}</span>
                    </span>
                    <span className="nav-label hdr-x grid">
                      <span className="whitespace-nowrap">{item.label}</span>
                    </span>
                  </TopLink>
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

        {/* Scrolled: the phone number folds away */}
        <a
          href={tel}
          className="header-phone hdr-x hide-compact order-2 hidden text-small text-bone transition-colors hover:text-flame min-[75rem]:ms-auto min-[75rem]:grid xl:me-4"
        >
          <span className="whitespace-nowrap">{site.business.phoneDisplay}</span>
        </a>
        {/* Scrolled: only the round phone chip is left */}
        <PillLink href={tel} tone="flame" icon="phone" className="header-cta order-2 max-sm:hidden" labelClassName="hdr-x hide-compact grid">
          <span>Call to reserve a table</span>
        </PillLink>
      </div>
    </header>
  );
}
