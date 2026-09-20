import { HeroBackground } from "@/components/ui/HeroBackground";
import { Container } from "@/components/ui/Container";
import { PageRibbon } from "@/components/ui/PageRibbon";
import styles from "./Hero.module.css";

export interface ContactHeroProps {
  heading: string;
  description: string;
  ribbonSrc?: string;
  ribbonWidth?: number;
  ribbonHeight?: number;
}

export function Hero({
  heading,
  description,
  ribbonSrc = "/images/contact/contact-hero-abstract.png",
  ribbonWidth = 1920,
  ribbonHeight = 860,
}: ContactHeroProps) {
  return (
    <section className={styles.hero} data-hero-interaction-root>
      <HeroBackground />

      <PageRibbon
        src={ribbonSrc}
        width={ribbonWidth}
        height={ribbonHeight}
        className={styles.ribbonWrapper}
        imageClassName={styles.ribbonImage}
        priority
      />

      <Container className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>{heading}</h1>
          <p className={styles.description}>{description}</p>
        </div>
      </Container>
    </section>
  );
}
