import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import type { SolutionCardProps } from "./types";
import styles from "./SolutionCard.module.css";

/**
 * SolutionCard
 *
 * Presentation-only card component matching the Solutions Figma design:
 * - Rounded card container with subtle grey surface
 * - Square image on the left with rounded corners
 * - Purple bold headline
 * - Description text
 * - Clickable whole-card Next.js link navigating to `/solutions/[slug]`
 *
 * Server Component: no state, no hooks.
 */
export function SolutionCard({ solution, className }: SolutionCardProps) {
  const { title, description, thumbnail, href } = solution;

  return (
    <Link href={href} className={clsx(styles.card, className)}>
      <div className={styles.imageWrapper}>
        <Image
          src={thumbnail}
          alt={title}
          fill
          className={styles.image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 140px, 160px"
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title} title={title}>
          {title}
        </h3>
        <p className={styles.description} title={description}>
          {description}
        </p>
      </div>
    </Link>
  );
}
