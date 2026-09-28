import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { PartnerLayerCardsProps } from "./types";
import styles from "./PartnerLayerCards.module.css";

/**
 * Presentational helper to format "How the four layers" in brand purple
 * and "run on Azure." in primary dark text.
 */
function renderHeading(heading: string) {
  const match = "How the four layers";
  if (heading.startsWith(match)) {
    return (
      <>
        <span className={styles.purpleText}>{match}</span>
        <span className={styles.darkText}>{heading.slice(match.length)}</span>
      </>
    );
  }
  return <span className={styles.darkText}>{heading}</span>;
}

/**
 * PartnerLayerCards
 *
 * Section for the Azure Partner Page (/partners/azure):
 * "How the four layers run on Azure."
 *
 * Renders:
 * - Two-tone section heading: "How the four layers" (purple) + "run on Azure." (black)
 * - Supporting description paragraph
 * - 4 stacked horizontal cards representing the four layers:
 *   - Card 1: Data (Image on LEFT, Content on RIGHT)
 *   - Card 2: AI/ML (Content on LEFT, Image on RIGHT)
 *   - Card 3: GenAI (Image on LEFT, Content on RIGHT)
 *   - Card 4: Agentic AI (Content on LEFT, Image on RIGHT)
 *
 * Each card features:
 * - Layer title in brand purple (20px xl semibold)
 * - "What Agivant engineers" label + body description (18px lg)
 * - "Built with" label + technologies list (18px lg)
 * - Artwork with rounded corners
 *
 * Server Component: all data arrives via typed props.
 * Strictly consumes design tokens from variables.css.
 */
export function PartnerLayerCards({
  data,
  height = "auto",
  className,
  id = "azure-four-layers",
}: PartnerLayerCardsProps) {
  if (!data?.cards?.length) return null;

  return (
    <Section
      height={height}
      className={clsx(styles.section, className)}
      id={id}
    >
      <Container size="xl" className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.heading}>{renderHeading(data.heading)}</h2>
          {data.description && (
            <p className={styles.description}>{data.description}</p>
          )}
        </header>

        <div className={styles.cards}>
          {data.cards.map((card, index) => {
            const isImageLeft = index % 2 === 0;

            return (
              <div
                key={card.id}
                className={clsx(
                  styles.card,
                  isImageLeft ? styles.imageLeft : styles.imageRight
                )}
              >
                <div className={styles.imageColumn}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={card.image.src}
                      alt={card.image.alt || card.title}
                      width={card.image.width ?? 320}
                      height={card.image.height ?? 260}
                      className={styles.image}
                    />
                  </div>
                </div>

                <div className={styles.contentColumn}>
                  <h3 className={styles.layerTitle}>{card.title}</h3>

                  <div className={styles.infoGroup}>
                    <h4 className={styles.label}>What Agivant engineers</h4>
                    <p className={styles.bodyText}>{card.body}</p>
                  </div>

                  <div className={styles.infoGroup}>
                    <h4 className={styles.label}>Built with</h4>
                    <p className={styles.solutionText}>{card.solution}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
