import type { BlogsHeroProps } from "./Hero";
import type { FeaturedProps } from "./Featured";
import type { BlogHubProps } from "./BlogHub";

/**
 * Full data contract for the Blogs page, owned by the Blogs section
 * wrapper — not by any individual section inside it. Each section
 * (Hero, Featured, BlogHub) gets its own slice of this object spread
 * into it as props.
 */
export interface BlogsPageData {
  hero: BlogsHeroProps;
  featured: FeaturedProps;
  hub: BlogHubProps;
}