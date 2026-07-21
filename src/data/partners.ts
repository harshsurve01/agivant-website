/**
 * data/partners.ts
 *
 * CMS-ready data layer for the Partners section. Every shape here is
 * designed to be the exact JSON contract a future Headless WordPress
 * (or any headless CMS) response would return — so swapping the body
 * of each getter below from a static object to a `fetch()` call is
 * the only change needed later. No component imports fetch/query
 * logic directly; they only import these types and getters.
 */

/** One partner brand's logo asset. Maps to an ACF/WP "logo" field group. */
export interface PartnerLogo {
  id: string;
  name: string;
  image: {
    src: string;
    alt: string;
  };
  website?: string;
}

/**
 * One visual slot in the strip. `logos` holds every logo that will
 * ever cycle through this slot; today only `logos[0]` is rendered.
 * `delay` is the future stagger offset (ms) for that slot's fade-up/
 * rise-in animation — unused today, but part of the contract so the
 * animation work later is additive, not a data-model migration.
 */
export interface PartnerLogoSlot {
  id: string;
  delay: number;
  logos: PartnerLogo[];
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

/* --------------------------------------------------------------------
   Static content (today's "CMS response").
   Each getter is async and awaited independently in Partners.tsx via
   Promise.all — this is intentional so that swapping any one of these
   for a real WP REST/GraphQL call later doesn't change the calling
   component at all.
   -------------------------------------------------------------------- */

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

// Exported name matches Partners.tsx's import (`getPartnersHeader`).
export const getPartnersHeader = getPartnersHeaderContent;

async function getPartnerLogoSlotsContent(): Promise<PartnerLogoSlot[]> {
  return [
    /**
     * Slot 1 — Glean is logos[0] (today's visible logo). AWS and Azure
     * are queued behind it for the future shift animation; nothing
     * renders them yet, PartnerLogoShift only reads logos[0].
     */
    {
      id: "slot-glean",
      delay: 0,
      logos: [
        {
          id: "glean",
          name: "Glean",
          image: {
            src: "/images/partners/glean.png",
            alt: "Glean",
          },
          website: "https://www.glean.com",
        },
        {
          id: "aws",
          name: "AWS",
          image: {
            src: "/images/partners/aws.png",
            alt: "AWS",
          },
          website: "https://aws.amazon.com",
        },
        {
          id: "azure",
          name: "Azure",
          image: {
            src: "/images/partners/azure.png",
            alt: "Azure",
          },
          website: "https://azure.microsoft.com",
        },
      ],
    },
    /**
     * Slot 2 — ServiceNow visible today; Salesforce and Shopify queued.
     */
    {
      id: "slot-servicenow",
      delay: 150,
      logos: [
        {
          id: "servicenow",
          name: "ServiceNow",
          image: {
            src: "/images/partners/servicenow.png",
            alt: "ServiceNow",
          },
          website: "https://www.servicenow.com",
        },
        {
          id: "salesforce",
          name: "Salesforce",
          image: {
            src: "/images/partners/salesforce.png",
            alt: "Salesforce",
          },
          website: "https://www.salesforce.com",
        },
        {
          id: "shopify",
          name: "Shopify",
          image: {
            src: "/images/partners/shopify.png",
            alt: "Shopify",
          },
          website: "https://www.shopify.com",
        },
      ],
    },
    /**
     * Slot 3 — Gemini Enterprise visible today; Databricks and
     * TigerGraph queued.
     */
    {
      id: "slot-gemini-enterprise",
      delay: 300,
      logos: [
        {
          id: "gemini-enterprise",
          name: "Gemini Enterprise",
          image: {
            src: "/images/partners/gemini-enterprise.png",
            alt: "Gemini Enterprise",
          },
          website: "https://cloud.google.com",
        },
        {
          id: "databricks",
          name: "Databricks",
          image: {
            src: "/images/partners/databricks.png",
            alt: "Databricks",
          },
          website: "https://www.databricks.com",
        },
        {
          id: "tigergraph",
          name: "TigerGraph",
          image: {
            src: "/images/partners/tigergraph.png",
            alt: "TigerGraph",
          },
          website: "https://www.tigergraph.com",
        },
      ],
    },
    /**
     * Slot 4 — NVIDIA visible today. Only one logo supplied for this
     * slot; `logos` stays a single-item array (not padded with
     * duplicates) so the future animation naturally has nothing to
     * cycle to here until a second partner is added — no data-model
     * change needed when that happens, just a new array entry.
     */
    {
      id: "slot-nvidia",
      delay: 450,
      logos: [
        {
          id: "nvidia",
          name: "NVIDIA",
          image: {
            src: "/images/partners/nvidia.png",
            alt: "NVIDIA",
          },
          website: "https://www.nvidia.com",
        },
      ],
    },
  ];
}

// Exported name matches Partners.tsx's import (`getPartnerLogoSlots`).
export const getPartnerLogoSlots = getPartnerLogoSlotsContent;

async function getPartnersCTAContent(): Promise<PartnersCTA> {
  return {
    label: "See our ecosystem partnerships",
    href: "/partners",
  };
}

// Exported name matches Partners.tsx's import (`getPartnersCTA`).
export const getPartnersCTA = getPartnersCTAContent;
