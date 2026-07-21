import { Container } from "@/components/ui/Container";
import { LifecycleHeader } from "./LifecycleHeader";
import { LifecycleAccordion } from "./LifecycleAccordion";
import { LifecycleSummary } from "./LifecycleSummary";
import {
  getLifecycleHeader,
  getLifecycleStages,
  getLifecycleSummary,
} from "@/data/lifecycle";
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
 * static chevron only (per spec: no animation in this pass). It's
 * rendered here rather than owned by either neighboring component
 * since it's purely a layout/transition device between them, not
 * content either one owns. A later pass can promote it to a shared,
 * animated Chevron UI component without this section's markup
 * needing to change — see LifecycleItem.tsx for the matching note on
 * its own static chevrons.
 */
export async function Lifecycle() {
  const [header, stages, summary] = await Promise.all([
    getLifecycleHeader(),
    getLifecycleStages(),
    getLifecycleSummary(),
  ]);

  return (
    <section className={styles.lifecycle}>
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
            <svg viewBox="0 0 24 24" fill="none" className={styles.connectorIcon}>
              <path
                d="M5 8L12 15L19 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 13L12 20L19 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
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
