import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Gradient } from "@/components/effects/Gradient";
import { AIStackCardShell } from "@/components/sections/Homepage/AIStack/AIStackCardShell";
import { AIStackBullets } from "@/components/sections/Homepage/AIStack/layouts/AIStackBullets";
import type { CleanDataProps, CleanDataCardBlock } from "./types";
import styles from "./CleanData.module.css";

const HIGHLIGHT_KEYWORD = "Clean Data,";

/**
 * CleanData
 *
 * Dedicated Service Inner Page editorial/masonry bento section:
 * "Clean Data, Confident AI"
 *
 * Reuses:
 * - AIStackCardShell for unified glass surface and interactive 3D pointer tilt
 * - AIStackBullets for bullet list typography and markers
 * - Container for max-width alignment
 * - Ambient Gradient effects
 *
 * Server Component: all data arrives via props; no client state.
 */
export function CleanData({ heading, cards, className }: CleanDataProps) {
  const cardAiReady = cards.find((c) => c.id === "ai-ready-platforms");
  const cardDataQuality = cards.find((c) => c.id === "data-quality");
  const cardConversational = cards.find((c) => c.id === "conversational-analytics");
  const cardRealtime = cards.find((c) => c.id === "real-time-pipelines");
  const cardAdvanced = cards.find((c) => c.id === "advanced-analytics");
  const cardDataOps = cards.find((c) => c.id === "data-operations");

  const renderHeading = (text?: string) => {
    if (!text) return null;
    const cleanText = text.replace(/<br\s*\/?>/gi, " ");
    if (cleanText.includes(HIGHLIGHT_KEYWORD)) {
      const parts = cleanText.split(HIGHLIGHT_KEYWORD);
      return (
        <>
          <span className={styles.highlight}>{HIGHLIGHT_KEYWORD}</span>
          {parts.slice(1).join(HIGHLIGHT_KEYWORD)}
        </>
      );
    }
    return cleanText;
  };

  const renderMediaTopCard = (card?: CleanDataCardBlock) => {
    if (!card) return null;
    return (
      <AIStackCardShell>
        <div className={styles.cardContent}>
          {card.media && (
            <div className={styles.mediaTop}>
              <Image
                src={card.media.src}
                alt={card.media.alt ?? card.title}
                width={card.media.width ?? 654}
                height={card.media.height ?? 448}
                className={styles.mediaTopImage}
                unoptimized
              />
            </div>
          )}
          <div className={styles.textBody}>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            {card.bullets && card.bullets.length > 0 && (
              <AIStackBullets bullets={card.bullets} />
            )}
          </div>
        </div>
      </AIStackCardShell>
    );
  };

  return (
    <section className={clsx(styles.section, className)}>
      <Gradient
        top="10%"
        left="-10%"
        size="45rem"
        stops={["#8500df20 0%", "transparent 70%"]}
        opacity={0.4}
        blur="60px"
      />
      <Gradient
        top="40%"
        right="-10%"
        size="40rem"
        stops={["#edbf7925 0%", "transparent 70%"]}
        opacity={0.35}
        blur="70px"
      />

      <Container>
        {heading && (
          <div className={styles.header}>
            <h2 className={styles.heading}>{renderHeading(heading)}</h2>
          </div>
        )}

        <div className={styles.grid}>
          {/* ── LEFT LANE (2fr wide): Upper card + 2 lower half-width cards ── */}
          <div className={styles.laneLeft}>
            {/* Upper: AI-ready data platforms and semantic layers */}
            {renderMediaTopCard(cardAiReady)}

            {/* Lower row: Data quality (left) + Conversational analytics (right) */}
            <div className={styles.laneLeftBottomRow}>
              {/* Left: Data quality, lineage and traceability */}
              {renderMediaTopCard(cardDataQuality)}

              {/* Right: Conversational analytics for leadership (media at bottom) */}
              {cardConversational && (
                <AIStackCardShell>
                  <div className={styles.cardContent}>
                    <div className={styles.textBody}>
                      <h3 className={styles.cardTitle}>{cardConversational.title}</h3>
                      {cardConversational.bullets && cardConversational.bullets.length > 0 && (
                        <AIStackBullets bullets={cardConversational.bullets} />
                      )}
                    </div>
                    {cardConversational.media && (
                      <div className={styles.mediaBottom}>
                        <Image
                          src={cardConversational.media.src}
                          alt={cardConversational.media.alt ?? cardConversational.title}
                          width={cardConversational.media.width ?? 614}
                          height={cardConversational.media.height ?? 408}
                          className={styles.mediaBottomImage}
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </AIStackCardShell>
              )}
            </div>
          </div>

          {/* ── CENTER LANE (1fr wide): One continuous card with text on top and artwork below ── */}
          <div className={styles.laneCenter}>
            {cardRealtime && (
              <AIStackCardShell>
                <div className={clsx(styles.cardContent, styles.centerCardContent)}>
                  <div className={styles.textBody}>
                    <h3 className={styles.cardTitle}>{cardRealtime.title}</h3>
                    {cardRealtime.bullets && cardRealtime.bullets.length > 0 && (
                      <AIStackBullets bullets={cardRealtime.bullets} />
                    )}
                  </div>
                  {cardRealtime.media && (
                    <div className={styles.centerMediaBottom}>
                      <Image
                        src={cardRealtime.media.src}
                        alt={cardRealtime.media.alt ?? cardRealtime.title}
                        width={cardRealtime.media.width ?? 652}
                        height={cardRealtime.media.height ?? 1544}
                        className={styles.centerMediaImage}
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </AIStackCardShell>
            )}
          </div>

          {/* ── RIGHT LANE (1fr wide): Advanced analytics + Data operations ── */}
          <div className={styles.laneRight}>
            {/* Upper: Advanced analytics and knowledge graphs */}
            {renderMediaTopCard(cardAdvanced)}

            {/* Lower: Data operations and annotation at scale */}
            {renderMediaTopCard(cardDataOps)}
          </div>
        </div>
      </Container>
    </section>
  );
}
