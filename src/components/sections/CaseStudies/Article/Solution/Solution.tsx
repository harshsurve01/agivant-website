import Image from "next/image";
import { Container } from "@/components/ui/Container";
import styles from "./Solution.module.css";
import type { SolutionProps } from "./types";
import { Gradient } from "@/components/effects/Gradient";

/**
 * Solution (Case Study Inner Page)
 *
 * Renders the Solution section:
 * - Centered "Solution" heading
 * - 5 Solution cards (3 on row one, 2 centered on row two)
 * - Each card contains:
 *   1. Upper ribbon image area (345px height, clipped to card's 35px border radius)
 *   2. Solution body text
 *   3. Purple dotted arrow divider underneath the text
 *
 * Server Component: all content arrives via props.
 */
export function Solution({ title, items }: SolutionProps) {
  return (
    <section className={styles.solution}>
            <Gradient
              kind="linear"
              angle="180deg"
              top="32%"
              left="-25%"
              size="45rem"
              stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
              opacity={0.15}
              blur="90px"
            />
            <Gradient
              top="30%"
              right="20%"
              size="32rem"
              stops={[
                "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
                "transparent 100%",
              ]}
              opacity={0.28}
              blur="60px"
            />
      <Container className={styles.container}>
        <h2 className={styles.title}>{title}</h2>

        <ul className={styles.grid}>
          {items.map((item, index) => {
            const text = typeof item === "string" ? item : item.text;
            const ribbon = typeof item === "string" ? undefined : item.ribbon;

            return (
              <li key={index} className={styles.card}>
                {ribbon ? (
                  <div className={styles.ribbonWrapper}>
                    <Image
                      src={ribbon}
                      alt=""
                      width={401}
                      height={345}
                      className={styles.ribbonImage}
                    />
                  </div>
                ) : null}

                <div className={styles.content}>
                  <p className={styles.text}>{text}</p>
                  <span className={styles.line} aria-hidden="true" />
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
