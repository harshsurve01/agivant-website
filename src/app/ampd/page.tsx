import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import Link from "next/link";
import { Hero } from "@/components/sections/Services/Hero";
import { RunningToday } from "@/components/sections/Services/RunningToday";
import type { RunningTodayMetric } from "@/data/services";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import { getAmpdPage, getAmpdSection } from "@/data/ampd";
import styles from "./AmpdPage.module.css";

const pageData = getAmpdPage();

export const metadata: Metadata = {
  title: pageData.seo.title ?? pageData.title,
  description: pageData.seo.description ?? undefined,
};

/**
 * Amp'd Landing Page (/ampd) — opened from the Header's "Get Amp'd!" button.
 *
 * Stage 1: page shell only — shared Header, empty <main> (sections are added
 * one by one from the Figma), and the universal Footer. The closing CTA uses
 * the Footer's existing `ctaData` composition (same as /services), fed from
 * `footerCta` in ampdPage.json: the heading's `<br>` splits the two lines,
 * the Amp'd media is inserted inline, and the primary CTA is the button.
 */
export default function AmpdPage() {
  const { hero, footerCta } = pageData;

  // 2. "Beyond automation" video (poster first; YouTube loads on click).
  const videoSection = getAmpdSection("beyond-automation");
  const videoMedia = videoSection?.data.media;
  const videoCta = videoSection?.data.cta;
  // 3. "Amp'd in production" stats (shared RunningToday). The purple part of
  // the heading is every word but the last ("Amp'd in" + "production").
  const statsSection = getAmpdSection("ampd-in-production");
  const statsHeading = statsSection?.data.heading ?? "";
  const statsHighlight = statsHeading.split(" ").slice(0, -1).join(" ");

  const youtubeId =
    videoMedia?.src.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    )?.[1] ?? videoMedia?.src;
  const [line1, ...rest] = (footerCta?.heading ?? "").split(/<br\s*\/?>/i);

  return (
    <GradientLayerProvider>
      <div className={styles.page}>
        <Header />

        <main id="main-content" className={styles.main}>
          {/* 1. Hero — shared Services Hero (HeroBackground + particles +
              PageRibbon); Amp'd positioning lives in AmpdPage.module.css. */}
          <Hero
            title={hero.title}
            summary={hero.summary ?? ""}
            primaryCta={hero.primaryCta}
            media={hero.media}
            className={styles.ampdHero}
            ribbonClassName={styles.ampdHeroRibbon}
          />

          {/* 2. "Beyond automation" video — shared VideoPlayer: the poster
              and centred play button show first; the YouTube player only
              loads (and then plays) after the click. */}
          {videoSection && videoMedia?.poster && youtubeId && (
            <Section
              height="auto"
              id={videoSection.id}
              className={styles.ampdVideo}
            >
              <Container size="xl" className={styles.ampdVideoContainer}>
                <VideoPlayer
                  source={{ provider: "youtube", id: youtubeId }}
                  poster={videoMedia.poster}
                  title={videoMedia.alt ?? "Video"}
                  autoPlay
                  className={styles.ampdVideoPlayer}
                />

                {videoCta?.enabled && (
                  <div className={styles.ampdVideoActions}>
                    <Link href={videoCta.href}>
                      <Button
                        variant="primary"
                        size="lg"
                        rightIcon={<ArrowUpRight />}
                      >
                        {videoCta.label}
                      </Button>
                    </Link>
                  </div>
                )}
              </Container>
            </Section>
          )}

          {/* 3. "Amp'd in production" — shared Services RunningToday + StatsCard
              (4 cards; each metric's `detail` renders as the card footnote). */}
          {statsSection && (
            <RunningToday
              id={statsSection.id}
              heading={statsHeading}
              highlightPhrase={statsHighlight}
              metrics={statsSection.blocks as RunningTodayMetric[]}
              columns={4}
              tintLastCard={false}
              className={styles.ampdStats}
            />
          )}
        </main>

        <Footer
          ctaData={
            footerCta?.enabled
              ? {
                  heading: {
                    line1: line1.trim(),
                    line2: rest.length ? rest.join(" ").trim() : undefined,
                  },
                  brandMedia: footerCta.media?.src
                    ? {
                        kind:
                          (footerCta.media.kind as
                            | "animation"
                            | "gif"
                            | "image"
                            | "video") ?? "animation",
                        src: footerCta.media.src,
                        alt: footerCta.media.alt ?? "Amp'd",
                        width: 240,
                        height: 80,
                      }
                    : undefined,
                  buttons: footerCta.primaryCta?.enabled
                    ? [
                        {
                          label: footerCta.primaryCta.label,
                          href: footerCta.primaryCta.href,
                          variant: "primary",
                          icon: "cube",
                        },
                      ]
                    : [],
                }
              : undefined
          }
        />
      </div>
    </GradientLayerProvider>
  );
}
