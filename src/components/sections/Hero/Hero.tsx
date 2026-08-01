import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getHero } from "@/data/hero";
// SVGR: imports each SVG as a React component (inline markup) rather
// than a static asset URL — see chat history for why that's preferred
// over next/image for small UI icons. Adjust paths if the real files
// land somewhere else in /assets.
import CubeIcon from "@/assets/icons/cube.svg";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import { HeroBackground } from "./HeroBackground";
import { ShineHighlight } from "./ShineHighlight";
import styles from "./Hero.module.css";

/**
 * Hero
 *
 * The homepage hero: heading, description, and two CTAs. Still owns
 * its own layout, spacing, typography, and CTA placement — none of
 * that changed in Sprint 1 (Hero Experience). What did change: the
 * content below is now wrapped in HeroBackground, which owns the two
 * breathing ambient glows and the decorative ellipse stroke behind it
 * (see HeroBackground.tsx). The headline's third line is still a
 * fixed, non-rotating phrase — "real business value" never changes to
 * a different word set — but it's no longer a static <span>: it's
 * wrapped in ShineHighlight, which reveals it word-by-word on mount
 * and then loops a shine sweep across it (see ShineHighlight.tsx).
 * Particles and headline motion are later sprints in that same file's
 * doc comment — none of them touch this file either; each is its own
 * component nested inside HeroBackground as it's built out.
 *
 * Server Component: no "use client", no hooks, no state, no effects
 * of its own. It's async because it awaits its data source directly —
 * the same pattern already used by AnnouncementBar and Header.
 * ShineHighlight is a client component, but importing/rendering a
 * client component from a server component is fine in Next.js — the
 * "use client" boundary lives in ShineHighlight.tsx itself, not here.
 *
 * ASSET NOTE: no Amp'd SVG file was supplied at implementation time.
 * The <Image> below points at "/images/hero/ampd.svg", which does
 * not yet exist in /public. Drop the real exported asset at that path;
 * the width/height below are placeholder intrinsic dimensions to
 * replace once the real file is available.
 */
export async function Hero() {
  const { title, tagline, description, primaryCTA, secondaryCTA } =
    await getHero();

  return (
    <section className={styles.hero}>
      <div className={styles.background} />

      <HeroBackground>
        <Container>
          <div className={styles.content}>
            {/*
              Heading is explicitly split into three structural lines to
              match the Figma, rather than relying on natural text wrap
              at a given viewport width. Each line is its own block-level
              span (see .headingLine in Hero.module.css) so the break
              points are deterministic regardless of container width.

              This structure is deliberately future-proof for the GSAP
              iteration: each line (and the highlighted word) is already
              an isolated node, so a future animation pass can target
              .headingLine / .highlight directly without touching markup
              again. No animation, GSAP, or client state is introduced
              here — this is layout-only scaffolding.
            */}
            <h1 className={styles.heading}>
              <span className={styles.headingLine}>
                {title.prefix}{" "}
                <span className={styles.assetWrapper}>
                  <Image
                    src="/images/hero/ampd-wordmark.svg" // TODO: replace with the real supplied asset
                    alt={title.highlightedAsset}
                    width={160} // TODO: replace with real asset's intrinsic width
                    height={48} // TODO: replace with real asset's intrinsic height
                    className={styles.assetImage}
                  />
                </span>
              </span>
              <span className={styles.headingLine}>{title.suffix}</span>
              <span className={styles.headingLine}>
                <ShineHighlight
                  text="real business value"
                  className={styles.highlight}
                />
              </span>
            </h1>

            <p className={styles.tagline}>{tagline}</p>
            <p className={styles.description}>{description}</p>

            <div className={styles.actions}>
              {/*
                TODO(a11y/html-validity): Link > Button nests two
                interactive elements (an <a> wrapping a <button>), which
                is invalid HTML and can cause double-firing/focus issues
                with assistive tech. Left as-is intentionally for now —
                do not redesign Button or Hero to fix this here.
                Once the homepage is completed, refactor Button into a
                polymorphic component (e.g. an `as`/`asChild` prop) or
                introduce a dedicated LinkButton so CTAs render a single
                valid interactive element instead of nesting <a><button>.

                Order below matches the Figma's visual left-to-right
                layout (dark CTA, then primary CTA) rather than the data
                object's field order.
              */}
              <Link href={secondaryCTA.href}>
                <Button variant="dark" size="lg" rightIcon={<ArrowUpRightIcon />}>
                  {secondaryCTA.label}
                </Button>
              </Link>
              <Link href={primaryCTA.href}>
                <Button variant="primary" size="lg" rightIcon={<CubeIcon />}>
                  {primaryCTA.label}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </HeroBackground>
    </section>
  );
}