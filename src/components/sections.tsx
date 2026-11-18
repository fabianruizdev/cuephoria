import Image from "next/image";
import type { ReactNode } from "react";
import { site } from "@/content/site-data";
import { money, specials, tel } from "@/lib/format";
import EventForm from "./EventForm";
import HoursList from "./HoursList";
import { DisplayHeading, PillLink, SectionHead, Star } from "./ui";

const b = site.business;
const img = (file: string) => `/img/gallery/${file}.jpg`;
const galleryItem = (file: string) => site.gallery.find((g) => g.file === file)!;

/* ================================================================== */
/* Shared: rounded photo panel inset 16px from the viewport edges      */
/* ================================================================== */

function PhotoPanel({
  src,
  alt = "",
  position = "center",
  fade = "bottom",
  priority = false,
  overlay,
}: {
  src: string;
  alt?: string;
  position?: string;
  fade?: "bottom" | "top" | "both";
  priority?: boolean;
  overlay?: string;
}) {
  const radius = fade === "bottom" ? "rounded-t-panel" : fade === "top" ? "rounded-b-panel" : "";
  return (
    <div aria-hidden={alt ? undefined : true} className={`absolute inset-x-2 -z-10 overflow-hidden sm:inset-x-4 ${fade === "top" ? "top-0" : "top-2 sm:top-4"} ${fade === "bottom" ? "bottom-0" : "bottom-2 sm:bottom-4"} ${radius}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        fetchPriority={priority ? "high" : undefined}
        loading={priority ? "eager" : "lazy"}
        className="object-cover"
        style={{ objectPosition: position }}
      />
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
      {fade !== "top" && <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent to-ink" />}
      {fade !== "bottom" && <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-t from-transparent to-ink" />}
    </div>
  );
}

/* ================================================================== */
/* HOME: hero                                                          */
/* ================================================================== */

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" width="40" height="40" role="img" aria-label="Google">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function ReviewCard() {
  const r = site.review;
  return (
    <figure className="flex w-full max-w-[23.5rem] overflow-hidden rounded-s-lg rounded-e-[2.5rem] bg-white text-black shadow-2xl shadow-black/40">
      <div className="relative w-[41.7%] shrink-0">
        <Image src={img(r.photo)} alt="" fill sizes="160px" className="object-cover object-[30%_center]" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col px-4 pt-5 pb-5 font-satoshi sm:ps-[1.95rem] sm:pe-5">
        <div className="flex items-start justify-between">
          <div>
            <svg aria-hidden="true" viewBox="0 0 26 20" width="26" height="20" className="block"><path d="M7 0h6L7 20H1zM19 0h6l-6 20h-6z" fill="currentColor" /></svg>
            <p className="mt-1 flex gap-0.5 text-[#ff9f40]" aria-label={`${r.stars} out of 5 stars`}>
              {Array.from({ length: r.stars }, (_, i) => (
                <Star key={i} />
              ))}
            </p>
          </div>
          <GoogleG />
        </div>
        <blockquote className="mt-4 text-[0.875rem] leading-[1.27] font-medium italic">
          <p>“{r.quote}”</p>
        </blockquote>
        <figcaption className="mt-auto pt-4 text-[0.75rem] leading-[1.1]">
          <span className="block font-bold">{r.name}</span>
          <span className="font-medium">{r.role}</span>
        </figcaption>
      </div>
    </figure>
  );
}

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden pt-[7.25rem] sm:pt-[6.9rem]" aria-labelledby="hero-title">
      <PhotoPanel
        src="/img/room-lights.jpg"
        priority
        position="60% 35%"
        overlay="bg-ink/55 bg-gradient-to-r from-ink/60 via-ink/35 to-ink/15"
      />
      <div className="container-x relative pb-12 lg:pb-0">
        <p
          aria-hidden="true"
          className="font-extrabold whitespace-nowrap text-bone/60 uppercase"
          style={{
            fontSize: "min(13.19rem, calc((min(100vw, 90rem) - 2 * var(--gutter)) / 6.07))",
            lineHeight: 0.9335,
            letterSpacing: "-0.0584em",
          }}
        >
          Cue-Phoria
        </p>
        <h1 id="hero-title" className="mt-[clamp(0.75rem,1.1vw,1rem)] text-hero font-normal text-bone">
          Fourteen <br className="hidden xs:block" />
          Diamond tables. <br className="hidden xs:block" />
          <span className="text-bone/55">Zero smoke.</span>
        </h1>

        <div className="mt-8 grid gap-10 lg:mt-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="lg:pb-[3.375rem]">
            <p className="max-w-[32.5rem] text-body-lg leading-[1.555] text-bone/80">
              Winter Park&apos;s upscale pool room — a full bar, a real kitchen and a game on every screen. No cover, open seven days.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <PillLink href={tel} tone="flame">
                Call to reserve a table
              </PillLink>
              <PillLink href="/table-rates" tone="ghost" icon="right">
                See table rates
              </PillLink>
            </div>
          </div>
          <div className="lg:-me-[2.1rem] lg:-mt-[5.1rem]">
            {b.veteranOwned && (
              <p className="mb-3 font-display text-label text-amber lg:me-[2.1rem] lg:text-end">Veteran Owned and Operated</p>
            )}
            <ReviewCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* HOME: statement + stats                                             */
/* ================================================================== */

export function IntroStats() {
  return (
    <section className="pt-[clamp(4.5rem,3rem+4.2vw,8.5rem)] pb-[clamp(4.5rem,3rem+5vw,7.5rem)]" aria-label="About Cue-Phoria">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-[15rem_1fr] md:gap-[3.5rem]">
          <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-card sm:w-48 md:w-auto">
            <Image src="/img/design/chalk-cue.jpg" alt="A player chalking a cue above a racked set of balls" fill sizes="(min-width: 768px) 240px, 192px" className="object-cover" />
          </div>
          <p className="max-w-[61.5rem] text-statement text-bone">
            Upscale without the stuffiness. Competitive without the rowdiness.{" "}
            <span className="text-bone/42">A clean, non-smoking room for pool, darts, touchscreen arcade games and sports on our TVs.</span>
          </p>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {site.stats.map((s) => (
            <li
              key={s.value}
              className={`flex min-h-[10rem] flex-col justify-between gap-6 rounded-card p-6 sm:min-h-[12.5rem] sm:gap-8 sm:p-7 ${s.highlight ? "bg-flame text-ink" : "bg-ink-2 text-bone"}`}
            >
              <p className="flex items-baseline gap-2">
                <span className="text-stat font-light">{s.value}</span>
                {s.suffix && <span className={`text-body-xl ${s.highlight ? "text-ink/70" : "text-bone/60"}`}>{s.suffix}</span>}
              </p>
              <p className={`max-w-[17rem] text-small leading-[1.35] ${s.highlight ? "text-ink/75" : "text-bone/60"}`}>{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Rates list (homepage) — "Pay by the hour. Or drink by it."           */
/* ================================================================== */

function RateRow({ n, title, desc, price, unit, pad = "sm:pt-[3.75rem] sm:pb-[4.25rem]" }: { n: string; title: ReactNode; desc: ReactNode; price?: string; unit?: string; pad?: string }) {
  return (
    <li className={`grid grid-cols-[2.25rem_1fr] gap-x-2 border-t border-ink/15 py-8 sm:grid-cols-[3.25rem_1fr_auto] sm:gap-x-0 ${pad}`}>
      <span className="pt-2 text-xs text-stone tabular-nums" aria-hidden="true">
        {n}
      </span>
      <div className="min-w-0 sm:pe-8">
        <h3 className="text-rate text-ink">{title}</h3>
        <p className="mt-3 max-w-[29rem] text-body leading-[1.31] text-stone">{desc}</p>
      </div>
      {price && (
        <p className="col-start-2 mt-4 flex flex-col sm:col-start-3 sm:mt-0 sm:items-end sm:text-end">
          <span className="text-price font-light text-ink">{price}</span>
          <span className="mt-1 text-2xs text-stone">{unit}</span>
        </p>
      )}
    </li>
  );
}

export function WeekendBanner({ className = "" }: { className?: string }) {
  const w = site.pricing.weekend;
  return (
    <div className={`rounded-[1.25rem] bg-ink px-6 py-6 sm:px-7 sm:py-7 ${className}`}>
      <p className="font-display text-[1.375rem] leading-[1.08] text-amber sm:text-[1.5rem]">
        {w.name} · {w.daysLabel}, {w.windowLabel}
      </p>
      <p className="mt-4 text-body-xl leading-snug text-bone">
        Pay once per person:{" "}
        {site.pricing.plans.map((p, i) => (
          <span key={p.id} className="sm:whitespace-nowrap">
            {i > 0 && <span className="px-2 text-bone/80">/</span>}
            {p.id === "table" ? "Table only" : p.name} {money(p.weekendPrice)}
          </span>
        ))}
      </p>
    </div>
  );
}

export function RatesSection() {
  const pr = site.pricing;
  const plans = pr.plans.filter((p) => p.onHomepage);
  const minAddon = Math.min(...pr.addons.items.map((a) => a.price));
  return (
    <section className="on-light section-y bg-cream text-ink" aria-labelledby="rates-title">
      <div className="container-x">
        <SectionHead
          headingId="rates-title"
          heading={
            <>
              <span className="block">Pay by the hour.</span> <span className="block">Or drink by it.</span>
            </>
          }
          intro="Rent a table on its own, or roll table time and unlimited drinks into one hourly rate per person."
          action={
            <PillLink href="/table-rates" tone="dark" icon="right">
              All table rates
            </PillLink>
          }
        />
        <div className="mt-12 grid gap-10 *:min-w-0 lg:mt-14 lg:grid-cols-[32.5rem_1fr] lg:gap-[4.5rem]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card lg:aspect-auto lg:h-[40.6rem]">
            <Image src={img("racking")} alt="A player racking the balls on a Diamond table" fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover object-[45%_center]" />
          </div>
          <div>
            <ol className="border-b border-ink/15">
              {plans.map((p, i) => (
                <RateRow key={p.id} n={String(i + 1).padStart(2, "0")} title={p.listName} desc={p.summary} price={money(p.price)} unit={p.unitShort} pad={i === plans.length - 1 ? "sm:pt-[3.75rem] sm:pb-9" : undefined} />
              ))}
              <li className="pb-5">
                <WeekendBanner />
              </li>
              <RateRow
                n={String(plans.length + 2).padStart(2, "0")}
                pad="sm:pt-[3.25rem] sm:pb-5"
                title={
                  <>
                    Food add-ons <span aria-hidden="true">•</span> {pr.addons.note}
                  </>
                }
                desc={pr.addons.items.map((a, i) => (
                  <span key={a.name}>
                    {i > 0 && <span className="px-2.5" aria-hidden="true">•</span>}
                    {a.name} <span className="whitespace-nowrap">+{money(a.price)}</span>
                  </span>
                ))}
              />
            </ol>
            <div className="mt-9 flex flex-col gap-2 text-xs leading-snug text-stone sm:flex-row sm:justify-between">
              <p>
                {pr.minimumNote} · {pr.gratuityNote}
              </p>
              <p>Add food to any package from {money(minAddon)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Neon specials — "Rack 'em up."                                     */
/* ================================================================== */

export function NeonSpecials() {
  return (
    <section id="specials" className="relative isolate scroll-mt-6 pt-10 pb-12 sm:pb-16" aria-labelledby="specials-title">
      <PhotoPanel src={img("room-seating")} position="center 60%" fade="top" overlay="bg-ink/85" />
      <div className="container-x">
        <h2 id="specials-title" className="text-neon text-center text-[clamp(3.75rem,0.5rem+14.4vw,13.125rem)] leading-[1.35] whitespace-nowrap">
          Rack ’em up.
        </h2>
        <p className="-mt-[clamp(0.5rem,2vw,2.4rem)] text-center text-body-lg text-bone/70">
          Ladies Night, poker tournaments and afternoons of unlimited play.
        </p>
        <div className="mt-[clamp(2rem,3vw,3.25rem)] rounded-panel border border-flame/55 bg-ink-2/95 px-5 py-6 sm:px-10 sm:py-8">
          <ul>
            {specials().map((s) => (
              <li key={s.name} className="border-b border-dashed border-bone/15 px-0 pt-5 pb-5 sm:px-4 sm:pt-5 sm:pb-5 first:pt-2">
                <h3 className="text-extrude text-title text-sun normal-case">
                  <span className="uppercase max-sm:block">{s.when}</span>
                  <span className="max-sm:hidden" aria-hidden="true"> · </span>
                  {s.name}
                </h3>
                <p className="mt-5 text-body-xl text-bone sm:mt-6">{s.detail}</p>
              </li>
            ))}
          </ul>
          <PillLink href={tel} tone="flame" className="mt-8">
            Call to reserve a table
          </PillLink>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Food preview                                                        */
/* ================================================================== */

export function FoodSection() {
  return (
    <section className="on-light section-y bg-cream text-ink" aria-labelledby="food-title">
      <div className="container-x">
        <SectionHead
          headingId="food-title"
          heading={
            <>
              <span className="block">A real kitchen.</span> <span className="block">Not bar snacks.</span>
            </>
          }
          intro="Air-fried wings, burgers, flatbreads and shareable starters — served right to your table until 30 minutes before close."
          action={
            <PillLink href="/food-menu" tone="dark">
              Full menu
            </PillLink>
          }
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-[1.776fr_1fr] lg:mt-14">
          <div className="relative aspect-[16/9] overflow-hidden rounded-card sm:aspect-auto sm:h-[clamp(16rem,31.6vw,28.45rem)]">
            <Image src="/img/design/wings.jpg" alt="A basket of glazed air-fried wings with celery and blue cheese" fill sizes="(min-width: 640px) 64vw, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card sm:aspect-auto">
            <Image src="/img/design/burger.jpg" alt="A bacon cheeseburger with fries and a draft beer" fill sizes="(min-width: 640px) 36vw, 100vw" className="object-cover" />
          </div>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {site.menu.preview.map((f) => (
            <li key={f.name} className="flex min-h-[8.5rem] flex-col justify-between gap-6 rounded-card bg-paper p-4 sm:min-h-[9.9rem] sm:gap-8 sm:p-[1.625rem]">
              <p className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                <span className="text-card text-ink">{f.name}</span>
                <span className="text-xs whitespace-nowrap text-stone">{f.meta}</span>
              </p>
              <p className="flex items-baseline gap-2">
                {f.from && <span className="text-xs text-stone">from</span>}
                <span className="text-price font-light text-ink">{money(f.price)}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Party card                                                          */
/* ================================================================== */

export function PartySection({ withButton = true }: { withButton?: boolean }) {
  return (
    <section className="pt-[clamp(4.5rem,3rem+5vw,7.5rem)]" aria-labelledby="party-title">
      <div className="container-x">
        <div className="grid gap-8 rounded-panel bg-ink-2 p-2.5 sm:p-4 lg:grid-cols-[46.8rem_1fr] lg:gap-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card lg:aspect-auto lg:h-[37.5rem]">
            <Image src={img("party-balloons")} alt="A party group in front of a balloon display" fill sizes="(min-width: 1024px) 750px, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col px-3 pb-5 sm:px-4 lg:px-0 lg:pt-10 lg:pe-10 lg:pb-6">
            <DisplayHeading id="party-title" color="sun">
              <span className="block">Your party.</span> <span className="block">Our tables.</span>
            </DisplayHeading>
            <p className="mt-6 max-w-[28rem] text-body-lg leading-[1.45] text-bone/70">
              Reserved tables and seating, drink packages and food for the group. Tell us the date and headcount — we&apos;ll handle the rest.
            </p>
            <ul className="mt-9 flex max-w-[27rem] flex-wrap gap-2" aria-label="Events we host">
              {site.events.tags.map((t) => (
                <li key={t} className="rounded-full border border-bone/15 px-4 py-2.5 text-xs leading-none text-bone/80 sm:px-[1.0625rem]">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-12 flex flex-wrap items-end justify-between gap-6 lg:mt-auto">
              <p>
                <span className="block text-xs text-bone/50">Call or text</span>
                <a href={tel} className="mt-1.5 block text-rate font-light text-bone hover:text-flame">
                  {b.phoneDisplay}
                </a>
              </p>
              {withButton && (
                <PillLink href="/book-events-contact-us#plan" tone="flame">
                  Plan an event
                </PillLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EventFormSection({ className = "" }: { className?: string }) {
  return (
    <section id="plan" className={`scroll-mt-6 pt-[clamp(3.5rem,2.5rem+3vw,5.5rem)] ${className}`} aria-labelledby="plan-title">
      <div className="container-x">
        <DisplayHeading id="plan-title" color="sun" className="text-center">
          Let&apos;s plan your event.
        </DisplayHeading>
        <p className="mx-auto mt-8 max-w-[44rem] text-center text-body-lg leading-[1.5] text-bone">
          Tell us your date, headcount and event type. An inquiry does not confirm a reservation.{" "}
          <span className="block">
            Prefer to talk?{" "}
            <a href={tel} className="font-bold underline-offset-4 hover:underline">
              Call {b.phoneDisplay}.
            </a>
          </span>
        </p>
        <EventForm headingId="plan-title" />
      </div>
    </section>
  );
}

/* ================================================================== */
/* Gallery strip                                                       */
/* ================================================================== */

export function GalleryStrip() {
  return (
    <section className="pt-[clamp(5rem,3.5rem+4.6vw,9.2rem)] pb-[clamp(4.5rem,3rem+5vw,7.5rem)]" aria-labelledby="look-title">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <DisplayHeading id="look-title" color="sun">
            Take a look around.
          </DisplayHeading>
          <PillLink href="/gallery" tone="ghost" icon="right">
            Full gallery
          </PillLink>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-4">
          {site.galleryStrip.map((file, i) => {
            const g = galleryItem(file);
            return (
              <li key={file} className={i % 2 === 1 ? "mt-10 lg:mt-16" : ""}>
                <div className="relative aspect-[308/415] overflow-hidden rounded-card">
                  <Image src={img(file)} alt={g.alt} fill sizes="(min-width: 1024px) 308px, 50vw" className="object-cover" />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ================================================================== */
/* FAQ                                                                 */
/* ================================================================== */

export function FaqList({ faqs = site.faqs, openFirst = true }: { faqs?: { q: string; a: string }[]; openFirst?: boolean }) {
  return (
    <div className="faq border-b border-ink/15">
      {faqs.map((f, i) => (
        <details key={f.q} open={openFirst && i === 0} className="group border-t border-ink/15">
          <summary className="flex items-center justify-between gap-6 py-6 group-open:pb-2 sm:py-7 sm:group-open:pb-2">
            <span className="text-card font-bold text-ink">{f.q}</span>
            <span aria-hidden="true" className="faq-icon grid size-9 shrink-0 place-items-center rounded-full border border-ink/20 text-ink">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                <path d="M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path className="faq-plus-v" d="M8 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="max-w-[35rem] pb-9 text-body text-stone">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="on-light section-y scroll-mt-6 bg-cream text-ink" aria-labelledby="faq-title">
      <div className="container-x grid gap-10 lg:grid-cols-[27.5rem_1fr] lg:gap-20">
        <div>
          <DisplayHeading id="faq-title">
            <span className="block">Good to</span> <span className="block">know.</span>
          </DisplayHeading>
          <div className="relative mt-8 hidden aspect-[440/550] overflow-hidden rounded-card lg:block">
            <Image src={img("bartender")} alt="A smiling bartender behind the Cue-Phoria bar" fill sizes="440px" className="object-cover object-[center_30%]" />
          </div>
        </div>
        <div className="lg:pt-[2.9rem]">
          <FaqList />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Visit — "Your table's waiting."                                    */
/* ================================================================== */

export function VisitSection() {
  return (
    <section className="pt-[clamp(4rem,3rem+2.8vw,6rem)] pb-[clamp(4rem,3rem+2.8vw,6.25rem)]" aria-labelledby="visit-title">
      <div className="container-x grid gap-4 md:grid-cols-2 lg:grid-cols-[1.524fr_1fr_1.026fr]">
        <div className="flex flex-col rounded-card bg-ink-2 p-7 sm:p-11 md:col-span-2 lg:col-span-1">
          <DisplayHeading id="visit-title" color="sun">
            <span className="block">Your table&apos;s</span> <span className="block">waiting.</span>
          </DisplayHeading>
          <p className="mt-6 max-w-[28.5rem] text-body-lg leading-[1.555] text-bone/70">
            On SR 436 in Winter Park — a short drive from Maitland, Casselberry, Oviedo and UCF. Walk-ins welcome; call ahead for groups.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 lg:mt-auto lg:pt-10">
            <PillLink href={tel} tone="flame">
              Call {b.phoneDisplay}
            </PillLink>
            <PillLink href={b.directionsUrl} tone="ghost" icon="right" target="_blank" rel="noopener">
              Get directions<span className="visually-hidden"> (opens Google Maps in a new tab)</span>
            </PillLink>
          </div>
        </div>
        <div className="relative min-h-[18rem] overflow-hidden rounded-card">
          <Image src={img("room-day")} alt="Rows of Diamond tables with high-top seating by the windows" fill sizes="(min-width: 1024px) 352px, (min-width: 768px) 50vw, 100vw" className="object-cover object-[40%_center]" />
        </div>
        <div className="on-light rounded-card bg-cream p-7 text-ink sm:p-9">
          <DisplayHeading as="h3" size="title">
            Hours
          </DisplayHeading>
          <div className="mt-5">
            <HoursList />
          </div>
          <p className="mt-1 text-small text-stone">{site.kitchenNote}</p>
          <div className="mt-5 border-t border-ink/12 pt-5">
            <p className="text-xs text-stone">Find us</p>
            <address className="mt-2 text-body leading-[1.45] font-medium not-italic">
              {b.street}
              <br />
              {b.city}, {b.state} {b.zip}
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Inner pages: hero panel                                             */
/* ================================================================== */

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  position = "center",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  image: string;
  position?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pt-[9.5rem] pb-[clamp(3.5rem,2rem+4vw,6rem)] sm:pt-[11rem] lg:pt-[13.5rem]" aria-labelledby="page-title">
      <PhotoPanel src={image} priority position={position} overlay="bg-gradient-to-r from-ink/80 via-ink/55 to-ink/25" />
      <div className="container-x">
        <p className="font-display text-label text-amber">{eyebrow}</p>
        <h1 id="page-title" className="mt-4 max-w-[14ch] text-[clamp(2.75rem,1rem+5.2vw,5.5rem)] leading-[0.98] tracking-[-0.045em] text-bone">
          {title}
        </h1>
        <p className="mt-6 max-w-[36rem] text-body-xl text-bone/80">{lead}</p>
        {children && <div className="mt-10 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
