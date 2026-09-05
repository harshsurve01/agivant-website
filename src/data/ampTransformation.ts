/**
 * data/ampTransformation.ts
 *
 * CMS-ready data access layer for the "What Changes When Your Enterprise Gets Amp'd?" section.
 * Content resides exclusively in `src/data/homepage.json` under `amp-transformation`.
 * No hardcoded copy belongs in this file.
 */

import homepageJson from "./homepage.json";

export interface AmpHeaderData {
  heading: {
    line1: string;
    line2Prefix: string;
    highlight: string;
  };
  description: {
    highlight: string;
    body: string;
  };
}

export interface AmpCardData {
  id: string;
  title: string;
}

export interface AmpColumnData {
  title: string;
  label?: string;
  cards: AmpCardData[];
}

export interface AmpHubData {
  brand: {
    lead: string;
    body: string;
    highlight: string;
    logoSrc?: string;
    logoAlt?: string;
  };
  leftConnectors: number;
  rightConnectors: number;
}

export interface AmpStatementData {
  prefix: string;
  highlight: string;
}

export interface AmpProgressStage {
  id: string;
  title: string;
  description: string;
}

export interface AmpProgressCTAData {
  label: string;
  href: string;
}

export interface AmpProgressData {
  title: string;
  stages: AmpProgressStage[];
  button?: AmpProgressCTAData;
}

function getAmpSection() {
  const section = homepageJson.sections.find((s) => s.id === "amp-transformation");
  if (!section) {
    throw new Error("Section amp-transformation not found in homepage.json");
  }
  return section;
}

export async function getAmpHeader(): Promise<AmpHeaderData> {
  const section = getAmpSection();
  const headingStr = section.data.heading ?? "";
  const [line1 = "", rest = ""] = headingStr.split(/<br\s*\/?>/i);

  // Description is split into highlight and body for presentation styling
  const descStr = section.data.description ?? "";
  const match = descStr.match(/^(Amp'd is how Agivant delivers real business value)\s*(.*)$/);
  const highlight = match ? match[1] : descStr;
  const body = match ? match[2] : "";

  return {
    heading: {
      line1: line1.trim(),
      line2Prefix: "",
      highlight: rest.trim(),
    },
    description: {
      highlight,
      body,
    },
  };
}

export async function getAmpLeftColumn(): Promise<AmpColumnData> {
  const section = getAmpSection();
  const block = section.blocks.find((b) => b.id === "amp-left-column") as any;
  const items = (block?.items ?? []) as AmpCardData[];

  return {
    title: "",
    label: block?.title ?? "Agivant's Advantage",
    cards: items.map((card) => ({
      id: card.id,
      title: card.title,
    })),
  };
}

export async function getAmpHub(): Promise<AmpHubData> {
  const section = getAmpSection();
  const block = section.blocks.find((b) => b.id === "amp-hub") as any;

  return {
    brand: {
      lead: "A",
      body: "mp",
      highlight: "'d",
      logoSrc: block?.media?.src ?? "/images/hero/ampd-wordmark.svg",
      logoAlt: block?.media?.alt ?? "Amp'd",
    },
    leftConnectors: 4,
    rightConnectors: 4,
  };
}

export async function getAmpRightColumn(): Promise<AmpColumnData> {
  const section = getAmpSection();
  const block = section.blocks.find((b) => b.id === "amp-right-column") as any;
  const items = (block?.items ?? []) as AmpCardData[];

  return {
    title: "",
    label: block?.title ?? "Enterprise Outcome",
    cards: items.map((card) => ({
      id: card.id,
      title: card.title,
    })),
  };
}

export async function getAmpStatement(): Promise<AmpStatementData> {
  const section = getAmpSection();
  const statementStr = section.data.closingStatement ?? "";
  const match = statementStr.match(/^(From AI ambition to\s*)(.*)$/);

  return {
    prefix: match ? match[1] : statementStr,
    highlight: match ? match[2] : "",
  };
}

export async function getAmpProgress(): Promise<AmpProgressData> {
  const section = getAmpSection();
  const block = section.blocks.find((b) => b.id === "amp-progress") as any;
  const items = (block?.items ?? []) as AmpProgressStage[];

  return {
    title: block?.title ?? "How Amp’d is Your Enterprise?",
    stages: items.map((stage) => ({
      id: stage.id,
      title: stage.title,
      description: stage.description,
    })),
    button: block?.cta
      ? {
          label: block.cta.label,
          href: block.cta.href,
        }
      : undefined,
  };
}