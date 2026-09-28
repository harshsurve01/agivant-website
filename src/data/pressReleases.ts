// data/pressReleases.ts
import geminiEnterprisePressRelease from "./press-release-gemini-enterprise.json";
import gleanPressRelease from "./press-release-glean.json";
import databricksPressRelease from "./press-release-databricks.json";
import {
  mapStandardizedHero,
  type StandardizedPartnerDetailPage,
} from "./partners";
import type { FooterButton } from "./footer";
import type {
  PartnerHeroData,
  PartnerIntroData,
  PartnerNumberedListData,
  PartnerAlternatingContentData,
} from "@/types/partnerDetail";

/**
 * data/pressReleases.ts
 *
 * Registry + loader for Press Release pages (/press-releases/[slug]).
 * Each press release is a JSON file that follows the same standardized
 * page contract as the partner JSON files, so the hero is mapped with the
 * shared `mapStandardizedHero()` used by partner pages.
 */

type StandardizedPressReleasePage = Pick<
  StandardizedPartnerDetailPage,
  "slug" | "title" | "seo" | "hero" | "sections"
> &
  Partial<Pick<StandardizedPartnerDetailPage, "footerCta">>;

/** Footer card data, in the shape the universal Footer's `ctaData` accepts. */
export interface PressReleaseFooterData {
  heading: { line1: string; line2?: string };
  description?: string;
  media?: { src: string; alt: string; width?: number; height?: number } | null;
  buttons: FooterButton[];
}

const PRESS_RELEASES: Record<string, StandardizedPressReleasePage> = {
  [geminiEnterprisePressRelease.slug]:
    geminiEnterprisePressRelease as unknown as StandardizedPressReleasePage,
  [gleanPressRelease.slug]:
    gleanPressRelease as unknown as StandardizedPressReleasePage,
  [databricksPressRelease.slug]:
    databricksPressRelease as unknown as StandardizedPressReleasePage,
};

export interface PressReleaseData {
  slug: string;
  meta: {
    title: string;
    description: string;
  };
  hero: PartnerHeroData;
  /** First `rich_text` section (heading + paragraphs), rendered with PartnerIntro. */
  intro?: PartnerIntroData;
  /**
   * Further `rich_text` sections (paragraphs, optional CTA blocks), rendered
   * with PartnerIntro. `afterQuotes` is true when the section follows the
   * `quote` section in the JSON, so it renders after the quote cards.
   */
  additionalIntros: { id: string; intro: PartnerIntroData; afterQuotes: boolean }[];
  /** First `numbered_list` section, rendered with the Blogs Phase2 component. */
  numberedList?: PartnerNumberedListData & { highlightCount?: number };
  /** First `quote` section (one card per quote block), rendered with PartnerIntro. */
  quotes?: PartnerIntroData;
  /** First `alternating_content` section (image/text rows), rendered with PartnerAlternatingContent. */
  alternatingContent?: PartnerAlternatingContentData;
  /** `footerCta` (heading, subheading, media, CTAs) for the Footer's partner-card variant. */
  footer?: PressReleaseFooterData;
}

export async function getPressRelease(
  slug: string
): Promise<PressReleaseData | null> {
  const data = PRESS_RELEASES[slug];
  if (!data) return null;
  return {
    slug: data.slug,
    meta: {
      title: data.seo.title ?? data.title,
      description: data.seo.description ?? "",
    },
    hero: mapStandardizedHero(data),
    intro: mapIntroSection(data),
    additionalIntros: mapAdditionalIntroSections(data),
    numberedList: mapNumberedListSection(data),
    quotes: mapQuoteSection(data),
    alternatingContent: mapAlternatingSection(data),
    footer: mapFooterCta(data),
  };
}

/**
 * Maps `footerCta` to the Footer card. The heading's first line is the purple
 * highlight (same convention as partner footer headings: `<br>`/newline
 * separates highlight and rest); the subheading keeps its line breaks.
 */
