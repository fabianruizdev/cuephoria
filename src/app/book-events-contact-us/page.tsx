import type { Metadata } from "next";
import Image from "next/image";
import { EventFormSection, FaqList, PageHero, VisitSection } from "@/components/sections";
import { ArrowUpRight, CheckIcon, DisplayHeading, PillLink, SectionHead } from "@/components/ui";
import { site } from "@/content/site-data";
import { tel } from "@/lib/format";

const b = site.business;
const ev = site.events;

export const metadata: Metadata = {
  title: { absolute: `Book Events | Private Parties at ${b.shortName} Billiards, ${b.city} ${b.state}` },
  description: `Book a private event at ${b.shortName} in ${b.city}, ${b.state}. Birthday parties, corporate outings, bachelor and bachelorette parties and group bookings. Call ${b.phoneDisplay}.`,
  alternates: { canonical: "/book-events-contact-us" },
  openGraph: { url: "/book-events-contact-us", title: "Book Events & Private Parties" },
};

/* One photo per event type, in the order of site.events.types */
const typePhotos = [
  { src: "/img/gallery/group-at-bar.jpg", position: "center 40%" },
  { src: "/img/gallery/party-balloons.jpg", position: "center 35%" },
  { src: "/img/gallery/friends-selfie.jpg", position: "center 30%" },
  { src: "/img/gallery/players-at-table.jpg", position: "center 45%" },
  { src: "/img/gallery/halloween-crowd.jpg", position: "center 35%" },
  { src: "/img/gallery/group-by-table.jpg", position: "center 42%" },
];

const eventFaqs = site.faqs.filter((f) => /reservation|group|kids|smoking/i.test(f.q));

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events & private parties"
        title={<>Your party. Our tables.</>}
        lead={`${b.tables} Diamond tables, a full kitchen and a full liquor bar in a non-smoking room. Tell us the date and headcount — we'll handle the rest.`}
        image="/img/gallery/party-balloons.jpg"
        position="center 40%"
      >
        <PillLink href="#plan" tone="flame">
          Plan an event
        </PillLink>
        <PillLink href={tel} tone="ghost" icon="right">
          Call {b.phoneDisplay}
        </PillLink>
      </PageHero>

      {/* Event types */}
      <section className="on-light section-y bg-cream text-ink" aria-labelledby="types-title">
        <div className="container-x">
          <SectionHead
            headingId="types-title"
            heading={
              <>
                <span className="block">Built for</span> <span className="block">groups.</span>
              </>
            }
            intro={`Since ${b.since}, we've hosted everything from small get-togethers to large corporate functions.`}
          />
          {/* Bento of photo cards: the first is tall, the last spans the full width */}
          <ul className="mt-12 grid auto-rows-[17rem] gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:auto-rows-[16.5rem]">
            {ev.types.map((t, i) => {
              const photo = typePhotos[i % typePhotos.length];
              const span = i === 0 ? "sm:row-span-2" : i === ev.types.length - 1 ? "sm:col-span-2 lg:col-span-3" : "";
              return (
                <li key={t.name} data-reveal className={span}>
                  <a href="#plan" className="type-card group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-card p-6 text-bone sm:p-7">
                    <Image src={photo.src} alt="" fill sizes={i === ev.types.length - 1 ? "100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"} className="type-card-img -z-20 object-cover" style={{ objectPosition: photo.position }} />
                    <span aria-hidden="true" className="type-card-shade absolute inset-0 -z-10" />
                    <span className="absolute top-6 left-6 rounded-full border border-bone/30 px-2.5 py-1 text-2xs tabular-nums backdrop-blur-sm sm:top-7 sm:left-7" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="type-card-chip absolute top-5 right-5 grid size-10 place-items-center rounded-full bg-bone text-ink sm:top-6 sm:right-6">
                      <ArrowUpRight />
                    </span>
                    <h3 className="max-w-[18ch] text-rate">{t.name}</h3>
                    <p className="mt-2 max-w-[34rem] text-small leading-snug text-bone/80">{t.detail}</p>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* What we offer */}
      <section className="pt-[clamp(4.5rem,3rem+5vw,7.5rem)]" aria-labelledby="offer-title">
        <div className="container-x">
          <div className="grid gap-8 rounded-panel bg-ink-2 p-2.5 sm:p-4 lg:grid-cols-[1fr_1fr] lg:gap-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card lg:aspect-auto lg:min-h-[34rem]">
              <Image src="/img/gallery/group-logo-wall.jpg" alt="A large group gathered at the Cue-Phoria logo wall" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[center_35%]" />
            </div>
            <div className="px-3 pb-6 sm:px-4 lg:px-0 lg:py-10 lg:pe-10">
              <DisplayHeading id="offer-title" color="sun">
                What we offer.
              </DisplayHeading>
              <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {ev.offers.map((o) => (
                  <li key={o} className="flex gap-3 text-body-lg leading-snug text-bone">
                    <CheckIcon className="mt-1 shrink-0 text-flame" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-[30rem] text-body text-bone/65">
                We welcome guests from {b.areas} and the rest of Central Florida.
              </p>
            </div>
          </div>
        </div>
      </section>

      <EventFormSection className="pb-[clamp(4.5rem,3rem+5vw,7.5rem)]" />

      <section className="on-light section-y bg-cream text-ink" aria-labelledby="events-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[27.5rem_1fr] lg:gap-20">
          <DisplayHeading id="events-faq-title">
            <span className="block">Good to</span> <span className="block">know.</span>
          </DisplayHeading>
          <FaqList faqs={eventFaqs} />
        </div>
      </section>

      <VisitSection />
    </>
  );
}
