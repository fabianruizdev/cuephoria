import type { MetadataRoute } from "next";
import { site } from "@/content/site-data";

const pages = ["/", "/table-rates", "/food-menu", "/gallery", "/hours-location", "/book-events-contact-us"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: site.business.siteUrl + path,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
