import type { Metadata } from "next";
import Image from "next/image";
import GroupEstimate from "@/components/GroupEstimate";
import { FaqList, PageHero, VisitSection } from "@/components/sections";
import { CheckIcon, DisplayHeading, PillLink, SectionHead } from "@/components/ui";
import { site } from "@/content/site-data";
import { money, tel } from "@/lib/format";

const b = site.business;
const pr = site.pricing;

export const metadata: Metadata = {
  title: { absolute: `Table Rates & Drink Packages | ${b.shortName} Billiards, ${b.city} ${b.state}` },
  description: `${b.shortName} table rates: $20 per table per hour, or Standard and Premium packages with drinks from $20 per person per hour. Weekend Unlimited Saturday and Sunday, noon to 6 PM. Call ${b.phoneDisplay}.`,
  alternates: { canonical: "/table-rates" },
  openGraph: { url: "/table-rates", title: "Table Rates & Drink Packages" },
};

const rateFaqs = [
  { q: "Is there a minimum?", a: `Yes. There is a one-hour minimum. ${pr.proRateNote}` },
  { q: "Do drink packages include gratuity?", a: `${pr.gratuityPercent}% gratuity is added to Standard and Premium packages. Table Only has no added gratuity.` },
  { q: "Can one person in the group buy a drink package?", a: pr.groupNote + " Everyone at the table plays on the same package." },
  { q: "How does Weekend Unlimited work?", a: `Saturday and Sunday from noon to 6 PM, pay once per person and play as long as you like inside that window: ${pr.plans.map((p) => `${p.name} ${money(p.weekendPrice)}`).join(", ")}.` },
];

