import type { ReactNode } from "react";

/** One tab card: title (`<br>` = forced line break) and optional artwork. */
export interface AmpdBuildTab {
  /** Also the id of the tab's panel (so `#<id>` deep-links to the tab). */
  id: string;
  title: string;
  media?: { src: string | null; alt?: string | null } | null;
}

export interface AmpdBuildEnvironmentProps {
  /** Section id (anchor). */
  id?: string;
  /** Section heading. */
  heading: string;
  /** How many leading words of the heading render in brand purple. */
  highlightWords?: number;
  /** Tab cards, in order. */
  tabs: AmpdBuildTab[];
  /** One pre-rendered panel per tab, in the same order as `tabs`. */
  panels: ReactNode[];
  /** Page-level class for scoped overrides. */
  className?: string;
}

/** Intro layout inside a panel. */
export type AmpdBuildIntroLayout = "stacked" | "offset" | "split" | "media";

export interface AmpdBuildIntroProps {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  /**
   * - stacked: eyebrow, rule, heading, body in one left column (default)
   * - offset: the same column, placed in the right half
   * - split: eyebrow/rule/heading left, body right
   * - media: copy left, `aside` right
   */
  layout?: AmpdBuildIntroLayout;
  /** Small pills under the body (e.g. roles). */
  tags?: string[];
  /** Call to action under the body. */
  action?: ReactNode;
  /** Right-hand content for the `media` layout. */
  aside?: ReactNode;
}

export interface AmpdSpecCard {
  id: string;
  title: string;
  body: string;
}

export interface AmpdSpecCardsProps {
  cards: AmpdSpecCard[];
}

export interface AmpdHtmlEmbedProps {
  /** Same-origin URL of the HTML document (e.g. `/animations/x.html`). */
  src: string;
  /** Accessible iframe title. */
  title: string;
  /**
   * CSS selectors inside the embedded document to hide (e.g. its own
   * heading/intro when the surrounding panel already provides them).
   * Applied through an injected stylesheet; the source file is untouched.
   */
  hideSelectors?: string[];
  className?: string;
}
