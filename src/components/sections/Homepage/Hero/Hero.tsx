import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getHero } from "@/data/hero";
import CubeIcon from "@/assets/icons/cube.svg";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import { HeroMediaBackground } from "@/components/ui/HeroBackground/HeroMediaBackground";
import { HeroBackground } from "@/components/ui/HeroBackground/HeroBackground";
import { AmpdLogoAnimation } from "./AmpdLogoAnimation";
import styles from "./Hero.module.css";

/**
 * Hero (New Homepage Hero)
 *
 * Server Component consuming single-string heading and standard data contract.
 */
export async function Hero() {
  const { heading, announcement, background, primaryCta, secondaryCta } =
    await getHero();

  const [line1 = "", line2 = ""] = announcement.text.split(/<br\s*\/?>/i);
  const altKey = announcement.media.alt || "Amp'd";
  const [prefix = "", suffix = ""] = line1.split(altKey);

  return (
    <section className={styles.hero} data-hero-interaction-root>
      <HeroMediaBackground data={background} />
      <HeroBackground />

      <Container>
        <div className={styles.content}>
          <h1 className={styles.heading}>{heading}</h1>

          <div className={styles.announcement}>
            <div className={styles.announcementLine1}>
              {prefix && <span>{prefix.trim()}</span>}
              <AmpdLogoAnimation data={announcement.media} />
              {suffix && <span>{suffix.trim()}</span>}
            </div>
            {line2 && (
              <span className={styles.announcementLine2}>
                {line2.trim()}
              </span>
            )}
          </div>

          <div className={styles.actions}>
            {primaryCta?.enabled && (
              <Link href={primaryCta.href}>
                <Button variant="dark" size="lg" rightIcon={<ArrowUpRightIcon />}>
                  {primaryCta.label}
                </Button>
              </Link>
            )}
            {secondaryCta?.enabled && (
              <Link href={secondaryCta.href}>
                <Button variant="primary" size="lg" rightIcon={<CubeIcon />}>
                  {secondaryCta.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}