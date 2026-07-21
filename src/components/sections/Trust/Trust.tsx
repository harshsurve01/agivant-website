import { Container } from "@/components/ui/Container";
import { getTrustCards } from "@/data/trust";
import { TrustCard } from "./TrustCard";
import { TrustProgress } from "./TrustProgress";
import styles from "./Trust.module.css";

/**
 * Trust
 *
 * The "Trust Ribbon" section: a stack of enterprise-trust cards with a
 * progress indicator, designed as the structural foundation for a
 * future GSAP cinematic sequence that cycles through the stack.
 *
 * Trust owns overall layout, the stack stage (the element every card
 * shares), spacing, composition, and the data-* attributes a future
 * animation will hook into. It does NOT own how a card, badge, or
 * progress dot looks — those are TrustCard's, TrustBadge's, and
 * TrustProgress's concerns respectively, each with its own module.
 *
 * Only the first card is active today (static, no animation). The
 * other two are already in the DOM — via data-active, not a truncated
 * array — so a later GSAP pass can transition between them without
 * any markup change.
 *
 * Server Component: no "use client", no hooks, no state, no effects.
 */
export async function Trust() {
  const cards = await getTrustCards();

  return (
    <section className={styles.trust} aria-labelledby="trust-heading">
      {/* Dedicated background layer: exists only so a future GSAP pass
          has somewhere to put the Figma's blurred glow/gradient. Left
          unstyled beyond positioning rather than guessed at. */}
      <div className={styles.background} aria-hidden="true" />

      <Container size="2xl">
        <h2 id="trust-heading" className={styles.srOnly}>
          Enterprise Trust
        </h2>

        <div className={styles.layout}>
          <div className={styles.stackStage} data-trust-stack>
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={styles.stackItem}
                data-trust-stack-item
                data-stack-index={index}
                data-active={index === 0}
              >
                <TrustCard
                  title={card.title}
                  description={card.description}
                  badge={card.badge}
                  accentColor={card.accentColor}
                />
              </div>
            ))}
          </div>

          <TrustProgress total={cards.length} activeIndex={0} />
        </div>
      </Container>
    </section>
  );
}