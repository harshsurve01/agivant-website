import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AIStackHeader } from "./AIStackHeader";
import { AIStackGrid } from "./AIStackGrid";
import { getAIStackHeader, getAIStackCards, getAIStackCTA } from "@/data/ai-stack";
// SVGR pattern matching Hero.tsx — see that file's comment for why
// this is imported as a component rather than a static asset URL.
import CubeIcon from "@/assets/icons/cube.svg";
import { Gradient } from "@/components/effects/Gradient";
import styles from "./AIStack.module.css";

/**
 * AIStack
 *
 * The "Engineering Every Layer Of Your AI Stack" section: heading
 * block, a five-card bento grid, and a closing CTA. Owns section-level
 * layout, composition, spacing, and data loading — it does not own the
 * heading's content (AIStackHeader), the grid's responsive placement
 * (AIStackGrid), or any card's interaction (AIStackCardShell, the
 * only Client Component in this section).
 *
 * The CTA lives here rather than in AIStackHeader or AIStackGrid
 * because it isn't part of either — it sits below the grid as its own
 * section-level element, the same way Lifecycle's closing CTA is owned
 * by Lifecycle's summary rather than by its accordion.
 *
 * Server Component: no "use client", no hooks, no state, no effects.
 * It's async because it awaits its data sources directly — the same
 * pattern already used by Hero and Lifecycle.
 */
export async function AIStack() {
  const [header, cards, cta] = await Promise.all([
    getAIStackHeader(),
    getAIStackCards(),
    getAIStackCTA(),
  ]);

  return (
    <section className={styles.aiStack}>
      <Gradient
        top="5%"
        right="15%"
        size="65rem"
        stops={["#8500df 50%", "#edbf79 85%", "transparent 100%"]}
        opacity={0.15}
        blur="30px"
      />

      <Container>
        <div className={styles.inner}>
          <AIStackHeader heading={header.heading} description={header.description} />

          <AIStackGrid cards={cards} />

          <Link href={cta.href} className={styles.cta}>
            <Button variant="primary" size="lg" rightIcon={<CubeIcon />}>
              {cta.label}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
