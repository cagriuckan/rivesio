import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rivesio Feedback",
    short_name: "Rivesio",
    description: "Collect product feedback with screenshots, triage every site in one inbox, and reply in-thread.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7fb",
    theme_color: "#0B1437",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
