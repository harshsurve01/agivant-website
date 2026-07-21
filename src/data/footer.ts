/**
 * data/footer.ts
 *
 * Data-access layer for the Footer layout component. Mirrors the pattern
 * established by Environment, Partners, Proof and AIStack: components
 * never hardcode content or fetch data themselves — they receive it from
 * an async getter defined here. Today these getters return static
 * literals; when the Headless WordPress backend is wired up, only the
 * function body below changes (e.g. to a `fetch()` call against the WP
 * REST/GraphQL API) — every component that consumes `FooterContent`
 * stays untouched.
 */

/** A single CTA button rendered inside the footer's heading zone. */
export interface FooterButton {
  /** Visible button label. */
  label: string;
  /** Destination URL or route. */
  href: string;
  /** Visual variant, passed straight through to <Button variant>. */
  variant: "primary" | "dark";
  /**
   * Optional icon identifier. A string key — not a ReactNode — so this
   * interface stays JSON-serializable for the future WordPress payload.
   * FooterCTA is responsible for resolving the key to an actual icon.
   */
  icon?: "arrow-up-right" | "cube";
}

/** A single link rendered inside the footer navigation list. */
export interface FooterNavigationLink {
  /** Visible link label. */
  label: string;
  /** Destination URL or route. */
  href: string;
}

/** All content the Footer layout component needs to render. */
export interface FooterContent {
  /** Heading text, e.g. "Ready To Get Your Enterprise Amp'd With Agivant?" */
  heading: {
    line1: string;
    line2Prefix: string;
    line2Brand: string;
    line3: string;
  };
  /** CTA buttons rendered below the heading. */
  buttons: FooterButton[];
  /** Footer navigation links. */
  navigation: FooterNavigationLink[];
  /** Copyright line. */
  copyright: string;
}

/**
 * getFooterContent
 *
 * Returns the full content model for the Footer. Static today; becomes a
 * fetch against Headless WordPress later without any change to the
 * `FooterContent` shape or to the components that consume it.
 */
export async function getFooterContent(): Promise<FooterContent> {
  return {
    heading: {
  line1: "Ready To Get Your",
  line2Prefix: "Enterprise",
  line2Brand: "Amp'd",
  line3: "With Agivant?"
},
    buttons: [
      {
        label: "Find your Amp'd score",
        href: "/ampd-score",
        variant: "dark",
        icon: "arrow-up-right",
      },
      {
        label: "Talk to an Amp'd specialist",
        href: "/contact",
        variant: "primary",
        icon: "cube",
      },
    ],
    navigation: [
      { label: "What We Build", href: "/what-we-build" },
      { label: "Client Success", href: "/client-success" },
      { label: "Agent Library", href: "/agent-library" },
      { label: "Resources", href: "/resources" },
      { label: "Careers", href: "/careers" },
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact" },
    ],
    copyright: "© 2026 Agivant Technologies. All rights reserved.",
  };
}