export default function TableRatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Table rates"
        title={<>Pay by the hour. Or drink by it.</>}
        lead="Rent a table on its own, or roll table time and unlimited drinks into one hourly rate per person. No cover charge, ever."
        image="/img/gallery/racking.jpg"
        position="center 40%"
      >
        <PillLink href={tel} tone="flame">
          Call to reserve a table
        </PillLink>
        <PillLink href="#estimate" tone="ghost" icon="right">
          Estimate your night
        </PillLink>
      </PageHero>

      {/* Packages */}
      <section id="packages" className="on-light section-y scroll-mt-6 bg-cream text-ink" aria-labelledby="packages-title">
        <div className="container-x">
          <SectionHead
            headingId="packages-title"
            heading={
              <>
                <span className="block">Three ways</span> <span className="block">to play.</span>
              </>
            }
            intro={`${pr.minimumNote}. ${pr.gratuityNote}. ${pr.proRateNote}`}
          />
          <ul className="mt-12 grid gap-4 lg:mt-14 lg:grid-cols-3">
            {pr.plans.map((p) => {
              const featured = p.popular;
              return (
                <li
                  key={p.id}
                  className={`relative flex flex-col rounded-card p-7 sm:p-8 ${featured ? "bg-ink text-bone" : "bg-paper text-ink"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-rate">{p.listName}</h3>
                    {(p.popular || p.tag) && (
                      <span className={`rounded-full px-3 py-1.5 text-2xs font-medium tracking-[0.08em] uppercase ${featured ? "bg-flame text-ink" : "bg-ink text-bone"}`}>
                        {p.popular ? "Most popular" : p.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-8 flex items-baseline gap-2">
                    <span className="text-stat font-light">{money(p.price)}</span>
                    <span className={`text-small ${featured ? "text-bone/60" : "text-stone"}`}>{p.unitShort}</span>
                  </p>
                  {p.soloPrice && (
                    <p className={`mt-2 text-small ${featured ? "text-bone/70" : "text-stone"}`}>Solo player: {money(p.soloPrice)} per hour</p>
                  )}
                  <div className={`mt-8 border-t pt-6 ${featured ? "border-bone/12" : "border-ink/12"}`}>
                    <h4 className={`text-xs tracking-[0.14em] uppercase ${featured ? "text-bone/60" : "text-stone"}`}>Includes</h4>
                    <ul className="mt-4 space-y-3">
                      {p.includes.map((i) => (
                        <li key={i} className="flex gap-3 text-body leading-snug">
                          <CheckIcon className={`mt-1 shrink-0 ${featured ? "text-flame" : "text-ember"}`} />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                    <h4 className={`mt-6 text-xs tracking-[0.14em] uppercase ${featured ? "text-bone/60" : "text-stone"}`}>Not included</h4>
                    <ul className={`mt-3 space-y-2 text-small ${featured ? "text-bone/65" : "text-stone"}`}>
                      {p.excludes.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>
                  <p className={`mt-auto pt-8 text-xs ${featured ? "text-bone/55" : "text-stone"}`}>
                    {p.hasGratuity ? `${pr.gratuityPercent}% gratuity added.` : "No added gratuity."} Weekend Unlimited: {money(p.weekendPrice)} per person.
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Weekend Unlimited */}
      <section id="weekend" className="section-y scroll-mt-6" aria-labelledby="weekend-title">
        <div className="container-x">
          <div className="grid gap-10 rounded-panel border border-flame/45 bg-ink-2 p-7 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-14 lg:p-14">
            <div>
              <p className="font-display text-label text-amber">
                {pr.weekend.daysLabel}, {pr.weekend.windowLabel}
              </p>
              <DisplayHeading id="weekend-title" color="sun" className="mt-4">
                Weekend Unlimited.
              </DisplayHeading>
              <p className="mt-6 max-w-[28rem] text-body-lg text-bone/75">
                {pr.weekend.headline} {pr.weekend.detail}
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3">
              {pr.plans.map((p) => (
                <li key={p.id} className="rounded-card bg-ink p-6">
                  <p className="text-small text-bone/70">{p.listName}</p>
                  <p className="mt-6 text-stat font-light text-bone">{money(p.weekendPrice)}</p>
                  <p className="mt-2 text-xs text-bone/55">per person, one time</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Estimator */}
      <section id="estimate" className="on-light section-y scroll-mt-6 bg-cream text-ink" aria-labelledby="estimate-title">
        <div className="container-x">
          <SectionHead
            headingId="estimate-title"
            heading={
              <>
                <span className="block">What will</span> <span className="block">it cost?</span>
              </>
            }
            intro="Set your group size and how long you plan to play. We’ll show the total for each option."
          />
          <div className="mt-12 lg:mt-14">
            <GroupEstimate />
          </div>
        </div>
      </section>

      {/* Add-ons + rate board */}
      <section className="section-y" aria-labelledby="addons-title">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-20">
          <div>
            <DisplayHeading id="addons-title" color="sun">
              <span className="block">Make it a</span> <span className="block">VIP party.</span>
            </DisplayHeading>
            <p className="mt-6 max-w-[34rem] text-body-lg text-bone/70">
              Add food to a Standard or Premium package for one flat price per item.
            </p>
            <ul className="mt-10 border-t border-bone/12">
              {pr.addons.items.map((a) => (
                <li key={a.name} className="flex items-baseline justify-between gap-6 border-b border-bone/12 py-5">
                  <span className="text-rate text-bone">{a.name}</span>
                  <span className="text-price font-light text-bone">+{money(a.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <PillLink href="/food-menu" tone="flame">
                See the food menu
              </PillLink>
            </div>
          </div>
          <figure>
            <div className="relative aspect-[9/16] overflow-hidden rounded-card">
              <Image src="/img/rate-board.jpg" alt="The Cue-Phoria rates board at the bar, showing the same rates listed on this page" fill sizes="(min-width: 1024px) 352px, 100vw" className="object-cover object-top" />
            </div>
            <figcaption className="mt-3 text-xs text-bone/55">The rate board at the bar.</figcaption>
          </figure>
        </div>
      </section>

      <section className="on-light section-y bg-cream text-ink" aria-labelledby="rates-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[27.5rem_1fr] lg:gap-20">
          <DisplayHeading id="rates-faq-title">
            <span className="block">Rate</span> <span className="block">questions.</span>
          </DisplayHeading>
          <FaqList faqs={rateFaqs} />
        </div>
      </section>

      <VisitSection />
    </>
  );
}
