import blog1Json from "./blog-is-your-tech-sabotaging-business.json";
import blog2Json from "./blog-measuring-productivity-gains-genai-without-hype.json";
import blog3Json from "./blog-agentic-ai-transforming-software-engineering-digital-commerce.json";
import blog4Json from "./blog-agentic-ai-transforming-software-engineering-digital-commerce-enterprise-guide.json";
import blog5Json from "./blog-what-makes-an-ai-agent-enterprise-grade.json";
import type { BlogDetailPage } from "@/types/blogDetail";

const blog1: BlogDetailPage = blog1Json as unknown as BlogDetailPage;
const blog2: BlogDetailPage = blog2Json as unknown as BlogDetailPage;
const blog3: BlogDetailPage = blog3Json as unknown as BlogDetailPage;
const blog4: BlogDetailPage = blog4Json as unknown as BlogDetailPage;
const blog5: BlogDetailPage = blog5Json as unknown as BlogDetailPage;

/**
 * Single source of truth collection of all individual Blog Detail Pages.
 */
export const allBlogDetails: BlogDetailPage[] = [
  blog1,
  blog2,
  blog3,
  blog4,
  blog5,
];

/**
 * Blog detail registry by canonical slug, including safe slug aliases.
 * The Blog Hub currently links to "measuring-productivity-gains-genai-application",
 * which maps to the canonical "measuring-productivity-gains-genai-without-hype".
 */
const BLOG_DETAILS_DATA: Record<string, BlogDetailPage> = {
  [blog1.slug]: blog1,
  [blog2.slug]: blog2,
  "measuring-productivity-gains-genai-application": blog2,
  [blog3.slug]: blog3,
  [blog4.slug]: blog4,
  [blog5.slug]: blog5,
};

/**
 * Resolves a Blog Detail page by its canonical slug or alias.
 */
export async function getBlogDetail(
  slug: string
): Promise<BlogDetailPage | null> {
  return BLOG_DETAILS_DATA[slug] ?? null;
}

/**
 * Returns all available Blog Detail slugs (canonical and aliases) for static generation.
 */
export function getAllBlogDetailSlugs(): string[] {
  return Object.keys(BLOG_DETAILS_DATA);
}

/**
 * Returns the complete collection of all individual Blog Detail Pages.
 */
export function getAllBlogDetails(): BlogDetailPage[] {
  return allBlogDetails;
}

export function getAllBlogs(): BlogDetailPage[] {
  return allBlogDetails;
}
