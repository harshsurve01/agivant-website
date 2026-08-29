/**
 * data/footer.ts
 *
 * Data-access layer for the Footer layout component.
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
   * Optional icon identifier.
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

/** Visual brand asset inserted inline into the heading (e.g. Amp'd wordmark/gif). */
export interface FooterBrandMedia {
  kind: "image" | "gif" | "video";
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/** All content the Footer layout component needs to render. */
export interface FooterContent {
  /** Heading text, e.g. "Ready To Get Your<br>Enterprise<br>With Agivant?" */
  heading: string;
  /** Brand media asset (e.g. Amp'd wordmark/gif) inserted inline in the heading. */
  brandMedia?: FooterBrandMedia;
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
 * Returns the full content model for the Footer.
 */
export async function getFooterContent(): Promise<FooterContent> {
  return {
    heading: "Ready To Get Your<br>Enterprise<br>With Agivant?",
    brandMedia: {
      kind: "image",
      src: "/images/ampd-wordmark.svg",
      alt: "Amp'd",
      width: 240,
      height: 80.46,
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
    copyright: "© 2023–2026 Agivant Technologies. All rights reserved.",
  };
}
