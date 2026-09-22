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
}

/**
 * Presentational helper to highlight "Built on the" in purple and keep the rest black.
 * Preserves the heading as ONE single conceptual data field.
 */
function renderHeading(heading: string) {
  const target = "Built on the";
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
  return heading;
}

/**
 * PartnerAgentTeams
 *
 * Reusable horizontal card grid section for Partner pages (Shopify and Databricks).
 *
 * Renders:
 * 1. Heading (with optional vertical accent bar and brand purple accent)
 * 2. Supporting description paragraph
 * 3. 4 Solution/workflow cards arranged horizontally, reusing the Case Study SolutionCard component
 * 4. Optional closing purple statement below the cards
 * 5. Soft ambient glowing gradients positioned behind the content
 *
 * Server Component: all content arrives via props from JSON.
 */
export function PartnerAgentTeams({
  data,
  height = "viewport",
  className,
}: PartnerAgentTeamsProps) {
  const { heading, description, cards, closingStatement } = data;
  const isBuiltOn = heading.startsWith("Built on the");
  const hasAccentBar = !isBuiltOn;

  return (
    <Section
      height={height}
      className={clsx(styles.section, className)}
      id={isBuiltOn ? "built-on-platform" : "partner-agent-teams"}
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
            isBuiltOn && styles.headingWrapperNoBar
          )}
        >
          {hasAccentBar && <span className={styles.accentBar} aria-hidden="true" />}
          <h2
            className={clsx(
              styles.heading,
              isBuiltOn && styles.headingBuiltOn
            )}
          >
            {renderHeading(heading)}
          </h2>
        </div>

        {/* Supporting description */}
        {description && <p className={styles.description}>{description}</p>}

        {/* 4 Cards arranged horizontally reusing Case Study SolutionCard */}
        <div className={styles.grid}>
          {cards.map((card) => (
            <SolutionCard
              key={card.id}
              as="div"
              title={card.title}
              text={card.text}
              ribbon={card.ribbon}
              variant="compact"
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
