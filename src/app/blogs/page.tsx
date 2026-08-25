import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Blogs } from "@/components/sections/Blogs";
import { PageRibbon } from "@/components/ui/PageRibbon";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { blogsPageData } from "@/data/blogs";
import styles from "./BlogsPage.module.css";

/**
 * Blogs Landing Page (/blogs).
 *
 * Renders Header, page-level decorative slanted ribbon layer,
 * Hero section (with particle tracking), Featured "Top Picks",
 * BlogHub filterable listing, and Footer.
 */
export default function BlogsPage() {
  return (
    <GradientLayerProvider>
      <div className={styles.page}>
        <Header />

        {/* Page-Level Decorative Slanted Ribbon Layer */}
        <PageRibbon
          src="/images/blogs/blogs-landingpage-ribbon.png"
          width={1440}
          height={856}
          className={styles.ribbonWrapper}
          imageClassName={styles.ribbonImage}
          priority
        />

        <main>
          <Blogs {...blogsPageData} />
        </main>

        <Footer />
      </div>
    </GradientLayerProvider>
  );
}