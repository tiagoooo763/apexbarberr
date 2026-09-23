import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/agendar`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
