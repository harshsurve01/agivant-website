"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import clsx from "clsx";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Gradient } from "@/components/effects/Gradient";
import type { AmpdBuildEnvironmentProps } from "./types";
import styles from "./AmpdBuildEnvironment.module.css";

const splitLines = (text: string) =>
  text.split(/<br\s*\/?>/i).map((line) => line.trim());

/**
 * AmpdBuildEnvironment (Amp'd landing page — "What changes when your
 * enterprise gets Amp'd")
 *
 * One section: heading, a row of tab cards, and ONE glass panel whose content
 * switches with the selected tab. Owns only the interactive shell — tab
 * state, keyboard navigation, the pointer under the active card and the
 * panel frame. Each panel's content arrives pre-rendered (server side) via
 * `panels`, so this client component carries no content of its own.
 *
 * All panels stay in the DOM (inactive ones `hidden`), so switching tabs never
 * reloads media or embeds and every panel's text is in the page HTML.
 */
export function AmpdBuildEnvironment({
  id,
  heading,
  highlightWords = 0,
  tabs,
  panels,
  className,
}: AmpdBuildEnvironmentProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pointerX, setPointerX] = useState<number | null>(null);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Pointer: horizontal centre of the active tab, relative to the panel.
  const updatePointer = useCallback(() => {
    const tab = tabRefs.current[activeIndex];
    const panel = panelRef.current;
    if (!tab || !panel) return;
    const tabRect = tab.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const x = tabRect.left + tabRect.width / 2 - panelRect.left;
    // Keep the pointer clear of the panel's rounded corners.
    const inset = 32;
    setPointerX(Math.max(inset, Math.min(panelRect.width - inset, x)));
  }, [activeIndex]);

  useEffect(() => {
    updatePointer();
    const track = trackRef.current;
    window.addEventListener("resize", updatePointer);
    track?.addEventListener("scroll", updatePointer, { passive: true });
    return () => {
      window.removeEventListener("resize", updatePointer);
      track?.removeEventListener("scroll", updatePointer);
    };
  }, [updatePointer]);

  // Deep links: `#<tab id>` opens that tab.
  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.slice(1);
      const index = tabs.findIndex((tab) => tab.id === hash);
      if (index >= 0) setActiveIndex(index);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [tabs]);

  const selectTab = (index: number, focus = false) => {
    setActiveIndex(index);
    const tab = tabRefs.current[index];
    if (focus) tab?.focus();
    // On narrow screens the tab row scrolls: centre the chosen card in it
    // (scrolls the row only, never the page).
    const track = trackRef.current;
    if (tab && track && track.scrollWidth > track.clientWidth) {
      track.scrollTo({
        left: tab.offsetLeft - (track.clientWidth - tab.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  // Arrow keys / Home / End move between tabs (automatic activation).
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    const next: Record<string, number> = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    };
    if (event.key in next) {
      event.preventDefault();
      selectTab(next[event.key], true);
    }
  };

  const words = heading.split(" ");
  const accent = words.slice(0, highlightWords).join(" ");
  const rest = words.slice(highlightWords).join(" ");

  return (
    <Section height="auto" id={id} className={clsx(styles.section, className)}>
      {/* Soft background glows (shared page-wide layer, never clipped by the section). */}
      <Gradient
        top="35%"
        left="-18%"
        size="34rem"
        stops={["#f6048d 0%", "#edbf79 45%", "transparent 72%"]}
        opacity={0.22}
        blur="90px"
      />
      <Gradient
        top="20%"
        right="10%"
        size="32rem"
        stops={["#8500df 0%", "#f6048d 45%", "transparent 72%"]}
        opacity={0.14}
        blur="90px"
      />

      <Container size="xl" className={styles.container}>
        <h2 className={styles.title}>
          {accent && <span className={styles.titleAccent}>{accent}</span>}
          {accent && rest ? " " : null}
          {rest}
        </h2>

        <div
          ref={trackRef}
          className={styles.tabs}
          role="tablist"
          aria-label={heading}
          onKeyDown={onKeyDown}
        >
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`${tab.id}-tab`}
                aria-selected={isActive}
                aria-controls={tab.id}
                tabIndex={isActive ? 0 : -1}
                className={clsx(styles.tab, isActive && styles.tabActive)}
                onClick={() => selectTab(index)}
              >
                {tab.media?.src && (
                  <span className={styles.tabMedia}>
                    <Image
                      src={tab.media.src}
                      alt={tab.media.alt ?? ""}
                      fill
                      sizes="(max-width: 768px) 60vw, 20rem"
                      className={styles.tabImage}
                    />
                  </span>
                )}
                <span className={styles.tabTitle}>
                  {splitLines(tab.title).map((line, i) => (
                    <span key={i} className={styles.tabTitleLine}>
                      {line}
                    </span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        <div ref={panelRef} className={styles.panel}>
          <span
            className={styles.pointer}
            aria-hidden="true"
            style={
              pointerX !== null
                ? ({ "--abe-pointer-x": `${pointerX}px` } as CSSProperties)
                : undefined
            }
          />
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              id={tab.id}
              role="tabpanel"
              aria-labelledby={`${tab.id}-tab`}
              hidden={index !== activeIndex}
              tabIndex={0}
              className={styles.panelBody}
            >
              {panels[index]}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
