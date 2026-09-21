// data/partners.ts
import { existsSync } from "fs";
import path from "path";
import homepageJson from "./homepage.json";
import partnersPageJson from "./partnersPage.json";
import partnerDetailJson from "./partners.json";
import databricksDetailJson from "./partner-databricks.json";
import shopifyDetailJson from "./partner-shopify.json";

/**
 * data/partners.ts
 *
 * CMS-ready data layer for the Partners section.
 */

export interface PartnerLogo {
  id: string;
  name: string;
  image: {
    src: string;
    alt: string;
  };
  website?: string;
}

interface PartnersHeaderContent {
  heading: {
    line1: string;
    line2: string;
  };
  description: string;
}

interface PartnersCTA {
  label: string;
  href: string;
}

function getPartnersSection() {
  const section = homepageJson.sections.find((s) => s.id === "partners");
  if (!section) {
    throw new Error("Section partners not found in homepage.json");
  }
  return section;
}

async function getPartnersHeaderContent(): Promise<PartnersHeaderContent> {
  const section = getPartnersSection();
  const heading = section.data.heading ?? "";
  const [line1 = "", line2 = ""] = heading.split(/<br\s*\/?>/i);

  return {
    heading: {
      line1: line1.trim(),
      line2: line2.trim(),
    },
    description: section.data.description ?? "",
  };
}

export const getPartnersHeader = getPartnersHeaderContent;

function getHomepagePartnerLogos(): PartnerLogo[] {
  const section = getPartnersSection();
  return (section.blocks as any[]).map((block) => ({
    id: block.id,
    name: block.title ?? "",
    image: {
      src: block.media?.src ?? "",
      alt: block.media?.alt ?? "",
    },
    website: block.cta?.href,
  }));
}

/**
 * Whether a logo's asset actually exists under /public. Filtering on
 * this — rather than trusting logos blindly — guarantees
 * "never use placeholder logos": only assets that are actually
 * present ever enter a slot's sequence.
 */
function assetExists(publicSrc: string): boolean {
  const absolutePath = path.join(process.cwd(), "public", publicSrc);
  return existsSync(absolutePath);
}

/** Group of logos assigned to one slot. */
export type PartnerLogoGroup = PartnerLogo[];

/** 5 slots with 2 + 2 + 2 + 2 + 2 capacity for the 10-partner roster. */
const SLOT_CAPACITIES = [2, 2, 2, 2, 2];

/**
 * Builds the 5 slot groups consumed by the 5 LogoShift instances:
 * - Slot 0 (2): Glean, ServiceNow
 * - Slot 1 (2): GEMINI, NVIDIA
 * - Slot 2 (2): AWS, Azure
 * - Slot 3 (2): Salesforce, Databricks
 * - Slot 4 (2): Shopify, TigerGraph
 *
 * Deterministic, never randomized, all 10 partners represented with zero duplicates.
 */
async function getPartnerLogoPairsContent(): Promise<PartnerLogoGroup[]> {
  const allLogos = getHomepagePartnerLogos();
  const availableLogos = allLogos.filter((logo) =>
    assetExists(logo.image.src)
  );

  const slots: PartnerLogoGroup[] = [];
  let offset = 0;
  for (const capacity of SLOT_CAPACITIES) {
    const group = availableLogos.slice(offset, offset + capacity);
    if (group.length > 0) {
      slots.push(group);
    }
    offset += capacity;
  }

  return slots;
}

export const getPartnerLogoPairs = getPartnerLogoPairsContent;

async function getPartnersCTAContent(): Promise<PartnersCTA> {
  const section = getPartnersSection();

  return {
    label: section.data.cta?.label ?? "See our ecosystem partnerships",
    href: section.data.cta?.href ?? "/partners",
  };
}

export const getPartnersCTA = getPartnersCTAContent;

/* ==========================================================================
   Partners Page (/partners) Inner Hero & Ecosystem Data
   ========================================================================== */

export interface PartnersHeroData {
  heading: string;
  description: string;
}

