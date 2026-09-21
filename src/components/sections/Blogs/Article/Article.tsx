import { Hero } from "./Hero";
import { ExecutiveBrief } from "./ExecutiveBrief";
import { Phase1 } from "./Phase1";
import { Phase2 } from "./Phase2";
import { Phase3 } from "./Phase3";
import { Phase4 } from "./Phase4";
import { Conclusion } from "./Conclusion";
import { SplitContent } from "./SplitContent";
import { ImpactTable } from "@/components/sections/Solutions/Article/ImpactTable";
import { EnterpriseAIPillar } from "./EnterpriseAIPillar";
import type { ArticleProps } from "./types";
import type { ArticleHeroProps } from "./Hero";
import type { ImpactTableProps } from "@/components/sections/Solutions/Article/ImpactTable";
import type { Phase1Props } from "./Phase1/types";

/**
 * Article
 *
 * Orchestrates the Blog Inner (/blogs/[slug]) page content:
 * - When passed `props.data` (BlogDetailPage), dynamically dispatches sections
 *   according to section.id and section.type backed by JSON schema.
 * - Retains full backwards compatibility if passed legacy ArticlePageData props.
 *
 * Server Component: no "use client", no hooks, no state, no data imports.
 * All data arrives via props from page.tsx.
 */
export function Article(props: ArticleProps) {
  if ("data" in props) {
    const { data } = props;

    const heroProps: ArticleHeroProps = {
      title: data.hero.title,
      date: data.hero.date ?? "May 26, 2026",
      readTime: data.hero.readTime ?? data.readTime ?? "4 mins",
      authors: (data.hero.authors ?? []).map((a) => ({
        name: a.name,
        role: a.role ?? "",
      })),
      ribbonSrc: data.hero.media?.src ?? undefined,
      slug: data.slug,
    };

    return (
      <>
        <Hero {...heroProps} />

        {data.sections.map((section) => {
          if (!section.enabled) return null;

          switch (section.id) {
            case "executive-brief": {
              const paragraphs = section.blocks
                .flatMap((b) => (b.body ? b.body.split(/\n\s*\n/) : []))
                .filter(Boolean);
              if (paragraphs.length === 0 && section.data.description) {
                paragraphs.push(section.data.description);
              }
              return (
                <ExecutiveBrief
                  key={section.id}
                  id={section.id}
                  title={section.data.heading ?? "Executive Brief"}
                  paragraphs={paragraphs}
                />
              );
            }

            case "baselines": {
              const cards = section.blocks.map((b) => ({
                title: b.title ?? "",
                description: b.body ?? b.description ?? "",
              }));
              return (
                <Phase1
                  key={section.id}
                  eyebrow={section.data.eyebrow}
                  title={section.data.heading ?? "Establishing Baselines"}
                  description={section.data.description}
                  cards={cards}
                />
              );
            }

            case "agentic-ai-definition": {
              const cards = section.blocks.map((b) => ({
                title: b.title ?? "",
                description: b.body ?? b.description ?? "",
              }));
              return (
                <Phase1
                  key={section.id}
                  eyebrow={section.data.eyebrow}
                  title={section.data.heading ?? "What Exactly is Agentic AI?"}
                  description={section.data.description}
                  cards={cards}
                  columns={3}
                  ribbonSrc={null}
                  highlightPosition="end"
                  highlightCount={2}
                  closingParagraph={
                    (section.data.closingParagraph as string) ?? null
                  }
                />
              );
            }

            case "enterprise-grade-meaning": {
              const cards = section.blocks.map((b) => ({
                title: b.title ?? "",
                description: b.body ?? b.description ?? "",
              }));
              return (
                <Phase1
                  key={section.id}
                  eyebrow={section.data.eyebrow}
                  title={
                    section.data.heading ??
                    'What Does "Enterprise-Grade AI" Actually Mean'
                  }
                  description={section.data.description}
                  cards={cards}
                  columns={3}
                  ribbonSrc={null}
                  highlightPosition="end"
                  highlightCount={4}
                  closingParagraph={
                    (section.data.closingParagraph as string | null | undefined) ??
                    null
                  }
                />
              );
            }

            case "coordination-cost": {
              const content = section.blocks
                .flatMap((b) => (b.body ? b.body.split(/\n\s*\n/) : []))
                .filter(Boolean);
              if (content.length === 0 && section.data.description) {
                content.push(section.data.description);
              }
              const image = section.data.media?.src
                ? {
                    src: section.data.media.src,
                    alt: section.data.media.alt,
                  }
                : null;

              return (
                <SplitContent
                  key={section.id}
                  eyebrow={section.data.eyebrow}
                  title={section.data.heading ?? ""}
                  content={content}
                  image={image}
                  highlightPosition={
                    (section.data.highlightPosition as
                      | "start"
                      | "end"
                      | "colon"
                      | undefined) ?? "colon"
                  }
                  highlightCount={
                    (section.data.highlightCount as number | undefined)
                  }
                />
              );
            }

            case "agivant-framework": {
              const items = section.blocks.map((b, idx) => ({
                index:
                  (b.index as string) ??
                  String(b.number ?? idx + 1).padStart(2, "0"),
                title: b.title ?? "",
                description: b.body ?? b.description ?? "",
              }));
              return (
                <Phase2
                  key={section.id}
                  eyebrow={section.data.eyebrow}
                  title={
                    section.data.heading ??
                    "The Agivant Framework: Autonomy From Design to Deployment"
                  }
                  description={section.data.description ?? ""}
                  items={items}
                  highlightPosition={
                    (section.data.highlightPosition as
                      | "start"
                      | "end"
                      | "colon"
                      | undefined) ?? "colon"
                  }
                  highlightCount={
                    (section.data.highlightCount as number | undefined)
                  }
                />
              );
            }

            case "commerce-use-cases": {
              const cards = section.blocks.map((b) => ({
                title: b.title ?? "",
                description: b.body ?? b.description ?? "",
              }));
              return (
                <Phase1
                  key={section.id}
                  eyebrow={section.data.eyebrow}
                  title={section.data.heading ?? "Real-World Commerce Use Cases"}
                  description={section.data.description}
                  cards={cards}
                  columns={3}
                  ribbonSrc={null}
                  highlightPosition={
                    (section.data.highlightPosition as "start" | "end" | undefined) ?? "start"
                  }
                  highlightCount={
                    (section.data.highlightCount as number | undefined) ?? 1
                  }
                  closingParagraph={
                    (section.data.closingParagraph as string) ?? null
                  }
                />
              );
            }

            case "experiments": {
              const items = section.blocks.map((b, idx) => ({
                index:
                  (b.index as string) ??
                  String(b.number ?? idx + 1).padStart(2, "0"),
                title: b.title ?? "",
                description: b.body ?? b.description ?? "",
              }));
              return (
                <Phase2
                  key={section.id}
                  eyebrow={section.data.eyebrow}
                  title={section.data.heading ?? "Running Proper Experiments"}
                  description={section.data.description ?? ""}
                  items={items}
                />
              );
            }

            case "instrumentation": {
              const cards = section.blocks.map((b) => ({
                title: b.title ?? "",
                description: b.body ?? b.description ?? "",
              }));
              return (
                <Phase3
                  key={section.id}
                  eyebrow={section.data.eyebrow}
                  title={
                    section.data.heading ?? "End-to-End Instrumentation Strategy"
                  }
                  description={section.data.description ?? ""}
                  cards={cards}
                />
              );
            }

            case "cfo-language": {
              const caseStudies = section.blocks.map((b) => ({
                title: b.title ?? "",
                insteadLabel:
                  (b.insteadLabel as string) ?? "Instead of saying:",
                insteadText: (b.insteadText as string) ?? "",
                sayLabel: (b.sayLabel as string) ?? "Say:",
                sayText: (b.sayText as string) ?? "",
                image: b.media?.src ?? undefined,
              }));
              return (
                <Phase4
                  key={section.id}
                  eyebrow={section.data.eyebrow}
                  title={section.data.heading ?? "Reporting in CFO Language"}
                  description={section.data.description ?? ""}
                  emphasis={(section.data.emphasis as string) ?? ""}
                  caseStudies={caseStudies}
                />
              );
            }

            case "conclusion": {
              const paragraphs = section.blocks
                .flatMap((b) => (b.body ? b.body.split(/\n\s*\n/) : []))
                .filter(Boolean);
              if (paragraphs.length === 0 && section.data.description) {
                paragraphs.push(section.data.description);
              }
              return (
                <Conclusion
                  key={section.id}
                  title={section.data.heading ?? "Conclusion"}
                  paragraphs={paragraphs}
                  quote={(section.data.quote as string) ?? undefined}
                />
              );
            }

            default: {
              if (section.id.startsWith("pillar-") || section.type === "pillar") {
                const problemBlock =
                  section.blocks.find(
                    (b) =>
                      b.id.endsWith("-problem") ||
                      b.type === "problem" ||
                      b.title?.toLowerCase().includes("problem")
                  ) ?? section.blocks[0];

                const whyBlock = section.blocks.find(
                  (b) =>
                    b.id.endsWith("-meaning") ||
                    b.id.endsWith("-why") ||
                    b.id.endsWith("-why-it-matters") ||
                    b.type === "why_it_matters" ||
                    b.title?.toLowerCase().includes("why it matters") ||
                    b.title?.toLowerCase().includes("what it means")
                );

                const implBlock = section.blocks.find(
                  (b) =>
                    b.id.endsWith("-implementation") ||
                    b.type === "implementation" ||
                    b.title?.toLowerCase().includes("implementation")
                );

                const povBlock = section.blocks.find(
                  (b) =>
                    b.id.endsWith("-mvp") ||
                    b.id.endsWith("-pov") ||
                    b.type === "pov" ||
                    b.title?.toLowerCase().includes("pov") ||
                    b.title?.toLowerCase().includes("mvp")
                );

                const sectionTitle =
                  (section.data.sectionTitle as string | undefined) ??
                  (section.id === "pillar-1"
                    ? "The 6 Pillars of Enterprise-Grade AI"
                    : null);

                return (
                  <EnterpriseAIPillar
                    key={section.id}
                    id={section.id}
                    sectionTitle={sectionTitle}
                    title={section.data.heading ?? ""}
                    problemLayout={
                      (section.data.problemLayout as "split" | "full" | undefined) ??
                      (whyBlock?.body ? "split" : "full")
                    }
                    problem={{
                      label: problemBlock?.title ?? "The problem",
                      content: problemBlock?.body ?? problemBlock?.description ?? "",
                    }}
                    whyItMatters={
                      whyBlock && (whyBlock.body || whyBlock.description)
                        ? {
                            label: whyBlock.title ?? "Why it matters",
                            content: whyBlock.body ?? whyBlock.description ?? "",
                          }
                        : null
                    }
                    implementation={{
                      label: implBlock?.title ?? "Enterprise Implementation",
                      items: implBlock?.items ?? [],
                      content: implBlock?.body ?? implBlock?.description ?? undefined,
                      ribbonSrc: implBlock?.media?.src,
                      ribbonAlt: implBlock?.media?.alt ?? undefined,
                    }}
                    pov={{
                      label: povBlock?.title ?? "Agivant POV",
                      content: povBlock?.body ?? povBlock?.description ?? "",
                      ribbonSrc: povBlock?.media?.src,
                      ribbonAlt: povBlock?.media?.alt ?? undefined,
                    }}
                  />
                );
              }

              switch (section.type) {
                case "card_grid": {
                  const cards = section.blocks.map((b) => ({
                    title: b.title ?? "",
                    description: b.body ?? b.description ?? "",
                  }));
                  const cols =
                    ((section.data.columns as unknown) === 3 ||
                      section.data.columnCount === 3)
                      ? 3
                      : 2;
                  return (
                    <Phase1
                      key={section.id}
                      eyebrow={section.data.eyebrow}
                      title={section.data.heading ?? ""}
                      description={section.data.description}
                      cards={cards}
                      columns={cols}
                      ribbonSrc={(section.data.ribbonSrc as string | null | undefined)}
                      highlightPosition={
                        section.data.highlightPosition as Phase1Props["highlightPosition"]
                      }
                      highlightCount={(section.data.highlightCount as number | undefined)}
                      highlightStartIndex={
                        (section.data.highlightStartIndex as number | undefined) ??
                        (section.data.highlightStart as number | undefined)
                      }
                      closingParagraph={(section.data.closingParagraph as string | null | undefined)}
                    />
                  );
                }

                case "numbered_list": {
                  const items = section.blocks.map((b, idx) => ({
                    index:
                      (b.index as string) ??
                      String(b.number ?? idx + 1).padStart(2, "0"),
                    title: b.title ?? "",
                    description: b.body ?? b.description ?? "",
                  }));
                  return (
                    <Phase2
                      key={section.id}
                      eyebrow={section.data.eyebrow}
                      title={section.data.heading ?? ""}
                      description={section.data.description ?? ""}
                      items={items}
                      highlightPosition={
                        (section.data.highlightPosition as
                          | "start"
                          | "end"
                          | "colon"
                          | undefined)
                      }
                      highlightCount={
                        (section.data.highlightCount as number | undefined)
                      }
                    />
                  );

                }

                case "comparison_table": {
                  return (
                    <ImpactTable
                      key={section.id}
                      data={section.data as unknown as ImpactTableProps["data"]}
                      blocks={section.blocks as unknown as ImpactTableProps["blocks"]}
                    />
                  );
                }

                case "split_content": {
                  const content = section.blocks
                    .flatMap((b) => (b.body ? b.body.split(/\n\s*\n/) : []))
                    .filter(Boolean);
                  if (content.length === 0 && section.data.description) {
                    content.push(section.data.description);
                  }
                  const image = section.data.media?.src
                    ? {
                        src: section.data.media.src,
                        alt: section.data.media.alt,
                      }
                    : null;

                  return (
                    <SplitContent
                      key={section.id}
                      eyebrow={section.data.eyebrow}
                      title={section.data.heading ?? ""}
                      content={content}
                      image={image}
                      highlightPosition={
                        (section.data.highlightPosition as
                          | "start"
                          | "end"
                          | "colon"
                          | undefined) ?? "colon"
                      }
                      highlightCount={
                        (section.data.highlightCount as number | undefined)
                      }
                    />
                  );
                }

                case "rich_text":
                default: {
                  const isConclusion = section.id
                    .toLowerCase()
                    .includes("conclusion");
                  const paragraphs = section.blocks
                    .flatMap((b) => (b.body ? b.body.split(/\n\s*\n/) : []))
                    .filter(Boolean);
                  if (paragraphs.length === 0 && section.data.description) {
                    paragraphs.push(section.data.description);
                  }

                  if (isConclusion) {
                    return (
                      <Conclusion
                        key={section.id}
                        title={section.data.heading ?? "Conclusion"}
                        paragraphs={paragraphs}
                        quote={(section.data.quote as string) ?? undefined}
                      />
                    );
                  }

                  const isPilotReality = section.id === "pilot-reality";
                  const isExecutiveBrief =
                    section.id === "executive-brief" || isPilotReality;
                  const showBar =
                    (section.data.showBar as boolean | undefined) ??
                    isExecutiveBrief;
                  const spacing =
                    (section.data.spacing as "hero" | "standard" | undefined) ??
                    (isExecutiveBrief ? "hero" : "standard");
                  const highlightPosition =
                    (section.data.highlightPosition as
                      | "start"
                      | "end"
                      | "colon"
                      | undefined) ??
                    (isPilotReality ? "start" : undefined);
                  const highlightCount =
                    (section.data.highlightCount as number | undefined) ??
                    (isPilotReality ? 4 : undefined);

                  return (
                    <ExecutiveBrief
                      key={section.id}
                      id={section.id}
                      title={section.data.heading ?? "Overview"}
                      paragraphs={paragraphs}
                      showBar={showBar}
                      spacing={spacing}
                      highlightPosition={highlightPosition}
                      highlightCount={highlightCount}
                    />
                  );
                }
              }
            }
          }
        })}
      </>
    );
  }

  // Legacy ArticlePageData fallback
  return (
    <>
      <Hero {...props.hero} />
      <ExecutiveBrief {...props.executiveBrief} />
      <Phase1 {...props.phase1} />
      <Phase2 {...props.phase2} />
      <Phase3 {...props.phase3} />
      <Phase4 {...props.phase4} />
      <Conclusion {...props.conclusion} />
    </>
  );
}
