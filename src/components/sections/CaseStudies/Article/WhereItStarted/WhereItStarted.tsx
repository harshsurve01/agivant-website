import { Container } from "@/components/ui/Container";
import { GlassCard } from "../GlassCard";
import type { WhereItStartedProps } from "./types";
import styles from "./WhereItStarted.module.css";
import { Gradient } from "@/components/effects/Gradient";

/**
 * WhereItStarted (Case Study Section 3)
 *
 * Renders Section 3 ("Where it started") for the Case Study detail page:
 * - Section heading ("Where it" in Agivant purple, "started" in black)
 * - Intro paragraph
 * - Two side-by-side glass cards (570px × 285px frame on desktop via shared GlassCard)
 * - Full-width glass container for Agivant's Role
 *
 * Data-driven from JSON blocks. Server Component.
 */
export function WhereItStarted({
  title = "Where it started",
  description,
  cards,
  role,
}: WhereItStartedProps) {
  // Split title: highlight "Where it" in purple, rest in black
  const titleParts = title.startsWith("Where it ")
    ? { highlight: "Where it", rest: title.slice(8) }
    : { highlight: null, rest: title };

  return (
    <section className={styles.whereItStarted}>
       <Gradient
        kind="linear"
        angle="180deg"
        top="-55%"
        right="20%"
        size="40rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
  <Gradient
   kind="linear"
        angle="180deg"
        top="-10%"
        right="20%"
        size="49rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
      <Container className={styles.container}>
        <h2 className={styles.title}>
          {titleParts.highlight ? (
            <>
              <span className={styles.titleHighlight}>{titleParts.highlight}</span>
              {titleParts.rest}
            </>
          ) : (
            title
          )}
        </h2>

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.cardsGrid}>
          {cards.map((card) => (
            <GlassCard
              key={card.id}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        {role && (
          <div className={styles.roleBanner}>
            <h3 className={styles.roleTitle}>{role.title}</h3>
            <p className={styles.roleDescription}>{role.description}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
