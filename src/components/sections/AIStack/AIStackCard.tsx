"use client";

import { useRef } from "react";
import Image from "next/image";
import { AIStackBadge } from "./AIStackBadge";
import styles from "./AIStackCard.module.css";

interface AIStackCardProps {
  title: string;
  description: string;
  badge: string;
  backgroundImage: string;
  accentColor: string;
  /**
   * CSS object-position value (e.g. "bottom", "top right", "center").
   * Optional — cards without a defined ribbon position fall back to
   * the CSS default in AIStackCard.module.css. Kept as a plain CSS
   * value rather than a set of enum/x-y fields so it maps 1:1 onto
   * object-position with no translation layer, while still letting
   * each card in data/ai-stack.ts control its own placement instead
   * of needing a dedicated CSS selector per card.
   */
  ribbonPosition?: string;
}

/**
 * AIStackCard
 *
 * The only Client Component in this section. Today it renders four
 * static layers and nothing else — no pointer listeners, no tilt, no
 * animation — but it's a Client Component now because the interaction
 * it will own (mouse-responsive tilt, perspective, floating layers,
 * depth/lighting) is inherently client-side: it has to read live
 * pointer position and update transforms in response, which Server
 * Components structurally cannot do. Drawing the boundary here, at
 * the card, keeps that requirement local to the one piece that needs
 * it instead of forcing the whole section (heading, grid, other
 * cards) into the client bundle for one card's future hover effect.
 *
 * `cardRef` is unused today — no listeners are attached to it yet, by
 * design (see the section's "Do NOT: Mouse tracking / Tilt /
 * Perspective" list). It exists now as the attachment point a future
 * pointermove/tilt implementation will need, so that work is additive
 * (add refs/handlers, read cardRef.current) instead of requiring this
 * component's markup to change shape later.
 *
 * Layers — background, ribbon image, content, badge — exist as
 * separate elements now, before any hover effect needs them to be,
 * because a future tilt/parallax pass moves each layer by a different
 * amount to fake depth (the classic "floating layers" effect). That
 * only works if the layers are already separate, independently
 * transformable DOM nodes; retrofitting that split later would mean
 * restructuring markup at the same time as wiring up animation, which
 * is exactly what this foundation avoids.
 */
export function AIStackCard({
  title,
  description,
  badge,
  backgroundImage,
  accentColor,
  ribbonPosition,
}: AIStackCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className={styles.card}
      style={
        {
          "--accent-color": accentColor,
          ...(ribbonPosition ? { "--ribbon-position": ribbonPosition } : {}),
        } as React.CSSProperties
      }
    >
      <div className={styles.background} aria-hidden="true" />

      <div className={styles.ribbon} aria-hidden="true">
        <Image
          src={backgroundImage} // TODO: replace with the real supplied ribbon asset per card
          alt=""
          fill
          className={styles.ribbonImage}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.badgeLayer}>
        <AIStackBadge label={badge} />
      </div>
    </div>
  );
}