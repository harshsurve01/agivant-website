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

const mockTestimonialsData: TestimonialsSectionData = {
  title: "Client Testimonials",
  cards: [
    {
      id: "sachin-puri",
      type: "video",
      author: {
        name: "Sachin Puri",
        designation: "CEO, Bluehost Group",
      },
      thumbnail: {
        src: "/images/testimonials/sachin-puri.png",
        alt: "Sachin Puri - CEO, Bluehost Group",
      },
    },
    {
      id: "sr-director-product-management",
      type: "text",
      testimonial:
        "We’ve worked with Agivant across several projects, and they bring real technical depth in generative AI, LLMs and data analytics. What we value most is how they get to the core of a problem and bring strong technical thinking to the solution.",
      readMoreText: "Read more →",
      readMoreHref: "/case-studies",
      author: {
        title: "Sr. Director, Product Management",
        context: "Fortune 100 tech leader",
      },
    },
    {
      id: "peter-spiegel",
      type: "video",
      author: {
        name: "Peter Spiegel",
        designation: "Founder & CEO, Ideal Living",
      },
      thumbnail: {
        src: "/images/testimonials/peter-spiegel.png",
        alt: "Peter Spiegel - Founder & CEO, Ideal Living",
      },
    },
    {
      id: "ceo-omni-channel-retailer",
      type: "text",
      testimonial:
        "We had 18 websites to migrate to a new platform on a very tight timeline. Agivant got the right DevOps and CI/CD setup in place, completed the migration cleanly, and improved the scalability and performance of the underlying infrastructure along the way.",
      readMoreText: "Read more →",
      readMoreHref: "/case-studies",
      author: {
        title: "CEO",
        context: "Omni-channel retailer",
      },
    },
    {
      id: "global-operations-manager",
      type: "text",
      testimonial:
        "We needed a practical way to make sense of millions of customer call recordings. Agivant built a system that analyzes the conversations, surfaces the metrics that matter, and gives our teams insight they can actually use to improve customer interactions and operations.",
      readMoreText: "Read more →",
      readMoreHref: "/case-studies",
      author: {
        title: "Global Operations Manager",
        context: "Fortune 50 enterprise",
      },
    },
    {
      id: "cio-fortune-100",
      type: "text",
      testimonial:
        "Agivant put our data warehouse, data lake and BI capabilities in place before the holiday season, within a very short window. That work changed how our teams use data to make day-to-day decisions.",
      readMoreText: "Read more →",
      readMoreHref: "/case-studies",
      author: {
        title: "CIO",
        context: "Fortune 100 enterprise",
      },
    },
  ],
  cta: {
    label: "See All Testimonials",
    href: "/case-studies",
  },
};

export async function getTestimonialsData(): Promise<TestimonialsSectionData> {
  return mockTestimonialsData;
}
