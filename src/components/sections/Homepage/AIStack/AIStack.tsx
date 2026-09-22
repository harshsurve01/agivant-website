import clsx from "clsx";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AIStackHeader } from "./AIStackHeader";
import { AIStackGrid } from "./AIStackGrid";
import {
  getAIStackHeader,
  getAIStackCards,
  getAIStackCTA,
  type AIStackCardData,
  type AIStackHeaderData,
} from "@/data/ai-stack";
// SVGR pattern matching Hero.tsx — see that file's comment for why
// this is imported as a component rather than a static asset URL.
import CubeIcon from "@/assets/icons/cube.svg";
import { Gradient } from "@/components/effects/Gradient";
import styles from "./AIStack.module.css";

export interface AIStackProps {
  heading?: string | AIStackHeaderData["heading"];
  description?: string | null;
  cards?: AIStackCardData[];
  showCta?: boolean;
  variant?: "default" | "service";
  gridVariant?: "default" | "service";
  className?: string;
}

/**
 * AIStack
 *
 * Reusable AI Stack Bento section used on:
 * 1. Homepage: "Engineering Every Layer Of Your AI Stack" (cards loaded from homepage.json with closing CTA)
 * 2. Service Inner Pages: "Foundation For The Agentic Enterprise" (cards passed via props, no CTA)
 *
 * Server Component: all data arrives via props or default async loaders; no client state.
 */
export async function AIStack({
  heading: propHeading,
  description: propDescription,
  cards: propCards,
  showCta: propShowCta,
  variant = "default",
  gridVariant,
  className,
}: AIStackProps = {}) {
  const isHomepage = !propCards;
  const effectiveGridVariant = gridVariant ?? (variant === "service" ? "service" : "default");

  const [header, defaultCards, cta] = isHomepage
    ? await Promise.all([
        getAIStackHeader(),
        getAIStackCards(),
        getAIStackCTA(),
      ])
    : [null, [], null];

  const resolvedHeading = propHeading ?? header?.heading ?? "";
  const resolvedDescription =
    propDescription !== undefined ? propDescription : header?.description ?? "";
  const resolvedCards = propCards ?? defaultCards;
  const showCta = propShowCta !== undefined ? propShowCta : isHomepage;

  return (
    <section
      className={clsx(
        styles.aiStack,
        variant === "service" && styles.serviceVariant,
        className
      )}
    >
      <Gradient
        top="5%"
        right="15%"
        size="65rem"
        stops={["#8500df 50%", "#edbf79 85%", "transparent 100%"]}
        opacity={0.15}
        blur="30px"
      />
      <Gradient
        kind="linear"
        angle="180deg"
        top="50%"
        left="-15%"
        size="30rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.5}
        blur="60px"
      />
      <Container>
        <div className={styles.inner}>
          <AIStackHeader
            heading={resolvedHeading}
            description={resolvedDescription}
          />

          <AIStackGrid cards={resolvedCards} variant={effectiveGridVariant} />

          {showCta && cta && (
            <Link href={cta.href} className={styles.cta}>
              <Button variant="primary" size="lg" rightIcon={<CubeIcon />}>
                {cta.label}
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
