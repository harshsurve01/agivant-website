import { Container } from "@/components/ui/Container";
import { LifecycleHeader } from "./LifecycleHeader";
import { LifecycleAccordion } from "./LifecycleAccordion";
import { LifecycleSummary } from "./LifecycleSummary";
import {
  getLifecycleHeader,
  getLifecycleStages,
  getLifecycleSummary,
} from "@/data/lifecycle";
import { Gradient } from "@/components/effects/Gradient";
import styles from "./Lifecycle.module.css";

/**
 * Lifecycle
 *
 * The "AI-Native Engineering Lifecycle" section: heading block, an
 * interactive accordion of stages, and a closing "Amplify" summary
 * with CTA. Owns section-level layout, composition, and data loading —
 * it does not own the accordion's open/hover interaction (that's
 * LifecycleAccordion's job, see that file), the heading's content
 * (LifecycleHeader), or the summary's content/CTA (LifecycleSummary).
 *
 * Server Component: no "use client", no hooks, no state, no effects.
 * It's async because it awaits its data sources directly — the same
 * pattern already used by Hero and AnnouncementBar. LifecycleAccordion
 * is the one exception in this subtree that needs interactivity; see
 * LifecycleAccordion.tsx for why that boundary is drawn there and not
 * here.
 *
 * The connector between the accordion and the summary card is a
 * 3-arrow chevron stack with a looping, CSS-only opacity chase (each
 * arrow peaks in turn, top to bottom, to read as forward motion — see
 * Lifecycle.module.css's .connectorArrow1/2/3 + @keyframes
 * connectorChase). It's rendered here rather than owned by either
 * neighboring component since it's purely a layout/transition device
 * between them, not content either one owns. Pure CSS rather than
 * GSAP/JS: the effect is a fixed, non-scroll-driven loop, so it
 * doesn't need this file to become a Client Component — see
 * LifecycleItem.tsx for the matching note on its own static chevrons.
 */
export async function Lifecycle() {
  const [header, stages, summary] = await Promise.all([
    getLifecycleHeader(),
    getLifecycleStages(),
    getLifecycleSummary(),
  ]);

  return (
    <section className={styles.lifecycle}>
      {/* Two ambient blobs, decorative only. Left is a flat brand-purple
          wash; right reuses the same 4-stop brand gradient as
          TrustCard's ::before blob. Both now portal into the shared
          page-wide GradientLayer rather than being clipped to this
          section. */}
      <Gradient
        top="45%"
        left="-15%"
        size="49rem"
        stops={[
          "color-mix(in srgb, #f2dc84ce 70%, transparent) 0%",
          "transparent 65%",
        ]}
        opacity={0.55}
        blur="10px"
      />
      <Gradient
        kind="conic"
        angle="280deg"
        top="35%"
        right="25%"
        size="32rem"
        stops={["#b31aef 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.1}
        blur="60px"
          donutHole={0.3}
      />

      {/* Container's default size="xl" (1280px) is used here, same as
          Hero and Header — close enough to the ~1245px column measured
          in the Figma inspector that introducing a one-off max-width
          isn't warranted; the section only needs to preserve visual
          proportions across desktop viewports, not match pixel-for-pixel. */}
      <Container>
        <div className={styles.inner}>
          <LifecycleHeader
            eyebrow={header.eyebrow}
            title={header.title}
            description={header.description}
          />

          <LifecycleAccordion stages={stages} />

          <div className={styles.connector} aria-hidden="true">
            <svg viewBox="0 0 24 30" fill="none" className={styles.connectorIcon}>
              <path
                className={styles.connectorArrow1}
                d="M5 5L12 12L19 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className={styles.connectorArrow2}
                d="M5 13L12 20L19 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className={styles.connectorArrow3}
                d="M5 21L12 28L19 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <LifecycleSummary
            title={summary.title}
            description={summary.description}
            cta={summary.cta}
          />
        </div>
      </Container>
    </section>
  );
}