"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { AmpdHtmlEmbedProps } from "./types";
import styles from "./AmpdBuildEnvironment.module.css";

const STYLE_ID = "ampd-embed-overrides";

/**
 * AmpdHtmlEmbed — shows a same-origin HTML document (with its own CSS/JS)
 * in an iframe that sizes itself to the document's height.
 *
 * Nothing in the source file is changed. After load, it:
 * - forces the document's light theme (`data-theme="light"`, which the file
 *   supports) so it matches the site on dark-mode systems;
 * - makes the document background transparent so the glass panel shows;
 * - hides `hideSelectors` (e.g. the file's own title/intro);
 * - opens the lower matrix rows' detail boxes upward (with a little room
 *   below the grid) so none is cut off at the bottom of the frame.
 * Wide content keeps scrolling sideways inside the frame, as in the source.
 */
export function AmpdHtmlEmbed({
  src,
  title,
  hideSelectors = [],
  className,
}: AmpdHtmlEmbedProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  const setup = useCallback(() => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    const win = frame?.contentWindow as (Window & typeof globalThis) | null;
    if (!doc || !win || !doc.body) return;

    doc.documentElement.setAttribute("data-theme", "light");

    if (!doc.getElementById(STYLE_ID)) {
      const style = doc.createElement("style");
      style.id = STYLE_ID;
      style.textContent = [
        "html,body{background:transparent;}",
        "body{overflow:hidden;}",
        ".wrap{max-width:none;padding:0 0 0.5rem;}",
        hideSelectors.length
          ? `${hideSelectors.join(",")}{display:none !important;}`
          : "",
        // Rows 3–4 (grid children 20+) open their detail box upward, and the
        // scroll area keeps a little room below, so no box is cut off by the
        // frame's bottom edge.
        ".grid > .cell:nth-child(n+20) .detail{top:auto;bottom:calc(100% + 7px);}",
        ".scroll{padding-bottom:3rem;}",
      ].join("\n");
      doc.head.appendChild(style);
    }

    const measure = () => {
      setHeight(Math.ceil(doc.body.getBoundingClientRect().height));
    };
    measure();
    observerRef.current?.disconnect();
    observerRef.current = new win.ResizeObserver(measure);
    observerRef.current.observe(doc.body);
  }, [hideSelectors]);

  useEffect(() => {
    // The frame may already be loaded before hydration attached onLoad.
    if (frameRef.current?.contentDocument?.readyState === "complete") setup();
    return () => observerRef.current?.disconnect();
  }, [setup]);

  return (
    <div className={clsx(styles.embed, className)}>
      <iframe
        ref={frameRef}
        src={src}
        title={title}
        loading="lazy"
        onLoad={setup}
        className={styles.embedFrame}
        style={height ? { height: `${height}px` } : undefined}
      />
    </div>
  );
}
