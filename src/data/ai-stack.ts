/**
 * data/ai-stack.ts
 *
 * CMS-ready data access layer for the AIStack section.
 * Content resides exclusively in `src/data/homepage.json` under `ai-stack`.
 * No hardcoded copy belongs in this file.
 */

import homepageJson from "./homepage.json";

export interface AIStackHeaderData {
  heading: {
    line1: string;
    line2Prefix: string;
    highlight: string;
  };
  description: string;
}

export type AIStackCardLayout = "agentic" | "aiml" | "cloud" | "data" | "mlops";

export interface AIStackCardData {
  id: string;
  title: string;
  description: string;
  badge: string;
  backgroundImage: string;
  accentColor: string;
  ribbonPosition?: string;
  layout: AIStackCardLayout;
}

export interface AIStackCTAData {
  label: string;
  href: string;
}

function getAIStackSection() {
  const section = homepageJson.sections.find((s) => s.id === "ai-stack");
  if (!section) {
    throw new Error("Section ai-stack not found in homepage.json");
  }
  return section;
}

export async function getAIStackHeader(): Promise<AIStackHeaderData> {
  const section = getAIStackSection();
  const heading = section.data.heading ?? "";
  const [line1 = "", highlight = ""] = heading.split(/<br\s*\/?>/i);

  return {
    heading: {
      line1: line1.trim(),
      line2Prefix: "",
      highlight: highlight.trim(),
    },
    description: section.data.description ?? "",
  };
}

export async function getAIStackCards(): Promise<AIStackCardData[]> {
  const section = getAIStackSection();

  return (section.blocks as any[]).map((block) => ({
    id: block.id,
    title: block.title ?? "",
    description: block.body ?? "",
    badge: block.eyebrow ?? "",
    backgroundImage: block.media?.src ?? "",
    accentColor: "#7c3aed",
    layout: (block.items?.[0] as AIStackCardLayout) ?? "agentic",
  }));
}

export async function getAIStackCTA(): Promise<AIStackCTAData> {
  const section = getAIStackSection();

  return {
    label: section.data.cta?.label ?? "See what we build",
    href: section.data.cta?.href ?? "/what-we-build",
  };
}
