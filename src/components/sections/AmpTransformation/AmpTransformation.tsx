import { Container } from "@/components/ui/Container";
import { Gradient } from "@/components/effects/Gradient";
import { AmpHeader } from "./AmpHeader";
import { AmpExperience } from "./AmpExperience";
import { AmpStatement } from "./AmpStatement";
import { AmpProgress } from "./AmpProgress";
import {
  getAmpHeader,
  getAmpLeftColumn,
  getAmpHub,
  getAmpRightColumn,
  getAmpStatement,
  getAmpProgress,
} from "@/data/ampTransformation";
import styles from "./AmpTransformation.module.css";

/**
 * AmpTransformation
 *
 * The "What Changes When Your Enterprise Gets Amp'd?" section. Acts
 * only as the section orchestrator: it loads the complete section
 * data and distributes the relevant slice to each child — it owns no
 * layout logic of its own beyond the outer section shell (background,
 * ambient gradients, and the shared Container), same division of
 * responsibility as Environment.tsx and AIStack.tsx.
 *
 * `leftColumn`, `hub`, and `rightColumn` are fetched independently
 * (matching the data file's six-getter split) but composed together
 * inside AmpExperience, since that's the component that owns their
 * shared three-column layout — see AmpExperience's doc comment.
 *
 * The two ambient gradient blobs mirror the soft purple/peach glows
 * behind this block in the supplied screenshot, using the same
 * <Gradient/> primitive and color stops already established by
 * AIStack.tsx and Trust.tsx rather than inventing a new background
 * treatment.
 *
 * Static layout only: no Framer Motion, no scroll logic, no client
 * state anywhere in this section yet. Every component listed below is
 * a plain Server Component so each one (AmpHeader, AmpExperience,
 * AmpColumn, AmpCard, AmpHub, AmpStatement, AmpProgress, AmpTimeline)
 * can independently become a Framer Motion boundary later without any
 * structural refactor — see the implementation brief's "Future Framer
 * Motion Integration" section.
 *
 * Server Component: no "use client", no hooks, no state, no effects.
 * It's async because it awaits its data sources directly — the same
 * pattern used by Environment and AIStack.
 */
export async function AmpTransformation() {
  const [header, leftColumn, hub, rightColumn, statement, progress] = await Promise.all([
    getAmpHeader(),
    getAmpLeftColumn(),
    getAmpHub(),
    getAmpRightColumn(),
    getAmpStatement(),
    getAmpProgress(),
  ]);

  return (
    <section className={styles.ampTransformation}>
      <Gradient
        top="-5%"
        left="-10%"
        size="40rem"
        stops={["#edbf79 0%", "#8500df 55%", "transparent 75%"]}
        opacity={0.18}
        blur="90px"
      />
      <Gradient
        top="15%"
        right="30%"
        size="38rem"
        stops={["#8500df 0%", "#edbf79 55%", "transparent 75%"]}
        opacity={0.38}
        blur="90px"
      />

      <Container>
        <div className={styles.inner}>
          <AmpHeader heading={header.heading} description={header.description} />

          <AmpExperience leftColumn={leftColumn} hub={hub} rightColumn={rightColumn} />

          <AmpStatement statement={statement} />

          <AmpProgress progress={progress} />
        </div>
      </Container>
    </section>
  );
}
