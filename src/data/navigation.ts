/**
 * data/navigation.ts
 *
 * Mock data source for the Header's primary navigation. Shaped as an
 * async getter — not a static export — for the same reason as
 * getAnnouncement(): swapping this file's internals for a real
 * Headless WordPress menu fetch later requires zero changes to Header.tsx.
 *
 * Today: resolves instantly with hardcoded mock data.
 * Later:  will `fetch()` a WordPress REST/GraphQL endpoint (e.g. the
 *         WP menus API) and return the same shape.
 */

export interface MegaMenuItem {
  id: string;
  title: string;
  description: string;
  href: string;
  isViewAll?: boolean;
}

export interface MegaMenuFeatureCard {
  title: string;
  description: string;
}

export interface MegaMenuCategory {
  id: "services" | "solutions" | "partnerships" | string;
  label: string;
  href: string;
  featureCard: MegaMenuFeatureCard;
  items: MegaMenuItem[];
}

export interface MegaMenuBottomBar {
  /** Optional stats line on the left of the bar (omitted = not rendered). */
  statsHighlight?: string;
  statsText?: string;
  ctaPrefix: string;
  ctaHighlight: string;
  ctaHref: string;
}

export interface MegaMenuImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** One slide of the optional featured carousel (e.g. a press release). */
export interface MegaMenuFeaturedItem {
  id: string;
  title: string;
  description?: string;
  /** Destination; empty string = not linked yet. */
  href: string;
  image: MegaMenuImage;
  logos: MegaMenuImage[];
}

/** Optional featured carousel shown in the right panel instead of the item grid. */
export interface MegaMenuFeatured {
  heading: string;
  items: MegaMenuFeaturedItem[];
}

export interface MegaMenuData {
  title: string;
  categories: MegaMenuCategory[];
  bottomBar: MegaMenuBottomBar;
  /** Category selected when the menu opens. Defaults to the first category. */
  defaultCategoryId?: string;
  /** When present, the right panel renders this carousel instead of the item grid. */
  featured?: MegaMenuFeatured;
}

export interface NavigationItem {
  /** Stable unique key for list rendering. */
  id: string;
  /** Visible link text. */
  label: string;
  /** Link destination. */
  href: string;
  /** Optional mega menu configuration. If present, item acts as a mega-menu trigger. */
  megaMenu?: MegaMenuData;
}

