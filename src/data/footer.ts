/**
 * data/footer.ts
 *
 * Data-access layer for the Footer layout component.
 */

import homepageJson from "./homepage.json";

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
  const { footerCta, footer } = homepageJson;
  return {
    heading: footerCta.heading,
    brandMedia: footerCta.media?.src
      ? {
          kind: footerCta.media.kind as "image",
          src: footerCta.media.src,
          alt: footerCta.media.alt ?? "Amp'd",
          width: 240,
          height: 80.46,
        }
      : undefined,
    buttons: [
      ...(footerCta.primaryCta?.enabled
        ? [
            {
              label: footerCta.primaryCta.label,
              href: footerCta.primaryCta.href,
              variant: "dark" as const,
              icon: "arrow-up-right" as const,
            },
          ]
        : []),
      ...(footerCta.secondaryCta?.enabled
        ? [
            {
              label: footerCta.secondaryCta.label,
              href: footerCta.secondaryCta.href,
              variant: "primary" as const,
              icon: "cube" as const,
            },
          ]
        : []),
    ],
    navigation: footer.navigation.map((item) => ({
      label: item.label,
      href: item.href,
    })),
    copyright: footer.copyright,
  };
}
