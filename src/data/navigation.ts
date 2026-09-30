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
  /** Hide the mega menu's bottom bar while this category is selected. Defaults to false (bar shown). */
  hideBottomBar?: boolean;
  /** Placeholder for the search field shown on this category (Solutions). */
  searchPlaceholder?: string;
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
          hideBottomBar: true,
          featureCard: {
            title: "Services",
            description:
              "Agivant engineers every layer of the AI stack, so isolated AI wins become an enterprise-wide advantage.",
          },
          items: [
            {
              id: "cloud-platform-engineering",
              title: "Cloud & Platform Engineering",
              description: "The infrastructure data, models and agents all run on",
              href: "/services",
            },
            {
              id: "data-engineering-data-science",
              title: "Data Engineering & Advanced Analytics",
              description: "Clean, reliable data and analytics teams can act on",
              href: "/services",
            },
            {
              id: "ai-ml-engineering",
              title: "AI & ML Engineering",
              description: "Models and RAG systems tuned to the domain, from spec to production",
              href: "/services",
            },
            {
              id: "ai-ml-operations",
              title: "MLOps & Scalable ML Platforms",
              description: "The release path that takes a model from notebook to production",
              href: "/services",
            },
            {
              id: "agentic-ai-agentops",
              title: "Agentic AI & AgentOps",
              description: "Agents that run the work and answer for every action",
              href: "/services",
            },
          ],
        },
        {
          id: "solutions",
          label: "Solutions",
          href: "/solutions",
          hideBottomBar: true,
          searchPlaceholder: "Search solutions by industry or domains",
          featureCard: {
            title: "Solutions",
            description:
              "Agentic AI solutions engineered for real business value, already running in production.",
          },
          items: [
            {
              id: "agentic-ai-autonomous-operations",
              title: "Agentic AI for autonomous operations",
              description:
                "Goal-driven agents working the tools that hold the task",
              href: "/solutions/agentic-ai-autonomous-operations",
            },
            {
              id: "agentic-mesh-deployment",
              title: "Agentic Mesh Deployment",
              description:
                "One agent network holding context across the enterprise",
              href: "/solutions/agentic-mesh-deployment",
            },
            {
              id: "agentic-silicon-lifecycle-platform",
              title: "Agentic Silicon Lifecycle Platform",
              description:
                "Design verification and yield correlation under one policy layer",
              href: "/solutions/agentic-silicon-lifecycle-platform",
            },
            {
              id: "autonomous-operations-brain",
              title: "Autonomous Operations Brain",
              description:
                "Incidents explained, then resolved inside the shift they open in",
              href: "/solutions/autonomous-operations-brain",
            },
            {
              id: "agentic-salesforce-velocity-platform",
              title: "Agentic Salesforce Velocity Platform",
              description:
                "Coordinated agent teams working inside Salesforce",
              href: "/solutions/agentic-salesforce-velocity-platform",
            },
            {
              id: "servicenow-workflow-automation",
              title: "Workflow automation",
              description:
                "Launch confidence, predicted weeks ahead of the date",
              href: "/solutions/servicenow-workflow-automation",
            },
            {
              id: "ai-product-tech-support",
              title: "AI product tech support",
              description:
                "AI products kept accurate and affordable in production",
              href: "/solutions/ai-product-tech-support",
            },
            {
              id: "agivant-spend-ai",
              title: "Agivant Spend AI",
              description:
                "Idle licenses reclaimed, demand forecast ahead of renewal",
              href: "/solutions/agivant-spend-ai",
            },
            {
              id: "view-all-solutions",
              title: "Explore all key solutions",
              description:
                "30 to 70% shorter cycle times, with first results in days and weeks",
              href: "/solutions",
              isViewAll: true,
            },
          ],
        },
        {
          id: "partnerships",
          label: "Partnerships",
          href: "/partners",
          hideBottomBar: true,
          featureCard: {
            title: "Ecosystem partnerships",
            description:
              "Agivant is trusted by global partners across the cloud, data, AI and workflow platforms enterprises depend on.",
          },
          items: [
            {
              id: "gemini-enterprise",
              title: "Gemini Enterprise",
              description: "Agents built on Google's Agent Development Kit",
              href: "/partners/gemini-enterprise",
            },
            {
              id: "databricks",
              title: "Databricks",
              description: "Bronze Partner, building agents on the Lakehouse",
              href: "/partners/databricks",
            },
            {
              id: "aws",
              title: "AWS",
              description: "Well-Architected practice for every migration",
              href: "/partners/aws",
            },
            {
              id: "azure",
              title: "Azure",
              description: "Optimization practice, built on Agivant's own AOAF",
              href: "/partners/azure",
            },
            {
              id: "salesforce",
              title: "Salesforce",
              description: "Agent teams working inside Data Cloud and Agentforce",
              href: "/partners/salesforce",
            },
            {
              id: "glean",
              title: "Glean",
              description: "Work AI collaboration, built on domain accelerators",
              href: "/partners/glean",
            },
            {
              id: "servicenow",
              title: "ServiceNow",
              description: "AI-first migration and automation practice",
              href: "/partners/servicenow",
            },
            {
              id: "nvidia",
              title: "NVIDIA",
              description: "GPU-native AI practice on the full CUDA stack",
              href: "/partners/nvidia",
            },
            {
              id: "shopify",
              title: "Shopify",
              description: "Agentic commerce on the Shopify platform",
              href: "/partners/shopify",
            },
            {
              id: "tigergraph",
              title: "TigerGraph",
              description: "Named Global Engineering Center partner",
              href: "/partners/tigergraph",
            },
          ],
        },
      ],
      bottomBar: {
        statsText: "Solutions engineered across industries and business functions",
        ctaPrefix: "Need something specific?",
        ctaHighlight: "Let's build it together",
        ctaHref: "/contact",
      },
    },
  },
  { id: "client-success", label: "Client Success", href: "/case-studies" },
  { id: "agent-library", label: "Agent Library", href: "/agent-library" },
  {
    id: "resources",
    label: "Resources",
    href: "/blogs",
    megaMenu: {
      title: "Resources",
      defaultCategoryId: "research",
      categories: [
        {
          id: "research",
          label: "Research",
          href: "/blogs",
          featureCard: {
            title: "Research",
            description:
              "Field notes and decision frameworks from the engineers putting AI into production.",
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
              "The agentic AI era, explained by the engineers building it.",
          },
          items: [],
        },
      ],
      featured: {
        heading: "What's new",
        items: [
          {
            id: "press-gemini-enterprise",
            title:
              "Agivant partners with Google Cloud on a dedicated Gemini Enterprise practice",
            description:
              "A dedicated practice built to accelerate custom AI agent development on Google Cloud.",
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
              "Agivant partners with Databricks to turn enterprise data into trusted context for AI",
            description:
              "Agentic AI, data engineering and enterprise AI solutions built on the Databricks Data + AI Platform.",
            href: "/press-releases/databricks",
            image: {
              src: "/images/mega-menu/card2.png",
              alt: "Agivant and Databricks partnership",
              width: 1264,
              height: 1181,
            },
            logos: [
              { src: "/images/logo/agivant-logo.svg", alt: "Agivant", width: 167, height: 33 },
              { src: "/images/partners/databricks.png", alt: "Databricks", width: 249, height: 91 },
            ],
          },
          {
            id: "press-glean",
            title:
              "Agivant announces a collaboration with Glean to advance enterprise Work AI",
            description:
              "A collaboration to put enterprise knowledge in reach of agents that can act on it.",
            href: "/press-releases/glean",
            image: {
              src: "/images/mega-menu/card3.png",
              alt: "Agivant and Glean collaboration",
              width: 1264,
              height: 1181,
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