export const partnersHeroData: PartnersHeroData = {
  heading: partnersPageJson.hero.heading,
  description: partnersPageJson.hero.description,
};

export interface PartnerHoverStyle {
  hoverColor: string;
  hoverAccent: string;
}

export const PARTNER_HOVER_STYLES: Record<string, PartnerHoverStyle> = {
  aws: { hoverColor: "#ff990118", hoverAccent: "#ff9901" },
  azure: { hoverColor: "rgba(0, 120, 212, 0.12)", hoverAccent: "#0078D4" },
  databricks: { hoverColor: "rgba(255, 54, 33, 0.12)", hoverAccent: "#FF3621" },
  "gemini-enterprise": { hoverColor: "#3385ff16", hoverAccent: "#3385ff" },
  glean: { hoverColor: "rgba(37, 99, 235, 0.12)", hoverAccent: "#2563EB" },
  nvidia: { hoverColor: "rgba(118, 185, 0, 0.14)", hoverAccent: "#76B900" },
  salesforce: { hoverColor: "rgba(0, 161, 224, 0.14)", hoverAccent: "#00A1E0" },
  servicenow: { hoverColor: "#60d25316", hoverAccent: "#60d253" },
  shopify: { hoverColor: "rgba(149, 191, 71, 0.15)", hoverAccent: "#5E8E3E" },
  tigergraph: { hoverColor: "rgba(244, 124, 32, 0.14)", hoverAccent: "#F47C20" },
};

export interface PartnerCardItem {
  name: string;
  slug: string;
  logo: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  description: string;
  href: string;
  hoverColor?: string;
  hoverAccent?: string;
}

export interface PartnerLandingCardBlock {
  id: string;
  type: "card";
  eyebrow: string | null;
  title: string;
  body: string;
  media: {
    kind: "logo" | "image";
    src: string;
    assetKey: string;
    alt: string;
    caption: string | null;
  };
  cta: {
    enabled: boolean;
    label: string;
    href: string;
    external: boolean;
  };
  items: unknown[];
}

export interface EcosystemSectionData {
  heading: string;
  description: string;
  partners: PartnerCardItem[];
}

const ecosystemLandingSection = partnersPageJson.sections.find(
  (s) => s.id === "explore-the-ecosystem"
);

if (!ecosystemLandingSection) {
  throw new Error(
    "Section explore-the-ecosystem not found in partnersPage.json"
  );
}

const partnerCardBlocks =
  ecosystemLandingSection.blocks as PartnerLandingCardBlock[];

export const ecosystemSectionData: EcosystemSectionData = {
  heading: ecosystemLandingSection.data.heading,
  description: ecosystemLandingSection.data.description,
  partners: partnerCardBlocks.map((block) => ({
    name: block.title,
    slug: block.id,
    logo: {
      src: block.media.src,
      alt: block.media.alt,
    },
    description: block.body,
    href: block.cta.href,
    hoverColor: PARTNER_HOVER_STYLES[block.id]?.hoverColor,
    hoverAccent: PARTNER_HOVER_STYLES[block.id]?.hoverAccent,
  })),
};

/* ==========================================================================
   Partner Detail Pages Data (/partners/[slug])
   CMS-ready structure for dynamic routing
   ========================================================================== */

import type {
  PartnerDetailData,
  PartnerHeroData,
  PartnerIntroData,
  PartnerStoryBannerData,
  AgenticEnterpriseData,
  AgenticEnterpriseBlockData,
  PartnerAccelerator,
  PartnerSolutionsData,
  PartnerProductionProofData,
  PartnerBuiltOnGeminiData,
  PartnerCTAData,
  DatabricksAgenticExecutionData,
  DatabricksBusinessContextData,
  DatabricksControlData,
  PartnerAgentTeamsData,
  PartnerAlternatingContentData,
} from "@/types/partnerDetail";

/* ==========================================================================
   Standardized Partner Detail Data Schema
   Conforms to senior developer's backend reference JSON (partnership_single.json)
   ========================================================================== */