function mapFooterCta(
  data: StandardizedPressReleasePage
): PressReleaseFooterData | undefined {
  const f = data.footerCta;
  if (!f?.enabled) return undefined;
  const [line1, ...rest] = (f.heading ?? "").split(/<br\s*\/?>|\n/i);
  const ctas = [f.primaryCta, f.secondaryCta].filter(
    (c): c is NonNullable<typeof c> => Boolean(c?.enabled && c.label)
  );
  return {
    heading: { line1, line2: rest.length ? rest.join(" ") : undefined },
    description: f.subheading ?? undefined,
    media: f.media?.src
      ? {
          src: f.media.src,
          alt: f.media.alt ?? "",
          width: f.media.width,
          height: f.media.height,
        }
      : null,
    buttons: ctas.map((c) => ({
      label: c.label ?? "",
      href: c.href ?? "",
      variant:
        ((c as { variant?: "primary" | "dark" }).variant ?? "dark") as
          | "primary"
          | "dark",
      icon: (c.icon === "arrow-up-right" ? "arrow-up-right" : "cube") as
        | "cube"
        | "arrow-up-right",
    })),
  };
}

/**
 * Maps the first `alternating_content` section to the rows shape partner pages
 * use (headingStructure highlight/text, body, media, layout, isCard).
 */
function mapAlternatingSection(
  data: StandardizedPressReleasePage
): PartnerAlternatingContentData | undefined {
  const sec = data.sections.find(
    (s) => s.type === "alternating_content" && s.enabled
  );
  if (!sec?.blocks?.length) return undefined;
  return {
    id: sec.id,
    rows: sec.blocks.map((b) => ({
      id: b.id,
      heading: b.headingStructure
        ? {
            highlight: b.headingStructure.highlight ?? "",
            text: b.headingStructure.text ?? "",
          }
        : splitRowHeading(b.heading),
      description: b.body ?? "",
      image: {
        src: b.media?.src ?? "",
        alt: b.media?.alt ?? "",
        width: b.media?.width ?? 437,
        height: b.media?.height ?? 279,
      },
      imagePosition: (b.layout === "image-text" ? "left" : "right") as
        | "left"
        | "right",
      isCard: Boolean(b.isCard),
    })),
  };
}

/**
 * Presentation rule for a single row `heading` string (no headingStructure):
 * text before a `<br>` is the highlight; without one, the first word is
 * ("About Agivant Technologies" → "About" + "Agivant Technologies").
 */
function splitRowHeading(heading: string | null | undefined): {
  highlight: string;
  text: string;
} {
  const value = heading?.trim() ?? "";
  const br = value.split(/<br\s*\/?>/i);
  if (br.length > 1) {
    return { highlight: br[0].trim(), text: br.slice(1).join(" ").trim() };
  }
  const space = value.indexOf(" ");
  return space < 0
    ? { highlight: value, text: "" }
    : { highlight: value.slice(0, space), text: value.slice(space + 1) };
}

/**
 * Maps the first `quote` section to PartnerIntroData.leadershipQuotes using
 * the standard quote-block fields (quote, authorName, authorRole, authorImage).
 */
function mapQuoteSection(
  data: StandardizedPressReleasePage
): PartnerIntroData | undefined {
  const sec = data.sections.find((s) => s.type === "quote" && s.enabled);
  const quotes = (sec?.blocks ?? [])
    .filter((b) => Boolean(b.quote))
    .map((b) => ({
      quote: b.quote ?? "",
      author: {
        name: b.authorName ?? "",
        role: b.authorRole ?? "",
        portraitSrc: b.authorImage?.src ?? "",
      },
    }));
  if (quotes.length === 0) return undefined;
  return { paragraphs: [], leadershipQuotes: quotes };
}

/**
 * Maps the first `numbered_list` section (`numberedItem` blocks) to the
 * same { heading, items } shape partner pages pass to Phase2.
 */
