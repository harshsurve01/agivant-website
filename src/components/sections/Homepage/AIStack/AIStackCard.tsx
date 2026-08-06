import type { AIStackCardData } from "@/data/ai-stack";
import { AIStackCardShell } from "./AIStackCardShell";
import { layouts } from "./layouts";

interface AIStackCardProps {
  card: AIStackCardData;
}

/**
 * AIStackCard
 *
 * ONLY a resolver. Reads `card.layout`, looks the matching layout
 * component up in the `layouts` registry, and renders it as children
 * inside AIStackCardShell. This is the ONLY place in the section that
 * touches the layout registry — no if(card.id), no switch(card.id),
 * anywhere.
 *
 * Server Component: no "use client", no hooks, no state, no pointer
 * logic, no layout CSS. AIStackCardShell (a Client Component) can't
 * import Server Components itself, which is exactly why this lookup
 * has to happen here rather than inside the shell — see the AIStack
 * implementation prompt's "Why the registry is in AIStackCard"
 * section.
 */
export function AIStackCard({ card }: AIStackCardProps) {
  const Layout = layouts[card.layout];

  return (
    <AIStackCardShell badge={card.badge}>
      <Layout
        title={card.title}
        description={card.description}
        backgroundImage={card.backgroundImage}
        accentColor={card.accentColor}
        ribbonPosition={card.ribbonPosition}
      />
    </AIStackCardShell>
  );
}
