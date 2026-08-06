import { AIStackCard } from "./AIStackCard";
import type { AIStackCardData } from "@/data/ai-stack";
import styles from "./AIStackGrid.module.css";

interface AIStackGridProps {
  cards: AIStackCardData[];
}

/**
 * AIStackGrid
 *
 * Owns the section's bento-style responsive grid and where each card
 * lands in it. Placement is done entirely in CSS (see
 * AIStackGrid.module.css: the first grid item spans two rows, the
 * rest auto-flow around it) rather than as data on each card — see
 * data/ai-stack.ts for why card order still matters even though
 * position itself isn't data.
 *
 * Passes each full `card` object straight through to AIStackCard
 * (the server resolver) rather than destructuring individual props
 * here — AIStackCard is what decides which fields a given layout
 * actually needs, and this component has no business knowing that.
 *
 * Server Component: no "use client", no hooks, no state. It renders
 * AIStackCard, which itself renders AIStackCardShell (a Client
 * Component) — Server Components can render Client Components, just
 * not the reverse.
 */
export function AIStackGrid({ cards }: AIStackGridProps) {
  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.id} className={styles.gridItem}>
          <AIStackCard card={card} />
        </div>
      ))}
    </div>
  );
}
