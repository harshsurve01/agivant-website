import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Cube } from "@/components/ui/Icon/Cube";
import { Gradient } from "@/components/effects/Gradient";
import type { PartnerIntroData } from "@/types/partnerDetail";
import styles from "./PartnerIntro.module.css";

export interface PartnerIntroProps {
  intro: PartnerIntroData;
}

/**
 * PartnerIntro
 *
 * Section 2 of the Partner Detail Page (/partners/[slug]).
 *
 * Reusable, generic presentation component designed for headless CMS / backend data:
 * - Receives all editorial copy (heading, paragraphs, quote/statement card, CTA) as props.
 * - Extracts first character from leadershipQuote.quote for drop-cap presentation styling if present.
 * - Supports either a leadership quote card (Gemini, Databricks) or a centered statement/highlight card (Shopify).
 * - Consumes design tokens exclusively from variables.css.
 */
export function PartnerIntro({ intro }: PartnerIntroProps) {
  const { heading, paragraphs, leadershipQuote, statementCard, cta } = intro;

  const quoteText = leadershipQuote?.quote ?? "";
  const firstLetter = quoteText.charAt(0);
  const restOfQuote = quoteText.slice(1);

  return (
    <section
      className={clsx(
        styles.section,
        statementCard && styles.hasStatementCard
      )}
      id="partner-intro"
    >
      {/* Soft ambient background gradients when statementCard is present */}
      {statementCard && (
        <>
          <Gradient
            kind="linear"
            angle="180deg"
            top="15%"
            left="-15%"
            size="28rem"
            stops={[
              "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
              "transparent 100%",
            ]}
            opacity={0.35}
            blur="75px"
          />
          <Gradient
            kind="linear"
            angle="180deg"
            top="45%"
            right="-15%"
            size="32rem"
            stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
            opacity={0.15}
            blur="90px"
          />
        </>
      )}

      <Container size="xl" className={styles.container}>
        {/* Section Heading with Purple Vertical Accent Bar (rendered only if heading copy exists) */}
        {Boolean(
          heading?.prefix?.trim() ||
            heading?.highlight?.trim() ||
            heading?.suffix?.trim()
        ) && (
          <div className={styles.headingWrapper}>
            <span className={styles.accentBar} aria-hidden="true" />
            <h2 className={styles.heading}>
              {heading.prefix && (
                <span className={styles.headingBlock}>{heading.prefix}</span>
              )}
              {heading.highlight && (
                <span className={styles.purpleText}>{heading.highlight} </span>
              )}
              {heading.suffix && (
                <span className={styles.darkText}>{heading.suffix}</span>
              )}
            </h2>
          </div>
        )}

        {/* Intro Paragraphs */}
        <div className={styles.paragraphs}>
          {paragraphs.map((p, idx) => (
            <p key={idx} className={styles.paragraph}>
              {p}
            </p>
          ))}
        </div>

        {/* Leadership Quote Glass Card */}
        {leadershipQuote && leadershipQuote.quote && (
          <div
            className={styles.quoteCard}
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            {/* Left Column: Arched purple backdrop + Portrait */}
            <div className={styles.portraitColumn}>
              <div className={styles.portraitBackdrop} aria-hidden="true" />
              <div className={styles.portraitWrapper}>
                <Image
                  src={leadershipQuote.author.portraitSrc}
                  alt={leadershipQuote.author.name}
                  width={260}
                  height={320}
                  className={styles.portrait}
                  priority
                />
              </div>
            </div>

            {/* Right Column: Stylized quotation marks, quote text, author info */}
            <div className={styles.quoteContent}>
              <div className={styles.quoteBody}>
                <blockquote className={styles.quoteText}>
                  <svg
                    width="42"
                    height="30"
                    viewBox="0 0 42 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.openQuoteSvg}
                    aria-hidden="true"
                  >
                    <path
                      d="M0 12C0 5.37258 5.37258 0 12 0H18V6H12C8.68629 6 6 8.68629 6 12V14H18V32H0V12Z"
                      fill="currentColor"
                    />
                    <path
                      d="M24 12C24 5.37258 29.3726 0 36 0H42V6H36C32.6863 6 30 8.68629 30 12V14H42V32H24V12Z"
                      fill="currentColor"
                    />
                  </svg>
                  {firstLetter && (
                    <span className={styles.dropCap}>{firstLetter}</span>
                  )}
                  {restOfQuote}
                  <svg
                    width="42"
                    height="30"
                    viewBox="0 0 42 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.closeQuoteSvg}
                    aria-hidden="true"
                  >
                    <path
                      d="M18 20C18 26.6274 12.6274 32 6 32H0V26H6C9.31371 26 12 23.3137 12 20V18H0V0H18V20Z"
                      fill="currentColor"
                    />
                    <path
                      d="M42 20C42 26.6274 36.6274 32 30 32H24V26H30C33.3137 26 36 23.3137 36 20V18H24V0H42V20Z"
                      fill="currentColor"
                    />
                  </svg>
                </blockquote>
              </div>

              <div className={styles.authorMeta}>
                <span className={styles.authorName}>
                  {leadershipQuote.author.name}
                </span>
                <span className={styles.authorRole}>
                  {leadershipQuote.author.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Statement / Highlight Glass Card */}
        {statementCard && statementCard.text && (
          <div
            className={styles.statementCard}
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <p className={styles.statementText}>{statementCard.text}</p>
          </div>
        )}

        {/* Accelerator CTA */}
        {cta && (
          <div className={styles.ctaWrapper}>
            <Link href={cta.href}>
              <Button
                variant="primary"
                size="lg"
                rightIcon={cta.icon === "cube" ? <Cube /> : undefined}
              >
                {cta.label}
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
