import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { PageHero, PartySection } from "@/components/sections";
import { PillLink } from "@/components/ui";
import { site } from "@/content/site-data";

const b = site.business;

export const metadata: Metadata = {
  title: { absolute: `Gallery | ${b.name}, ${b.city} ${b.state}` },
  description: `Photos from inside ${b.name} in ${b.city}, ${b.state}: ${b.tables} Diamond pool tables, the bar, parties and league nights.`,
  alternates: { canonical: "/gallery" },
  openGraph: { url: "/gallery", title: "Gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={<>Take a look around.</>}
        lead="The room, the bar and a few good nights at Cue-Phoria. Select any photo to see it larger."
        image="/img/gallery/group-at-bar.jpg"
        position="center 35%"
      >
        <PillLink href="/book-events-contact-us#plan" tone="flame">
          Plan an event
        </PillLink>
      </PageHero>

      <section className="pt-4 pb-[clamp(1rem,1rem+2vw,2.5rem)]" aria-label="Photos">
        <div className="container-x">
          <GalleryGrid images={site.gallery} />
        </div>
      </section>

      <div className="pb-[clamp(4.5rem,3rem+5vw,7.5rem)]">
        <PartySection />
      </div>
    </>
  );
}
