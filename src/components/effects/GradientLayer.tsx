"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import styles from "./GradientLayer.module.css";

const GradientLayerContext = createContext<HTMLDivElement | null>(null);

export function useGradientLayer() {
  return useContext(GradientLayerContext);
}

/**
 * Wrap the ENTIRE page (all sections) with this ONCE — e.g. in
 * page.tsx:
 *
 *   <GradientLayerProvider>
 *     <AnnouncementBar />
 *     <Header />
 *     <Hero />
 *     <Trust />
 *     <Lifecycle />
 *     ...
 *     <Footer />
 *   </GradientLayerProvider>
 *
 * How it works:
 * - `.root` is `position: relative` with NO explicit height — its
 *   height is whatever all the in-flow sections inside `.content`
 *   naturally add up to.
 * - `.layer` is `position: absolute; inset: 0` INSIDE `.root`, so it
 *   automatically stretches to match that same full-page height,
 *   without ever needing a hardcoded px/vh value.
 * - Every <Gradient /> used anywhere in the tree portals its glow
 *   into `.layer` instead of rendering inline in its own section, so
 *   glows can bleed across section boundaries and the only clipping
 *   boundary left is the page itself, not each individual section.
 * - Because `.layer` is `absolute` (not `fixed`), it scrolls with the
 *   page — this is "approach 2".
 */
export function GradientLayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  // Force one re-render after mount so context value picks up the
  // real DOM node (ref is null during the first render).
  const [, forceRender] = useState(0);

  useEffect(() => {
    forceRender((n) => n + 1);
  }, []);

  return (
    <div className={styles.root}>
      <div ref={layerRef} className={styles.layer} aria-hidden="true" />
      <div className={styles.content}>
        <GradientLayerContext.Provider value={layerRef.current}>
          {children}
        </GradientLayerContext.Provider>
      </div>
    </div>
  );
}
