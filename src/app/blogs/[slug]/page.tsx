import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { FooterButton, FooterBrandMedia } from "@/data/footer";
import { Article } from "@/components/sections/Blogs/Article";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import {
  getBlogDetail,
  getAllBlogDetailSlugs,
} from "@/data/blogDetail";
import styles from "./BlogArticlePage.module.css";

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-renders all Blog inner pages defined in the JSON data registry (including aliases).
 */
export function generateStaticParams() {
  return getAllBlogDetailSlugs().map((slug) => ({ slug }));
}

/**
 * Generates page metadata dynamically from the Blog JSON SEO/hero data.
 */
export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogDetail(slug);

  if (!article) {
    return { title: "Blog Not Found | Agivant" };
  }

  return {
    title: article.seo?.title ?? `${article.title} | Blog | Agivant`,
    description: article.seo?.description ?? article.hero?.summary ?? "",
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;

  const article = await getBlogDetail(slug);

  if (!article) {
    notFound();
  }

  const footerButtons: FooterButton[] = [];
  if (
    article.footerCta?.primaryCta?.enabled &&
    article.footerCta.primaryCta.label
  ) {
    footerButtons.push({
      label: article.footerCta.primaryCta.label,
      href: article.footerCta.primaryCta.href ?? "/ampd-score",
      variant: "dark",
      icon: "arrow-up-right",
    });
  }
  if (
    article.footerCta?.secondaryCta?.enabled &&
    article.footerCta.secondaryCta.label
  ) {
    footerButtons.push({
      label: article.footerCta.secondaryCta.label,
      href: article.footerCta.secondaryCta.href ?? "/contact",
      variant: "primary",
      icon: "cube",
    });
  }

  let footerHeading = article.footerCta?.heading;
  if (article.slug === "is-your-tech-sabotaging-business" && footerHeading) {
    footerHeading = footerHeading
      .replace(
        "Need Help Making Sense Of It All? ",
        "Need Help Making Sense Of It All?<br />"
      )
      .replace(
        "We Are Always Happy To Chat About ",
        "We Are Always Happy To Chat About<br />"
      )
      .replace(
        "The Latest E-Commerce Trends ",
        "The Latest E-Commerce Trends<br />"
      );
  }

  return (
    <GradientLayerProvider>
      <Header />

      <main id="main-content">
        <Article data={article} />
      </main>

      {article.showFooter !== false && article.footerCta?.enabled ? (
        <Footer
          className={
            article.slug === "is-your-tech-sabotaging-business"
              ? styles.techSabotagingFooter
              : undefined
          }
          ctaData={{
            heading: footerHeading
              ? footerHeading.replace(/<br\s*\/?>/gi, "\n")
              : article.footerCta.heading.replace(/<br\s*\/?>/gi, "\n"),
            description: article.footerCta.subheading ?? undefined,
            brandMedia: article.footerCta.media?.src
              ? {
                  kind: (article.footerCta.media.kind as FooterBrandMedia["kind"]) ?? "animation",
                  src: article.footerCta.media.src,
                  alt: article.footerCta.media.alt ?? "Amp'd",
                  width: 240,
                  height: 80.46,
                }
              : null,
            buttons: footerButtons,
          }}
        />
      ) : article.showFooter !== false ? (
        <Footer />
      ) : null}
    </GradientLayerProvider>
  );
}
