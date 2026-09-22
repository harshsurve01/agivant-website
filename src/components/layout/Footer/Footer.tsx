import clsx from "clsx";
import {
  getFooterContent,
  type FooterButton,
  type FooterBrandMedia,
} from "@/data/footer";
import { Container } from "@/components/ui/Container";
import { FooterCTA } from "./FooterCTA";
import { PartnerFooterCTA } from "./PartnerFooterCTA";
import { FooterNavigation } from "./FooterNavigation";
import { FooterBrandmark } from "./FooterBrandmark";
import { FooterCopyright } from "./FooterCopyright";
import styles from "./Footer.module.css";

/**
 * Visual style of the footer.
 * - "default": Centered 3-line heading, 2 CTA buttons, faded brandmark, and copyright (no navigation column).
 * - "minimal": Compact variant containing ONLY the large faded Agivant logo and copyright text.
 * - "partners": Simplified variant for Partners landing page with centered 64px 2-line heading,
 *               single purple CTA button, faded brandmark, and copyright.
 * - "partner-detail": Variant for Partner Detail pages with centered heading, supporting description paragraph,
 *                     single primary button (with cube icon), faded brandmark, and copyright.
 * - "service-detail": Variant for Service Detail pages with centered 2-line heading (line 1 purple, line 2 black),
 *                     single primary button (with cube icon), faded brandmark, and copyright.
 * - "partner-card" (or "partner"): Reusable horizontal glass card variant for Partner pages (Databricks, ServiceNow, etc.)
 *                                  with left artwork, right heading/description/button, faded brandmark, and copyright.
 */
export type FooterVariant = "default" | "minimal" | "partners" | "partner-detail" | "service-detail" | "partner-card" | "partner";

export interface FooterCustomCTA {
  heading: string | { line1: string; line2?: string; line3?: string };
  description?: string;
  brandMedia?: FooterBrandMedia | null;
  media?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  } | null;
  buttons: FooterButton[];
}

export interface FooterProps {
  /** Optional custom CSS class name for scoped page-level adjustments. */
  className?: string;
  /** Visual variant. Defaults to "default". */
  variant?: FooterVariant;
  /** Whether to render FooterNavigation. Defaults to false. */
  showNavigation?: boolean;
  /** Whether to render the decorative FooterBrandmark. Defaults to true. */
  showBrandmark?: boolean;
  /** Optional custom CTA data (used on partner detail pages and custom landing pages). */
  ctaData?: FooterCustomCTA;
}

/**
 * Footer
 *
 * Global layout component combining the site's final CTA with its footer brandmark and copyright.
 * Supports "default" centered footer, "partners" landing footer, "partner-detail" CMS-driven footer,
 * "service-detail" service inner page footer, "partner-card" horizontal glass card footer, and "minimal" logo+copyright variant.
 *
 * Server Component: async, no "use client", no hooks, no state.
 */
export async function Footer({
  className,
  variant = "default",
  showNavigation = false,
  showBrandmark = true,
  ctaData,
}: FooterProps) {
  const content = await getFooterContent();

  const isPartners = variant === "partners";
  const isPartnerDetail = variant === "partner-detail" || variant === "service-detail";
  const isPartnerCard = variant === "partner-card" || variant === "partner";
  const isMinimal = variant === "minimal";

  const heading =
    ctaData?.heading ??
    (isPartners
      ? "Ready to put the right\necosystem to work?"
      : content.heading);

  const description = ctaData?.description;

  const brandMedia =
    ctaData?.brandMedia === null
      ? undefined
      : (ctaData?.brandMedia ??
        (isPartners || isPartnerDetail || isPartnerCard ? undefined : content.brandMedia));

  const buttons: FooterButton[] =
    ctaData?.buttons ??
    (isPartners
      ? [
          {
            label: "Talk to an Amp'd specialist",
            href: "/contact",
            variant: "primary",
            icon: "cube",
          },
        ]
      : content.buttons);

  return (
    <footer
      className={clsx(
        styles.footer,
        styles[variant],
        className
      )}
    >
      {!isMinimal && (
        <Container
          size="xl"
          className={styles.top}
        >
          {isPartnerCard ? (
            <PartnerFooterCTA
              heading={heading}
              description={description}
              media={ctaData?.media}
              buttons={buttons}
            />
          ) : (
            <FooterCTA
              heading={heading}
              description={description}
              brandMedia={brandMedia}
              buttons={buttons}
              variant={variant}
            />
          )}
          {showNavigation ? (
            <FooterNavigation links={content.navigation} />
          ) : null}
        </Container>
      )}

      {showBrandmark ? (
        <Container
          size="xl"
          className={styles.brandmarkContainer}
        >
          <FooterBrandmark />
        </Container>
      ) : null}

      <Container
        size="xl"
        className={styles.copyrightContainer}
      >
        <FooterCopyright text={content.copyright} />
      </Container>
    </footer>
  );
}