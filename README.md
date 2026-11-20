# Cue-Phoria website (Next.js)

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4.
The homepage follows the Figma design at 1440px; the inner pages reuse the same type, colour and components.

## Run it

```bash
npm install
npm run dev        # http://localhost:3009
npm run build      # production build (all pages are prerendered as static HTML)
npm run start      # serve the production build
```

## Edit content

**`src/content/site-data.ts` is the one file to edit** for prices, hours, specials, the menu,
FAQs, event types, gallery photos and business details. Every page reads from it.

- Prices are plain numbers (`20`, not `"$20"`).
- Times are 24-hour `"HH:MM"`. A close time earlier than the open time means after midnight.
- Gallery photos live in `public/img/gallery/`; add the file there and an entry in `gallery`.

> The review card on the homepage still has the **placeholder review from the Figma file**.
> Replace `review` in `site-data.ts` with a real Google review before launch.

## Event inquiry form

The form posts to a server action (`src/app/actions.ts`) that validates the fields and forwards
them as JSON to the URL in the `EVENT_INQUIRY_WEBHOOK_URL` environment variable
(Formspree, Zapier, Make, or any endpoint that accepts a JSON POST).
Until that variable is set, the form tells visitors it is not switched on and asks them to call.

## Where things are

| Path | What it is |
| --- | --- |
| `src/app/globals.css` | Design tokens from Figma: colours, type scale, extruded/neon text effects |
| `src/components/sections.tsx` | Homepage sections (also reused on inner pages) |
| `src/components/ui.tsx` | Pill buttons, display headings, section header |
| `src/components/Header.tsx` | Navigation (inline on desktop, native popover menu below 1200px) |
| `src/app/<page>/page.tsx` | Table rates, food menu, gallery, hours & location, events |
| `public/img/design/` | Three photos taken from the Figma file (cue chalk, wings, burger) |

## Deploy

Works on Vercel or any Node host (`npm run build && npm run start`). The existing URLs
(`/table-rates`, `/food-menu`, …) are kept, each page declares its canonical URL, and
`/sitemap.xml` and `/robots.txt` are generated.
