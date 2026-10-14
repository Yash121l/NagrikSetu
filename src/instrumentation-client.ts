import posthog from "posthog-js";
import { APP_SLUG, POSTHOG_KEY } from "@/lib/analytics";

const isLocalhost = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
const explicitlyEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

// Skip dev builds and localhost unless a key is set explicitly for this environment.
if (explicitlyEnabled || (process.env.NODE_ENV === "production" && !isLocalhost)) {
  posthog.init(POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-08-30",
    capture_pageview: "history_change",
    capture_pageleave: true,
    autocapture: true,
    enable_heatmaps: true,
    capture_dead_clicks: true,
    capture_exceptions: true,
    capture_performance: { web_vitals: true },
    // Inputs (search box, correction text) are masked: correction text must not leave the app.
    session_recording: { maskAllInputs: true }
  });
  posthog.register({ app: APP_SLUG });

  // Outbound clicks to official sources are the moment a citizen finds where to go.
  document.addEventListener(
    "click",
    (event) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin === window.location.origin || !/^https?:$/.test(url.protocol)) return;
      posthog.capture("source_link_clicked", {
        domain: url.hostname,
        url: `${url.origin}${url.pathname}`,
        page_path: window.location.pathname,
        record_id: anchor.closest<HTMLElement>("[data-record-id]")?.dataset.recordId
      });
    },
    { capture: true }
  );
}
