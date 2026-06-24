import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NagrikSetu",
    short_name: "NagrikSetu",
    description: "Citizen-first search and navigation layer for public information in India.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7faf7",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
