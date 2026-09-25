import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Section, type SectionHeight } from "@/components/ui/Section";
import { Gradient } from "@/components/effects/Gradient";
import { SolutionCard } from "@/components/sections/CaseStudies/Article/Solution";
import type { PartnerAgentTeamsData } from "@/types/partnerDetail";
import styles from "./PartnerAgentTeams.module.css";

export interface PartnerAgentTeamsProps {
  data: PartnerAgentTeamsData;
  height?: SectionHeight;
  className?: string;
  id?: string;
  /** Desktop column count. Defaults to 4; tablet/mobile breakpoints are unchanged. */
  columns?: 3 | 4;
  /** Header alignment. "center" centers heading + description and hides the accent bar. Defaults to "left". */
  align?: "left" | "center";
  /** Adds a subtle lift (2px up + shadow) on card hover. Defaults to false. */
  hoverable?: boolean;
  /** Enforces NVIDIA page typography rules: 4xl heading, xl card title, lg body. */
  nvidiaTypography?: boolean;
  /** Hides the vertical accent bar beside a left-aligned heading. Defaults to false. */
  hideAccentBar?: boolean;
  /** Renders the first N words of the heading in purple and the rest in the primary text colour. Unset keeps the existing heading treatment. */
  headingHighlightWords?: number;
}

/**
 * Presentational helper to highlight designated phrase in purple and keep the rest black.
 * Preserves the heading as ONE single conceptual data field.
 */
function renderHeading(heading: string, highlightWords?: number) {
  if (highlightWords && highlightWords > 0) {
    const words = heading.split(" ");
    return (
      <>
        <span className={styles.headingHighlight}>
          {words.slice(0, highlightWords).join(" ")}
        </span>{" "}
        <span className={styles.headingRest}>
          {words.slice(highlightWords).join(" ")}
        </span>
      </>
    );
  }
  const targets = ["Built on the", "More connected-data", "Market"];
  for (const target of targets) {
    if (heading.startsWith(target)) {
      return (
        <>
          <span className={styles.headingHighlight}>{target}</span>{" "}
          <span className={styles.headingRest}>
            {heading.slice(target.length).trim()}
          </span>
        </>
      );
    }
  }
  return heading;
}

/**
 * PartnerAgentTeams
 *
 * Reusable horizontal card grid section for Partner pages (Shopify, Databricks, Salesforce, TigerGraph, NVIDIA).
 *
 * Renders:
 * 1. Heading (with optional vertical accent bar and brand purple accent)
 * 2. Supporting description paragraph
 * 3. 3 or 4 Solution/workflow cards arranged horizontally, reusing the Case Study SolutionCard component
 * 4. Optional closing purple statement below the cards
 * 5. Soft ambient glowing gradients positioned behind the content
 *
 * Server Component: all content arrives via props from JSON.
 */
export function PartnerAgentTeams({
  data,
  height = "viewport",
  className,
  id,
  columns = 4,
  align = "left",
  hoverable = false,
  nvidiaTypography = false,
  hideAccentBar = false,
  headingHighlightWords,
}: PartnerAgentTeamsProps) {
  const { heading, description, cards, closingStatement } = data;
  const isBuiltOn = heading.startsWith("Built on the");
  const isMoreConnected = heading.startsWith("More connected-data");
  const isMarket = heading.startsWith("Market");
  const isCentered = align === "center";
  const hasAccentBar =
    !isBuiltOn && !isMoreConnected && !isMarket && !isCentered && !hideAccentBar;

  return (
    <Section
      height={height}
      className={clsx(styles.section, className)}
      id={id ?? (isBuiltOn ? "built-on-platform" : isMarket ? "market-validation" : "partner-agent-teams")}
    >
      {/* Soft ambient background gradients positioned behind content */}
      <Gradient
        kind="linear"
        angle="180deg"
        top="55%"
        left="-20%"
        size="38rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.12}
        blur="90px"
      />
      <Gradient
        top="20%"
        right="-12%"
        size="34rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.28}
        blur="75px"
      />

      <Container size="xl" className={styles.container}>
        {/* Heading with vertical accent bar (if applicable) */}
        <div
          className={clsx(
            styles.headingWrapper,
            (isBuiltOn || isMoreConnected || isMarket || hideAccentBar) &&
              styles.headingWrapperNoBar,
            isCentered && styles.headingWrapperCentered
          )}
        >
          {hasAccentBar && <span className={styles.accentBar} aria-hidden="true" />}
          <h2
            className={clsx(
              styles.heading,
              (isBuiltOn || isMoreConnected || isMarket) && styles.headingBuiltOn
            )}
          >
            {renderHeading(heading, headingHighlightWords)}
          </h2>
        </div>

        {/* Supporting description */}
        {description && (
          <p
            className={clsx(
              styles.description,
              isCentered && styles.descriptionCentered
            )}
          >
            {description}
          </p>
        )}

        {/* 4 Cards arranged horizontally reusing Case Study SolutionCard */}
        <div className={clsx(styles.grid, columns === 3 && styles.grid3)}>
          {cards.map((card) => (
            <SolutionCard
              key={card.id}
              as="div"
              title={card.title}
              text={card.text}
              ribbon={card.ribbon}
              variant="compact"
              className={clsx(
                hoverable && styles.cardHoverable,
                nvidiaTypography && styles.nvidiaCard
              )}
            />
          ))}
        </div>

        {/* Closing purple statement */}
        {closingStatement && (
          <p
            className={clsx(
              styles.closingStatement,
              isBuiltOn && styles.closingStatementProminent
            )}
          >
            {closingStatement}
          </p>
        )}
      </Container>
    </Section>
  );
}
