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
      "Agivant works across global hyperscaler, data, AI and workflow platforms enterprises depend on.",
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
     id: "databricks",
     name: "Databricks",
     image: { src: "/images/partners/databricks.png", alt: "Databricks" },
     website: "https://www.databricks.com",
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
    id: "nvidia",
    name: "NVIDIA",
    image: { src: "/images/partners/nvidia.png", alt: "NVIDIA" },
    website: "https://www.nvidia.com",
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

// Fixed at 4 — the Figma card is exactly 4 static slots, each owning
// one independent LogoShift instance, which in turn owns exactly one
// logo pair (per the Framer component's "one logo pair per instance"
// model — not an arbitrary-length rotation).
const SLOT_COUNT = 4;
const PAIR_SIZE = 2;

/**
 * Builds the 4 fixed pairs consumed by the 4 LogoShift instances:
 * the first 8 asset-verified logos, taken in fixed roster order and
 * chunked consecutively — [0,1], [2,3], [4,5], [6,7]. Deterministic,
 * never randomized, never duplicated as filler.
 *
 * SLOT_COUNT * PAIR_SIZE (8) vs. the current 9-item roster: one logo
 * is left over and intentionally not shown, rather than force-fitting
 * it into an instance that's only supposed to hold two. Whichever
 * logo sorts last in ALL_PARTNER_LOGOS (currently Databricks) is the
 * one held in reserve. This is a roster-size fact, not a design
 * decision — the fix is either trimming the roster to exactly 8, or
 * extending the card to a 5th slot; flagged below via a dev warning
 * so it's never silently forgotten.
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