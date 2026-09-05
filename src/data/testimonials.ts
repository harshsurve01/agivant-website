/**
 * src/data/testimonials.ts
 *
 * Single source of truth for Client Testimonials content following
 * AGIVANT_JSON_DATA_RULEBOOK.md.
 * Provides normalized data and async getter signatures for seamless
 * Headless WordPress integration.
 */

export interface TestimonialVideoCardData {
  id: string;
  type: "video";
  author: {
    name: string;
    designation: string;
  };
  thumbnail: {
    src: string;
    alt: string;
  };
}

export interface TestimonialTextCardData {
  id: string;
  type: "text";
  testimonial: string;
  readMoreText: string;
  readMoreHref?: string;
  author: {
    title: string;
    context: string;
  };
}

export type TestimonialCardData = TestimonialVideoCardData | TestimonialTextCardData;

export interface TestimonialsSectionData {
  title: string;
  cards: TestimonialCardData[];
  cta: {
    label: string;
    href: string;
  };
}

import homepageJson from "./homepage.json";

const testimonialsSection = homepageJson.sections.find(
  (s) => s.id === "client-testimonials"
)!;

export async function getTestimonialsData(): Promise<TestimonialsSectionData> {
  const cards: TestimonialCardData[] = (testimonialsSection.blocks ?? []).map((block: any) => {
    if (block.type === "video_card") {
      return {
        id: block.id,
        type: "video",
        author: {
          name: block.authorName ?? "",
          designation: block.authorRole ?? "",
        },
        thumbnail: {
          src: block.media?.src ?? "",
          alt: block.media?.alt ?? "",
        },
      };
    } else {
      return {
        id: block.id,
        type: "text",
        testimonial: block.quote ?? "",
        readMoreText: block.cta?.label ?? "Read more →",
        readMoreHref: block.cta?.href ?? "/case-studies",
        author: {
          title: block.authorName ?? "",
          context: block.authorRole ?? "",
        },
      };
    }
  });

  return {
    title: testimonialsSection.data.heading ?? "Client Testimonials",
    cards,
    cta: {
      label: testimonialsSection.data.cta?.label ?? "See All Testimonials",
      href: testimonialsSection.data.cta?.href ?? "/case-studies",
    },
  };
}
