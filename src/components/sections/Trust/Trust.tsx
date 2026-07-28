import { Container } from "@/components/ui/Container";
import { getTrustCards } from "@/data/trust";
import { TrustCard } from "./TrustCard";
import { TrustProgress } from "./TrustProgress";
import { TrustAnimation } from "./TrustAnimation";
import { Gradient } from "@/components/effects/Gradient";
import styles from "./Trust.module.css";

/**
 * Trust
 *
 * The "Trust Ribbon" section: a stack of enterprise-trust cards with a
 * progress indicator, cycled by a cinematic GSAP + ScrollTrigger
 * sequence (see TrustAnimation).
 *
 * Trust owns overall layout, the stack stage (the element every card
 * shares), spacing, composition, and the data-* attributes the
 * animation layer hooks into. It does NOT own how a card, badge, or
 * progress dot looks — those are TrustCard's, TrustBadge's, and
 * TrustProgress's concerns respectively, each with its own module —
 * and it does NOT own the animation itself, which lives entirely in
 * TrustAnimation as a client-only, DOM-driven layer on top of this
 * markup. Nothing below changed shape to accommodate that layer beyond
 * a few data-* hooks and one new sibling component.
 *
 * All three cards are always in the DOM — via data-active, not a
 * truncated array — so TrustAnimation can transition between them
 * without any markup change, and so the section still renders
 * correctly (card 1 visible) before JS hydrates or with
 * prefers-reduced-motion.
 *
 * Server Component: no "use client", no hooks, no state, no effects.
 * TrustAnimation is the one client boundary, mounted as a sibling.
 */
export async function Trust() {
  const cards = await getTrustCards();

  return (
    <section className={styles.trust} aria-labelledby="trust-heading" data-trust-root>
      {/* Dedicated background layer. TrustAnimation targets it via
          data-trust-glow to drive the ambient glow's accent color as
          the active card changes. */}
      <div className={styles.background} aria-hidden="true" data-trust-glow />

      {/* Static ambient ellipse, top-left — decorative only, does not
          participate in the scroll animation. Portals into the shared
          page-wide GradientLayer instead of being clipped to this
          section. */}
      <Gradient
        top="-100px"
        left="-220px"
        size="640px"
        stops={[
          "color-mix(in srgb, var(--color-bg-gradient-start) 55%, transparent) 0%",
          "transparent 58%",
        ]}
        opacity={1}
        blur="90px"
      />

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

          <div className={styles.progressSlot}>
            <TrustProgress total={cards.length} activeIndex={0} />
          </div>
        </div>
      </Container>

      {/* Behavior-only: renders nothing, drives the DOM above via GSAP. */}
      <TrustAnimation
        totalCards={cards.length}
        accentColors={cards.map((card) => card.accentColor)}
      />
    </section>
  );
}