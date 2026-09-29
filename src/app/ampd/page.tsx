import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { Gradient } from "@/components/effects/Gradient";
import Link from "next/link";
import { Hero } from "@/components/sections/Services/Hero";
import { RunningToday } from "@/components/sections/Services/RunningToday";
import {
  AmpdBuildEnvironment,
  AmpdBuildIntro,
  AmpdSpecCards,
  AmpdHtmlEmbed,
  type AmpdBuildIntroLayout,
} from "@/components/sections/Ampd/AmpdBuildEnvironment";
import { PartnerAgentTeams } from "@/components/sections/Partners/Detail/PartnerAgentTeams";
import { DatabricksBusinessContext } from "@/components/sections/Partners/Detail/DatabricksBusinessContext";
import { AIStack } from "@/components/sections/Homepage/AIStack";
import { Cube } from "@/components/ui/Icon/Cube";
import {
  AgenticEngineeringNow,
  type AgenticEngineeringMetric,
} from "@/components/sections/Ampd/AgenticEngineeringNow";
import type { RunningTodayMetric } from "@/data/services";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "@/components/ui/Icon/ArrowUpRight";
import Image from "next/image";
import {
  getAmpdPage,
  getAmpdSection,
  type AmpdTabBlock,
  type AmpdTabItem,
} from "@/data/ampd";
import styles from "./AmpdPage.module.css";

const pageData = getAmpdPage();

