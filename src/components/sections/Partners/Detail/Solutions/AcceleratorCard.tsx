import Image from "next/image";
import clsx from "clsx";
import type { PartnerAccelerator } from "@/types/partnerDetail";
import styles from "./Solutions.module.css";

export interface AcceleratorCardProps {
  accelerator: PartnerAccelerator;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  cardRef?: (el: HTMLDivElement | null) => void;
}

/**
 * AcceleratorCard
 *
 * Single interactive accelerator card component.
 * Supports hover (desktop) and click/tap (mobile/desktop).
 * Pure presentation: consumes typed PartnerAccelerator data.
 *
 * Active/Hover behavior:
 * - Card remains strictly in its layout position (zero translateY/resize/layout shift).
 * - Active card content & image at 100% opacity.
 * - Inactive cards content & image at reduced opacity.
 * - Arrow badge remains 100% visible on both active and inactive cards.
 */
export function AcceleratorCard({
  accelerator,
  isActive,
  onClick,
  onMouseEnter,
  cardRef,
}: AcceleratorCardProps) {
  // Natural intrinsic dimensions based on the source image files
  const naturalWidth = 278;
  const naturalHeight = accelerator.id === "quote-accelerator" ? 234 : 183;

  return (
    <div
      id={accelerator.id}
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`View details for ${accelerator.title.replace(/\n/g, " ")}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onPointerEnter={onMouseEnter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={clsx(
        styles.card,
        isActive ? styles.cardActive : styles.cardInactive
      )}
    >
      {/* Top content area with inner padding */}
      <div className={styles.cardContent}>
        {/* Top row: Arrow Badge - Always 100% opacity */}
        <div className={styles.cardHeader}>
          <div className={styles.arrowBadge} aria-hidden="true">
            <svg
              className={styles.arrowIcon}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isActive ? (
                // In active state: arrow points down-left
                <path
                  d="M10.5 3.5L3.5 10.5M3.5 10.5H9.5M3.5 10.5V4.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                // In inactive state: arrow points up-right
                <path
                  d="M3.5 10.5L10.5 3.5M10.5 3.5H4.5M10.5 3.5V9.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Card Body - reduced opacity when inactive */}
        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{accelerator.title}</h3>
          <p className={styles.cardCategory}>{accelerator.category}</p>
          <p className={styles.cardDescription}>{accelerator.description}</p>
        </div>
      </div>

      {/* Card Wave Artwork Image - reduced opacity when inactive, natural ratio */}
      <div className={styles.cardImageWrapper}>
        <Image
          src={accelerator.image.src}
          alt={accelerator.image.alt}
          width={naturalWidth}
          height={naturalHeight}
          className={styles.cardImage}
          unoptimized
        />
      </div>
    </div>
  );
}
