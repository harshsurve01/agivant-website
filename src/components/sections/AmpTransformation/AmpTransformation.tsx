import { Container } from "@/components/ui/Container";
import { Gradient } from "@/components/effects/Gradient";
import { AmpHeader } from "./AmpHeader";
import { AmpExperience } from "./AmpExperience";
import { AmpFooter } from "./AmpFooter";
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
 * data and distributes the relevant slice to each of its three direct
 * children — Header, Experience, Footer — matching the section spec's
 * top-level structure exactly:
 *
 *   AmpTransformation
 *   ├── Header                (normal scroll, no pin)
 *   ├── Experience  (Pinned)  (Left Column / Connector Layer / AmpCore / Right Column)
 *   └── Footer                (normal scroll, NOT inside the pinned timeline)
 *
 * `statement` and `progress` are still fetched independently (the
 * data file keeps its six-getter split), but both are now handed to
 * AmpFooter as a pair, since AmpFooter is the component that owns
 * their shared footer layout — see AmpFooter's doc comment.
 * `leftColumn`, `hub`, and `rightColumn` are likewise composed inside
 * AmpExperience, since that's the component that owns the pinned
 * three-column layout.
 *
 * The two ambient gradient blobs mirror the soft purple/peach glows
 * behind this block in the supplied screenshot, using the same
 * <Gradient/> primitive and color stops already established by
 * AIStack.tsx and Trust.tsx rather than inventing a new background
 * treatment.
 *
 * This pass is structural only: still a plain Server Component tree,
 * no Framer Motion, no GSAP/ScrollTrigger, no client state anywhere
 * in this section yet. Every component below (AmpHeader, AmpExperience,
 * AmpColumn, AmpNode, AmpConnectorLayer, AmpCore, AmpFooter, AmpTimeline)
 * is isolated enough to independently become a Client/animation
 * boundary later without any further structural refactor — see the
 * section spec's "Motion Architecture" and "Maintainability" sections.
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
        top="85%"
        right="20%"
        size="38rem"
        stops={[ "#edbf79 55%", "transparent 75%"]}
        opacity={0.21}
        blur="90px"
      />

      <Container>
        <div className={styles.inner}>
          <AmpHeader heading={header.heading} description={header.description} />

          <AmpExperience leftColumn={leftColumn} hub={hub} rightColumn={rightColumn} />

          <AmpFooter statement={statement} progress={progress} />
        </div>
      </Container>
    </section>
  );
}