export interface StandardizedMediaObject {
  kind: "image" | "video" | "logo" | "diagram" | string;
  src: string | null;
  assetKey: string | null;
  alt: string | null;
  caption: string | null;
  /** Frontend-specific dimensions & metadata preserved for Next.js <Image> */
  width?: number;
  height?: number;
  provider?: "youtube" | string;
  id?: string;
  poster?: string;
}

export interface StandardizedCTAObject {
  enabled: boolean;
  label: string | null;
  href: string | null;
  external: boolean;
  /** Frontend-specific CTA visual icon */
  icon?: "cube" | "arrow-up-right" | string;
}

export interface StandardizedPartnerRef {
  name: string;
  logo: StandardizedMediaObject;
}

export interface StandardizedSEO {
  title: string | null;
  description: string | null;
  canonical: string | null;
  ogImage: string | null;
}

export interface StandardizedHero {
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  summary: string | null;
  authors: string[] | unknown[];
  partner: StandardizedPartnerRef;
  media: StandardizedMediaObject;
  primaryCta: StandardizedCTAObject | null;
  secondaryCta: StandardizedCTAObject | null;
  /** Frontend-only: multi-line split heading required by PartnerHero layout */
  headingLine1?: string;
  headingLine2?: string;
  heading?: string;
  /** Frontend-only: ribbon asset path for decorative PageRibbon */
  ribbonSrc?: string;
}

export interface StandardizedSectionBlock {
  id: string;
  type: string;
  heading?: string | null;
  body?: string | null;
  eyebrow?: string | null;
  title?: string | null;
  quote?: string | null;
  statement?: string | null;
  authorName?: string | null;
  authorRole?: string | null;
  authorImage?: StandardizedMediaObject | null;
  media?: StandardizedMediaObject | null;
  cta?: StandardizedCTAObject | null;
  items?: string[];
  description?: string;
  /** Frontend-only preserved fields */
  supportingStatement?: string;
  closingStatement?: string;
  paragraphs?: string[];
  metric?: string;
  badge?: string;
  caseStudySlug?: string;
  slug?: string;
  headingStructure?: {
    highlight?: string;
    text?: string;
    prefix?: string;
    suffix?: string;
    rest?: string;
  } | null;
  layout?: string;
  isCard?: boolean;
  isTall?: boolean;
  challenge?: string;
  solution?: string;
  agentTeamTitle?: string;
  agentTeamDescription?: string;
  agents?: Array<{ name: string; role: string }>;
  proof?: {
    headline: string;
    description: string;
    metrics?: Array<{ value: string; label: string }>;
    highlights?: string[];
    video: {
      provider: "youtube" | string;
      id: string;
      poster: string;
      title: string;
    };
  };
}

export interface StandardizedSectionData {
  eyebrow: string | null;
  heading: string | null;
  description: string | null;
  columns: unknown[];
  media: StandardizedMediaObject | null;
  cta: StandardizedCTAObject | null;
  /** Frontend-only preserved structural / layout metadata */
  layout?: "text-image" | "text-metrics" | "image-text" | string;
  supportingStatement?: string;
  closingStatement?: string;
  highlights?: string[];
  metrics?: Array<{ value: string; label: string }>;
  headingStructure?: {
    highlight?: string;
    suffix?: string;
    prefix?: string;
    text?: string;
    rest?: string;
  };
}

export interface StandardizedSection {
  id: string;
  type:
    | "rich_text"
    | "quote"
    | "split_content"
    | "checklist"
    | "card_grid"
    | "media"
    | "case_study_grid"
    | string;
  enabled: boolean;
  conditions: Record<string, unknown> | null;
  data: StandardizedSectionData;
  blocks: StandardizedSectionBlock[];
}

export interface StandardizedFooterCTA {
  enabled: boolean;
  heading: string;
  subheading: string | null;
  partner: StandardizedPartnerRef;
  primaryCta: StandardizedCTAObject | null;
  secondaryCta: StandardizedCTAObject | null;
  media?: StandardizedMediaObject | null;
  /** Frontend-only: draft banner text */
  rawHeading?: string;
}

