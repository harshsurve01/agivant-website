import { Container } from "@/components/ui/Container";
import type { ExecutiveBriefProps } from "./types";
import styles from "./ExecutiveBrief.module.css";
import { Gradient } from "@/components/effects/Gradient";

/**
 * ExecutiveBrief
 *
 * Renders the Blog Inner page's "Executive Brief" section: a small
 * brand-colored accent bar beside a two-tone heading, followed by
 * the section's body copy. Figma: node 2097:1282 ("Executive
 * Brief"), 2097:1288 (accent bar), 2097:1290 (body copy), all direct
 * children of "Blog Inside page" (node 2097:1214) — this section has
 * no dedicated Figma frame of its own, unlike the Hero above it.
 *
 * `title`'s last word is rendered in the brand highlight color,
 * mirroring the same two-tone pattern Featured already uses for its
 * own heading (first word highlighted there) — kept purely
 * presentational, not encoded in the data, same reasoning as
 * Featured.
 *
 * No shared background/particle treatment here — Figma shows this
 * section on the page's plain white background, unlike Hero, so
 * HeroBackground is intentionally not used. Container IS reused,
 * same "xl" default ArticleHero's own Container already renders at
 * — its 1280px max-width plus padding lines up with Figma's ~96px
 * left edge for this content closely enough (1280px container in a
 * 1440px frame + the shared --container-padding-inline token lands
 * at 100px) that a dedicated width value isn't warranted here.
 *
 * Server Component: no "use client", no hooks, no state, no effects,
 * no data imports. Every value arrives via props, so this component
 * is already shaped for a future WordPress-sourced article object
 * with zero changes required on this end.
 */
export function ExecutiveBrief({ title, paragraphs }: ExecutiveBriefProps) {
  const words = title.split(" ");
  const highlighted = words[words.length - 1];
  const rest = words.slice(0, -1).join(" ");

  return (
    <section className={styles.executiveBrief}>
             <Gradient
              top="20%"
              right="25%"
              size="45rem"
              stops={["#8500df 50%", "#edbf79 55%", "transparent 75%"]}
              opacity={0.15}
              blur="80px"
            />
      <Gradient
        top="25%"
        left="-18%"
        size="42rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
      
      <Gradient
        top="60%"
        right="25%"
        size="42rem"
        stops={[
          "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
          "transparent 100%",
        ]}
        opacity={0.4}
        blur="60px"
      />
         <Gradient
        kind="linear"
        angle="180deg"
        top="70%"
        right="25%"
        size="45rem"
        stops={["#b31aef44 0%", "#f6048d 31%", "#f88c54 78%", "#ff7670 100%"]}
        opacity={0.15}
        blur="90px"
      />
      <Container>
        <div className={styles.headingRow}>
          <span className={styles.bar} aria-hidden="true" />
          <h2 className={styles.title}>
            {rest ? `${rest} ` : ""}
            <span className={styles.highlight}>{highlighted}</span>
          </h2>
        </div>

        <div className={styles.body}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