const mockNavigation: NavigationItem[] = [
  {
    id: "what-we-build",
    label: "What We Build",
    href: "/services", // Fallback destination if JS is disabled
    megaMenu: {
      title: "What We Build",
      categories: [
        {
          id: "services",
          label: "Services",
          href: "/services",
          featureCard: {
            title: "Services",
            description:
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
          },
          items: [
            {
              id: "agentic-ai-agentops",
              title: "Agentic AI & AgentOps",
              description: "Lorem ipsum dolor sitLorem ipsum dolor",
              href: "/services",
            },
            {
              id: "ai-ml-engineering",
              title: "AI & ML Engineering",
              description: "Lorem ipsum dolor sitLorem ipsum dolor",
              href: "/services",
            },
            {
              id: "ai-ml-operations",
              title: "AI & ML Operations",
              description: "Lorem ipsum dolor sitLorem ipsum dolor",
              href: "/services",
            },
            {
              id: "cloud-platform-engineering",
              title: "Cloud & Platform Engineering",
              description: "Lorem ipsum dolor sitLorem ipsum dolor",
              href: "/services",
            },
            {
              id: "data-engineering-data-science",
              title: "Data Engineering & Data Science",
              description: "Lorem ipsum dolor sitLorem ipsum dolor",
              href: "/services",
            },
          ],
        },
        {
          id: "solutions",
          label: "Solutions",
          href: "/solutions",
          featureCard: {
            title: "Solutions",
            description:
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
          },
          items: [
            {
              id: "goal-driven-enterprise-agents",
              title: "Goal-Driven Enterprise Agents",
              description:
                "Agivant builds agentic AI systems that read a goal, work across enterprise tools.",
              href: "/solutions/goal-driven-agents-enterprise-workflows",
            },
            {
              id: "verbatim-ai-customer-intelligence",
              title: "Verbatim AI Customer Intelligence",
              description:
                "Transforms omnichannel customer conversations into automated insights.",
              href: "/solutions/verbatim-ai",
            },
            {
              id: "autonomous-operations-platform",
              title: "Autonomous Operations Platform",
              description:
                "Autonomous operations platform with agent mesh across business processes.",
              href: "/solutions/agentic-ai-autonomous-operations",
            },
            {
              id: "operations-brain-intelligence",
              title: "Operations Brain Intelligence",
              description:
                "Unified telemetry and reasoning across multi-agent enterprise deployments.",
              href: "/solutions/operations-brain-intelligence",
            },
            {
              id: "salesforce-velocity-platform",
              title: "Salesforce Velocity Platform",
              description:
                "Accelerate quote-to-cash with agent-assisted enterprise CRM workflows.",
              href: "/solutions/salesforce-velocity-platform",
            },
            {
              id: "servicenow-workflow-automation",
              title: "ServiceNow Workflow Automation",
              description:
                "Modernize enterprise service management with cognitive incident resolution.",
              href: "/solutions/servicenow-workflow-automation",
            },
            {
              id: "ai-product-tech-support",
              title: "AI Product Tech Support",
              description:
                "Next-generation customer support with cognitive agent assist and resolution.",
              href: "/solutions/ai-product-tech-support",
            },
            {
              id: "agivant-spend-ai",
              title: "Agivant Spend AI",
              description:
                "Procurement intelligence and FinOps cost optimization driven by AI agents.",
              href: "/solutions/agivant-spend-ai",
            },
            {
              id: "view-all-solutions",
              title: "View all 49 solutions",
              description:
                "Browse functional domains, technology stacks, and solution canvases.",
              href: "/solutions",
              isViewAll: true,
            },
          ],
        },
        {
          id: "partnerships",
          label: "Partnerships",
          href: "/partners",
          featureCard: {
            title: "Partnerships",
            description:
              "Collaborating with leading technology ecosystem partners to deliver scalable AI solutions.",
          },
          items: [],
        },
      ],
      bottomBar: {
        statsHighlight: "45 solutions",
        statsText: "across industries and business functions",
        ctaPrefix: "Need something specific?",
        ctaHighlight: "Let's build it together",
        ctaHref: "/contact",
      },
    },
  },
  { id: "client-success", label: "Client Success", href: "/client-success" },
  { id: "agent-library", label: "Agent Library", href: "/agent-library" },
  {
    id: "resources",
    label: "Resources",
    href: "/resources", // Fallback destination if JS is disabled
    megaMenu: {
      title: "Resources",
      defaultCategoryId: "talk-tech",
      categories: [
        {
          id: "research",
          label: "Research",
          href: "",
          featureCard: {
            title: "Research",
            description:
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
          },
          items: [],
        },
        {
          id: "talk-tech",
          label: "Talk Tech",
          href: "/talktech",
          featureCard: {
            title: "Talk Tech",
            description:
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
          },
          items: [],
        },
      ],
      featured: {
        heading: "Whats New",
        items: [
          {
            id: "press-gemini-enterprise",
            title: "Agivant partners with Google Cloud",
            description:
              "to set up a dedicated Gemini Enterprise practice to accelerate custom AI agent development",
            href: "/press-releases/gemini-enterprise",
            image: {
              src: "/images/partners/gemini/agentic-enterprise/agentic-enterprise-control.png",
              alt: "Agivant partners with Google Cloud",
              width: 874,
              height: 558,
            },
            logos: [
              { src: "/images/logo/agivant-logo.svg", alt: "Agivant", width: 167, height: 33 },
              { src: "/images/partners/gemini.png", alt: "Gemini Enterprise", width: 249, height: 91 },
            ],
          },
          {
            id: "press-databricks",
            title:
              "Agivant Partners With Databricks To Help Enterprises Turn Enterprise Data Into Trusted Context For AI",
            description:
              "Agivant's agentic AI, data engineering and enterprise AI solutions built on the Databricks Data + AI Platform help organizations build the next generation of AI-native businesses.",
            href: "",
            image: {
              src: "/images/mega-menu/card2.png",
              alt: "Agivant and Databricks partnership",
              width: 166,
              height: 227,
            },
            logos: [
              { src: "/images/logo/agivant-logo.svg", alt: "Agivant", width: 167, height: 33 },
              { src: "/images/partners/databricks.png", alt: "Databricks", width: 249, height: 91 },
            ],
          },
          {
            id: "press-glean",
            title:
              "Agivant Technologies Announces Collaboration with Glean to Advance Enterprise Work AI and Agentic AI Transformation",
            href: "/press-releases/glean",
            image: {
              src: "/images/mega-menu/card3.png",
              alt: "Agivant and Glean collaboration",
              width: 166,
              height: 227,
            },
            logos: [
              { src: "/images/logo/agivant-logo.svg", alt: "Agivant", width: 167, height: 33 },
              { src: "/images/partners/glean.png", alt: "Glean", width: 249, height: 91 },
            ],
          },
        ],
      },
      bottomBar: {
        ctaPrefix: "Need something specific?",
        ctaHighlight: "Let's build it together",
        ctaHref: "/contact",
      },
    },
  },
  { id: "careers", label: "Careers", href: "/careers" },
  { id: "about-us", label: "About Us", href: "/about" },
];

/**
 * Returns the current primary navigation items.
 *
 * Async by design: Header already awaits this, so replacing the body
 * below with a real WordPress menu fetch is a change confined entirely
 * to this file.
 */
export async function getNavigation(): Promise<NavigationItem[]> {
  return mockNavigation;
}

