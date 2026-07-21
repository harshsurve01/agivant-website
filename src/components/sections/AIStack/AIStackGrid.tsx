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
 * rest auto-flow around it) rather than as data on each card — the
 * Figma's asymmetric layout is a presentation concern, not content,
 * so AIStackCardData carries no position/size field. See
 * data/ai-stack.ts for why card order still matters even though
 * position itself isn't data.
 *
 * Server Component: no "use client", no hooks, no state. It renders
 * AIStackCard (a Client Component) as a child, which is fine — Server
 * Components can render Client Components, just not the reverse.
 */
export function AIStackGrid({ cards }: AIStackGridProps) {
  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.id} className={styles.gridItem}>
          <AIStackCard
            title={card.title}
            description={card.description}
            badge={card.badge}
            backgroundImage={card.backgroundImage}
            accentColor={card.accentColor}
            ribbonPosition={card.ribbonPosition}
          />
        </div>
      ))}
    </div>
  );
}