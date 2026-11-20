import Link from "next/link";
import { site } from "@/content/site-data";
import { tel } from "@/lib/format";
import { Logo } from "./Header";
import BackToTop from "./BackToTop";
import CurrentYear from "./CurrentYear";

const columns = [
  {
    title: "Play",
    links: [
      { href: "/table-rates", label: "Table rates" },
      { href: "/table-rates#weekend", label: "Weekend Unlimited" },
      { href: "/#specials", label: "Daily specials" },
    ],
  },
  {
    title: "Eat & Drink",
    links: [
      { href: "/food-menu", label: "Food menu" },
      { href: "/table-rates#packages", label: "Drink packages" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  {
    title: "Visit",
    links: [
      { href: tel, label: site.business.phoneDisplay },
      { href: "/hours-location", label: "Hours & location" },
      { href: "/book-events-contact-us", label: "Book an event" },
    ],
  },
];

export default function Footer() {
  const b = site.business;
  return (
    <footer className="bg-ink pb-10 text-bone">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:gap-10">
          <div>
            <Link href="/" className="inline-block rounded-sm" aria-label={`${b.shortName} home`}>
              <Logo />
            </Link>
            <p className="mt-6 max-w-[22rem] text-small leading-[1.55] text-bone/60">
              {b.tables} Diamond tables, a full bar and a real kitchen in a clean, non-smoking room. {b.city}, {b.state}.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-x-14 lg:gap-x-20 xl:gap-x-[5.75rem]">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-xs tracking-[0.16em] text-bone/70 uppercase">{col.title}</h2>
                <ul className="mt-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href.startsWith("/") ? (
                        <Link href={l.href} className="inline-block py-[0.3rem] text-small text-bone/85 transition-colors hover:text-flame">
                          {l.label}
                        </Link>
                      ) : (
                        <a href={l.href} className="inline-block py-[0.3rem] text-small text-bone/85 transition-colors hover:text-flame">
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-12 flex justify-center">
          <BackToTop />
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-bone/10 pt-7 text-small text-bone/75 sm:flex-row sm:justify-between">
          <p>
            © <CurrentYear /> {b.name}
          </p>
          <p>
            {b.street} · {b.city}, {b.state} {b.zip}
          </p>
        </div>
      </div>
    </footer>
  );
}