// The build-matrix HTML carries its own title/intro; the Amp'd panel already
// provides them, so the embed hides these elements (source file untouched).
const EMBED_HIDDEN_INTRO = [".wrap > h1", ".wrap > .bar", ".wrap > .sub", ".wrap > .intro"];

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

  // 4. "Agentic engineering now": rich_text block = body copy, metric blocks = cards.
  const agenticSection = getAmpdSection("agentic-engineering-now");
  const agenticBlocks = (agenticSection?.blocks ?? []) as {
    id: string;
    type: string;
    body?: string | null;
    value?: string;
    label?: string;
  }[];
  const agenticBody =
    agenticBlocks.find((b) => b.type === "rich_text")?.body ?? null;
  const agenticMetrics: AgenticEngineeringMetric[] = agenticBlocks
    .filter((b) => b.type === "metric")
    .map((b) => ({ id: b.id, value: b.value ?? "", label: b.label ?? "" }));

  // 5. "What changes when your enterprise gets Amp'd": tab cards + one glass
  // panel; every `tab` block renders its own panel from its items.
  const whatChangesSection = getAmpdSection("what-changes");
  const tabBlocks = (whatChangesSection?.blocks ?? []).filter(
    (block): block is AmpdTabBlock =>
      (block as AmpdTabBlock).type === "tab"
  );
  // 6. "Inside the Amp'd build environment": the first three heading words
  // ("Inside the Amp'd") render in brand purple.
  const buildEnvSection = getAmpdSection("inside-ampd-build-environment");
  const buildEnvWords = (buildEnvSection?.data.heading ?? "").split(" ");
  const buildEnvAccent = buildEnvWords.slice(0, 3).join(" ");
  const buildEnvRest = buildEnvWords.slice(3).join(" ");

  // Foundation bento (shared AIStack, MLOps service layouts/images) — shown
  // where a tab lists `{ "type": "section", "id": "foundation" }`.
  const foundationSection = getAmpdSection("foundation");
  const foundationCards = (
    (foundationSection?.blocks ?? []) as {
      id: string;
      title?: string;
      description?: string;
      bullets?: string[];
      layout?: string;
      media?: { src: string } | null;
    }[]
  ).map((block) => ({
    id: block.id,
    title: block.title ?? "",
    description: block.description ?? "",
    bullets: block.bullets ?? [],
    backgroundImage: block.media?.src ?? "",
    accentColor: "var(--color-brand-primary, #8500DF)",
    layout: (block.layout ?? "data") as "data",
  }));

  const youtubeId =
    videoMedia?.src.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    )?.[1] ?? videoMedia?.src;
  const [line1, ...rest] = (footerCta?.heading ?? "").split(/<br\s*\/?>/i);

  // One tab panel: intro (layout follows its content), then each item group
  // in data order — numberedItem → spec cards, card → PartnerAgentTeams,
  // embed → HTML embed, section → Foundation (AIStack), feature → icon cards.
  // `tag` items become the intro's pills, an `image` item with a src its
  // illustration; the tab's CTA sits under the copy.
  const renderTabPanel = (tab: AmpdTabBlock) => {
    const itemsOf = (type: AmpdTabItem["type"]) =>
      tab.items.filter((item) => item.type === type);
    const tags = itemsOf("tag");
    const illustration = itemsOf("image").find((item) => item.media?.src);
    const layout: AmpdBuildIntroLayout = illustration
      ? "media"
      : tags.length > 0
        ? "offset"
        : itemsOf("embed").length > 0
          ? "split"
          : "stacked";
    const groups = tab.items
      .map((item) => item.type)
      .filter((type, i, all) => all.indexOf(type) === i);

    const renderGroup = (type: AmpdTabItem["type"]) => {
      const items = itemsOf(type);
      switch (type) {
        case "numberedItem":
          return (
            <AmpdSpecCards
              key={type}
              cards={items.map((item) => ({
                id: item.id,
                title: item.title ?? "",
                body: item.body ?? "",
              }))}
            />
          );
        case "card":
          return (
            <div key={type} className={styles.ampdSubCards}>
              {/* Same card grid as the Azure partner page's
                  "What Agivant brings to Azure." section. */}
              <PartnerAgentTeams
                id={`${tab.id}-cards`}
                data={{
                  heading: "",
                  description: "",
                  cards: items.map((item) => ({
                    id: item.id,
                    title: item.title ?? "",
                    text: item.body ?? "",
                    ribbon: item.media?.src ?? "",
                  })),
                }}
                columns={3}
                height="auto"
                hideAccentBar
              />
            </div>
          );
        case "embed":
          return items.map((item) =>
            item.media?.src ? (
              <AmpdHtmlEmbed
                key={item.id}
                src={item.media.src}
                title={item.title ?? item.media.alt ?? ""}
                hideSelectors={EMBED_HIDDEN_INTRO}
              />
            ) : null
          );
        case "section":
          return items.some((item) => item.id === "foundation") &&
            foundationSection &&
            foundationCards.length > 0 ? (
            <div key={type} className={styles.ampdFoundation}>
              <AIStack
                variant="service"
                heading={foundationSection.data.heading ?? undefined}
                showCta={false}
                cards={foundationCards}
              />
            </div>
          ) : null;
        case "feature":
          return (
            <div key={type} className={styles.ampdFeatureCards}>
              {/* Shared DatabricksBusinessContext icon cards (3 + 2). */}
              <DatabricksBusinessContext
                id={`${tab.id}-cards`}
                height="auto"
                data={{
                  heading: "",
                  description: "",
                  closingStatement: "",
                  cards: items.map((item) => ({
                    id: item.id,
                    title: item.title ?? "",
                    description: item.body ?? "",
                  })),
                }}
              />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <>
        <AmpdBuildIntro
          eyebrow={tab.eyebrow}
          heading={tab.heading}
          body={tab.body}
          layout={layout}
          tags={tags.map((tag) => tag.title ?? "").filter(Boolean)}
          action={
            tab.cta?.enabled ? (
              <Link href={tab.cta.href}>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<Cube />}
                  className={styles.ampdPanelCta}
                >
                  {tab.cta.label}
                </Button>
              </Link>
            ) : null
          }
          aside={
            illustration?.media?.src ? (
              <Image
                src={illustration.media.src}
                alt={illustration.media.alt ?? ""}
                fill
                sizes="(max-width: 1024px) 24rem, 30rem"
              />
            ) : null
          }
        />
        {groups.map(renderGroup)}
      </>
    );
  };

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
              height="viewport"
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

          {/* 4. "Agentic engineering now" — Amp'd section component. */}
          {agenticSection && (
            <AgenticEngineeringNow
              id={agenticSection.id}
              heading={agenticSection.data.heading ?? ""}
              description={agenticSection.data.description}
              body={agenticBody}
              metrics={agenticMetrics}
              ribbon={agenticSection.data.media}
            />
          )}

          {/* 5. "What changes when your enterprise gets Amp'd" — tab cards
              and one glass panel (AmpdBuildEnvironment); each panel is
              rendered here on the server from its `tab` block. */}
          {whatChangesSection && tabBlocks.length > 0 && (
            <AmpdBuildEnvironment
              id={whatChangesSection.id}
              heading={whatChangesSection.data.heading ?? ""}
              highlightWords={3}
              tabs={tabBlocks.map((tab) => ({
                id: tab.id,
                title: tab.title,
                media: tab.media,
              }))}
              panels={tabBlocks.map((tab) => renderTabPanel(tab))}
            />
          )}

          {/* 6. "Inside the Amp'd build environment" — heading, subheading and
              description, then the existing interactive build-matrix HTML
              (same-origin AmpdHtmlEmbed; its own title/intro are hidden). */}
          {buildEnvSection?.data.media?.src && (
            <Section
              height="auto"
              id={buildEnvSection.id}
              className={styles.ampdBuildEnv}
            >
              <Gradient
                top="-6rem"
                left="-14rem"
                size="30rem"
                stops={["#f6048d 0%", "#b31aef 45%", "transparent 72%"]}
                opacity={0.14}
                blur="90px"
              />
              <Container size="xl">
                <h2 className={styles.ampdBuildEnvTitle}>
                  <span className={styles.ampdBuildEnvAccent}>
                    {buildEnvAccent}
                  </span>{" "}
                  {buildEnvRest}
                </h2>
                {buildEnvSection.data.subheading && (
                  <p className={styles.ampdBuildEnvSubtitle}>
                    {buildEnvSection.data.subheading}
                  </p>
                )}
                {buildEnvSection.data.description && (
                  <p className={styles.ampdBuildEnvText}>
                    {buildEnvSection.data.description}
                  </p>
                )}
                <AmpdHtmlEmbed
                  src={buildEnvSection.data.media.src}
                  title={
                    buildEnvSection.data.media.alt ??
                    buildEnvSection.data.heading ??
                    ""
                  }
                  hideSelectors={EMBED_HIDDEN_INTRO}
                  className={styles.ampdBuildEnvEmbed}
                />
              </Container>
            </Section>
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
                        width: footerCta.media.src.endsWith(".gif") ? 400 : 282,
                        height: footerCta.media.src.endsWith(".gif") ? 225 : 94,
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
