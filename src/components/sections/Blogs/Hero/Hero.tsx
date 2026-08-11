import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import { SearchBar } from "@/components/ui/SearchBar";
import styles from "./Hero.module.css";

export interface BlogsHeroSearch {
  /** Placeholder copy shown inside the search input. */
  placeholder: string;
  /** Label rendered on the search button. */
  buttonLabel: string;
}

export interface BlogsHeroProps {
  /**
   * Main hero heading. May contain a line break (`\n`) to separate
   * the eyebrow line ("Blogs") from the headline that follows it —
   * kept as one field, not two, so a future WordPress rich-text
   * heading maps onto this prop with no shape changes.
   */
  heading: string;
  /** Supporting description copy beneath the heading. */
  description: string;
  /** Search bar copy. No filtering logic lives here or in SearchBar. */
  search: BlogsHeroSearch;
}

/**
 * Hero (Blogs)
 *
 * Renders the Blogs page's hero content only: heading, description,
 * and a search bar in place of a CTA. Reuses the exact same shared
 * pieces as the TechTalk Hero — HeroBackground for all ambient
 * visuals (gradients, particle field, decorative ellipse) and
 * Container for width/centering — nothing about either is duplicated
 * or reimplemented here.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no business logic, no data imports. Every value arrives via props,
 * so this component is already shaped for a future WordPress-sourced
 * `hero` object with zero changes required on this end. Search is
 * presentational only (see SearchBar) — no filtering logic exists
 * yet.
 */
export function Hero({ heading, description, search }: BlogsHeroProps) {
  const [eyebrow, ...rest] = heading.split("\n");
  const headline = rest.join(" ");

  return (
    <section className={styles.hero} data-hero-interaction-root>
      {/* Decorative background only — identical usage to the
          TechTalk Hero. `data-hero-interaction-root` is the
          pointer-tracking boundary HeroParticleField looks up via
          closest(), and must stay on an ancestor containing both
          HeroBackground and Content. */}
      <HeroBackground />

      {/* Content */}
      <Container className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <span className={styles.headline}>{headline}</span>
          </h1>

          <p className={styles.description}>{description}</p>

          <div className={styles.search}>
            <SearchBar
              placeholder={search.placeholder}
              buttonLabel={search.buttonLabel}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
