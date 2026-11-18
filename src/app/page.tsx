import type { Metadata } from "next";
import { site } from "@/content/site-data";
import {
  EventFormSection,
  FaqSection,
  FoodSection,
  GalleryStrip,
  HomeHero,
  IntroStats,
  NeonSpecials,
  PartySection,
  RatesSection,
  VisitSection,
} from "@/components/sections";

const b = site.business;

export const metadata: Metadata = {
  title: { absolute: `${b.name} | Pool Hall in ${b.city}, ${b.state}` },
  description: `${b.tables} Diamond pool tables in a smoke-free room in ${b.city}, ${b.state}. Table time from $10 per hour, drink packages from $20 per person, full bar and kitchen. Open 7 days. Call ${b.phoneDisplay}.`,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: `${b.name} | Pool Hall in ${b.city}, ${b.state}` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: site.faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <HomeHero />
      <IntroStats />
      <RatesSection />
      <NeonSpecials />
      <FoodSection />
      <PartySection />
      <EventFormSection />
      <GalleryStrip />
      <FaqSection />
      <VisitSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
