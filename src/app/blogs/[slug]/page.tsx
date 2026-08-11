import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Article } from "@/components/sections/Blogs/Article";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { blogArticles, getArticleBySlug } from "@/data/blogs";

/**
 * Blog Inner page (/blogs/[slug]).
 *
 * Same role app/blogs/page.tsx plays for the Blogs page: this is the
 * only thing that renders for this route, and the only thing that
 * knows how to go from a URL slug to the data <Article /> needs.
 * <Article /> itself has no article-selection logic of its own — it
 * only knows how to render whatever ArticlePageData it's handed, same
 * as <Blogs /> only knows how to render whatever BlogsPageData it's
 * handed. Selection (matching the slug, handling a miss) lives here,
 * one level up, exactly where blogsPageData's page.tsx sibling keeps
 * its own equivalent (none needed there, since it has only one page's
 * worth of data to pass through).
 *
 * Preserves the same GradientLayerProvider → Header → main → Footer
 * shell the main Blogs page uses, so the two routes share one visual
 * shell/background architecture rather than each inventing their own.
 *
 * Imports `Article` from its own barrel (`./Article`), NOT from the
 * `Blogs` section barrel (`@/components/sections/Blogs`) — that
 * barrel only exports `Blogs`/`BlogsPageData`, it does not re-export
 * `Article`. Importing `Article` from there was the route's original
 * bug (would compile to an unresolvable/undefined import).
 */

interface BlogArticlePageProps {
  // Next.js 16: `params` is a Promise in Server Component page props —
  // synchronous access is no longer supported and throws at request
  // time. Must be awaited before use, same as searchParams/cookies/headers.
  params: Promise<{ slug: string }>;
}

/**
 * Pre-renders one path per known article slug. Falls out naturally
 * once `blogArticles` is swapped for a real headless-WordPress query
 * — this function's shape doesn't change, only where `blogArticles`
 * comes from does.
 */
export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;

  // TEMPORARY DEBUG LOGGING — remove once the 404 cause is confirmed.
  console.log("BLOG SLUG:", JSON.stringify(slug));
  console.log("KNOWN SLUGS:", blogArticles.map((a) => a.slug));

  const article = getArticleBySlug(slug);

  // TEMPORARY DEBUG LOGGING — remove once the 404 cause is confirmed.
  console.log("ARTICLE FOUND:", !!article);

  // Unknown/not-yet-authored slug (including the other hub/featured
  // slugs that don't have Article-page content yet — see blogs.ts's
  // own comment on `blogArticles`) — defer to Next's 404 rather than
  // rendering a partial page.
  if (!article) {
    notFound();
  }

  // `slug` is BlogArticleData's own lookup key, not part of
  // ArticlePageData — stripped off before spreading the rest into
  // <Article />, so Article's prop contract stays exactly what
  // Article/types.ts declares, with no extra/unused prop passed in.
  const { slug: _slug, ...articleData } = article;

  return (
    <GradientLayerProvider>
      <Header />

      <main>
        <Article {...articleData} />
      </main>

      <Footer />
    </GradientLayerProvider>
  );
}