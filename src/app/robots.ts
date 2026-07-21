import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  let host: string | undefined;
  try {
    host = new URL(origin).host;
  } catch {
    host = undefined;
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/_next/",
        "/*/feedbacks",
        "/*/feedbacks/",
        "/*/sites",
        "/*/sites/",
        "/*/projects",
        "/*/projects/",
        "/*/settings",
        "/*/settings/",
        "/*/login",
        "/*/signup",
        "/*/agent-invite",
        "/*/agent-invite/",
      ],
    },
    sitemap: `${origin}/sitemap.xml`,
    ...(host ? { host } : {}),
  };
}