export interface StandardizedPartnerDetailPage {
  schemaVersion: string;
  pageType: string;
  slug: string;
  title: string;
  name?: string;
  seo: StandardizedSEO;
  hero: StandardizedHero;
  sections: StandardizedSection[];
  footerCta: StandardizedFooterCTA;
}

export const PARTNERS_DETAIL_DATA: Record<string, StandardizedPartnerDetailPage> = {
  [partnerDetailJson.slug]: partnerDetailJson,
  [databricksDetailJson.slug]: databricksDetailJson as unknown as StandardizedPartnerDetailPage,
  [shopifyDetailJson.slug]: shopifyDetailJson as unknown as StandardizedPartnerDetailPage,
};

/**
 * Adapter mapping the standardized CMS partner object into the existing
 * PartnerDetailData interface consumed by page.tsx and partner section components.
 * Ensures zero frontend breaking changes while adopting the backend data standard.
 */
function mapStandardizedToPartnerDetail(
  data: StandardizedPartnerDetailPage
): PartnerDetailData {
  const meta = {
    title: data.seo.title ?? data.title,
    description: data.seo.description ?? "",
  };

  const headingLines: string[] = data.hero.heading
    ? data.hero.heading.split(/<br\s*\/?>/i)
    : [];
  let headingLine1 = headingLines[0] ?? data.title;
  let headingLine2 = headingLines[1] ?? "";
  if (!data.hero.heading && data.hero.headingLine1) {
    headingLine1 = data.hero.headingLine1;
    headingLine2 = data.hero.headingLine2 ?? "";
    headingLines.push(headingLine1);
    if (headingLine2) headingLines.push(headingLine2);
  }

  const hero: PartnerHeroData = {
    headingLine1,
    headingLine2,
    headingLines: headingLines.length > 0 ? headingLines : undefined,
    partnerLogo: {
      src: data.hero.partner.logo.src ?? "",
      alt: data.hero.partner.logo.alt ?? data.hero.partner.name,
      width: data.hero.partner.logo.width,
      height: data.hero.partner.logo.height,
      assetKey: data.hero.partner.logo.assetKey ?? undefined,
    },
    ribbonSrc: data.hero.ribbonSrc ?? data.hero.media?.src ?? "",
  };

  const introSec = data.sections.find((s) => s.id === "production-value");
  const quoteSec = data.sections.find((s) => s.id === "customer-quote");
  const quoteBlock = quoteSec?.blocks?.[0];

  let introPrefix = introSec?.data.headingStructure?.prefix;
  let introHighlight = introSec?.data.headingStructure?.highlight;
  let introSuffix = introSec?.data.headingStructure?.suffix;
  if (!introHighlight && introSec?.data.heading) {
    const fullHeading = introSec.data.heading;
    const highlightMatch = "From Gemini Enterprise";
    if (fullHeading.startsWith(highlightMatch)) {
      introHighlight = highlightMatch;
      introSuffix = fullHeading.slice(highlightMatch.length).trim();
    } else {
      introHighlight = fullHeading;
      introSuffix = "";
    }
  }

  const leadershipQuote = quoteBlock?.quote
    ? {
        quote: quoteBlock.quote,
        author: {
          name: quoteBlock.authorName ?? "",
          role: quoteBlock.authorRole ?? "",
          portraitSrc: quoteBlock.authorImage?.src ?? "",
        },
      }
    : undefined;

  const statementText =
    quoteBlock?.statement ??
    (quoteBlock?.type === "statement" || quoteSec?.type === "statement_card"
      ? quoteBlock?.body
      : undefined);

  const statementCard = statementText
    ? {
        text: statementText,
      }
    : undefined;

  const intro: PartnerIntroData | undefined =
    introSec || quoteSec
      ? {
          heading: {
            prefix: introPrefix,
            highlight: introHighlight ?? "",
            suffix: introSuffix ?? "",
          },
          paragraphs:
            introSec?.blocks?.[0]?.paragraphs ??
            (introSec?.blocks?.[0]?.body ? [introSec.blocks[0].body] : []),
          leadershipQuote,
          statementCard,
          cta: quoteSec?.data.cta?.enabled
            ? {
                label: quoteSec.data.cta.label ?? "",
                href: quoteSec.data.cta.href ?? "",
                icon: (quoteSec.data.cta as { icon?: string }).icon ?? undefined,
              }
            : undefined,
        }
      : undefined;

  const storyBannerSec = data.sections.find(
    (s) =>
      s.data.layout === "image-stacked" ||
      (data.slug === "shopify" && s.id === "autonomous-workflows")
  );

  const storyBanner: PartnerStoryBannerData | undefined = storyBannerSec
    ? {
        image: {
          src: storyBannerSec.data.media?.src ?? "",
          alt: storyBannerSec.data.media?.alt ?? "",
          width: storyBannerSec.data.media?.width ?? 4816,
          height: storyBannerSec.data.media?.height ?? 1006,
        },
        heading: {
          highlight:
            storyBannerSec.data.headingStructure?.highlight ?? "Get Amp'd to move",
          text:
            storyBannerSec.data.headingStructure?.text ??
            storyBannerSec.data.heading ??
            "",
        },
        description:
          storyBannerSec.blocks?.[0]?.body ??
          storyBannerSec.data.description ??
          "",
      }
    : undefined;

  const agentTeamsSec = data.sections.find(
    (s) =>
      s.id === "coordinated-agent-teams" ||
      s.id === "built-on-databricks" ||
      s.id === "industry-accelerators"
  );

  const agentTeams: PartnerAgentTeamsData | undefined = agentTeamsSec
    ? {
        heading: agentTeamsSec.data.heading ?? "",
        description: agentTeamsSec.data.description ?? "",
        cards: (agentTeamsSec.blocks ?? []).map((b) => ({
          id: b.id,
          title: b.title ?? undefined,
          text: b.body ?? "",
          ribbon: b.media?.src ?? "",
        })),
        closingStatement:
          (agentTeamsSec.data as { closingStatement?: string }).closingStatement ??
          undefined,
      }
    : undefined;

  const alternatingSec = data.sections.find(
    (s) =>
      s.id === "scale-and-control" ||
      s.type === "alternating_content"
  );

  const alternatingContent: PartnerAlternatingContentData | undefined = alternatingSec
    ? {
        id: alternatingSec.id,
        rows: (alternatingSec.blocks ?? []).map((b) => {
          let highlight = b.headingStructure?.highlight;
          let text = b.headingStructure?.text;
          if (!highlight && b.heading) {
            const parts = b.heading.split(/<br\s*\/?>|\n/);
            highlight = parts[0];
            text = parts.slice(1).join(" ");
          }
          return {
            id: b.id,
            heading: {
              highlight: highlight ?? "",
              text: text ?? "",
            },
            description: b.body ?? "",
            image: {
              src: b.media?.src ?? "",
              alt: b.media?.alt ?? "",
              width: b.media?.width ?? 437,
              height: b.media?.height ?? 279,
            },
            imagePosition: (b.layout === "image-text" ? "left" : "right") as "left" | "right",
            isCard: Boolean(b.isCard),
          };
        }),
      }
    : undefined;

  let databricksAgenticExecution: DatabricksAgenticExecutionData | undefined;
  const databricksSec =
    data.slug === "databricks"
      ? data.sections.find((s) => s.id === "autonomous-workflows")
      : undefined;

  if (databricksSec) {
    const block = databricksSec.blocks?.[0];
    const mediaSource = block?.media ?? databricksSec.data.media;
    databricksAgenticExecution = {
      eyebrow: block?.eyebrow ?? databricksSec.data.eyebrow ?? "",
      heading: block?.heading ?? databricksSec.data.heading ?? "",
      supportingStatement:
        block?.supportingStatement ?? databricksSec.data.supportingStatement ?? "",
      paragraphs:
        block?.paragraphs ??
        (block?.body ? [block.body] : databricksSec.data.description ? [databricksSec.data.description] : []),
      closingStatement:
        block?.closingStatement ?? databricksSec.data.closingStatement ?? "",
      image: {
        src: mediaSource?.src ?? "/images/partners/gemini/agentic-enterprise/agentic-enterprise-ambition.png",
        alt: mediaSource?.alt ?? "Amp’d by Agivant",
        width: mediaSource?.width ?? 437,
        height: mediaSource?.height ?? 408,
      },
    };
  }

  let databricksBusinessContext: DatabricksBusinessContextData | undefined;
  const businessContextSec =
    data.slug === "databricks"
      ? data.sections.find((s) => s.id === "business-context")
      : undefined;

  if (businessContextSec) {
    databricksBusinessContext = {
      heading: businessContextSec.data.heading ?? "",
      description: businessContextSec.data.description ?? "",
      cards: (businessContextSec.blocks ?? []).map((b) => ({
        id: b.id,
        title: b.title ?? "",
        description: b.body ?? b.description ?? "",
      })),
      closingStatement: businessContextSec.data.closingStatement ?? "",
    };
  }

  let databricksControl: DatabricksControlData | undefined;
  const controlSec =
    data.slug === "databricks"
      ? data.sections.find((s) => s.id === "control" || s.id === "agent-control")
      : undefined;

  if (controlSec) {
    const block = controlSec.blocks?.[0];
    const mediaSource = block?.media ?? controlSec.data.media;
    databricksControl = {
      heading: block?.heading ?? controlSec.data.heading ?? "",
      description:
        block?.body ??
        controlSec.data.description ??
        "",
      image: {
        src: mediaSource?.src ?? "/images/partners/gemini/agentic-enterprise/agentic-enterprise-control.png",
        alt: mediaSource?.alt ?? "Keep cost, access, and agent behavior under clear control",
        width: mediaSource?.width ?? 437,
        height: mediaSource?.height ?? 279,
      },
    };
  }

  const storySectionIds = [
    "autonomous-workflows",
    "agent-teams",
    "control",
    "google-cloud-scale",
  ];
  const storySections = data.sections.filter(
    (s) =>
      storySectionIds.includes(s.id) &&
      s.id !== storyBannerSec?.id &&
      s.id !== databricksSec?.id &&
      s.id !== controlSec?.id
  );

  const agenticEnterprise: AgenticEnterpriseData | undefined =
    storySections.length > 0
      ? {
          blocks: storySections.map((sec) => {
            const block = sec.blocks?.[0];

            let blockHeading: AgenticEnterpriseBlockData["heading"] = {
              highlight: sec.data.headingStructure?.highlight,
        suffix: sec.data.headingStructure?.suffix,
        prefix: sec.data.headingStructure?.prefix,
        text: sec.data.headingStructure?.text,
      };

      if (!sec.data.headingStructure && sec.data.heading) {
        const h = sec.data.heading;
        if (sec.id === "autonomous-workflows") {
          const ampMatch = h.match(/^(Get Amp['’]d)\s*(.*)$/i);
          if (ampMatch) {
            blockHeading = { highlight: ampMatch[1], text: ampMatch[2] };
          } else if (h.match(/^Amp['’]d/i)) {
            blockHeading = { highlight: h };
          } else {
            blockHeading = { text: h };
          }
        } else if (sec.id === "agent-teams") {
          const target = "core enterprise systems.";
          const idx = h.indexOf(target);
          if (idx !== -1) {
            blockHeading = {
              prefix: h.substring(0, idx).trim(),
              highlight: target,
            };
          } else {
            blockHeading = { text: h };
          }
        } else if (sec.id === "control") {
          const parts = h.split(/<br\s*\/?>/i);
          if (parts.length >= 2) {
            blockHeading = {
              prefix: parts[0] + "\n",
              highlight: parts[1],
            };
          } else {
            blockHeading = { text: h };
          }
        } else if (sec.id === "google-cloud-scale") {
          const parts = h.split(/<br\s*\/?>/i);
          if (parts.length >= 2) {
            blockHeading = {
              highlight: parts[0] + "\n",
              text: parts[1],
            };
          } else {
            blockHeading = { text: h };
          }
        } else {
          blockHeading = { text: h };
        }
      }

      const mediaSource = block?.media ?? sec.data.media;

      return {
        id: sec.id,
        layout: sec.data.layout as AgenticEnterpriseBlockData["layout"],
        eyebrow: block?.eyebrow ?? sec.data.eyebrow ?? undefined,
        heading: blockHeading,
        supportingStatement:
          block?.supportingStatement ?? sec.data.supportingStatement ?? undefined,
        body: block?.body ?? sec.data.description ?? "",
        paragraphs: block?.paragraphs ?? undefined,
        closingStatement: block?.closingStatement ?? sec.data.closingStatement,
        image: mediaSource?.src
          ? {
              src: mediaSource.src,
              alt: mediaSource.alt ?? "",
              width: mediaSource.width ?? 437,
              height: mediaSource.height ?? 279,
            }
          : undefined,
        metrics: block?.items?.length
          ? {
              items: block.items,
              closingStatement: sec.data.closingStatement,
            }
          : undefined,
      };
    }),
  } : undefined;

  const solutionsSec = data.sections.find(
    (s) =>
      s.id === "gemini-solutions" ||
      s.id === "solutions" ||
      s.id === "databricks-solutions" ||
      s.id === "shopify-solutions" ||
      s.id === "accelerate"
  );
  let solPrefix = solutionsSec?.data.headingStructure?.prefix;
  let solHighlight = solutionsSec?.data.headingStructure?.highlight;
  let solSuffix = solutionsSec?.data.headingStructure?.suffix;
  let solText = solutionsSec?.data.headingStructure?.text;
  if (!solHighlight && solutionsSec?.data.heading) {
    const target = "Scale on the Databricks";
    if (solutionsSec.data.heading.startsWith(target)) {
      solHighlight = target;
      solSuffix = solutionsSec.data.heading.slice(target.length).trim();
    } else {
      const parts = solutionsSec.data.heading.split(/<br\s*\/?>/i);
      if (parts.length >= 2) {
        solPrefix = parts[0] + "\n";
        solHighlight = parts[1];
      } else {
        solPrefix = solutionsSec.data.heading;
        solHighlight = "";
      }
    }
  }

  const solutions: PartnerSolutionsData | undefined = solutionsSec
    ? {
        heading: {
          prefix: solPrefix,
          highlight: solHighlight,
          suffix: solSuffix,
          text: solText,
        },
        description: solutionsSec.data.description ?? "",
        accelerators: (solutionsSec.blocks ?? []).map((b) => ({
          id: b.id,
          title: b.title ?? "",
          category: b.eyebrow ?? "",
          description: b.body ?? "",
          image: {
            src: b.media?.src ?? "",
            alt: b.media?.alt ?? "",
          },
          challenge: b.challenge ?? "",
          solution: b.solution ?? "",
          agentTeamTitle: b.agentTeamTitle,
          agentTeamDescription: b.agentTeamDescription,
          agents: b.agents,
          proof: b.proof as PartnerAccelerator["proof"],
        })),
      }
    : undefined;

  const proofSec = data.sections.find(
    (s) => s.id === "proof-from-production"
  );
  let proofHighlight = proofSec?.data.headingStructure?.highlight;
  let proofRest = proofSec?.data.headingStructure?.rest;
  if (!proofHighlight && proofSec?.data.heading) {
    const target = "Proof";
    if (proofSec.data.heading.startsWith(target)) {
      proofHighlight = target;
      proofRest = proofSec.data.heading.slice(target.length).trim();
    } else {
      proofHighlight = proofSec.data.heading;
      proofRest = "";
    }
  }

  const productionProof: PartnerProductionProofData | undefined = proofSec
    ? {
        heading: {
          highlight: proofHighlight ?? "",
          rest: proofRest ?? "",
        },
        description: proofSec.data.description ?? "",
        cards: (proofSec.blocks ?? []).map((b) => ({
          id: b.id,
          badge: b.badge ?? b.eyebrow ?? undefined,
          title: b.title ?? "",
          description: b.body ?? "",
          metric: b.metric ?? "",
          ctaLabel: b.cta?.label ?? "Read more >>",
          caseStudySlug: b.caseStudySlug ?? b.id,
          image: {
            src: b.media?.src ?? "",
            alt: b.media?.alt ?? "",
          },
        })),
      }
    : undefined;

  const builtSec = data.sections.find(
    (s) =>
      s.id === "built-on-gemini" ||
      s.id === "built-on-shopify" ||
      s.id === "built-on"
  );
  let builtHighlight = builtSec?.data.headingStructure?.highlight;
  let builtRest =
    builtSec?.data.headingStructure?.rest ??
    builtSec?.data.headingStructure?.text;
  if (!builtHighlight && builtSec?.data.heading) {
    const target = "Built on";
    if (builtSec.data.heading.startsWith(target)) {
      builtHighlight = target;
      builtRest = builtSec.data.heading.slice(target.length).trim();
    } else {
      builtHighlight = builtSec.data.heading;
      builtRest = "";
    }
  }

  const builtOnGemini: PartnerBuiltOnGeminiData | undefined = builtSec
    ? {
        heading: {
          highlight: builtHighlight ?? "",
          rest: builtRest ?? "",
        },
        description: builtSec.data.description ?? "",
        cards: (builtSec.blocks ?? []).map((b) => ({
          id: b.id,
          badge: b.badge ?? b.eyebrow ?? undefined,
          title: b.title ?? "",
          slug: b.slug ?? b.id,
          description: b.body ?? "",
          metric: b.metric ?? "",
          ctaLabel: b.cta?.label ?? "See the solution >>",
          image: {
            src: b.media?.src ?? "",
            alt: b.media?.alt ?? "",
          },
        })),
      }
    : undefined;

  const cta: PartnerCTAData | undefined = data.footerCta?.enabled
    ? {
        heading: data.footerCta.rawHeading ?? data.footerCta.heading,
        description: data.footerCta.subheading ?? "",
        buttonLabel:
          data.footerCta.secondaryCta?.label ?? "Talk to an Amp'd specialist",
        buttonHref: data.footerCta.secondaryCta?.href ?? "/contact",
        buttonIcon: data.footerCta.secondaryCta?.icon as PartnerCTAData["buttonIcon"],
        buttonVariant:
          (data.footerCta.secondaryCta as { variant?: "primary" | "dark" })?.variant ??
          (data.footerCta.media ? "dark" : "primary"),
        media: data.footerCta.media?.src
          ? {
              src: data.footerCta.media.src,
              alt: data.footerCta.media.alt ?? "",
              width: data.footerCta.media.width,
              height: data.footerCta.media.height,
            }
          : undefined,
      }
    : undefined;

  return {
    slug: data.slug,
    name: data.name ?? data.hero.partner.name,
    meta,
    hero,
    intro,
    storyBanner,
    agentTeams,
    alternatingContent,
    agenticEnterprise,
    databricksAgenticExecution,
    databricksBusinessContext,
    databricksControl,
    solutions,
    productionProof,
    builtOnGemini,
    cta,
  };
}

export async function getPartnerDetail(
  slug: string
): Promise<PartnerDetailData | null> {
  const raw = PARTNERS_DETAIL_DATA[slug];
  if (!raw) return null;
  return mapStandardizedToPartnerDetail(raw);
}

export async function getStandardizedPartnerDetail(
  slug: string
): Promise<StandardizedPartnerDetailPage | null> {
  return PARTNERS_DETAIL_DATA[slug] ?? null;
}

export function getAllPartnerSlugs(): string[] {
  return Object.keys(PARTNERS_DETAIL_DATA);
}