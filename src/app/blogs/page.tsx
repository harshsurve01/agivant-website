import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { Blogs } from "@/components/sections/Blogs";
import { GradientLayerProvider } from "@/components/effects/GradientLayer";
import { blogsPageData } from "@/data/blogs";

export default function BlogsPage() {
  return (
    <GradientLayerProvider>
      <Header />

      <main>
        <Blogs {...blogsPageData} />
      </main>

      <Footer />
    </GradientLayerProvider>
  );
}