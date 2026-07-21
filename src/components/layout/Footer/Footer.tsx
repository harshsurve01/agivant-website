import clsx from "clsx";
import { getFooterContent } from "@/data/footer";
// TODO(path): adjust this import to match wherever Container actually
// lives in this project (e.g. "@/components/layout/Container"). Assumed
// here to match the barrel-export convention used elsewhere (see the
// Button import in FooterCTA.tsx).
import { Container } from "@/components/ui/Container";
import { FooterCTA } from "./FooterCTA";
import { FooterNavigation } from "./FooterNavigation";
import { FooterBrandmark } from "./FooterBrandmark";
import { FooterCopyright } from "./FooterCopyright";
import styles from "./Footer.module.css";

/**
 * Visual style of the footer. Only "default" is implemented in Phase 2.
 * "minimal" is reserved here so a future variant can be added by (a)
 * adding a case wherever variant-specific markup is needed and (b)
 * adding a `.minimal` class to Footer.module.css — without restructuring
 * this component or any of its children.
 */
export type FooterVariant = "default" | "minimal";

export interface FooterProps {
  /** Visual variant. Defaults to "default". Only "default" exists today. */
  variant?: FooterVariant;
  /** Whether to render FooterNavigation. Defaults to true. */
  showNavigation?: boolean;
  /** Whether to render the decorative FooterBrandmark. Defaults to true. */
  showBrandmark?: boolean;
}

/**
 * Footer
 *
 * Global layout component (not a homepage-only section) combining the
 * site's final CTA with its footer navigation. Rendered once per page,
 * typically from the root layout, even though today it only appears on
 * the homepage.
 *
 * Owns section layout, composition, spacing, and data loading. Delegates
 * all content rendering to its four children, each of which owns exactly
 * one visual responsibility (heading + buttons, navigation, decorative
 * brandmark, copyright).
 *
 * Horizontal content width is delegated entirely to the shared Container
 * component (size="2xl"), matching every other major section (Header,
 * Hero, etc.). Footer.module.css no longer owns any horizontal padding
 * or max-width — only background, overflow, positioning, and vertical
 * spacing. Three independent Container instances wrap the CTA+navigation
 * row, FooterBrandmark, and the copyright line respectively, so all
 * three visual zones align to the same content grid as the rest of the
 * site.
 *
 * Server Component: async, no "use client", no hooks, no state, no
 * event handlers. Data is fetched here (today: static; future: Headless
 * WordPress) and passed down as props — children never fetch their own
 * data.
 *
 * EXTENSIBILITY: `variant`, `showNavigation`, and `showBrandmark` exist
 * now so future footer variants (e.g. a minimal footer on interior
 * pages) are additive — a new variant class plus a conditional prop
 * check — rather than a structural rewrite. No behavior beyond
 * "default" / all-sections-shown is implemented in this phase.
 */
export async function Footer({
  variant = "default",
  showNavigation = true,
  showBrandmark = true,
}: FooterProps) {
  const content = await getFooterContent();

  return (
    <footer className={clsx(styles.footer, styles[variant])}>
      <Container size="2xl" className={styles.top}>
        <FooterCTA heading={content.heading} buttons={content.buttons} />
        {showNavigation ? (
          <FooterNavigation links={content.navigation} />
        ) : null}
      </Container>

      {showBrandmark ? (
        <Container size="xl">
          <FooterBrandmark />
        </Container>
      ) : null}

      <Container size="xl">
        <FooterCopyright text={content.copyright} />
      </Container>
    </footer>
  );
}