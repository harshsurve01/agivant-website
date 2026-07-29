import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/data/proof";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import styles from "./SpotlightCard.module.css";

interface SpotlightCardProps {
  caseStudy: CaseStudy;
}

/**
 * TODO(client): destination + target behavior not yet specified.
 *
 * The client hasn't confirmed (a) whether the whole card or just the
 * corner arrow should be clickable, or (b) where it should go — a
 * dedicated case-study page, an external link, same tab vs new tab,
 * etc. Until that's answered, the whole card is wired up as a link
 * (the corner arrow visually implies "this card goes somewhere," so
 * making only the icon clickable while the rest of the card isn't
 * would be a confusing half-measure) pointing at a placeholder `"#"`.
 *
 * `caseStudy.href` is read optimistically below so this starts
 * working the moment a `href` field is added to the `CaseStudy` type
 * in data/proof.ts — no further changes needed here. If the client
 * instead wants ONLY the corner arrow clickable, swap the `<Link>`
 * wrapper below to only wrap the `.corner` span, not the whole
 * `<article>` — everything else stays the same.
 */
const PLACEHOLDER_HREF = "#";

/**
 * SpotlightCard
 *
 * Presentation only: badge, image, overlay, title, description,
 * metric, footer. No hover logic — it doesn't know or care whether
 * it's the hovered card, the container decides that in Phase 4 and
 * will pass this component whatever prop that requires then. `metric`
 * and `footer` render conditionally because not every case study has
 * them populated (see the field-level comments in data/proof.ts).
 *
 * Image support follows the same "content asset, not a UI icon"
 * treatment as AI Stack and Partners: `fill` + `sizes` rather than
 * fixed width/height, since this card's artwork is a background
 * treatment behind the badge/corner icon, not an inline logo.
 *
 * Semantic markup: <article> per card, heading level bumped to h3
 * since ProofContent already owns the section's h2. Image alt text
 * is required by the CaseStudy type, not optional. The whole card is
 * now wrapped in a <Link> (see PLACEHOLDER_HREF above for why the
 * href is a stand-in) — <article> nests inside it rather than being
 * replaced by it, so the semantic markup is unchanged.
 *
 * `data-spotlight-card` on the <Link>: a plain, unstyled hook so
 * SpotlightContainer.module.css's dim-the-other-cards-on-hover rule
 * (`.container:has([data-spotlight-card]:hover) ...`) can select this
 * element from a different CSS Modules file. CSS Modules hashes class
 * names per-file, so `styles.cardLink` isn't reachable from
 * SpotlightContainer's own stylesheet — a data attribute sidesteps
 * that without exporting/composing classes across files just for one
 * selector.
 */
export function SpotlightCard({ caseStudy }: SpotlightCardProps) {
  const { industry, title, description, metric, metricLabel, footer, image } =
    caseStudy;

  // `href` isn't on CaseStudy yet — read defensively so this doesn't
  // break once it's added, and falls back to the placeholder until then.
  const href = (caseStudy as CaseStudy & { href?: string }).href ?? PLACEHOLDER_HREF;

  return (
    <Link
      href={href}
      className={styles.cardLink}
      aria-label={title}
      data-spotlight-card
    >
      <article className={styles.card}>
        <div className={styles.artwork}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="400px"
            className={styles.image}
          />

          <span className={styles.badge}>{industry}</span>

          {/* Corner affordance is still purely visual — the click
              target is the whole card via the <Link> wrapper above,
              not this icon specifically. No handler needed here. */}
          <span className={styles.corner} aria-hidden="true">
            <ArrowUpRight />
          </span>
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>

          {metric ? (
            <div className={styles.metric}>
              <p className={styles.metricValue}>{metric}</p>
              {metricLabel ? (
                <p className={styles.metricLabel}>{metricLabel}</p>
              ) : null}
            </div>
          ) : null}

          {footer ? <p className={styles.footer}>{footer}</p> : null}
        </div>
      </article>
    </Link>
  );
}