import { Container } from "@/components/ui/Container";
import styles from "./Objectives.module.css";
import type { ObjectivesProps } from "./types";
import { Gradient } from "@/components/effects/Gradient";

/**
 * Objectives (Case Study Inner Page)
 *
 * Renders the two-column Objectives/Challenges section that sits
 * below the Hero. Figma: "Case Study Inside Page" → Frame 1707482264
 * (Objectives card) + Frame 1707482265 (Challenges card) — read
 * directly via the Figma MCP connector this pass, not estimated from
 * the screenshot. See Objectives.module.css for exact measurements
 * and the one open question (vertical section padding — see below).
 *
 * Figma shows this section's cards beginning inside the lower part
 * of the Hero (they visually overlap). Per the brief, that overlap is
 * explicitly OUT of scope here — this renders as a normal section in
 * document flow, with no negative margin, absolute positioning,
 * transform, or extra Hero height. Because of that overlap, Figma's
 * own y-position for these cards isn't usable as this section's
 * top/bottom padding in normal flow — the module's vertical rhythm
 * (padding-block) is a reasonable default, not a Figma-sourced value.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. All content arrives via props.
 */
export function Objectives({
  title,
  challengesTitle,
  challenges,
}: ObjectivesProps) {
  return (
    <section className={styles.objectives}>
      <Gradient
                   top="10%"
                   right="25%"
                   size="40rem"
                   stops={["#8500df 50%", "#edbf79 55%", "transparent 75%"]}
                   opacity={0.15}
                   blur="80px"
                 />
           <Gradient
             top="20%"
             left="-18%"
             size="42rem"
             stops={[
               "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
               "transparent 100%",
             ]}
             opacity={0.4}
             blur="60px"
           />
           
          

      <Container className={styles.container}>
        <div className={styles.row}>
          <div className={styles.objectivesCard}>
            <h2 className={styles.objectivesTitle}>{title}</h2>
          </div>

          <div className={styles.challengesCard}>
            <h3 className={styles.challengesTitle}>{challengesTitle}</h3>
            <ul className={styles.challengesList}>
              {challenges.map((challenge) => (
                <li key={challenge} className={styles.challengeItem}>
                  <span className={styles.bullet} aria-hidden="true" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
