// data/partners.ts
import { existsSync } from "fs";
import path from "path";

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

async function getPartnersHeaderContent(): Promise<PartnersHeaderContent> {
  return {
    heading: {
      line1: "Agivant Is Trusted By",
      line2: "Global Partners",
    },
    description:
      "Agivant works across global hyperscaler, data, AI & workflow platforms enterprises depend on.",
  };
}

export const getPartnersHeader = getPartnersHeaderContent;

/**
 * The full partner roster, in a fixed display order. Add/remove
 * partners here only; getPartnerLogoPairs() below adapts
 * automatically to whichever of these actually have a real asset
 * file on disk, and chunks them into the 4 card slots' pairs.
 */
const ALL_PARTNER_LOGOS: PartnerLogo[] = [
  {
    id: "glean",
    name: "Glean",
    image: { src: "/images/partners/glean.png", alt: "Glean" },
    website: "https://www.glean.com",
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    image: { src: "/images/partners/servicenow.png", alt: "ServiceNow" },
    website: "https://www.servicenow.com",
  },
 
  
   {
     id: "gemini",
     name: "GEMINI",
     image: { src: "/images/partners/gemini.png", alt: "GEMINI" },
     website: "https://www.gemini.com",
   },
  {
    id: "nvidia",
    name: "NVIDIA",
    image: { src: "/images/partners/nvidia.png", alt: "NVIDIA" },
    website: "https://www.nvidia.com",
  },
  {
    id: "aws",
    name: "AWS",
    image: { src: "/images/partners/aws.png", alt: "AWS" },
    website: "https://aws.amazon.com",
  },
  {
    id: "azure",
    name: "Azure",
    image: { src: "/images/partners/azure.png", alt: "Azure" },
    website: "https://azure.microsoft.com",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    image: { src: "/images/partners/salesforce.png", alt: "Salesforce" },
    website: "https://www.salesforce.com",
  },
  
  {
    id: "databricks",
    name: "Databricks",
    image: { src: "/images/partners/databricks.png", alt: "Databricks" },
    website: "https://www.databricks.com",
  },
  {
    id: "shopify",
    name: "Shopify",
    image: { src: "/images/partners/shopify.png", alt: "Shopify" },
    website: "https://www.shopify.com",
  },
  {
    id: "tigergraph",
    name: "TigerGraph",
    image: { src: "/images/partners/tigergraph.png", alt: "TigerGraph" },
    website: "https://www.tigergraph.com",
  },
];

/**
 * Whether a logo's asset actually exists under /public. Filtering on
 * this — rather than trusting ALL_PARTNER_LOGOS blindly — guarantees
 * "never use placeholder logos": only assets that are actually
 * present ever enter a slot's sequence.
 */
function assetExists(publicSrc: string): boolean {
  const absolutePath = path.join(process.cwd(), "public", publicSrc);
  return existsSync(absolutePath);
}

/** Exactly two logos — everything one LogoShift instance holds. */
export type PartnerLogoPair = [PartnerLogo, PartnerLogo];

// Widened from 4 to 5 static slots to fit the full 10-partner
// roster as clean pairs — each slot still owns exactly one
// independent LogoShift instance holding exactly one logo pair (the
// Framer component's "one logo pair per instance" model is
// unchanged; there's just one more instance of it now). SLOT_COUNT *
// PAIR_SIZE (10) matches the roster below exactly, so nothing is
// held in reserve.
const SLOT_COUNT = 5;
const PAIR_SIZE = 2;

/**
 * Builds the 5 fixed pairs consumed by the 5 LogoShift instances:
 * the first 10 asset-verified logos, taken in fixed roster order and
 * chunked consecutively — [0,1], [2,3], [4,5], [6,7], [8,9].
 * Deterministic, never randomized, never duplicated as filler.
 *
 * If the roster ever grows past SLOT_COUNT * PAIR_SIZE again, the
 * leftover logic below holds the excess in reserve (dev-only warning)
 * rather than force-fitting a 3rd logo into any one slot — add a 6th
 * slot (bump SLOT_COUNT) or trim the roster instead.
 */
async function getPartnerLogoPairsContent(): Promise<PartnerLogoPair[]> {
  const availableLogos = ALL_PARTNER_LOGOS.filter((logo) =>
    assetExists(logo.image.src)
  );

  if (process.env.NODE_ENV !== "production") {
    const missing = ALL_PARTNER_LOGOS.filter(
      (logo) => !assetExists(logo.image.src)
    );
    if (missing.length > 0) {
      console.warn(
        `[Partners] Skipping ${missing.length} logo(s) with missing asset file(s): ${missing
          .map((logo) => `${logo.id} (${logo.image.src})`)
          .join(", ")}`
      );
    }

    const capacity = SLOT_COUNT * PAIR_SIZE;
    if (availableLogos.length > capacity) {
      const leftover = availableLogos.slice(capacity);
      console.warn(
        `[Partners] ${leftover.length} logo(s) held in reserve, not shown — ` +
          `${SLOT_COUNT} slots × ${PAIR_SIZE} logos/pair = ${capacity} capacity, ` +
          `but ${availableLogos.length} logos are available: ${leftover
            .map((logo) => logo.id)
            .join(", ")}. Trim the roster to ${capacity} or add a 5th slot.`
      );
    } else if (availableLogos.length < capacity) {
      console.warn(
        `[Partners] Only ${availableLogos.length} logo(s) available — fewer ` +
          `than the ${capacity} needed to fill all ${SLOT_COUNT} slots. Some ` +
          `slots will be omitted rather than given an incomplete pair.`
      );
    }
  }

  const pairs: PartnerLogoPair[] = [];
  for (let slot = 0; slot < SLOT_COUNT; slot++) {
    const a = availableLogos[slot * PAIR_SIZE];
    const b = availableLogos[slot * PAIR_SIZE + 1];
    if (!a || !b) break; // not enough logos left to complete this pair
    pairs.push([a, b]);
  }

  return pairs;
}

export const getPartnerLogoPairs = getPartnerLogoPairsContent;

async function getPartnersCTAContent(): Promise<PartnersCTA> {
  return {
    label: "See our ecosystem partnerships",
    href: "/partners",
  };
}

export const getPartnersCTA = getPartnersCTAContent;