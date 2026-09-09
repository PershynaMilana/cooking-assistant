import type { MetadataRoute } from "next";

import { resolveSiteUrl } from "config/site";
import { PRIVATE_PATH_PREFIXES } from "constants/routes";

const SITEMAP_PATH = "/sitemap.xml";

// the private area is also blocked by a noindex on its own layout; this only spares crawlers
// the requests, since every one of those pages answers with the login redirect anyway
const robots = (): MetadataRoute.Robots => ({
    rules: { userAgent: "*", allow: "/", disallow: PRIVATE_PATH_PREFIXES },
    sitemap: new URL(SITEMAP_PATH, resolveSiteUrl()).toString(),
});

export default robots;
