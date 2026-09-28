import clsx from "clsx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageRibbon } from "@/components/ui/PageRibbon";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { PartnerHero } from "@/components/sections/Partners/Detail/PartnerHero";
import { PartnerIntro } from "@/components/sections/Partners/Detail/PartnerIntro";
import { Phase2 } from "@/components/sections/Blogs/Article/Phase2";
import { PartnerAlternatingContent } from "@/components/sections/Partners/Detail/PartnerAlternatingContent";
import { getPressRelease, getAllPressReleaseSlugs } from "@/data/pressReleases";
import styles from "./PressReleasePage.module.css";

interface PressReleasePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPressReleaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PressReleasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const pressRelease = await getPressRelease(slug);
  if (!pressRelease) {
    return { title: "Press Release Not Found | Agivant" };
  }
  return {
    title: pressRelease.meta.title,
    description: pressRelease.meta.description,
  };
}

/**
 * Press Release page (/press-releases/[slug]).
 *
 * Thin, data-driven composition of existing components:
 * universal Header + PageRibbon + PartnerHero (logo above the heading)
 * + PartnerIntro (announcement heading and paragraphs)
 * + Phase2 (numbered list, e.g. "Key Pillars")
 * + PartnerIntro (quote cards)
 * + PartnerAlternatingContent (image/text "About" rows, inline purple/black
 *   heading variant).
 * Body sections are added section by section.
 */
export default async function PressReleasePage({
  params,
}: PressReleasePageProps) {
  const { slug } = await params;
  const pressRelease = await getPressRelease(slug);

  if (!pressRelease) {
    notFound();
  }

  const {
    hero,
    intro,
    additionalIntros,
    numberedList,
    quotes,
    alternatingContent,
    footer,
  } = pressRelease;

  return (
    <GradientLayerProvider>
      <div className={clsx(styles.page)} data-press-release={slug}>
        <Header />

        {hero.ribbonSrc && (
          <PageRibbon
            src={hero.ribbonSrc}
            width={hero.ribbonWidth ?? 1440}
            height={hero.ribbonHeight ?? 696}
            className={styles.ribbonWrapper}
            imageClassName={styles.ribbonImage}
            priority
          />
        )}

        <main id="main-content">
          <PartnerHero hero={hero} logoPosition="above" />
          {intro && <PartnerIntro intro={intro} />}
          {numberedList && (
            <Phase2
              id="key-pillars"
              title={numberedList.heading}
              items={numberedList.items}
              highlightPosition="start"
              highlightCount={numberedList.highlightCount ?? 3}
              dividerVariant="accent"
            />
          )}
          {additionalIntros
            .filter((s) => !s.afterQuotes)
            .map((s) => (
              <PartnerIntro key={s.id} intro={s.intro} id={s.id} />
            ))}
          {quotes && <PartnerIntro intro={quotes} id="leadership-quotes" />}
          {additionalIntros
            .filter((s) => s.afterQuotes)
            .map((s) => (
              <PartnerIntro key={s.id} intro={s.intro} id={s.id} />
            ))}
          {alternatingContent && (
            <PartnerAlternatingContent
              data={alternatingContent}
              variant="tigergraph"
              height="auto"
              id={alternatingContent.id}
            />
          )}
        </main>

        {footer && (
          <Footer
            variant="partner-card"
            className={styles.footer}
            ctaData={footer}
          />
        )}
      </div>
    </GradientLayerProvider>
  );
}
