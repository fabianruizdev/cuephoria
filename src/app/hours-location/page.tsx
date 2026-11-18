import type { Metadata } from "next";
import Image from "next/image";
import HoursList from "@/components/HoursList";
import { FaqSection, PageHero } from "@/components/sections";
import { DisplayHeading, PillLink } from "@/components/ui";
import { site } from "@/content/site-data";
import { tel } from "@/lib/format";

const b = site.business;

export const metadata: Metadata = {
  title: { absolute: `Hours & Location | ${b.name}, ${b.city} ${b.state}` },
  description: `${b.shortName} is open Monday to Thursday 5 PM to 12 AM, Friday 5 PM to 2 AM, and Saturday and Sunday 12 PM to 2 AM. ${b.street}, ${b.city}, ${b.state} ${b.zip}. Call ${b.phoneDisplay}.`,
  alternates: { canonical: "/hours-location" },
  openGraph: { url: "/hours-location", title: "Hours & Location" },
};

export default function HoursLocationPage() {
  return (
    <>
      <PageHero
        eyebrow="Hours & location"
        title={<>Your table&apos;s waiting.</>}
        lead={`Open 7 days a week on SR 436 in ${b.city}. Walk-ins are welcome, and there is never a cover charge.`}
        image="/img/gallery/room-day.jpg"
        position="center 45%"
      >
        <PillLink href={b.directionsUrl} tone="flame" target="_blank" rel="noopener">
          Get directions<span className="visually-hidden"> (opens Google Maps in a new tab)</span>
        </PillLink>
        <PillLink href={tel} tone="ghost" icon="right">
          Call {b.phoneDisplay}
        </PillLink>
      </PageHero>

      <section className="pb-[clamp(4.5rem,3rem+5vw,7.5rem)]" aria-label="Hours and address">
        <div className="container-x grid gap-4 lg:grid-cols-[1fr_1fr_1.15fr]">
          <div className="on-light rounded-card bg-cream p-7 text-ink sm:p-9">
            <DisplayHeading as="h2" size="title">
              Hours
            </DisplayHeading>
            <div className="mt-6">
              <HoursList showStatus />
            </div>
            <p className="mt-3 text-small text-stone">{site.kitchenNote}</p>
          </div>

          <div className="flex flex-col rounded-card bg-ink-2 p-7 sm:p-9">
            <DisplayHeading as="h2" size="title" color="sun">
              Find us
            </DisplayHeading>
            <address className="mt-6 text-body-xl leading-snug font-medium not-italic">
              {b.street}
              <br />
              {b.city}, {b.state} {b.zip}
            </address>
            <h3 className="mt-8text-xs tracking-[0.14em] text-bone/60 uppercase">Drive times</h3>
            <ul className="mt-3 border-t border-bone/12">
              {b.nearby.map((n) => (
                <li key={n.place} className="flex justify-between gap-4 border-b border-bone/12 py-3 text-body">
                  <span>{n.place}</span>
                  <span className="text-bone/65">{n.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-small text-bone/60">We also see plenty of guests from {b.areas}.</p>
          </div>

          <div className="relative min-h-[22rem] overflow-hidden rounded-card bg-ink-2">
            <iframe
              title={`Map showing ${b.name}`}
              src={b.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0 grayscale-[0.4] invert-[0.9] hue-rotate-180"
            />
          </div>
        </div>

        <div className="container-x mt-4 grid gap-4 md:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-card">
            <Image src="/img/gallery/room-lights.jpg" alt="Diamond pool tables under the ceiling light frames" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-card">
            <Image src="/img/gallery/room-seating.jpg" alt="Cue racks and high-top seating beside the tables" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <FaqSection />
    </>
  );
}
