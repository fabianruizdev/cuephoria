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
/* Pill buttons with the round icon chip, as in the Figma file.        */
/* Colours and the hover fill live in globals.css (.pill[data-tone]):  */
/* on hover the chip's colour floods the pill from the chip outwards.  */
/* ------------------------------------------------------------------ */

type Tone = "flame" | "ghost" | "dark" | "ghost-dark";
type Icon = "up-right" | "right" | "phone";

export function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className} fill="none">
      <path d="M5.6 2.2 3.9 2a1.3 1.3 0 0 0-1.4 1.2c-.2 5.6 4.7 10.5 10.3 10.3a1.3 1.3 0 0 0 1.2-1.4l-.2-1.7a1 1 0 0 0-.7-.8l-2-.6a1 1 0 0 0-1 .3l-.8.8a8 8 0 0 1-3.4-3.4l.8-.8a1 1 0 0 0 .3-1l-.6-2a1 1 0 0 0-.8-.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

const pillBase =
  "pill group relative isolate inline-flex min-h-12 items-center gap-4 overflow-hidden rounded-full py-1.5 ps-[1.375rem] pe-1.5 text-small font-medium leading-none whitespace-nowrap";

interface PillProps {
  tone?: Tone;
  icon?: Icon;
  children: ReactNode;
  className?: string;
  /** Extra classes for the text label (the header collapses it to show only the chip) */
  labelClassName?: string;
}

function PillInner({ icon, children, labelClassName = "" }: { icon: Icon; children: ReactNode; labelClassName?: string }) {
  return (
    <>
      <span aria-hidden="true" className="pill-fill" />
      <span className={`relative ${labelClassName}`}>{children}</span>
      <span className="pill-chip relative grid size-9 shrink-0 place-items-center rounded-full">
        {icon === "up-right" ? <ArrowUpRight /> : icon === "phone" ? <PhoneIcon /> : <ArrowRight />}
      </span>
    </>
  );
}

/** Internal links use next/link; tel:, mailto: and external links use a plain anchor. */
export function PillLink({
  tone = "flame",
  icon = "up-right",
  children,
  className = "",
  labelClassName,
  href,
  ...rest
}: PillProps & Omit<ComponentProps<"a">, "className" | "children"> & { href: string }) {
  const cls = `${pillBase} ${className}`;
  const inner = <PillInner icon={icon} labelClassName={labelClassName}>{children}</PillInner>;
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} className={cls} data-tone={tone} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} data-tone={tone} {...rest}>
      {inner}
    </a>
  );
}

export function PillButton({
  tone = "flame",
  icon = "up-right",
  children,
  className = "",
  labelClassName,
  ...rest
}: PillProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button data-tone={tone} className={`${pillBase} cursor-pointer disabled:cursor-progress disabled:opacity-70 ${className}`} {...rest}>
      <PillInner icon={icon} labelClassName={labelClassName}>{children}</PillInner>
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
    <Tag id={id} data-split={size === "heading" ? "" : undefined} className={`text-extrude ${sizeCls} ${colorCls} ${className}`}>
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
        <div data-reveal className="flex flex-col items-start gap-8 md:items-end md:text-end">
          {intro && (
            <p className={`text-body-lg leading-[1.45] ${introTone === "stone" ? "text-stone" : "text-bone/70"}`}>{intro}</p>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
