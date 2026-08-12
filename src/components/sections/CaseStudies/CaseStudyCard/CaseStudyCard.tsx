import Link from "next/link";
import Image from "next/image";
import styles from "./CaseStudyCard.module.css";
import type { CaseStudyCardProps } from "./types";

/**
 * Decorative circular arrow, matching the "Deep Dive" affordance in
 * Figma. No shared icon component exists in the project yet (none
 * was part of the uploaded component set), so this is a small inline
 * SVG local to the card rather than a new global icon system — flag
 * this for review if a shared icon set does exist elsewhere.
 */
function DeepDiveIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={styles.deepDiveIconSvg}
    >
      <circle cx="7" cy="7" r="7" fill="currentColor" />
      <path d="M5.5 4.2 9.3 7 5.5 9.8V4.2Z" fill="var(--color-white)" />
    </svg>
  );
}

/**
 * CaseStudyCard
 *
 * Presentation-only — receives one case study's data via props and
 * never imports data/caseStudies.ts itself, per the brief. Filtering
 * state and the filtered list both live entirely in CaseStudyHub;
 * this component has no state of its own.
 *
 * The whole card is a single Next.js Link to `/case-studies/[slug]`,
 * since the brief calls for the navigation structure to be correct
 * now even though the destination page doesn't exist yet — "Deep
 * Dive" is the visible affordance, but the click target is the full
 * card, matching the hover treatment in Figma.
 *
 * Server Component: no "use client", no hooks, no state.
 */
export function CaseStudyCard({
  caseStudy,
  deepDiveLabel = "Deep Dive",
}: CaseStudyCardProps) {
  const { slug, title, image, industry, capability } = caseStudy;

  return (
    <Link href={`/case-studies/${slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className={styles.image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 386px"
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>

        <div className={styles.footer}>
          <div className={styles.tags}>
            <span className={styles.badge}>{industry}</span>
            <span className={styles.badge}>{capability}</span>
          </div>

          <span className={styles.deepDive}>
            {deepDiveLabel}
            <span className={styles.deepDiveIcon} aria-hidden="true">
              <DeepDiveIcon />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
