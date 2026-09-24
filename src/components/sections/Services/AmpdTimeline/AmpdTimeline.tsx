"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import type { AmpdTimelineProps } from "./types";
import styles from "./AmpdTimeline.module.css";

/**
 * AmpdTimeline
 *
 * Chronological timeline with accordion-style milestone expansion.
 * Features:
 * - Brand heading with "The Amp'd" / "The Amp’d" highlighted in purple.
 * - Left vertical rail with circular milestone badges connected by a vertical axis.
 * - Single-active accordion state (milestone 01 open by default).
 * - Smooth CSS Grid height animation (grid-template-rows: 0fr -> 1fr).
 * - Full W3C WAI-ARIA disclosure accessibility for screen readers and keyboard users.
 */
export function AmpdTimeline({
  heading = "The Amp’d Way",
  items,
  className,
  defaultActiveIndex = 0,
}: AmpdTimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number>(defaultActiveIndex);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };

  const renderHeading = (text: string) => {
    const ampdMatch = text.match(/^(The Amp['’]d)(.*)$/i);
    if (ampdMatch) {
      return (
        <>
          <span className={styles.highlight}>{ampdMatch[1]}</span>
          {ampdMatch[2]}
        </>
      );
    }
    return text;
  };

  return (
    <section className={`${styles.section} ${className || ""}`} aria-label={heading}>
      <Container size="xl">
        <div className={styles.inner}>
          <header className={styles.header}>
            <h2 className={styles.heading}>{renderHeading(heading)}</h2>
          </header>

          <div className={styles.timeline}>
            {items.map((item, index) => {
              const isActive = activeIndex === index;
              const isLast = index === items.length - 1;

              return (
                <div
                  key={item.id}
                  className={styles.item}
                  data-active={isActive}
                >
                  <div className={styles.rail}>
                    <button
                      type="button"
                      className={styles.circle}
                      data-active={isActive}
                      onClick={() => handleSelect(index)}
                      aria-label={`Milestone ${item.number}: ${item.title}`}
                      tabIndex={-1}
                    >
                      {item.number}
                    </button>
                    {!isLast && <div className={styles.line} aria-hidden="true" />}
                  </div>

                  <div className={styles.content}>
                    <button
                      type="button"
                      className={styles.trigger}
                      data-active={isActive}
                      onClick={() => handleSelect(index)}
                      aria-expanded={isActive}
                      aria-controls={`timeline-desc-${item.id}`}
                      id={`timeline-header-${item.id}`}
                    >
                      <span className={styles.title}>{item.title}</span>
                    </button>

                    <div
                      id={`timeline-desc-${item.id}`}
                      role="region"
                      aria-labelledby={`timeline-header-${item.id}`}
                      className={styles.accordionContent}
                      data-active={isActive}
                    >
                      <div className={styles.accordionInner}>
                        <p className={styles.description}>{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