function mapNumberedListSection(
  data: StandardizedPressReleasePage
): (PartnerNumberedListData & { highlightCount?: number }) | undefined {
  const sec = data.sections.find(
    (s) => s.type === "numbered_list" && s.enabled
  );
  if (!sec) return undefined;
  return {
    heading: sec.data.heading ?? "",
    highlightCount:
      (sec.data as { highlightCount?: number })?.highlightCount ??
      wordsThroughFirstComma(sec.data.heading),
    items: (sec.blocks ?? []).map((b, i) => ({
      index: String(b.number ?? i + 1).padStart(2, "0"),
      title: b.title ?? "",
      description: b.body ?? "",
    })),
  };
}

/**
 * Maps the first `rich_text` section to PartnerIntroData using the same
 * standardized fields partner intros use (headingStructure + block paragraphs).
 */
function mapIntroSection(
  data: StandardizedPressReleasePage,
  index = 0
): PartnerIntroData | undefined {
  const sec = data.sections.filter(
    (s) => s.type === "rich_text" && s.enabled
  )[index];
  if (!sec) return undefined;
  const hs = sec.data.headingStructure;
  const block = sec.blocks?.find((b) => b.type === "rich_text") ?? sec.blocks?.[0];
  // `cta` blocks (standard CTA shape) render as the section's buttons.
  const ctas = (sec.blocks ?? [])
    .filter((b) => b.type === "cta")
    .map((b) => b as unknown as {
      enabled?: boolean;
      label?: string;
      href?: string;
      icon?: string;
      variant?: "primary" | "dark";
    })
    .filter((c) => c.enabled !== false && c.label)
    .map((c) => ({
      label: c.label ?? "",
      href: c.href ?? "",
      icon: c.icon,
      variant: c.variant ?? "primary",
    }));
  return {
    heading:
      hs?.highlight || hs?.suffix || hs?.prefix
        ? {
            prefix: hs?.prefix,
            highlight: hs?.highlight ?? "",
            suffix: hs?.suffix ?? "",
          }
        : splitHeadingAtPartner(sec.data.heading, data.hero.partner?.name),
    paragraphs: block?.paragraphs ?? (block?.body ? [block.body] : []),
    ...(ctas.length > 0 ? { ctas } : {}),
  };
}

/**
 * Presentation rule for numbered-list headings: when the heading has a comma,
 * the words up to and including it are highlighted ("As Part Of This
 * Practice, …"). Otherwise the page default applies.
 */
function wordsThroughFirstComma(
  heading: string | null | undefined
): number | undefined {
  const idx = heading?.indexOf(",") ?? -1;
  if (!heading || idx < 0) return undefined;
  return heading.slice(0, idx + 1).trim().split(/\s+/).length;
}

/** Maps every `rich_text` section after the first, keeping section ids and order. */
function mapAdditionalIntroSections(
  data: StandardizedPressReleasePage
): PressReleaseData["additionalIntros"] {
  const richText = data.sections.filter(
    (s) => s.type === "rich_text" && s.enabled
  );
  const quoteIdx = data.sections.findIndex(
    (s) => s.type === "quote" && s.enabled
  );
  return richText.slice(1).flatMap((sec, i) => {
    const intro = mapIntroSection(data, i + 1);
    if (!intro) return [];
    return [
      {
        id: sec.id,
        intro,
        afterQuotes: quoteIdx >= 0 && data.sections.indexOf(sec) > quoteIdx,
      },
    ];
  });
}

/**
 * Presentation rule for a single `heading` string (no headingStructure):
 * the text before the partner's name (from `hero.partner.name`) is the
 * purple highlight and the rest is dark. Without the name in the heading,
 * the whole heading is highlighted.
 */
function splitHeadingAtPartner(
  heading: string | null | undefined,
  partnerName: string | null | undefined
): PartnerIntroData["heading"] {
  const text = heading?.trim();
  if (!text) return undefined;
  const idx = partnerName ? text.indexOf(partnerName) : -1;
  if (idx <= 0) return { highlight: text, suffix: "" };
  return {
    highlight: text.slice(0, idx).trim(),
    suffix: text.slice(idx).trim(),
  };
}

export function getAllPressReleaseSlugs(): string[] {
  return Object.keys(PRESS_RELEASES);
}
