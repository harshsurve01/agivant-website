import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Gradient } from "@/components/effects/Gradient";
import { AmpdStep } from "./AmpdStep";
import type { HowYourEnterpriseGetsAmpdSectionData } from "@/data/services";
import styles from "./HowYourEnterpriseGetsAmpd.module.css";

export interface RibbonData {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface HowYourEnterpriseGetsAmpdProps {
  data: HowYourEnterpriseGetsAmpdSectionData;
  ribbon?: RibbonData | null;
  className?: string;
}

/**
 * HowYourEnterpriseGetsAmpd
 *
 * Section 4 of the Services Landing Page & "The Amp'd Way" on Service Inner Pages:
 * - Left-aligned heading: "The Amp'd" (purple) + " Way" (black), or "How your " + "enterprise gets Amp'd"
 * - Optional supporting description
 * - Vertical step rows with number circles, purple titles, dark descriptions,
 *   and thin purple horizontal dividers between each step.
 * - Supports optional background ribbon artwork that can bleed upward under the section above.
 */
export function HowYourEnterpriseGetsAmpd({
  data,
  ribbon: propRibbon,
  className,
}: HowYourEnterpriseGetsAmpdProps) {
  const ribbon = propRibbon ?? data.media ?? null;

  const renderHeading = () => {
    // 1. "The Amp'd" / "The Amp’d" at start
    const ampdMatch = data.heading.match(/^(The Amp['’]d)(.*)$/i);
    if (ampdMatch) {
      return (
        <>
          <span className={styles.highlight}>{ampdMatch[1]}</span>
          {ampdMatch[2]}
        </>
      );
    }

    // 2. Services Landing Page: "How your enterprise gets Amp'd"
    const landingHighlight = "enterprise gets Amp'd";
    if (data.heading.includes(landingHighlight)) {
      const parts = data.heading.split(landingHighlight);
      return (
        <>
          {parts[0]}
          <span className={styles.highlight}>{landingHighlight}</span>
          {parts[1]}
        </>
      );
    }

    return data.heading;
  };

  return (
    <section
      className={`${styles.section} ${ribbon ? styles.hasRibbon : ""} ${className || ""}`.trim()}
      aria-label={data.heading}
    >
      {/* ── Services ambient gradients (landing page only, when ribbon is not present) ── */}
      {!ribbon && (
        <>
          <Gradient
            top="15%"
            right="20%"
            size="40rem"
            stops={[
              "color-mix(in srgb, #9d84f2 85%, transparent) 0%",
              "transparent 78%",
            ]}
            opacity={0.4}
            blur="85px"
          />
          <Gradient
            kind="linear"
            angle="180deg"
            top="70%"
            left="-15%"
            size="28rem"
            stops={[
              "color-mix(in srgb, #EDBF79 70%, transparent) 0%",
              "transparent 100%",
            ]}
            opacity={0.5}
            blur="75px"
          />
        </>
      )}

      {/* ── Background Ribbon (when provided) ── */}
      {ribbon && (
        <div className={styles.ribbonWrapper} aria-hidden="true">
          <Image
            src={ribbon.src}
            alt={ribbon.alt || ""}
            width={ribbon.width || 1200}
            height={ribbon.height || 900}
            className={styles.ribbonImage}
            priority={false}
          />
        </div>
      )}

      <Container size="xl">
        <div className={styles.inner}>
          <header className={styles.header}>
            <h2 className={styles.heading}>{renderHeading()}</h2>

            {data.description && (
              <p className={styles.description}>{data.description}</p>
            )}
          </header>

          <ol className={styles.stepList}>
            {data.steps.map((step) => (
              <AmpdStep key={step.id} step={step} />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
