import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import { SearchBar } from "@/components/ui/SearchBar";
import styles from "./Hero.module.css";
import type { CaseStudiesHeroProps } from "./types";

/**
 * Hero (Case Studies)
 *
 * Renders the Case Studies page's hero content only: heading,
 * description, and a search bar in place of a CTA. Reuses the exact
 * same shared pieces as the Blogs and TechTalk Heroes — HeroBackground
 * for all ambient visuals (gradients, particle field, decorative
 * ellipse) and Container for width/centering — nothing about either
 * is duplicated or reimplemented here.
 *
 * Unlike Blogs' heading (a small "Blogs" eyebrow above a larger
 * headline), Figma shows the Case Studies heading as two lines of
 * identical weight/size ("Client success," / "in production"), so
 * both lines share one `.headingLine` style rather than the eyebrow/
 * headline split Blogs uses. The `heading` prop still carries the
 * line break as `\n` for the same reason Blogs does: it keeps the
 * data shape ready for a future CMS-sourced heading with zero prop
 * changes.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no business logic, no data imports (no caseStudies.ts here — see
 * types.ts and the page above for the data flow). Every value arrives
 * via props. Search is presentational only (see SearchBar) — no
 * filtering logic exists yet; that lands with CaseStudyHub +
 * PortfolioFilters + CaseStudyCard.
 */
export function Hero({ heading, description, search }: CaseStudiesHeroProps) {
  const [firstLine, ...rest] = heading.split("\n");
  const secondLine = rest.join(" ");

  return (
    <section className={styles.hero} data-hero-interaction-root>
      {/* Decorative background only — identical usage to the Blogs
          and TechTalk Heroes. `data-hero-interaction-root` is the
          pointer-tracking boundary HeroParticleField looks up via
          closest(), and must stay on an ancestor containing both
          HeroBackground and Content. */}
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
