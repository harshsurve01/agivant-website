import { Container } from "@/components/ui/Container";
import type { WhatAgentsDoProps } from "./types";
import styles from "./WhatAgentsDo.module.css";

const HIGHLIGHT_PHRASE = "let them work the tools";

/**
 * Renders the heading with the designated phrase highlighted in brand purple.
 */
function renderHeading(heading: string) {
  if (heading.includes(HIGHLIGHT_PHRASE)) {
    const parts = heading.split(HIGHLIGHT_PHRASE);
    return (
      <>
        {parts[0]}
        <span className={styles.highlight}>{HIGHLIGHT_PHRASE}</span>
        {parts[1] || ""}
      </>
    );
  }
  return heading;
}

/**
 * WhatAgentsDo (Solution Inner Page: /solutions/[slug])
 *
 * Section 02 of the Solution Inner Page:
 * - Centered heading ("Give agents a goal and let them work the tools")
 *   with "let them work the tools" rendered in brand purple.
 * - Centered intro description.
 * - Centered purple uppercase eyebrow: "WHAT THE AGENTS DO".
 * - 2-column responsive grid of horizontal cards matching the exact reference:
 *   - Off-white card surface with rounded corners and subtle shadow.
 *   - Left-notched chevron indentation cut directly into the card silhouette.
 *   - Purple filled right-pointing triangle integrated inside the notch.
 *   - Large, vertically centered text with generous left spacing.
 * - Centered purple closing statement below the grid.
 *
 * Server Component: all data arrives via typed props; no client state.
 */
export function WhatAgentsDo({ data, blocks }: WhatAgentsDoProps) {
  if (!data || !blocks?.length) return null;

  const { heading, description, eyebrow, closingStatement } = data;

  return (
    <section className={styles.section} id="what-agents-do">
      <Container className={styles.container}>
        <header className={styles.header}>
          {heading && (
            <h2 className={styles.heading}>{renderHeading(heading)}</h2>
          )}

          {description && (
            <p className={styles.description}>{description}</p>
          )}

          {eyebrow && (
            <p className={styles.eyebrow}>{eyebrow}</p>
          )}
        </header>

        <div className={styles.grid}>
          {blocks.map((block) => {
            const statement = block.body || block.title;
            if (!statement) return null;

            return (
              <div key={block.id} className={styles.card}>
                {/* Masked card surface with smooth left chevron notch cutout */}
                <div className={styles.cardSurface} aria-hidden="true" />

                {/* Dedicated notch edge layer providing subtle inner shadow along the cutout silhouette */}
                <div className={styles.notchEdge} aria-hidden="true">
                  <svg
                    width="28"
                    height="70"
                    viewBox="0 0 28 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.notchEdgeSvg}
                  >
               
                    <path
                      d="M 0 0 Q 0 9 5 15 L 24 33 Q 27 35 24 37 L 5 55 Q 0 61 0 70"
                      className={styles.notchShadowBlur}
                    />
                    {/* Subtle fine stroke definition along the cut-out edge */}
                    <path
                      d="M 0 0 Q 0 9 5 15 L 24 33 Q 27 35 24 37 L 5 55 Q 0 61 0 70"
                      className={styles.notchShadowFine}
                    />
                  </svg>
                </div>

                {/* Purple right-pointing triangle integrated inside the notch */}
                <div className={styles.triangleWrapper} aria-hidden="true">
                  <svg
                    width="18"
                    height="34"
                    viewBox="0 0 18 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.triangleSvg}
                  >
                    <polygon
                      points="0,0 18,17 0,34"
                      fill="var(--color-brand-primary, #8500DF)"
                      stroke="#00000000"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Card statement text */}
                <p className={styles.cardText}>{statement}</p>
              </div>
            );
          })}
        </div>

        {closingStatement && (
          <p className={styles.closingStatement}>{closingStatement}</p>
        )}
      </Container>
    </section>
  );
}
