import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { WhatAgivantBuiltProps } from "./types";
import styles from "./WhatAgivantBuilt.module.css";
import { Gradient } from "@/components/effects/Gradient";

/**
 * WhatAgivantBuilt (Case Study Section 4)
 *
 * Renders Section 4 ("What Agivant built") for the Case Study detail page:
 * - Section heading ("What" in Agivant purple, "Agivant built" in black)
 * - Intro paragraph
 * - 2×2 card grid with upper image frame and lower content box
 *
 * Data-driven from JSON blocks. Server Component.
 */
export function WhatAgivantBuilt({
  title = "What Agivant built",
  description,
  cards,
}: WhatAgivantBuiltProps) {
  // Split title: highlight "What" in purple, rest in black
  const titleParts = title.startsWith("What ")
    ? { highlight: "What", rest: title.slice(4) }
    : { highlight: null, rest: title };

  return (
    <section className={styles.whatAgivantBuilt}>
             <Gradient
                    kind="linear"
                    angle="180deg"
                    top="-12%"
                    left="-25%"
                    size="40rem"
                    stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
                    opacity={0.15}
                    blur="90px"
                  />
      <Container className={styles.container}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.title}>
            {titleParts.highlight ? (
              <>
                <span className={styles.titleHighlight}>{titleParts.highlight}</span>
                {titleParts.rest}
              </>
            ) : (
              title
            )}
          </h2>

          {description && <p className={styles.description}>{description}</p>}

          <div className={styles.cardsGrid}>
            {cards.map((card) => (
              <div key={card.id} className={styles.card} tabIndex={0}>
                {card.imageSrc && (
                  <div className={styles.imageWrapper}>
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt || card.title}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 572px"
                    />
                  </div>
                )}

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDescription}>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
