import clsx from "clsx";
import { BlogSectionGradient } from "./BlogSectionGradient";
import type { BlogSectionWrapperProps } from "./types";
import styles from "./BlogSectionGradient.module.css";

/**
 * BlogSectionWrapper
 *
 * Wraps any Blog Article section with:
 * 1. An ambient, contained decorative gradient layer (z-index: 0)
 * 2. An elevated content container (z-index: 1) holding the section content
 * 3. Strict bounding box containment via overflow: clip & isolation: isolate
 *
 * Guarantees that:
 * - Gradients never bleed into adjacent sections
 * - Gradients never paint over headings, body paragraphs, tables, or cards
 * - Semantic <section> tags and global `section { min-height: 100vh; }` rules are 100% preserved
 */
export function BlogSectionWrapper({
  sectionId,
  index,
  children,
  className,
  gradientConfig,
}: BlogSectionWrapperProps) {
  return (
    <div
      className={clsx(styles.sectionWrapper, className)}
      data-blog-section={sectionId}
    >
      <BlogSectionGradient
        index={index}
        sectionId={sectionId}
        config={gradientConfig}
      />
      <div className={styles.contentContainer}>{children}</div>
    </div>
  );
}
