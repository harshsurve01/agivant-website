/**
 * data/lifecycle.ts
 *
 * CMS-ready data access layer for the Lifecycle section.
 * Content resides exclusively in `src/data/homepage.json` under `lifecycle`.
 * No hardcoded copy belongs in this file.
 */

import homepageJson from "./homepage.json";

export interface LifecycleHeaderData {
  eyebrow: string;
  title: {
    highlight: string;
    suffix: string;
  };
  description: string;
}

export interface LifecycleMediaData {
  kind: "image";
  src: string;
  alt: string;
}

export interface LifecycleStage {
  id: string;
  title: string;
  description: string;
  status?: string;
  media: LifecycleMediaData;
}

export interface LifecycleSummaryData {
  title: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
}

function getLifecycleSection() {
  const section = homepageJson.sections.find((s) => s.id === "lifecycle");
  if (!section) {
    throw new Error("Section lifecycle not found in homepage.json");
  }
  return section;
}

export async function getLifecycleHeader(): Promise<LifecycleHeaderData> {
  const section = getLifecycleSection();
  const heading = section.data.heading ?? "";
  const [highlight = "", ...rest] = heading.split(" ");

  return {
    eyebrow: section.data.eyebrow ?? "Traditional SDLC",
    title: {
      highlight,
      suffix: rest.join(" "),
    },
    description: section.data.description ?? "",
  };
}

export async function getLifecycleStages(): Promise<LifecycleStage[]> {
  const section = getLifecycleSection();
  const stageBlocks = (section.blocks as any[]).filter((b) => b.type === "card");

  return stageBlocks.map((block) => ({
    id: block.id,
    title: block.title ?? "",
    description: block.body ?? "",
    status: block.eyebrow ?? "Governed",
    media: {
      kind: (block.media?.kind as "image") ?? "image",
      src: block.media?.src ?? "",
      alt: block.media?.alt ?? "",
    },
  }));
}

export async function getLifecycleSummary(): Promise<LifecycleSummaryData> {
  const section = getLifecycleSection();
  const summaryBlock = (section.blocks as any[]).find((b) => b.id === "lifecycle-summary");

  return {
    title: summaryBlock?.title ?? "Amplify",
    description: summaryBlock?.body ?? "",
    cta: {
      label: summaryBlock?.cta?.label ?? "See Amp'd in action",
      href: summaryBlock?.cta?.href ?? "/amp-d",
    },
  };
}