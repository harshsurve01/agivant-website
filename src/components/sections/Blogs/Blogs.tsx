import { Hero } from "./Hero";
import { Featured } from "./Featured";
import { BlogHub } from "./BlogHub";
import type { BlogsPageData } from "./types";
import styles from "./Blogs.module.css";

/**
 * Blogs
 *
 * Orchestrates the Blogs page, same role Homepage/TechTalk play for
 * their pages: it is the only thing app/blogs/page.tsx renders, and
 * it is the only thing that knows which sections make up the Blogs
 * page and in what order. `page.tsx` never imports Hero, Featured,
 * BlogHub (or any other section) directly — everything flows through
 * here.
 *
 * Renders Hero, Featured, and BlogHub in that order. Each section
 * gets its own slice of BlogsPageData spread into it as props — this
 * component holds no content or state of its own.
 *
 * Server Component: no "use client", no hooks, no state, no data
 * imports. Data arrives entirely through props from page.tsx.
 * (BlogHub itself is a Client Component internally, for its filter
 * interactivity — that boundary lives inside BlogHub, not here.)
 */
export function Blogs({ hero, featured, hub }: BlogsPageData) {
  return (
    <div className={styles.blogs}>
      <Hero {...hero} />
      <Featured {...featured} />
      <BlogHub {...hub} />
    </div>
  );
}