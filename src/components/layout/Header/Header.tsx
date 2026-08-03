import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { StickyHeader } from "./StickyHeader";
import { getNavigation } from "@/data/navigation";
import styles from "./Header.module.css";

/**
 * Header
 *
 * The site's primary header: brand logo, desktop navigation, and a CTA
 * button, laid out inside Container. Owns its own layout, spacing,
 * navigation rendering, and CTA placement — it does not own the
 * AnnouncementBar above it, a mobile menu, or dropdowns, all of which
 * are separate concerns for later iterations. Sticky-state *detection*
 * is delegated to HeaderShell (a Client Component); Header itself
 * still composes and renders every child exactly as before.
 *
 * Server Component: no "use client", no hooks, no state, no effects.
 * It's async because it awaits its navigation data directly — the same
 * pattern AnnouncementBar already uses, and the same pattern that will
 * apply once getNavigation() is backed by a real Headless WordPress
 * menu fetch instead of mock data. HeaderShell wraps the rendered
 * output in its own "use client" boundary without requiring Header
 * itself to become a Client Component.
 */
export async function Header() {
  const navigation = await getNavigation();

  return (
    <StickyHeader>
      <Container size="2xl">
        <div className={styles.inner}>
          <Logo />

      
         

          <nav aria-label="Primary" className={styles.nav}>
            <ul className={styles.navList}>
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

         

          <Button variant="primary" size="lg" font-weight="bold" className={styles.cta}>
            Get Amp&apos;d!
          </Button>
        </div>
      </Container>
    </StickyHeader>
  );
}