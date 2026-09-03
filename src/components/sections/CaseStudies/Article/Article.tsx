import clsx from "clsx";
import { PageRibbon } from "@/components/ui/PageRibbon";
import { Hero } from "./Hero";
import { Objectives } from "./Objectives";
import { Solution } from "./Solution";
import { Technology } from "./Technology";
import { Outcome } from "./Outcome";
import { OutcomeSummary } from "./OutcomeSummary";
import { AtAGlance } from "./AtAGlance";
import { WhereItStarted } from "./WhereItStarted";
import { WhatAgivantBuilt } from "./WhatAgivantBuilt";
import { HowItIsBuilt } from "./HowItIsBuilt";
import { ProofAndResults } from "./ProofAndResults";
import { RepeatablePattern } from "./RepeatablePattern";
import { FinalCTA } from "./FinalCTA";
import { Architecture } from "./Architecture";
import type { ArticleProps } from "./types";
import styles from "./Article.module.css";

/**
 * Article (Case Study Inner Page)
 *
 * Orchestrates the Case Study Inner (/case-studies/[slug]) page content:
 * - PageRibbon in the page-level decorative visual layer
 * - Hero
 * - Dynamic sections based on section.type:
 *   - checklist -> Objectives (two-column frosted-glass cards)
 *   - card_grid -> Solution (sequential solution cards with ribbons)
 *   - rich_text -> Technology (technology stack and note)
 *   - stats -> Outcome (numbered outcome cards with highlighted values)
 *   - architecture_diagram -> Architecture (interactive iframe embed or image)
 *
 * Server Component: all content arrives via props from page.tsx (backed by case-study.json).
 */
