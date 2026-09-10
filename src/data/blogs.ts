import type { BlogsPageData } from "@/components/sections/Blogs";
import type { BlogsHeroProps } from "@/components/sections/Blogs/Hero";
import type { FeaturedProps } from "@/components/sections/Blogs/Featured";
import type {
  BlogHubProps,
  BlogFilterOption,
  BlogHubArticle,
} from "@/components/sections/Blogs/BlogHub";
import blogsJson from "./blogs.json";
import { allBlogDetails } from "./blogDetail";

/* ==========================================================================
   BLOG LANDING PAGE JSON CONTRACT & DATA ACCESS LAYER
   Landing-page-level configuration is sourced from `src/data/blogs.json`.
   Individual blog content and metadata belong to `src/data/blog-*.json`
   via `allBlogDetails` (the single source of truth).
   ========================================================================== */

export interface BlogMedia {
  kind: string;
  src: string | null;
  assetKey: string | null;
  alt: string | null;
  caption: string | null;
}

export interface BlogCTA {
  enabled: boolean;
  label: string | null;
  href: string | null;
  external: boolean;
}

export interface BlogCardRecord {
  id: string;
  type: string;
  slug: string;
  title: string;
  body: string | null;
  author: string | null;
  publishedDate: string | null;
  category?: string | null;
  readTime?: string | null;
  topicId?: string;
  topicLabel?: string;
  readTimeId?: string;
  readTimeLabel?: string;
  audienceId?: string;
  audienceLabel?: string;
  media: BlogMedia | null;
  cta?: BlogCTA;
  items?: string[];
}

export interface BlogSectionData {
  eyebrow: string | null;
  heading: string | null;
  description: string | null;
  columns: unknown[];
  media: BlogMedia | null;
  cta: BlogCTA | null;
}

export interface BlogFiltersConfig {
  topics: BlogFilterOption[];
  readTimeOptions: BlogFilterOption[];
  audienceOptions: BlogFilterOption[];
}

export interface BlogSection {
  id: string;
  type: string;
  enabled: boolean;
  conditions: unknown | null;
  data: BlogSectionData;
  filters?: BlogFiltersConfig;
  featuredSlug?: string;
  blocks?: BlogCardRecord[];
}

export interface BlogLandingPageDocument {
  schemaVersion: string;
  pageType: string;
  slug: string;
  title: string;
  seo: {
    title: string | null;
    description: string | null;
    canonical: string | null;
    ogImage: string | null;
  };
  hero: {
    eyebrow: string | null;
    title: string;
    subtitle: string | null;
    summary: string | null;
    authors?: unknown[];
    partner?: unknown | null;
    media?: BlogMedia | null;
    primaryCta?: BlogCTA | null;
    secondaryCta?: BlogCTA | null;
    search?: {
      placeholder: string;
      buttonLabel: string;
    };
  };
  sections: BlogSection[];
  footerCta?: {
    enabled: boolean;
    heading: string;
    subheading: string | null;
    partner: unknown | null;
    primaryCta: BlogCTA | null;
    secondaryCta: BlogCTA | null;
  };
}

const blogsData: BlogLandingPageDocument = blogsJson as unknown as BlogLandingPageDocument;

/**
 * Hero adapter: converts normalized JSON hero to BlogsHeroProps.
 * Converts `<br>` to `\n` to match Hero's eyebrow/headline split presentation.
 */
export const blogsHero: BlogsHeroProps = {
  heading: blogsData.hero.title.replace(/<br\s*\/?>/gi, "\n"),
  description: blogsData.hero.summary ?? "",
  search: {
    placeholder:
      blogsData.hero.search?.placeholder ??
      "Search by keywords, services and tools...",
    buttonLabel: blogsData.hero.search?.buttonLabel ?? "Search",
  },
};

/**
 * Featured section adapter: selects the featured blog from allBlogDetails
 * (defaulting to the slug configured in blogs.json or the first article) and maps
 * it to the presentation contract consumed by Featured.tsx.
 */
const featuredSection = blogsData.sections.find((s) => s.id === "featured");
const featuredSlug =
  featuredSection?.featuredSlug ??
  "agentic-ai-transforming-software-engineering-digital-commerce";
const featuredBlog =
  allBlogDetails.find((b) => b.slug === featuredSlug) ?? allBlogDetails[0];

