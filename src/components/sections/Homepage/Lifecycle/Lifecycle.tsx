import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { LifecycleHeader } from "./LifecycleHeader";
import { LifecycleCards } from "./LifecycleCards";
import { LifecycleSummary } from "./LifecycleSummary";
import type { LifecycleCardStage } from "./LifecycleCard";
import {
  getLifecycleHeader,
  getLifecycleStages,
  getLifecycleSummary,
  type LifecycleSummaryData,
} from "@/data/lifecycle";
import { Gradient } from "@/components/effects/Gradient";
import styles from "./Lifecycle.module.css";

export interface LifecycleRibbonData {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface LifecycleProps {
  heading?: string | { highlight: string; suffix: string };
  eyebrow?: string | null;
  description?: string | null;
  stages?: LifecycleCardStage[];
  summary?: LifecycleSummaryData | null;
  showSummary?: boolean;
  showConnector?: boolean;
  initialActiveIndex?: number;
  autoRotate?: boolean;
  enableModal?: boolean;
  showLearnMore?: boolean;
  indicatorVariant?: "dots" | "numbered";
  ribbon?: LifecycleRibbonData | null;
  showBackgroundArtwork?: boolean;
  className?: string;
}

/**
 * Lifecycle
 *
 * The "AI-Native Engineering Lifecycle" section on Homepage &
 * "The Amp'd Way" on Service Inner Pages:
 * - Eyebrow & Heading
 * - Horizontal Stages Cards with active state and smooth transitions
 * - Numbered or Dot pagination indicator
 * - Optional Animated Chevron Connector & Amplify Summary
 * - Supports optional background decorative ribbon
 */
export async function Lifecycle({
  heading,
  eyebrow,
  description,
  stages: propStages,
  summary: propSummary,
  showSummary = true,
  showConnector = true,
  initialActiveIndex = 0,
  autoRotate = true,
  enableModal = true,
  showLearnMore = true,
  indicatorVariant = "dots",
  ribbon,
  showBackgroundArtwork = true,
  className,
}: LifecycleProps = {}) {
  const isCustomData = Boolean(propStages && propStages.length > 0);

  const [headerData, stagesData, summaryData] = isCustomData
    ? [null, propStages!, propSummary || null]
    : await Promise.all([
        getLifecycleHeader(),
        getLifecycleStages(),
        getLifecycleSummary(),
      ]);

  const resolvedEyebrow = eyebrow !== undefined ? eyebrow : headerData?.eyebrow;
  const resolvedHeading =
    heading !== undefined
      ? heading
      : headerData
      ? { highlight: headerData.title.highlight, suffix: headerData.title.suffix }
      : "";
  const resolvedDescription =
    description !== undefined ? description : headerData?.description;
  const stages = propStages || stagesData;
  const summary = propSummary !== undefined ? propSummary : summaryData;

  const hasActiveRibbon = showBackgroundArtwork && Boolean(ribbon);

  return (
    <section className={clsx(styles.lifecycle, hasActiveRibbon && styles.hasRibbon, className)}>
      {hasActiveRibbon && ribbon && (
        <div className={styles.ribbonWrapper} aria-hidden="true">
          <Image
            src={ribbon.src}
            alt={ribbon.alt || ""}
            width={ribbon.width || 1440}
            height={ribbon.height || 1834}
            className={styles.ribbonImage}
            unoptimized
            priority={false}
          />
        </div>
      )}

      {showBackgroundArtwork && !ribbon && (
        <>
          <Gradient
            top="5%"
            right="30%"
            size="49rem"
            stops={[
              "color-mix(in srgb, #f2dc84ce 70%, transparent) 0%",
              "transparent 65%",
            ]}
            opacity={0.45}
            blur="10px"
          />
          <Gradient
            kind="linear"
            angle="180deg"
            top="40%"
            left="-25%"
            size="32rem"
            stops={["#b31aef 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
            opacity={0.2}
            blur="90px"
          />
        </>
      )}

      <Container>
        <div className={styles.inner}>
          <LifecycleHeader
            eyebrow={resolvedEyebrow}
            title={resolvedHeading}
            description={resolvedDescription}
          />

          <LifecycleCards
            stages={stages}
            initialActiveIndex={initialActiveIndex}
            autoRotate={autoRotate}
            enableModal={enableModal}
            showLearnMore={showLearnMore}
            indicatorVariant={indicatorVariant}
          />

          {showConnector && (
            <div className={styles.connector} aria-hidden="true">
              <svg viewBox="0 0 24 30" fill="none" className={styles.connectorIcon}>
                <path
                  className={styles.connectorArrow1}
                  d="M5 5L12 12L19 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  className={styles.connectorArrow2}
                  d="M5 13L12 20L19 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  className={styles.connectorArrow3}
                  d="M5 21L12 28L19 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {showSummary && summary && (
            <LifecycleSummary
              title={summary.title}
              description={summary.description}
              cta={summary.cta}
              details={summary.details}
            />
          )}
        </div>
      </Container>
    </section>
  );
}