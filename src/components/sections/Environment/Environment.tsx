import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EnvironmentHeader } from "./EnvironmentHeader";
import { EnvironmentExperience } from "./EnvironmentExperience";
import {
  getEnvironmentHeader,
  getEnvironmentStages,
  getEnvironmentCTA,
} from "@/data/environment";
import { Cube } from "@/components/ui/Icon/Cube";
import styles from "./Environment.module.css";

/**
 * Environment
 *
 * The "What's Inside The Amp'd Build Environment?" section: heading
 * block, the Timeline/Card experience, and a closing CTA. Owns
 * section-level layout, composition, spacing, and data loading — it
 * does not own the heading's content (EnvironmentHeader), the
 * timeline/card synchronization (EnvironmentExperience, the only
 * Client Component in this section), or any single stage's content
 * shape (data/environment.ts).
 *
 * The CTA lives here rather than in EnvironmentHeader or
 * EnvironmentExperience because it isn't part of either — it's static
 * section content (label/href from data), not something driven by
 * active-stage state, so it has no reason to live inside the Client
 * Component boundary. Same reasoning as AIStack's own CTA placement.
 * It's visually aligned under the card column (see .ctaRow in
 * Environment.module.css) via a simple flex right-align rather than a
 * grid synced to EnvironmentExperience's internal column widths — an
 * exact sync would mean either lifting those column widths out of
 * EnvironmentExperience (breaking its ownership of that layout) or
 * duplicating the ratio in two files. The right-align gets visually
 * close without either tradeoff; see the TODO(figma) on .ctaRow.
 *
 * Server Component: no "use client", no hooks, no state, no effects.
 * It's async because it awaits its data sources directly — the same
 * pattern already used by Hero, Lifecycle, and AIStack.
 */
export async function Environment() {
  const [header, stages, cta] = await Promise.all([
    getEnvironmentHeader(),
    getEnvironmentStages(),
    getEnvironmentCTA(),
  ]);

  return (
    <section className={styles.environment}>
      <Container>
        <div className={styles.inner}>
          <EnvironmentHeader heading={header.heading} description={header.description} />

          <EnvironmentExperience stages={stages} />

          <div className={styles.ctaRow}>
            <Link href={cta.href}>
              <Button variant="primary" size="lg" rightIcon={<Cube />}>
                {cta.label}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}