import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import { SearchBar } from "@/components/ui/SearchBar";
import styles from "./Hero.module.css";
import type { CaseStudiesHeroProps } from "./types";

/**
 * Hero (Case Studies Landing Page)
 *
 * Renders the Case Studies page's hero content:
 * - Shared HeroBackground (particles and ambient glow)
 * - Heading: "Client success," / "in production"
 * - Description: "Proven outcomes across high-impact enterprise deployments."
 * - Search bar leading into the CaseStudyHub section below
 *
 * Server Component: no "use client", no hooks, no state. All values arrive via props.
 * `data-hero-interaction-root` enables pointer tracking across the full Hero for HeroParticleField.
 */
export function Hero({ heading, description, search }: CaseStudiesHeroProps) {
  const [firstLine, ...rest] = heading.split("\n");
  const secondLine = rest.join(" ");

  return (
    <section className={styles.hero} data-hero-interaction-root>
      {/* Background with particle tracking */}
      <HeroBackground />

      {/* Content */}
      <Container className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            <span className={styles.headingLine}>{firstLine}</span>
            {secondLine && (
              <span className={styles.headingLine}>{secondLine}</span>
            )}
          </h1>

          <p className={styles.description}>{description}</p>

          <div className={styles.search}>
            <SearchBar
              placeholder={search.placeholder}
              buttonLabel={search.buttonLabel}
              value={search.value}
              onChange={search.onChange}
              onSubmit={search.onSubmit}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
