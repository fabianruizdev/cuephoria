import type { Metadata, Viewport } from "next";
import { Archivo, Lilita_One, Neonderthaw } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/content/site-data";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const lilita = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lilita",
  display: "swap",
});

const neonderthaw = Neonderthaw({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-neonderthaw",
  display: "swap",
  preload: false, // only used below the fold on the homepage
});

const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Satoshi-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi-local",
  display: "swap",
  preload: false,
});

const b = site.business;

export const metadata: Metadata = {
  metadataBase: new URL(b.siteUrl),
  title: {
    default: `${b.name} | Pool Hall in ${b.city}, ${b.state}`,
    template: `%s | ${b.shortName} Billiards, ${b.city} ${b.state}`,
  },
  description: `${b.tables} Diamond pool tables in a smoke-free room in ${b.city}, ${b.state}. Full bar and kitchen. Open 7 days. Call ${b.phoneDisplay}.`,
  openGraph: {
    type: "website",
    siteName: b.name,
    images: [{ url: "/img/room-lights.jpg", width: 2560, height: 1707, alt: "Diamond pool tables under the ceiling light frames at Cue-Phoria" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0f1214",
  colorScheme: "dark",
};

/* Runs before paint: turns on intro animations only when JS works and the visitor
   has not asked for reduced motion. If the app never hydrates, content reappears after 4s. */
const motionScript = `(function(){var d=document.documentElement;if(!window.matchMedia||matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('motion')},4000)})()`;

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  name: b.name,
  url: b.siteUrl + "/",
  telephone: b.phoneTel,
  image: b.siteUrl + "/img/room-lights.jpg",
  priceRange: "$$",
  smokingAllowed: false,
  address: {
    "@type": "PostalAddress",
    streetAddress: b.street,
    addressLocality: b.city,
    addressRegion: b.state,
    postalCode: b.zip,
    addressCountry: "US",
  },
  openingHoursSpecification: site.hours.map((h, i) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days[i],
    opens: h.open,
    closes: h.close,
  })),
  sameAs: [b.facebook],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${lilita.variable} ${neonderthaw.variable} ${satoshi.variable}`}
    >
      <body>
        <Script id="motion-flag" strategy="beforeInteractive">
          {motionScript}
        </Script>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
