"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AmpColumn } from "./AmpColumn";
import { AmpCore } from "./AmpCore";
import { AmpHeader } from "./AmpHeader";
import type { AmpColumnData, AmpHeaderData, AmpHubData } from "@/data/ampTransformation";
import styles from "./AmpExperience.module.css";

gsap.registerPlugin(ScrollTrigger);

interface AmpExperienceProps {
  header: AmpHeaderData;
  leftColumn: AmpColumnData;
  hub: AmpHubData;
  rightColumn: AmpColumnData;
}

/**
 * Scroll distance (in px) to scrub through the entire pinned experience.
 */
const PIN_SCROLL_DISTANCE = 1000;

/** Logo initial scale relative to viewport width */
const LOGO_INITIAL_VW = 0.3;

/** Duration of the logo shrink phase */
const LOGO_SHRINK_DURATION = 2.4;

/** How far into the logo shrink the Amp Core blob starts fading/scaling in */
const BLOB_START_OFFSET = LOGO_SHRINK_DURATION * 0.55;

/** Blob reveal duration (finishes simultaneously with the logo shrink) */
const BLOB_REVEAL_DURATION = LOGO_SHRINK_DURATION - BLOB_START_OFFSET;

/** Materialization settings for cards */
const CARD_INITIAL_SCALE = 1.1;
const CARD_INITIAL_BLUR_PX = 12;
const CARD_INITIAL_Y_PX = -10;
const CARD_REVEAL_DURATION = 1;

/** Shared eases */
const CORE_EASE = "power1.inOut";
const CARD_REVEAL_EASE = "power2.out";

/**
 * AmpExperience
 *
 * Client Component boundary owning the GSAP + ScrollTrigger pinned sequence:
 * 1. Pinned Header + Grid stage.
 * 2. Phase 1 ("logo"): Central Amp'd logo shrinks from large scale to resting size.
 * 3. Phase 2 ("blob"): New Amp Core organic blob fades and scales in behind the logo.
 * 4. Phase 3 ("cards"): All 8 cards and side labels materialize together into the wave layout.
 */
export function AmpExperience({ header, leftColumn, hub, rightColumn }: AmpExperienceProps) {
  const experienceRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const leftSlotRef = useRef<HTMLDivElement>(null);
  const rightSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const experience = experienceRef.current;
    if (!experience) return;

    let ctx: gsap.Context | null = null;

    const logoEl = experience.querySelector<HTMLElement>("[data-amp-logo]");
    const blobEl = experience.querySelector<HTMLElement>("[data-amp-blob]");

    const leftSlot = leftSlotRef.current;
    const rightSlot = rightSlotRef.current;
    const leftNodes = leftSlot
      ? Array.from(leftSlot.querySelectorAll<HTMLElement>("[data-amp-node]"))
      : [];
    const rightNodes = rightSlot
      ? Array.from(rightSlot.querySelectorAll<HTMLElement>("[data-amp-node]"))
      : [];
    const leftLabelEl = leftSlot?.querySelector<HTMLElement>("[data-amp-column-label]") ?? null;
    const rightLabelEl = rightSlot?.querySelector<HTMLElement>("[data-amp-column-label]") ?? null;

    if (!logoEl || !blobEl) return;

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: experience,
          start: "top 15%",
          end: `+=${PIN_SCROLL_DISTANCE}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
        },
      });

      const viewportWidth = window.innerWidth;
      const logoNaturalWidth = logoEl.getBoundingClientRect().width || 140;
      const logoStartScale = (viewportWidth * LOGO_INITIAL_VW) / logoNaturalWidth;

      // Initial state at t = 0
      tl.set(
        [blobEl, ...leftNodes, ...rightNodes, leftLabelEl, rightLabelEl].filter(Boolean),
        { opacity: 0 },
        0
      );

      // Phase 1: Logo shrinks from large to natural size
      tl.addLabel("logo").fromTo(
        logoEl,
        { scale: logoStartScale, opacity: 1 },
        { scale: 1, opacity: 1, duration: LOGO_SHRINK_DURATION, ease: CORE_EASE },
        "logo"
      );

      // Phase 2: Blob appears behind the logo
      tl.addLabel("blob", `logo+=${BLOB_START_OFFSET}`).fromTo(
        blobEl,
        { scale: 0.35, opacity: 0 },
        { scale: 1, opacity: 1, duration: BLOB_REVEAL_DURATION, ease: CORE_EASE },
        "blob"
      );

      // Phase 3: All 8 cards and side labels materialize together
      tl.addLabel("cards");

      const allNodes = [...leftNodes, ...rightNodes];
      if (allNodes.length > 0) {
        tl.fromTo(
          allNodes,
          {
            opacity: 0,
            scale: CARD_INITIAL_SCALE,
            filter: `blur(${CARD_INITIAL_BLUR_PX}px)`,
            y: CARD_INITIAL_Y_PX,
          },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            y: 0,
            duration: CARD_REVEAL_DURATION,
            ease: CARD_REVEAL_EASE,
          },
          "cards"
        );
      }

      const allLabels = [leftLabelEl, rightLabelEl].filter(Boolean);
      if (allLabels.length > 0) {
        tl.fromTo(
          allLabels,
          { opacity: 0 },
          { opacity: 1, duration: CARD_REVEAL_DURATION, ease: CARD_REVEAL_EASE },
          "cards"
        );
      }
    }, experienceRef);

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={experienceRef} className={styles.experience}>
      <div className={styles.headerRow}>
        <AmpHeader heading={header.heading} description={header.description} />
      </div>

      <div ref={gridRef} className={styles.grid}>
        <div ref={leftSlotRef} className={styles.leftSlot}>
          <AmpColumn column={leftColumn} side="left" />
        </div>

        <AmpCore hub={hub} />

        <div ref={rightSlotRef} className={styles.rightSlot}>
          <AmpColumn column={rightColumn} side="right" />
        </div>
      </div>
    </div>
  );
}