export const blogsFeatured: FeaturedProps = {
  title: featuredSection?.data.heading ?? "Top Picks for You",
  article: {
    slug: featuredBlog.slug,
    image:
      featuredBlog.thumbnail?.media?.src ??
      "/images/blogs/featured-card.png",
    imageAlt:
      featuredBlog.thumbnail?.media?.alt ??
      "Abstract render of flowing blue ribbon shapes symbolizing autonomous agent workflows",
    category: featuredBlog.category ?? "Agentic AI",
    readTime: featuredBlog.readTime ?? "6 min read",
    author: featuredBlog.hero.authors?.[0]?.name ?? "Executive Team",
    title: featuredBlog.title,
    excerpt: featuredBlog.hero.summary ?? "",
    publishedDate: featuredBlog.hero.date ?? "June 2026",
    cta: {
      label: "Read Article",
      href: `/blogs/${featuredBlog.slug}`,
    },
  },
};

/**
 * Blog Hub section adapter: reads filter configurations from blogs.json,
 * and derives the Hub presentation cards directly from the single-source-of-truth
 * collection `allBlogDetails`.
 */
const hubSection = blogsData.sections.find((s) => s.id === "blog-hub");

export const blogsHub: BlogHubProps = {
  heading: hubSection?.data.heading ?? "Blog Hub",
  topics: hubSection?.filters?.topics ?? [],
  readTimeOptions: hubSection?.filters?.readTimeOptions ?? [],
  audienceOptions: hubSection?.filters?.audienceOptions ?? [],
  articles: allBlogDetails.map((blog) => {
    const topicOption = hubSection?.filters?.topics.find(
      (t) => t.id === blog.topic
    );
    const audienceOption = hubSection?.filters?.audienceOptions.find(
      (a) => a.id === blog.targetAudience
    );

    return {
      slug: blog.slug,
      topicId: blog.topic ?? "agentic-ai-agentops",
      topicLabel:
        blog.topicLabel ?? topicOption?.label ?? blog.category ?? "Agentic AI",
      readTimeId: blog.readTimeId ?? "quick",
      readTimeLabel: blog.readTime ?? blog.hero.readTime ?? "4 min read",
      audienceId: blog.targetAudience ?? "technical",
      audienceLabel:
        blog.audienceLabel ?? audienceOption?.label ?? "Technical Focus",
      title: blog.title,
      excerpt: blog.hero.summary ?? "",
      author: blog.hero.authors?.[0]?.name ?? "Executive Team",
      publishedDate: blog.hero.date ?? "May 2026",
      cta: {
        label: "Read Article",
        href: `/blogs/${blog.slug}`,
      },
    };
  }),
};

/**
 * Full page data object consumed by <Blogs {...blogsPageData} />.
 */
export const blogsPageData: BlogsPageData = {
  hero: blogsHero,
  featured: blogsFeatured,
  hub: blogsHub,
};

/**
 * Returns the raw Blog Landing Page JSON document.
 */
export function getBlogsPage(): BlogLandingPageDocument {
  return blogsData;
}

/**
 * Returns all articles listed in the Blog Hub.
 */
export function getBlogHubArticles(): BlogHubArticle[] {
  return blogsHub.articles;
}

/**
 * Looks up a Hub article by its canonical slug (or legacy alias).
 */
export function getBlogHubArticleBySlug(slug: string): BlogHubArticle | undefined {
  return blogsHub.articles.find(
    (item) =>
      item.slug === slug ||
      (slug === "measuring-productivity-gains-genai-application" &&
        item.slug === "measuring-productivity-gains-genai-without-hype")
  );
}

/* ============================================================================
   BLOG ARTICLE DATA (Blog Inner / /blogs/[slug])
   ============================================================================
   Migrated to dedicated JSON files (`src/data/blog-*.json`) per
   AGIVANT_JSON_DATA_RULEBOOK.md.
   Data access is handled by `@/data/blogDetail`.
   The exports below are preserved for backward compatibility.
   ============================================================================ */

export type { BlogDetailPage, BlogDetailPage as BlogArticleData } from "@/types/blogDetail";
export {
  getBlogDetail,
  getBlogDetail as getArticleBySlug,
  allBlogDetails,
  allBlogDetails as blogArticles,
  getAllBlogDetailSlugs,
  getAllBlogs,
} from "./blogDetail";
