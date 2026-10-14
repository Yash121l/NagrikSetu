import posthog from "posthog-js";

// Public PostHog project key (phc_ keys are write-only client keys and safe to ship).
// NEXT_PUBLIC_POSTHOG_KEY overrides it, e.g. to point a fork at another project.
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_oLm8fb7L4CXDqGdJcc7a6boCtR8rVjf6dNx7G995eGdy";
export const APP_SLUG = "nagriksetu";

/** Fire-and-forget event capture. A no-op until PostHog has been initialised. */
export function track(event: string, properties?: Record<string, unknown>) {
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}