export function Article(props: ArticleProps) {
  if ("data" in props) {
    const { data } = props;
    const ribbonSrc =
      data.hero.media?.src ?? "/images/case-studies/case-study-ribbon.png";
    const isNewTemplate =
      data.slug === "multi-brand-commerce-migration" ||
      data.sections.some((s) => s.type === "outcome_summary");

    return (
      <div className={styles.article}>
        {/* Page-Level Decorative Ribbon Layer */}
        <PageRibbon
          src={ribbonSrc}
          width={1920}
          height={860}
          className={clsx(
            styles.ribbonWrapper,
            isNewTemplate && styles.ribbonPosition_top
          )}
          imageClassName={styles.ribbonImage}
          priority
        />

        <Hero heading={data.hero.title} description={data.hero.summary ?? ""} />

        {data.sections.map((section) => {
          if (!section.enabled) return null;

          switch (section.type) {
            case "checklist": {
              const challengesCard = section.blocks[0];
              return (
                <Objectives
                  key={section.id}
                  title={section.data.heading ?? "Objectives"}
                  challengesTitle={
                    challengesCard?.title ??
                    section.data.description ??
                    "Challenges"
                  }
                  challenges={challengesCard?.items ?? []}
                />
              );
            }

            case "card_grid": {
              return (
                <Solution
                  key={section.id}
                  title={section.data.heading ?? "Solution"}
                  items={section.blocks.map((block) => ({
                    text: block.body ?? "",
                    ribbon: block.media?.src ?? undefined,
                  }))}
                />
              );
            }

            case "rich_text": {
              const techListBlock =
                section.blocks.find((b) => b.id === "technology-list") ??
                section.blocks[0];
              const techNoteBlock =
                section.blocks.find((b) => b.id === "technology-note") ??
                section.blocks[1];

              return (
                <Technology
                  key={section.id}
                  title={section.data.heading ?? "Technology"}
                  technologies={techListBlock?.body ?? ""}
                  additionalText={techNoteBlock?.body ?? ""}
                />
              );
            }

            case "stats": {
              return (
                <Outcome
                  key={section.id}
                  title={section.data.heading ?? "Outcome"}
                  items={section.blocks.map((block, index) => ({
                    index: String(index + 1).padStart(2, "0"),
                    emphasis: block.value ?? "",
                    text: block.label ?? "",
                  }))}
                />
              );
            }

            case "outcome_summary": {
              return (
                <OutcomeSummary
                  key={section.id}
                  title={section.data.heading ?? "Outcome"}
                  description={section.data.description ?? ""}
                  primaryCta={section.data.primaryCta}
                  secondaryCta={section.data.secondaryCta}
                />
              );
            }

            case "at_a_glance": {
              return (
                <AtAGlance
                  key={section.id}
                  title={section.data.heading ?? "At a glance"}
                  blocks={section.blocks.map((block) => ({
                    id: block.id,
                    title: block.title ?? "",
                    body: block.body ?? "",
                  }))}
                />
              );
            }

            case "where_it_started": {
              const problemCards = section.blocks.filter((b) => b.type === "card");
              const roleBlock = section.blocks.find((b) => b.type === "role_summary");

              return (
                <WhereItStarted
                  key={section.id}
                  title={section.data.heading ?? "Where it started"}
                  description={section.data.description ?? ""}
                  cards={problemCards.map((block) => ({
                    id: block.id,
                    title: block.title ?? "",
                    description: block.body ?? "",
                  }))}
                  role={
                    roleBlock
                      ? {
                          title: roleBlock.title ?? "Agivant’s Role",
                          description: roleBlock.body ?? "",
                        }
                      : undefined
                  }
                />
              );
            }

            case "what_agivant_built": {
              return (
                <WhatAgivantBuilt
                  key={section.id}
                  title={section.data.heading ?? "What Agivant built"}
                  description={section.data.description ?? ""}
                  cards={section.blocks.map((block) => ({
                    id: block.id,
                    title: block.title ?? "",
                    description: block.body ?? "",
                    imageSrc: block.media?.src ?? undefined,
                    imageAlt: block.media?.alt ?? block.title ?? "",
                  }))}
                />
              );
            }

            case "how_it_is_built": {
              const tableBlock = section.blocks.find(
                (b) => b.type === "table" || b.id === "architecture-table"
              );
              const beforeCard = section.blocks.find(
                (b) => b.id === "before-card"
              );
              const afterCard = section.blocks.find(
                (b) => b.id === "after-card"
              );

              const rows =
                (tableBlock as unknown as { rows?: Array<{ id: string; label: string; value: string }> })?.rows ?? [];

              return (
                <HowItIsBuilt
                  key={section.id}
                  title={section.data.heading ?? "How it is built"}
                  rows={rows}
                  beforeCard={
                    beforeCard
                      ? {
                          id: beforeCard.id,
                          title: beforeCard.title ?? "Before",
                          body: beforeCard.body ?? "",
                        }
                      : undefined
                  }
                  afterCard={
                    afterCard
                      ? {
                          id: afterCard.id,
                          title: afterCard.title ?? "After",
                          body: afterCard.body ?? "",
                        }
                      : undefined
                  }
                />
              );
            }

            case "proof_and_results": {
              const subheadingBlock = section.blocks.find(
                (b) => b.type === "subheading_block" || b.id === "measured-results-header"
              );
              const metricBlocks = section.blocks.filter(
                (b) => b.type === "bento_metric"
              );

              return (
                <ProofAndResults
                  key={section.id}
                  title={section.data.heading ?? "Proof in production"}
                  description={section.data.description ?? ""}
                  subheadingBlock={
                    subheadingBlock
                      ? {
                          heading: subheadingBlock.heading ?? "Measured results",
                          description: subheadingBlock.description ?? "",
                        }
                      : undefined
                  }
                  metrics={metricBlocks.map((b) => ({
                    id: b.id,
                    value: b.value ?? "",
                    label: b.label ?? "",
                    variant: (b as unknown as { variant?: "small" | "wide" }).variant,
                  }))}
                />
              );
            }

            case "repeatable_pattern": {
              const cardBlocks = section.blocks.filter(
                (b) => b.type === "card"
              );
              const quoteBlock = section.blocks.find(
                (b) => b.type === "quote_card"
              );
              const movementBlock = section.blocks.find(
                (b) => b.type === "enterprise_movement"
              );

              return (
                <RepeatablePattern
                  key={section.id}
                  title={section.data.heading ?? "The repeatable pattern"}
                  cards={cardBlocks.map((b) => ({
                    id: b.id,
                    title: b.title ?? "",
                    body: b.body ?? "",
                  }))}
                  quote={
                    quoteBlock
                      ? {
                          id: quoteBlock.id,
                          body: quoteBlock.body ?? "",
                          author: (quoteBlock as unknown as { author?: string }).author ?? "",
                        }
                      : undefined
                  }
                  movement={
                    movementBlock
                      ? {
                          heading: movementBlock.heading ?? "Enterprise movement",
                          stages: (movementBlock as unknown as { stages?: Array<{ id: string; label: string; status: "default" | "active" }> }).stages ?? [],
                        }
                      : undefined
                  }
                />
              );
            }

            case "final_cta": {
              return (
                <FinalCTA
                  key={section.id}
                  heading={section.data.heading ?? "Ready to get your enterprise Amp'd?"}
                  description={section.data.description ?? ""}
                  primaryCta={
                    section.data.primaryCta
                      ? {
                          enabled: section.data.primaryCta.enabled,
                          label: section.data.primaryCta.label ?? "Find your Amp'd score",
                          href: section.data.primaryCta.href ?? "/ampd-score",
                          external: section.data.primaryCta.external,
                        }
                      : undefined
                  }
                  secondaryCta={
                    section.data.secondaryCta
                      ? {
                          enabled: section.data.secondaryCta.enabled,
                          label: section.data.secondaryCta.label ?? "Talk to an Amp'd specialist",
                          href: section.data.secondaryCta.href ?? "/contact",
                          external: section.data.secondaryCta.external,
                        }
                      : undefined
                  }
                />
              );
            }

            case "architecture_diagram": {
              const block = section.blocks[0];
              const src = block?.media?.src ?? "";
              const isEmbed = src.endsWith(".html");

              const architectureProp = isEmbed
                ? {
                    type: "iframe" as const,
                    src,
                    title: block?.title ?? "Architecture Diagram",
                  }
                : {
                    type: "image" as const,
                    image: {
                      src,
                      alt: block?.media?.alt ?? "",
                    },
                  };

              return <Architecture key={section.id} {...architectureProp} />;
            }

            default:
              return null;
          }
        })}
      </div>
    );
  }

  return (
    <div className={styles.article}>
      <PageRibbon
        src="/images/case-studies/case-study-ribbon.png"
        width={1920}
        height={860}
        className={styles.ribbonWrapper}
        imageClassName={styles.ribbonImage}
        priority
      />

      <Hero {...props.hero} />
      <Objectives {...props.objectives} />
      <Solution {...props.solution} />
      <Technology {...props.technology} />
      <Outcome {...props.outcome} />
      <Architecture {...props.architecture} />
    </div>
  );
}

