import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { StickyHeader } from "./StickyHeader";
import { NavigationMenu } from "./NavigationMenu";
import { getNavigation } from "@/data/navigation";
import styles from "./Header.module.css";

/**
 * Header
 *
 * The site's primary header: brand logo, desktop navigation with mega menu,
 * and CTA button, laid out inside Container.
 *
 * Server Component: no "use client", no hooks, no state, no effects.
 * Async because it awaits its navigation data directly.
 * Interactive navigation behavior (mega menu, dropdowns, search) is delegated
 * to the NavigationMenu Client Component.
 */
export async function Header() {
  const navigation = await getNavigation();

  return (
    <StickyHeader>
      <Container size="2xl">
        <div className={styles.inner}>
          <Logo />

          <NavigationMenu navigation={navigation} />

         

          <Button variant="primary" size="lg" font-weight="bold" className={styles.cta}>
            Get Amp&apos;d!
          </Button>
        </div>
      </Container>
    </StickyHeader>
  );
}