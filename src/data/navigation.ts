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
  statsHighlight: string;
  statsText: string;
  ctaPrefix: string;
  ctaHighlight: string;
  ctaHref: string;
}

export interface MegaMenuData {
  title: string;
  categories: MegaMenuCategory[];
  bottomBar: MegaMenuBottomBar;
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
  { id: "resources", label: "Resources", href: "/resources" },
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

