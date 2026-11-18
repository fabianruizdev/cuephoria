import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Icons (decorative: the visible label is the accessible name)        */
/* ------------------------------------------------------------------ */

export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className} fill="none">
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className} fill="none">
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className} fill="none">
      <path d="m3 8.5 3.2 3L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true" className={className}>
      <path fill="currentColor" d="m10 1.5 2.6 5.6 6.1.7-4.5 4.2 1.2 6L10 15l-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Pill buttons with the round icon chip, as in the Figma file         */
/* ------------------------------------------------------------------ */

type Tone = "flame" | "ghost" | "dark" | "ghost-dark";

const toneClass: Record<Tone, { pill: string; chip: string }> = {
  // Orange pill, dark chip with an orange arrow
  flame: {
    pill: "bg-flame text-ink hover:bg-[#ffb062]",
    chip: "bg-ink text-flame",
  },
  // Outline pill on dark, light chip with a dark arrow
  ghost: {
    pill: "border border-bone/25 text-bone hover:border-bone/60 hover:bg-bone/5",
    chip: "bg-bone text-ink",
  },
  // Dark pill on cream, orange chip with a dark arrow
  dark: {
    pill: "bg-ink text-bone hover:bg-[#262b30]",
    chip: "bg-flame text-ink",
  },
  // Outline pill on cream
  "ghost-dark": {
    pill: "border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/5",
    chip: "bg-ink text-bone",
  },
};

const pillBase =
  "group inline-flex min-h-12 items-center gap-4 rounded-full py-1.5 ps-[1.375rem] pe-1.5 text-small font-medium leading-none whitespace-nowrap transition-colors duration-200";
const chipBase =
  "grid size-9 shrink-0 place-items-center rounded-full transition-transform duration-200 motion-safe:group-hover:translate-x-0.5";

interface PillProps {
  tone?: Tone;
  icon?: "up-right" | "right";
  children: ReactNode;
  className?: string;
}

function Chip({ tone, icon }: { tone: Tone; icon: "up-right" | "right" }) {
  return (
    <span className={`${chipBase} ${toneClass[tone].chip}`}>
      {icon === "up-right" ? <ArrowUpRight /> : <ArrowRight />}
    </span>
  );
}

/** Internal links use next/link; tel:, mailto: and external links use a plain anchor. */
export function PillLink({
  tone = "flame",
  icon = "up-right",
  children,
  className = "",
  href,
  ...rest
}: PillProps & Omit<ComponentProps<"a">, "className" | "children"> & { href: string }) {
  const cls = `${pillBase} ${toneClass[tone].pill} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <Chip tone={tone} icon={icon} />
    </>
  );
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...rest}>
      {inner}
    </a>
  );
}

export function PillButton({
  tone = "flame",
  icon = "up-right",
  children,
  className = "",
  ...rest
}: PillProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={`${pillBase} ${toneClass[tone].pill} cursor-pointer disabled:cursor-progress disabled:opacity-70 ${className}`} {...rest}>
      <span>{children}</span>
      <Chip tone={tone} icon={icon} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Lilita One display heading with the extruded shadow                 */
/* ------------------------------------------------------------------ */

export function DisplayHeading({
  as: Tag = "h2",
  color = "ink",
  size = "heading",
  className = "",
  id,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  color?: "ink" | "sun";
  size?: "heading" | "title";
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  const sizeCls = size === "heading" ? "text-heading" : "text-title";
  const colorCls = color === "ink" ? "text-ink" : "text-sun";
  return (
    <Tag id={id} className={`text-extrude ${sizeCls} ${colorCls} ${className}`}>
      {children}
    </Tag>
  );
}

/* Heading row used by most sections: heading left, intro + button in a right column. */
export function SectionHead({
  heading,
  headingId,
  color = "ink",
  intro,
  introTone = "stone",
  action,
}: {
  heading: ReactNode;
  headingId?: string;
  color?: "ink" | "sun";
  intro?: ReactNode;
  introTone?: "stone" | "bone";
  action?: ReactNode;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,25.75rem)] md:items-end md:gap-10">
      <DisplayHeading id={headingId} color={color} className="max-w-[16ch]">
        {heading}
      </DisplayHeading>
      {(intro || action) && (
        <div className="flex flex-col items-start gap-8">
          {intro && (
            <p className={`text-body-lg leading-[1.45] ${introTone === "stone" ? "text-stone" : "text-bone/70"}`}>{intro}</p>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
