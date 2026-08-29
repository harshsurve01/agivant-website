import { PageRibbon } from "@/components/ui/PageRibbon";
import { Hero } from "./Hero";
import { Objectives } from "./Objectives";
import { Solution } from "./Solution";
import { Technology } from "./Technology";
import { Outcome } from "./Outcome";
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

    return (
      <div className={styles.article}>
        {/* Page-Level Decorative Ribbon Layer */}
        <PageRibbon
          src={ribbonSrc}
          width={1920}
          height={860}
          className={styles.ribbonWrapper}
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

