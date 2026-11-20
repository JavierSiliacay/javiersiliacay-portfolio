import type { MetadataRoute } from "next";

const SITE_URL = "https://javiersiliacay-portfolio.siliacay-javier.workers.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
