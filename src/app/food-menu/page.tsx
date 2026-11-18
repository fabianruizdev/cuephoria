import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, VisitSection } from "@/components/sections";
import { DisplayHeading, PillLink } from "@/components/ui";
import { site, type MenuItem } from "@/content/site-data";
import { money, tel } from "@/lib/format";

const b = site.business;
const m = site.menu;

export const metadata: Metadata = {
  title: { absolute: `Food Menu | ${b.name}, ${b.city} ${b.state}` },
  description: `Full food menu at ${b.shortName} in ${b.city}, ${b.state}: air fried wings from $10.95, burgers, flatbreads, starters and salads. Kitchen open daily until 30 minutes before close. ${b.phoneDisplay}.`,
  alternates: { canonical: "/food-menu" },
  openGraph: { url: "/food-menu", title: "Food Menu" },
};

const priceOf = (i: MenuItem) => (i.price !== undefined ? money(i.price) : i.priceLabel ?? "");

/* Photo shown beside a few sections */
const sectionPhoto: Record<string, { src: string; alt: string }> = {
  mains: { src: "/img/design/burger.jpg", alt: "A bacon cheeseburger with fries and a draft beer" },
  wings: { src: "/img/design/wings.jpg", alt: "A basket of glazed air-fried wings with celery and blue cheese" },
};

export default function FoodMenuPage() {
  return (
    <>
      <PageHero
        eyebrow="Food menu"
        title={<>A real kitchen. Not bar snacks.</>}
        lead="Air-fried wings, burgers, flatbreads and shareable starters, served right to your table until 30 minutes before close."
        image="/img/design/wings.jpg"
        position="center 55%"
      >
        <PillLink href={tel} tone="flame">
          Call to reserve a table
        </PillLink>
      </PageHero>

      <section className="on-light bg-cream text-ink" aria-label="Menu">
        {/* Section jump links */}
        <nav aria-label="Menu sections" className="sticky top-0 z-20 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
          <ul className="container-x flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
            {m.sections.map((s) => (
              <li key={s.id} className="shrink-0">
                <a href={`#${s.id}`} className="inline-flex min-h-11 items-center rounded-full border border-ink/15 px-4 text-small text-ink transition-colors hover:bg-ink hover:text-bone">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="container-x pt-[clamp(3.5rem,2rem+4vw,6rem)] pb-[clamp(4.5rem,3rem+5vw,7.5rem)]">
          <div className="space-y-[clamp(4rem,3rem+3vw,6rem)]">
            {m.sections.map((s) => {
              const photo = sectionPhoto[s.id];
              return (
                <section key={s.id} id={s.id} className="scroll-mt-24" aria-labelledby={`${s.id}-title`}>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <DisplayHeading id={`${s.id}-title`}>{s.name}</DisplayHeading>
                    {s.note && <p className="text-body text-stone">{s.note}</p>}
                  </div>

                  <div className={`mt-10 grid gap-10 ${photo ? "lg:grid-cols-[1fr_24rem] lg:gap-14" : ""}`}>
                    <ul className={`grid content-start gap-x-12 self-start ${s.items.length > 5 ? "md:grid-cols-2" : ""}`}>
                      {s.items.map((i: MenuItem) => (
                        <li key={i.name} className="border-t border-ink/15 py-5">
                          <div className="flex items-baseline gap-3">
                            <h3 className="text-card text-ink">{i.name}</h3>
                            <span aria-hidden="true" className="min-w-6 flex-1 translate-y-[-0.3em] border-b border-dotted border-ink/30" />
                            <span className="text-card font-light whitespace-nowrap text-ink tabular-nums">{priceOf(i)}</span>
                          </div>
                          {i.desc && <p className="mt-2 max-w-[34rem] text-body leading-snug text-stone">{i.desc}</p>}
                        </li>
                      ))}
                    </ul>
                    {photo && (
                      <div className="relative hidden aspect-[4/5] overflow-hidden rounded-card lg:block">
                        <Image src={photo.src} alt={photo.alt} fill sizes="384px" className="object-cover" />
                      </div>
                    )}
                  </div>

                  {(s.extras || s.list) && (
                    <div className="mt-8 grid gap-6 rounded-card bg-paper p-6 sm:p-7 md:grid-cols-[1fr_auto] md:items-start">
                      {s.list && (
                        <div>
                          <h4 className="text-xs tracking-[0.14em] text-stone uppercase">{s.listLabel}</h4>
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {s.list.map((x) => (
                              <li key={x} className="rounded-full border border-ink/15 px-3.5 py-2 text-xs leading-none text-ink">
                                {x}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {s.extras && (
                        <ul className="space-y-2 md:min-w-48">
                          {s.extras.map((x) => (
                            <li key={x.name} className="flex justify-between gap-6 text-body">
                              <span className="text-stone">{x.name}</span>
                              <span className="font-medium">+{money(x.price)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          <p className="mt-16 text-small text-stone">{m.kitchenNote} Prices before tax.</p>
        </div>
      </section>

      {/* Add-ons callout */}
      <section className="section-y" aria-labelledby="menu-addons-title">
        <div className="container-x">
          <div className="grid gap-8 rounded-panel bg-ink-2 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">
            <div>
              <DisplayHeading id="menu-addons-title" color="sun">
                Add food to your package.
              </DisplayHeading>
              <p className="mt-6 max-w-[40rem] text-body-lg text-bone/75">
                On a Standard or Premium drink package?{" "}
                {site.pricing.addons.items.map((a) => `${a.name} +${money(a.price)}`).join(" · ")}.
              </p>
            </div>
            <PillLink href="/table-rates#packages" tone="flame" icon="right">
              See drink packages
            </PillLink>
          </div>
        </div>
      </section>

      <VisitSection />
    </>
  );
}
